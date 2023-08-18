const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/seed-configuration-table.js");
const fs = require("fs");
const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";

module.exports.applyScript = async function() {
	const scriptName = "seed-configuration-table";

	try {
		// Ensure table exists
		const tables = ["sys_configuration"];
		const tableList = await r.tableList().run();
        
		for(let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				logger.info(
					"applyScript",
					`Created table ${table}: ${ctResult}`,
					null
				);
			}
		}
		
		//Check for existing configs
		const existingConfigs = await r.table("sys_configuration").count().gt(0);
		if (!existingConfigs) {
			//If none, seed configs
			const configs = fs.readdirSync(`${baseDir}/app-configs`);
			const dbConfigs = [];
			configs.forEach(config => {
				dbConfigs.push({
					"appId": config.replace(".json", ""),
					"config": JSON.parse(fs.readFileSync(`${baseDir}/app-configs/${config}`, "utf8"))
				});
			});

			await r.table("sys_configuration").insert(dbConfigs);
		}
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};