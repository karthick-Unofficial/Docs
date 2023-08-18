const provider = require("../../lib/rethinkdbProvider");
const r = provider.r;

module.exports.applyScript = async function() {
	try {

		const dbList = await r.dbList();

		if(dbList.indexOf("queue") > -1) {
			console.log("queue database exists, removing it...");
			const dbDropResult = await r.dbDrop("queue");
			console.log("removed queue database", dbDropResult);
		}
		else {
			console.log("queue database does not exist");
		}

		const ecosystemTables = await r.tableList();

		for(let i = 0; i < ecosystemTables.length; i++) {
			const table = ecosystemTables[i];
			if(table.indexOf("queue_") === 0) {
				const removeTableResult = await r.tableDrop(table);
				console.log(`removed table :${table}`, removeTableResult);
			}
		}

		return { "success": true };
	}
	catch(err) {
		console.log("There was an error with remove-rethinkdb-jobqueue script: ", err);
		return { "success": false, err };
	}
};
