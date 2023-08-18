"use strict";
const FEED_TYPES_TABLE = "sys_feedTypes";
const FEED_ENTITIES_TABLE = "sys_feedEntities";
const EVENT_FEED_CACHE_TABLE = "sys_eventFeedCache";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const pollFreq = 5000; //ms
let handle = null;
const _health = {
	status: 1,
	config: {
		pollFrequency: pollFreq
	},
	metrics: {
		totalStale: 0
	}
};

const proc = require("node-app-core").process("feed-monitor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});

proc.initialize = function(args) {
	try {
		//purgeStale(); // if we want initial purge at startup
		handle = setInterval(purgeStale, pollFreq);
		proc.status("Started polling for stale tracks");
	}
	catch(e) {
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	clearInterval(handle);
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	// -- status should probably be more about performance or could be related to acceptable errors but want to be aware. 
	// -- Maybe I can come up with a metric that would generically help measure performance
	// -- like a ping and measure response time for starters
	// -- actually the ping could be built into health fetch I think
	return _health;
};


async function purgeStale() {
	const ttlFeeds = await r.table(FEED_TYPES_TABLE)
		.filter(r.row.hasFields("ttl").and(r.row("ttl").gt(-1)))
		.run();

	// -- to support event based feeds when items are aged out in feed needs to be reflected 
	// -- in entityFeedCache so the changefeed can pass the proper changes
	const qs = ttlFeeds.map(function (feed) {
		return r.table(FEED_ENTITIES_TABLE)
			.between([feed.feedId, true, r.minval],
				[feed.feedId, true, r.now().add(-1 * feed.ttl)],
				{ index: "feedId_isActive_timestamp" })
			.pluck("id")
			.map((row) => {
				return row("id");
			})
			.coerceTo("array")
			.do((arr) => {
				return r.expr([
					r.table(FEED_ENTITIES_TABLE).getAll(r.args(arr))
						.filter(function (row) { return row("entityData")("properties")("temp").default(false).eq(true); })
						.delete({ returnChanges: true }),
					r.table(FEED_ENTITIES_TABLE).getAll(r.args(arr))
						.filter(function (row) { return row("entityData")("properties")("temp").default(false).eq(false); })
						.update({ "isActive": false }, { returnChanges: true }),
					r.table(EVENT_FEED_CACHE_TABLE).getAll(r.args(arr), { "index": "entityId" })
						.update({ "inScope": false })
				]);
			});

		// return r.table(FEED_ENTITIES_TABLE)
		// 	.between([feed.feedId, true, r.minval],
		// 		[feed.feedId, true, r.now().add(-1 * feed.ttl)],
		// 		{ index: "feedId_isActive_timestamp" })
		// 	.update({ isActive: false });
	});

	const results = await r.expr(qs).run();
	ttlFeeds.forEach(function (feed, index) {
		const allResults = {
			"changes": [],
			"deleted": 0,
			"replaced": 0
		};

		// -- loop through returnChanges for both delete and update queries
		results[index].forEach(returnChanges => {
			if (returnChanges.changes) {
				allResults.changes = allResults.changes.concat(returnChanges.changes);
			}
			allResults.deleted += returnChanges.deleted;
			allResults.replaced += returnChanges.replaced;
		});

		const staleTotal = allResults.replaced + allResults.deleted;
		if (staleTotal > 0) {
			proc.logger.info({
				app: "eocsystem",
				method: "purge-stale-" + feed.feedId,
				user: "system",
				count: staleTotal
			});
			_health.metrics.totalStale += staleTotal;
			proc.status(`set ${staleTotal} tracks to stale in feed ${feed.feedId}`);

			// -- publish changes
			if (proc.globalChangefeed) {
				allResults.changes.forEach(change => {
					proc.globalChangefeed.publish({
						...change,
						type: "remove",
						rt: true
					});
				});
			}
		}
	});
}