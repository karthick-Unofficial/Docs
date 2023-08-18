const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/add-feed-icon.js");

module.exports.applyScript = async function () {
	const scriptName = "add-feed-icon";

	try {
		const feedTypes = await r.table("sys_feedTypes").filter(
			r.row.hasFields("feedIcon").not()
		).pluck("id", "entityType").run();
		if (feedTypes.length > 0) {
			for (let i = 0; i < feedTypes.length; i++) {
				await r.table("sys_feedTypes").get(feedTypes[i].id)
					.update(() => {
						return {
							feedIcon: feedTypes[i].entityType.charAt(0).toUpperCase() + feedTypes[i].entityType.slice(1)
						};
					})
					.run();
			}
		}

		return {
			success: true
		};
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {
			err: err
		});
		return {
			"success": false,
			err
		};
	}
};