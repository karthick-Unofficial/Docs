const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-track-feed-display-properties";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(feedtype => r.and(feedtype.hasFields("displayProperties"), feedtype("entityType").eq("track")));

		feedTypes.forEach((type, index) => {
			if (type.displayProperties && !Array.isArray(type.displayProperties)) {
				type.displayProperties = Object.keys(type.displayProperties).map(propertyKey => {
					const newDisplayProp = {
						key: propertyKey,
						label: type.displayProperties[propertyKey]
					};
					// known track props with additional key/values other than 'key' and 'label'
					switch (propertyKey.toLocaleLowerCase()) {
						case "timestamp":
							newDisplayProp.unit = "time";
							break;
						case "countryCode":
							newDisplayProp.visual = "flag";
							newDisplayProp.tooltip = "countryOfOrigin";
							break;
						case "course":
							newDisplayProp.visual = "direction";
							newDisplayProp.unit = "°";
							break;
						case "speed":
							newDisplayProp.visual = "text";
							break;
						default:
							break;
					}
					return newDisplayProp;
				});
			}
		});


		for (let i = 0; i < feedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(feedTypes[i].id)
				.update({
					displayProperties: feedTypes[i].displayProperties
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