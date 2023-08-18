const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-application-entity-type-table-two.js"
);


module.exports.applyScript = async function() {
	const scriptName = "update-application-entity-type-table-two";

	try {
		// -- add map-app entities
		const appId = "lists-app";
		const mapEntityTypes = ["list"].map(entityType => {
			return {
				appId,
				entityType
			};
		});
		const mapRows = await r.table("sys_applicationEntityType")
			.filter(
				r.row("appId").eq("lists-app")
			);
		if (mapRows.length === 0) {
			const result = await r.table("sys_applicationEntityType")
				.insert(mapEntityTypes);
			logger.info(
				"applyScript",
				`Updated table ${"sys_applicationEntityType"}: ${result}`,
				null
			);
		}

		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};