const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-camera-stream-properties";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.row("feedId").eq("cameras")
			);

		feedTypes.forEach((type) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalData") {
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


		for (let i = 0; i < feedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(feedTypes[i].id)
				.update({
					streamProperties: feedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, feedTypes);
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