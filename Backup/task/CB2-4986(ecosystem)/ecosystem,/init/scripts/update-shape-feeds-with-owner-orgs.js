const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-shape-feeds-with-owner-orgs";

	try {
		// Custom code ---------------------------------------------------
		const feedTypes = await r.table("sys_feedTypes")
			.filter(
				r.row("entityType").eq("shapes")
			);

		feedTypes.forEach((filter, index) => {
			if (!filter.ownerOrg) {
				const lastIndex = filter.feedId.lastIndexOf("_");
				const ownerOrg = filter.feedId.substring(0, lastIndex);
				filter["ownerOrg"] = ownerOrg;
			}
		});

		for (let i = 0; i < feedTypes.length; i++) {
			await r.table("sys_feedTypes")
				.get(feedTypes[i].id)
				.update({
					ownerOrg: feedTypes[i].ownerOrg
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