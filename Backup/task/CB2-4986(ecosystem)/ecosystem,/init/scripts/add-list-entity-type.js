const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;


/**
 * This is the template for DB update scripts, and it may be expanded upon as necessary.
 * 1.) update the scriptName variable below
 * 2.) If you need a table, update any "x-goes-here" strings in the Create Table section. If not, remove it.
 * 3.) If you need an entry in sys_application, update any "x-goes-here" strings in the Add Application section. If not, remove it.
 * 4.) Add any custom code you may need.
 * 5.) Import script into dbscripts.js and add it to exports as an object.
 */
module.exports.applyScript = async function () {
	const scriptName = "add-list-entity-type";

	try {
		// ---------------------------------------------------------------

		// Custom code ---------------------------------------------------
		const entityType = await r.table("sys_entityType")
			.filter(
				r.row("name").eq("list")
			);
		if (entityType.length === 0) {
			const result = await r.table("sys_entityType")
				.insert({
					"name": "list",
					"sourceTable": "sys_list"
				});
		}
		return {
			"success": true
		};
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {
			"success": false,
			err
		};
	}
};