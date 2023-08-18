const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/create-system-notification-table.js");

module.exports.applyScript = async function () {
	const scriptName = "create-system-notification-table";

	try {
		// Create table -------------------------------------------------
		const tableList = await r.tableList().run();

		// If table doesn't exist, create it
		if (!tableList.includes("sys_systemNotification")) {
			const tc = config.tableConfig || {};
			const ctResult = await r.tableCreate("sys_systemNotification", tc).run();
			console.log(`Created table ${"sys_systemNotification"}`, tc, ctResult);
		}
		// Finished, return success: true
		return {
			"success": true
		};
	}
	catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {
			"success": false,
			err
		};
	}
};