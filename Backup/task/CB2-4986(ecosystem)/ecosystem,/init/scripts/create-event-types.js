const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	try {
		// Create list category table
		const tables = ["sys_eventTypes"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				console.log(`Created table ${table}`, tc, ctResult);
			}
		}

		return {"success": true};
	}
	catch(err) {
		console.log("There was an error with create-event-types script: ", err);
		return {
			"success": false,
			err
		};
	}
};