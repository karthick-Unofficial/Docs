const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-geo-global-feed-types.js"
);

module.exports.applyScript = async function () {
	const scriptName = "update-geo-global-feed-types";

	try {
		// -- Update track entities
		const trackFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "track", appId: "vessels-app" });

		trackFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_properties_name",
							"entityData_properties_iconType",
							"entityData_properties_disposition"
						],
						"initial": [
							...property.properties.initial,
							"entityData_properties_id",
							"entityData_properties_name",
							"entityData_properties_iconType",
							"entityData_properties_disposition",
							"entityType"
						],
						"update": [
							...property.properties.update,
							"entityData_properties_name",
							"entityData_properties_iconType",
							"entityData_properties_disposition"
						]
					};
				}
			});
		});

		for (let i = 0; i < trackFeedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(trackFeedTypes[i].id)
				.update({
					streamProperties: trackFeedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, trackFeedTypes);


		// -- update shape entities
		const shapeFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "shapes" });

		shapeFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_properties_name",
							"entityData_properties_symbol"
						],
						"initial": [
							...property.properties.initial,
							"entityData_properties_id",
							"entityData_properties_name",
							"entityData_properties_symbol"
						],
						"update": [
							...property.properties.update,
							"entityData_properties_name",
							"entityData_properties_symbol"
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


		// -- update camera entities
		const cameraFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "camera" });

		cameraFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare
						],
						"initial": [
							...property.properties.initial,
							"entityType"
						],
						"update": [
							...property.properties.update
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


		// -- update facility entities
		const facilityFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "facility" });

		facilityFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_properties_name"
						],
						"initial": [
							...property.properties.initial,
							"entityData_properties_name",
							"entityData_properties_id"
						],
						"update": [
							...property.properties.update,
							"entityData_properties_name"
						]
					};
				}
			});
		});

		for (let i = 0; i < facilityFeedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(facilityFeedTypes[i].id)
				.update({
					streamProperties: facilityFeedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, facilityFeedTypes);
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
