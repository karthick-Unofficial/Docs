const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/util.js");
const provider = require("../../lib/rethinkdbProvider");

module.exports = function(app) {

	const restServer = app.rest;
	const fs = require("fs");
	const sleep = ms => new Promise(res => setTimeout(res, ms));
	let memwatch = null;
	let heapdump = null;
	let memStatsEnabled = false;

	restServer.get("/util/rethinkdb/stats", function (req, res) {
		const poolLength = provider.r.getPool().getLength();
		const poolAvailLength = provider.r.getPool().getAvailableLength();
		res.send({
			pool: {
				length: poolLength,
				availableLength: poolAvailLength
			}
		});
	});

	const getMemWatch = () => {
		try {
			if(!memwatch) memwatch = require("@designqube/node-memwatch");
			return memwatch;
		}
		catch(err) {
			logger.error("getMemWatch", "Error getting memwatch", { errMessage: err.message, errStack: err.stack });
			return null;
		}
	};

	const getHeapDump = () => {
		try {
			if(!heapdump) heapdump = require("heapdump");
			return heapdump;
		}
		catch(err) {
			logger.error("getHeapDump", "Error getting heapdump", { errMessage: err.message, errStack: err.stack });
			return null;
		}
	};

	const onStatsHandler = (stats) => {
		logger.error("onStatsHandler", "Garbage collection occurred. Stats collected.", { "stats": stats });
	};

	restServer.get("/util/memstats/toggle", async function (req, res) {
		try {
			if(!memStatsEnabled) {
				getMemWatch().on("stats", onStatsHandler);
				memStatsEnabled = true;
			}
			else {
				getMemWatch().removeListener("stats", onStatsHandler);
				memStatsEnabled = false;
			}
			res.send({"memStatsEnabled": memStatsEnabled});
		}
		catch(err) {
			logger.error("/util/memstats/toggle", "Error toggling memstats", { errMessage: err.message, errStack: err.stack });
			res.err(err.message, err);
		}
	});

	// restServer.get("/util/memstats/forcegc", async function (req, res) {
	// 	try {
	// 		getMemWatch().gc();
	// 		return { success: true };
	// 	}
	// 	catch(err) {
	// 		logger.error("/util/memstats/forcegc", "Error forcing garbage collection", { errMessage: err.message, errStack: err.stack });
	// 		res.err(err.message, err);
	// 	}
	// });

	restServer.get("/util/heapdiff/:wait", async function (req, res) {
		try {
			const mw = getMemWatch();
			const hd = new mw.HeapDiff();
			await sleep(req.routeVars.wait);
			const diff = hd.end();
			res.send(diff);
		}
		catch(err) {
			logger.error("/util/memstats/forcegc", "Error forcing garbage collection", { errMessage: err.message, errStack: err.stack });
			res.err(err.message, err);
		}
	});

	restServer.get("/util/heapdump", async function (req, res) {
		try {
			const dump = async function() {
				return new Promise((resolve, reject) => {
					getHeapDump().writeSnapshot(function(err, filename) {
						if(err) reject(err);
						const buff = fs.readFileSync(filename);
						fs.unlinkSync(filename);
						resolve({ buff: buff, filename: filename });
					});
				});
			};
			const filebuffRes = await dump();
			res.setContentType("application/zip");
			res.setHeader("content-disposition", `attachment; filename="${filebuffRes.filename}"`);
			res.send(filebuffRes.buff, "binary");
		}
		catch(err) {
			logger.error("/util/memstats/heapdump", "Error executing heap dump", { errMessage: err.message, errStack: err.stack });
			res.err(err.message, err);
		}
	});

};