const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "make-all-shapes-public";

	try {
		// Custom code ---------------------------------------------------
		const result = await r.table("sys_shape")
			.filter({ "isPublic": false, "isDeleted": false })
			.update({ "isPublic": true });
		console.log(`${scriptName} success: ${result}`);
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