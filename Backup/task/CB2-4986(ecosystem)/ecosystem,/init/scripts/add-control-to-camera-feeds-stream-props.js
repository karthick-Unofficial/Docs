const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "add-control-to-camera-feeds-stream-props";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.row("entityType").eq("camera")
			);

		feedTypes.forEach((type) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalData" || property.batch === "globalGeo")  {
					property.properties = {
						"compare": [
							...property.properties.compare
						],
						"initial": [
							...property.properties.initial,
							"control"
						],
						"update": [
							...property.properties.update
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