const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-application-entity-type-table-three.js"
);


module.exports.applyScript = async function () {
	const scriptName = "update-application-entity-type-table-three";

	try {
		// -- add app entities
		
		const mapEntityTypes = [{
			appId: "map-app",
			entityType: "accessPoint"
		},
		{
			appId: "events-app",
			entityType: "accessPoint"
		},
		{
			appId: "cameras-app",
			entityType: "accessPoint"
		}
		];

		const result = await r.table("sys_applicationEntityType")
			.insert(mapEntityTypes);
		logger.info(
			"applyScript",
			`Updated table ${"sys_applicationEntityType"}  entities: ${result}`,
			null
		);

		// Finished, return success: true
		return { "success": true };
	}
	catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};