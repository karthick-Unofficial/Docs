const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "add-entityType-shape-globalgeo-stream-properties";

	try {
		// -- Add "entityType" properties to shape globalGeo streaming props
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.or(
					r.row("entityType").eq("shape"),
					r.row("entityType").eq("shapes")
				)
			);

		feedTypes.forEach((type) => {
			if (type.streamProperties) {
				type.streamProperties.forEach(property => {
					if (property.batch === "globalGeo") {
						if (!property.properties.initial.includes("entityType")) {
							property.properties.initial = [
								...property.properties.initial,
								"entityType"
							];
						}
					}
				});
			}
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