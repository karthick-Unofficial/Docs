const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/update-feeds-with-owner-orgs.js");

module.exports.applyScript = async function () {
	const scriptName = "update-feeds-with-owner-orgs";

	try {
		const results = [];

		const feedTypesToUpdate = await r.table("sys_feedTypes")
			.filter(
				r.row.hasFields("ownerOrg").not()
			)
			.run();

		if (feedTypesToUpdate.length) {
			for (const feedType of feedTypesToUpdate) {
				const feedId = feedType.feedId;
				const id = feedType.id;

				const orgInts = await r.table("sys_orgIntegration")
					.filter({ "intId": feedId })
					.run();

				if (orgInts.length > 0) {
					const orgInt = orgInts[0];

					const ownerOrg = orgInt.feedOwnerOrg;

					const result = await r.table("sys_feedTypes")
						.get(id)
						.update({ "ownerOrg": ownerOrg })
						.run();

					results.push(result);
				}
			}
		}

		logger.info("applyScript", `Result of ${scriptName}: ${results}`, null, SYSTEM_CODES.UNSPECIFIED);

		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: err });
		return {
			"success": false,
			err
		};
	}
};