const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-stream-properties-heading";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(feedtype => r.expr(["ssr", "aishub"]).contains(feedtype("feedId")));

		feedTypes.forEach((type) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"entityData_properties_hdg",
							"entityData_properties_heading"
						],
						"initial": [
							...property.properties.initial,
							"entityData_properties_hdg",
							"entityData_properties_heading"
						],
						"update": [
							...property.properties.update,
							"entityData_properties_hdg",
							"entityData_properties_heading"
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