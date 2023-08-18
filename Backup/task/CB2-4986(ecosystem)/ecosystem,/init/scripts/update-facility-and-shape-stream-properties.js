const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-facility-and-shape-stream-properties";

	try {
		// -- Add "feedId" and "entityType" properties to shape and facility globalGeo streaming props
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.or(
					r.row("entityType").eq("shapes"),
					r.row("entityType").eq("facility")
				)
			);

		feedTypes.forEach((type) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalGeo") {
					if (!property.properties.initial.includes("feedId")) {
						property.properties.initial = [
							...property.properties.initial,
							"feedId"
						];
					}
					if (type.entityType === "facility" && !property.properties.initial.includes("entityType")) {
						property.properties.initial = [
							...property.properties.initial,
							"entityType"
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