const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const seedData = require("../data/initial-event-types-create.json");

module.exports.applyScript = async function () {
	try {
		
		//seed eventTypes table with initial data
		const seedDataKeys = Object.keys(seedData);
		for (let i = 0; i < seedDataKeys.length; i++) {
			// key is the table to insert seed data to
			const key = seedDataKeys[i];
			// seedData is an array of entities to insert into this table
			const tableSeedData = seedData[key];
			const seedDataResult = await r.table(key).insert(tableSeedData, {
				conflict: "update"
			}).run();
			console.log(`inserted seed data into table :${key}`, seedDataResult);
		}

		// seed orgEventTypes table for each existing org with default eventType
		const orgs = await r.table("sys_organization");
		const orgEventTypes = [];
		for (let i = 0; i < orgs.length; i ++) {
			const newOrgEventType = {
				eventTypeId: "cb_event",
				id: `${orgs[i].orgId}_cb_event`,
				orgId: orgs[i].orgId
			};
			orgEventTypes.push(newOrgEventType);
		}

		const result = await r.table("sys_orgEventType")
			.insert(orgEventTypes);
			
		return {
			"success": true
		};
	} catch (err) {
		console.log("There was an error with seed-event-types script: ", err);
		return {
			"success": false,
			err
		};
	}
};