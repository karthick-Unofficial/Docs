const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/script-name-goes-here.js"
);

/**
 * This is the template for DB update scripts, and it may be expanded upon as necessary.
 * 1.) update the scriptName variable below & update the logger route above
 * 2.) If you need a table, update any "x-goes-here" strings in the Create Table section. If not, remove it.
 * 3.) If you need an entry in sys_application, update any "x-goes-here" strings in the Add Application section. If not, remove it.
 * 4.) Add any custom code you may need.
 * 5.) Import script into dbscripts.js and add it to exports as an object.
 */
module.exports.applyScript = async function() {
	const scriptName = "script-name-goes-here";

	try {
		// Create table -------------------------------------------------
		const tables = ["table-name-goes-here"];
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
		// --------------------------------------------------------------

		// Add Application ----------------------------------------------
		const applications = [
			{
				"appId": "app-id-goes-here",
				"icon": "icon-goes-here",
				"id": "id-goes-here",
				"name": "name-goes-here"
			}
		];
        
		for (let j = 0; j < applications.length; j++) {
			const app = applications[j]; 
			const appResult = await r.table("sys_application").insert(app).run();
			logger.info(
				"applyScript",
				`Inserted application ${app.appId} into sys_applications: ${appResult}`,
				null
			);
		}
		// ---------------------------------------------------------------
        
		// Custom code ---------------------------------------------------

		// Your code goes here!

		// ---------------------------------------------------------------
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};