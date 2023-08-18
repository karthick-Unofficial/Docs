const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-org-support-url.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-org-support-url";

	try {
		// -- update shape entities
		const orgSupportUpdate = await r.table("sys_organization").update({supportURL: "http://aressecuritycorp.com/contact/"}).run();

		console.log(`${scriptName} orgs updated: `, orgSupportUpdate);
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
