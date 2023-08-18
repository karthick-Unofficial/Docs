"use strict";
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/rethinkdbProvider.js");
const config = require("../config.json");
const RethinkDBDash = require("rethinkdbdash");
const processChangefeed = require("rethinkdb-changefeed-reconnect");
const { ReqlDriverError, ReqlServerError, ReqlRuntimeError, ReqlCompileError } = require("rethinkdbdash/lib/error");
const secrets = require("../secrets/secrets");

module.exports = new RethinkDBProvider();

function RethinkDBProvider() {
	if (process.env.RETHINKDB_SERVERS) {
		// -- supports multiple command delimited server:port i.e. 192.168.1.5:28015,192.168.1.6:28015
		const servers = process.env.RETHINKDB_SERVERS.split(",");
		const serversConfig = [];
		servers.forEach(function (server) {
			const parts = server.split(":");
			serversConfig.push({ "host": parts[0], "port": parts[1] });
		});
		config.dbOptions.servers = serversConfig;
	}
	this.servers = config.dbOptions.servers;
	const credFileContents = secrets.get("DB_CREDS");
	if (credFileContents) {
		const dbCreds = credFileContents.split("|");
		if (dbCreds.length === 2) {
			logger.info("RethinkDBProvider", `setting credentials for user ${dbCreds[0]}`);
			config.dbOptions["user"] = dbCreds[0];
			config.dbOptions["password"] = dbCreds[1];
		}
		else {
			logger.error("RethinkDBProvider", "Invalid credentials, username and password required");
		}
	}
	else {
		logger.error("RethinkDBProvider", "No DB_CREDS secret available. This is required if authorization to RethinkDB is enabled");
	}
	config.dbOptions["silent"] = true;
	// The pool master by default will log all errors/new states on stderr. 
	// If you do not want to pollute stderr, pass silent: true when you import the driver and provide your own log method.
	// Not sure how we differentiate between new states and errors so will need to determine what kind of messages to expect and format/text
	// So far have only seen state changes so may not be useful for health
	config.dbOptions["log"] = function (message) {
		logger.info("RethinkDBProvider", "Pool logged a message", { message: message }, SYSTEM_CODES.RETHINKDB);
	};
	this.r = RethinkDBDash(config.dbOptions);
	// -- these do not appear to trigger from a failure on server so would seemingly occur when problem with client pool. Which makes sense but server failure I would have
	// -- thought would affect pool state 
	this.r.getPoolMaster().on("healthy", function (healthy) {
		if (healthy === true) {
			logger.info("RethinkDBProvider", "Pool transitioned to a healthy state", null, SYSTEM_CODES.RETHINKDB);
		}
		else {
			// -- This could be an ecosystem issue as well, might want to log for both because IDK for sure
			logger.fatal("RethinkDBProvider", "Pool transitioned to an unhealthy state and will not respond to queries", null, SYSTEM_CODES.RETHINKDB);
		}
	});

	// monitor pool size and if reaches and persists at max, bail
	this.atMaxCtr = 0;
	setInterval(function () {
		try {
			const maxPoolLength = config.dbOptions.max || 1000;
			const poolLength = this.r.getPoolMaster().getLength();
			if (poolLength >= maxPoolLength) {
				this.atMaxCtr++;
				logger.error(
					"RethinkDBPoolSizeMonitor",
					`${process.argv[1]} pool length reached allowed max ${poolLength}/${maxPoolLength} - ${this.atMaxCtr} times.`,
					{ maxPoolLength: maxPoolLength, poolLength: poolLength },
					SYSTEM_CODES.RETHINKDB
				);
				if(this.atMaxCtr >= 4) {
					process.exit();
				}
			}
			else {
				this.atMaxCtr = 0;
				logger.info("RethinkDBPoolSizeMonitor",
					`${process.argv[1]} pool length below allowed max ${poolLength}/${maxPoolLength}`,
					{ maxPoolLength: maxPoolLength, poolLength: poolLength },
					SYSTEM_CODES.RETHINKDB);
			}
		}
		catch (err) {
			logger.error("RethinkDBPoolSizeMonitor",
				`${process.argv[1]} unexpected error`,
				{ errMessage: err.message, errStack: err.stack },
				SYSTEM_CODES.RETHINKDB);
		}
	}.bind(this), 15000);
}

RethinkDBProvider.prototype.isReqlError = function (err) {
	return (err instanceof ReqlServerError) ||
		(err instanceof ReqlDriverError) ||
		(err instanceof ReqlRuntimeError) ||
		(err instanceof ReqlCompileError);
};

RethinkDBProvider.prototype.processChangefeed = function (name, changesQuery, onFeedItem, onError) {
	// trick to get reference to cursor so we can provide a cancel function
	let c = null;
	const changesQueryAsync = async function () {
		c = await changesQuery.run();
		return c;
	};
	processChangefeed(
		changesQueryAsync, onFeedItem, onError,
		{
			changefeedName: name,
			attemptDelay: 1000,
			maxAttempts: 100,
			silent: false,
			logger: {
				log: (cfName, msg) => logger.info("processChangefeed", "Changefeed log message", { changefeedName: cfName, message: msg }, SYSTEM_CODES.RETHINKDB),
				info: (cfName, msg) => logger.info("processChangefeed", "Changefeed info message", { changefeedName: cfName, message: msg }, SYSTEM_CODES.RETHINKDB),
				// -- Failed attempts come as warnings - this should be something we watch for as an indicator of rethink server failure
				warn: (cfName, msg) => logger.error("processChangefeed", "Changefeed warn message", { changefeedName: cfName, message: msg }, SYSTEM_CODES.RETHINKDB),
				// -- exceed max attempts, query exceptions
				error: (cfName, msg) => logger.fatal("processChangefeed", "Changefeed error message", { changefeedName: cfName, message: msg }, SYSTEM_CODES.RETHINKDB)
			}
		}
	);
	const cancelFn = () => {
		if (c) {
			console.log(`close ${name} changefeed`);
			c.close();
		}
		else {
			console.log(`cannot cancel ${name} changefeed. cursor not available`);
		}
	};
	return cancelFn;
};

RethinkDBProvider.prototype.ping = async function() {
	try {
		const pingResult = await this.r.expr(1).run();
		return pingResult === 1;
	}
	catch (err) {
		return false;
	}
};
