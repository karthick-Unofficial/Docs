const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-list-streams"
);

module.exports.applyScript = async function () {
	const scriptName = "update-list-streams";

	try {
		// -- update shape entities
		const listFeedTypes = await r.table("sys_feedTypes")
			.filter({ entityType: "list" });

		listFeedTypes.forEach((type, index) => {
			type.streamProperties.forEach(property => {
				if (property.batch === "globalData") {
					property.properties = {
						"compare": [
							...property.properties.compare,
							"noPagination"
						],
						"initial": [
							...property.properties.initial,
							"noPagination"
						],
						"update": [
							...property.properties.update,
							"noPagination"
						]
					};
				}
			});
		});

		for (let i = 0; i < listFeedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(listFeedTypes[i].id)
				.update({
					streamProperties: listFeedTypes[i].streamProperties
				});
		}
		console.log(`${scriptName} feedTypes update: `, listFeedTypes);
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
