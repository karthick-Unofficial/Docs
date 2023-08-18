const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-cameras-geo-global-feed-types.js"
);

module.exports.applyScript = async function () {
	const scriptName = "update-cameras-geo-global-feed-types";

	try {
		// -- update camera entities
		const cameraFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "camera" });

		cameraFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_displayTargetId",
          					"entityData_displayType"
						],
						"initial": [
							...property.properties.initial,
							"entityData_displayTargetId",
          					"entityData_displayType"
						],
						"update": [
							...property.properties.update,
							"entityData_displayTargetId",
          					"entityData_displayType"
						]
					};
				}
			});
		});

		for (let i = 0; i < cameraFeedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(cameraFeedTypes[i].id)
				.update({
					streamProperties: cameraFeedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, cameraFeedTypes);
		// ---------------------------------------------------------------

		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {
			"success": false,
			err
		};
	}
};
