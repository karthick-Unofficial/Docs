const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;


module.exports.applyScript = async function() {
	const scriptName = "add-ecolink-table";

	try {
		// Create table -------------------------------------------------
		// sys_orgSharingConnections was added later as it was missed. This won't impact future updates but will correct for new installations 
		const tables = ["sys_ecoLink", "sys_orgSharingConnections"];
		const tableList = await r.tableList().run();
        
		for(let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				console.log(`Created table ${table}`, tc, ctResult);
			}
		}
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {"success": false, err};
	}
};