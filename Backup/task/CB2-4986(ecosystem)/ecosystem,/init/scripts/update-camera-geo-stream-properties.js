const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-camera-geo-stream-properties";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.row("entityType").eq("camera")
			);

		for (let i = 0; i < feedTypes.length; i++) {
			let changesMade = false;
			if (feedTypes[i].streamProperties) {
				feedTypes[i].streamProperties.forEach(property => {
					if (property.batch === "globalGeo") {
						if (!property.properties.initial)
							property.properties.initial = [];
						if (!property.properties.initial.includes("entityData_properties_id")) {
							property.properties.initial.push("entityData_properties_id");
							changesMade = true;
						}
						if (!property.properties.initial.includes("entityData_properties_name")) {
							property.properties.initial.push("entityData_properties_name");
							changesMade = true;
						}
						if (!property.properties.initial.includes("controls")) {
							property.properties.initial.push("controls");
							changesMade = true;
						}
					}
				});
			} else {
				feedTypes[i].streamProperties = [
					{
						"alwaysSend": true,
						"batch": "globalGeo",
						"properties": {
							"initial": [
								"entityData_properties_id",
								"entityData_properties_name",
								"controls"
						  	]
						}
					}
				];
				changesMade = true;
			}

			if (changesMade) {
				await r.table("sys_feedTypes")
					.get(feedTypes[i].id)
					.update({
						streamProperties: feedTypes[i].streamProperties
					});
			}
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