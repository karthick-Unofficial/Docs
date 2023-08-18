const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/create_sys_accessPoint_table.js");


module.exports.applyScript = async function () {
	const scriptName = "create_sys_accessPoint_table";

	try {
		const tables = ["sys_accessPoints"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();                
				logger.info("applyScript for new accessPoint Passed", `Created table ${table}: ${ctResult}`);
				const indexCreate = await r.table("sys_accessPoints").indexCreate("feedId").run();
				logger.info("sys_access point create index", `Created Index for ${table}: ${indexCreate}`);
			}
		}
		return { success: true };
	}
	catch (err) {
		logger.error("applyScript for new accessPoint failed", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { "success": false, err };
	}
};