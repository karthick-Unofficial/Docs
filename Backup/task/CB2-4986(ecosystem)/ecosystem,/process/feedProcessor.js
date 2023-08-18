const feedModel = require("../models/feedModel")();

const proc = require("node-app-core").process("feed-processor", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});
require("../app-global.js").globalChangefeed = proc.globalChangefeed;

const _health = {
	status: 1,
	metrics: {
		success: 0,
		ignore: 0,
		fail: 0
	}
};

proc.initialize = function(args) {
	try {
		const topic = args.MESSAGE_TOPIC || "__feed.publish__";
		initSubscriber(topic);
		proc.status("Feed processor subscriber initialized");
	}
	catch(e) {
		proc.fail("unhandled exception", e); 
	}
	proc.initSuccess();
}; 

proc.shutdown = function() {
	proc.shutdownSuccess();
};

proc.getHealth = function() {
	return _health;
};

function initSubscriber(subscribeTopic) {
	// -- messages destined for UI - state maintained in rethinkdb
	// -- Not using persistent feed because we want to always start with most recent data
	proc.globalChangefeed.subscribe({ entityType: "track" }, "ecosystem.feed-processor", globalChangefeedHandler);
}

function globalChangefeedHandler(change, subject) {
	const span = proc.tracer.startSpan("feed-transformer");
	try {
		// -- only process realtime for UI updates
		if(change.rt) {
			const parsedMsg = change.new_val;
			feedModel.upsertEntity(parsedMsg.feedId, parsedMsg.id, parsedMsg.entityData, parsedMsg.acquisitionTime, function(err, result) {
				if(err) {
					span.log({ 
						event: "error", 
						reason: `Process Feed Item failed: ${err.message}`
					});
					console.log(err);
					_health.metrics.fail++;
				}
				else {
					span.log({ event: "feed-entity-upsert", feedId: parsedMsg.feedId });
					_health.metrics.success++;
				}
				span.finish();
			});
		}
		else {
			_health.metrics.ignore++;
		}
	}
	catch (ex) {
		span.log({ 
			event: "error", 
			reason: `Process Feed Item failed: ${ex.message}`
		});
		_health.metrics.fail++;
		span.finish();
		console.log("unhandled exception processing feed item", ex.message);
	}
}	

