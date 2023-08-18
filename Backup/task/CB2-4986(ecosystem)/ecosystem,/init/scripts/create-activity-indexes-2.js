const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	try {

		const indexList = await r.table("sys_activity").indexList();

		if(indexList.indexOf("objectId_objectType") === -1) {
			await r.table("sys_activity")
				.indexCreate("objectId_objectType", [r.row("object")("id"), r.row("object")("type")]);
			console.log("Created compound index objectId_objectType");
		}
		else {
			console.log("Compound index objectId_objectType already exists");
		}

		if(indexList.indexOf("targetId_targetType") === -1) {
			await r.table("sys_activity")
				.indexCreate("targetId_targetType", [r.row("target")("id"), r.row("target")("type")]);
			console.log("Created compound index targetId_targetType");
		}
		else {
			console.log("Compound index targetId_targetType already exists");
		}
	
		return {
			"success": true
		};
	} catch (err) {
		console.log("There was an error with create-activity-indexes-2 script: ", err);
		return {
			"success": false,
			err
		};
	}
};