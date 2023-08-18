const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-camera-globalgeo-stream-properties";

	try {
		// -- Add "feedId" and "entityData_properties_type" properties to camera globalGeo streaming props
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.or(
					r.row("entityType").eq("camera")
				)
			);

		feedTypes.forEach((type) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					if (!property.properties.initial.includes("entityData_properties_type")) {
						property.properties.initial = [
							...property.properties.initial,
							"entityData_properties_type"
						];
					}
					if (!property.properties.initial.includes("feedId")) {
						property.properties.initial = [
							...property.properties.initial,
							"feedId"
						];
					}
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