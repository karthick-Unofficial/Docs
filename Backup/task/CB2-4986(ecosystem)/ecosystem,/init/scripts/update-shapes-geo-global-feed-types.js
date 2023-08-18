const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-shapes-geo-global-feed-types.js"
);

module.exports.applyScript = async function () {
	const scriptName = "update-shapes-geo-global-feed-types";

	try {
		// -- update shape entities
		const shapeFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "shapes" });

		shapeFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_properties_polyFill",
							"entityData_properties_polyStroke",
							"entityData_properties_polyFillOpacity",
							"entityData_properties_lineWidth",
							"entityData_properties_lineType"
						],
						"initial": [
							...property.properties.initial,
							"entityData_type",
							"entityData_properties_type",
							"entityData_properties_polyFill",
							"entityData_properties_polyStroke",
							"entityData_properties_polyFillOpacity",
							"entityData_properties_lineWidth",
							"entityData_properties_lineType"
						],
						"update": [
							...property.properties.update,
							"entityData_properties_polyFill",
							"entityData_properties_polyStroke",
							"entityData_properties_polyFillOpacity",
							"entityData_properties_lineWidth",
							"entityData_properties_lineType"
						]
					};
				}
			});
		});

		for (let i = 0; i < shapeFeedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(shapeFeedTypes[i].id)
				.update({
					streamProperties: shapeFeedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, shapeFeedTypes);
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
