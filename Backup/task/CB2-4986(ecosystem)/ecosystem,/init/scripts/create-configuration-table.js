const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger( "ecosystem", "/init/scripts/create-configuration-table.js" );

module.exports.applyScript = async function () {
	const scriptName = "create-configuration-table";

	try {
		const tables = ["sys_configuration"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				logger.info("applyScript", `Created table ${table}: ${ctResult}`);
			}
		}

		// Finished, return success: true
		return { "success": true };
	}
	catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};