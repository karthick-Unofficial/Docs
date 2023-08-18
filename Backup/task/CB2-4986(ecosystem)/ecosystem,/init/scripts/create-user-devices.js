const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function() {
	try {
		const tables = ["sys_userDevice"];

		for(let i = 0; i < tables.length; i++) {
			const table = tables[i];
			const tc = config.tableConfig || {};
			const ctResult = await r.tableCreate(table, tc).run();
			console.log(`created table :${table}`, tc, ctResult);
		}

		const secondaryIndexes = {
			"sys_userDevice": ["deviceId"]
		};

		const siKeys = Object.keys(secondaryIndexes);
		for(let i = 0; i < siKeys.length; i++) {
			const key = siKeys[i];
			const si = secondaryIndexes[key];
			for(let j = 0; j < si.length; j++) {
				const indexName = si[j];
				const siResult = await r.table(key).indexCreate(indexName).run();
				console.log(`created index :${indexName} on table ${key}`, siResult);
			}
		}

		return { "success": true };
	}
	catch(err) {
		return err;
	}
};
