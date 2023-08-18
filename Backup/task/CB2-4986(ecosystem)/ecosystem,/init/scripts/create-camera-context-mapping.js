const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/create-camera-context-mapping.js");

/**
 * Update DB with new sys_entityAttachment table and populate it with all prior attachments
 */
module.exports.applyScript = async function () {
	const scriptName = "create-camera-context-mapping";

	try {
		// Create table -------------------------------------------------
		const tableList = await r.tableList().run();

		// If table doesn't exist, create it
		if (!tableList.includes("sys_cameraContextMapping")) {
			const tc = config.tableConfig || {};
			const ctResult = await r.tableCreate("sys_cameraContextMapping", tc).run();
			console.log(`Created table ${"sys_cameraContextMapping"}`, tc, ctResult);
		}
		// Finished, return success: true
		return {
			"success": true
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