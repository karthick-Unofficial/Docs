const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-facility-entity-type.js"
);


module.exports.applyScript = async function() {
	const scriptName = "add-facility-entity-type";

	try {
		const entityType = await r.table("sys_entityType")
			.filter({
				name: "facility"
			})
			.run();
        
		if (!entityType.length) {
			const result = await r.table("sys_entityType")
				.insert({
					name: "facility",
					sourceTable: "sys_facility"
				})
				.run();

			logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
		}
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};