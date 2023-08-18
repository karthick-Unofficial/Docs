const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-list-feed-id.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-list-feed-id";

	try {
		const lists = await r.table("sys_list");

		if (lists.length) {
			const updatedLists = [];
			lists.forEach(list => {
				if (!list.feedId) {
					list.feedId = `${list.ownerOrg}_lists`;
					updatedLists.push(list);
				}
			});
			if (updatedLists.length) {
				for (let i = 0; i < updatedLists.length; i++) {
					const result = await r.table("sys_list")
						.get(updatedLists[i].id)
						.update(updatedLists[i]).run();
					logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
				}
			}

		}
		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {
			err: {
				message: err.message,
				stack: err.stack
			}
		});
		return {
			"success": false,
			err
		};
	}

};