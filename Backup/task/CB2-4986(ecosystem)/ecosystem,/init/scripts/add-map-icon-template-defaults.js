const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-map-icon-template-defaults.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-map-icon-template-defaults";

	try {
		// Custom code ---------------------------------------------------
		const result = await r.table("sys_feedTypes")
			.filter({"entityType":"track"})
			.update({
				mapIconTemplate: "properties.(iconType & '_' & disposition)"
			});

		logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
		// ---------------------------------------------------------------

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