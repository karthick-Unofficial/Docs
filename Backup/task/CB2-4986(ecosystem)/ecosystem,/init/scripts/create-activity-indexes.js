const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	try {

		const indexList = await r.table("sys_activity").indexList();

		if(indexList.indexOf("objectId_pubDate") === -1) {
			await r.table("sys_activity")
				.indexCreate("objectId_pubDate", [r.row("object")("id"), r.row("published")]);
			console.log("Created compound index objectId_pubDate");
		}
		else {
			console.log("Compound index objectId_pubDate already exists");
		}

		if(indexList.indexOf("targetId_pubDate") === -1) {
			await r.table("sys_activity")
				.indexCreate("targetId_pubDate", [r.row("target")("id"), r.row("published")]);
			console.log("Created compound index targetId_pubDate");
		}
		else {
			console.log("Compound index targetId_pubDate already exists");
		}

		if (indexList.indexOf("targetId_type") === -1) {
			await r.table("sys_activity")
				.indexCreate("targetId_type", [r.row("target")("id"), r.row("type")]);
			console.log("Created compound index targetId_type");
		} else {
			console.log("Compound index targetId_type already exists");
		}
	
		return {
			"success": true
		};
	} catch (err) {
		console.log("There was an error with create-org-activity-indexes script: ", err);
		return {
			"success": false,
			err
		};
	}
};