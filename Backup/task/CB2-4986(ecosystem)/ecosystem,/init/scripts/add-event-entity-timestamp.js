const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-event-entity-timestamp";

	try {
		const eventEntityUpdate = r
			.table("sys_eventEntities")
			.filter(r.row.hasFields("lastUpdated").not())
			.update({
				lastModifiedDate: new Date()
			})
			.run();

		console.log(`${scriptName} update result: `, eventEntityUpdate);
		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
