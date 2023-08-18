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
module.exports.applyScript = async function() {
	const scriptName = "add-event-geo";

	try {
		// Custom code ---------------------------------------------------

		const eventUpdate = r.table("sys_event")
			.filter(
				r.row.hasFields("entityData").not()
			)
			.update({
				"entityData": {
					"geometry": null
				}
			})
			.run();
            
		console.log(`${scriptName} event geo update result: `, eventUpdate);

		// ---------------------------------------------------------------
        
		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {"success": false, err};
	}
};