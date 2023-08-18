const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-accesspoint-entity-type.js"
);


module.exports.applyScript = async function () {
	const scriptName = "add-accesspoint-entity-type";

	try {
		const entityType = await r.table("sys_entityType")
			.filter({
				name: "accessPoint"
			})
			.run();

		if (!entityType.length) {
			const result = await r.table("sys_entityType")
				.insert({
					name: "accessPoint",
					sourceTable: "sys_accessPoints",
					externalEcoPermissionOptions: [
						"control"
					],
					appId: "map-app",
					permissionOptions: [
						"manage",
						"control"
					],
					refProperties: [
						{
							"entityType": "shape",
							"name": "fov"
						}
					]
				})
				.run();

			logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
		}

		// Finished, return success: true
		return { "success": true };
	}
	catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};