const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;


/**
 * Update DB with new sys_entityAttachment table and populate it with all prior attachments
 */
module.exports.applyScript = async function() {
	const scriptName = "create-entity-attachments";

	try {
		// Create table -------------------------------------------------
		const tables = ["sys_entityAttachment"];
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
		// --------------------------------------------------------------

		// Custom code ---------------------------------------------------

		const entAttachments = await r.table("sys_attachment")
			.forEach((attachment) => {
				return r.table("sys_entityAttachment")
					.insert({
						fileId: attachment("id"),
						targetId: attachment("targetId")
					});
			})
			.run();

		const attachments = await r.table("sys_attachment")
			.replace(r.row.without(["app", "targetId", "targetType"]))
			.run();

		console.log(`${scriptName} entity attachment insert result: `, entAttachments);
		console.log(`${scriptName} attachment update result: `, attachments);
		// ---------------------------------------------------------------
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {"success": false, err};
	}
};