const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-list-column-required-props";

	try {
		// Custom code ---------------------------------------------------
		const totalResults = {
			"deleted": 0,
			"errors": 0,
			"inserted": 0,
			"replaced": 0,
			"skipped": 0,
			"unchanged": 0
		};

		const lists = await r.table("sys_list");
		asyncForEach(lists, async (list) => {
			// -- add column.required property with a default value of "false" if not present
			list.columns.forEach(col => {
				if (col.required !== true) {
					col.required = false;
				}
			});

			// -- update columns property in the table after making the update
			const result = await r.table("sys_list")
				.get(list.id)
				.update({
					columns: list.columns
				});
			Object.keys(totalResults).forEach(key => {
				if (result[key]) {
					totalResults[key] = totalResults[key] + result[key];
				}
			});
		});
		console.log(`${scriptName} success: `, totalResults);
		// ---------------------------------------------------------------

		// Finished, return success: true
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

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}