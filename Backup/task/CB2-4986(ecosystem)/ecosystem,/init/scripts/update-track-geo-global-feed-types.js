const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-track-geo-global-feed-types.js"
);

module.exports.applyScript = async function () {
	const scriptName = "update-track-geo-global-feed-types";

	try {
		// -- Update track entities
		const trackFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "track", appId: "vessels-app" });

		trackFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare
						],
						"initial": [
							...property.properties.initial,
							"entityData_properties_type"
						],
						"update": [
							...property.properties.update
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
