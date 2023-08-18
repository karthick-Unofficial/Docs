const provider = require("../lib/rethinkdbProvider");
const r = provider.r;

module.exports = async function(app) {

	if(app._testMode) {
		// -- load seed data
		// const seedDataKeys = Object.keys(seedData);
		const seedData = await app.appRequest.request(
			"cb-load-tester", 
			"GET", 
			"/testSeedData/ecosystem", 
			null,
			null,
			null
		);
        
		// key is the table to insert seed data to
		for(const key in seedData) {
			// seedData is an array of entities to insert into this table
			const tableSeedData = seedData[key];
			const seedDataResult = await r.table(key).insert(tableSeedData, { conflict: "update" }).run();
			console.log(`inserted test seed data into table :${key}`, seedDataResult);
		}
	}

};