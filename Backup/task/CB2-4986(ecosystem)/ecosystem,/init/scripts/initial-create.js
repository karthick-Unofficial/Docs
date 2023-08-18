const config = require("../../config");
const provider = require("../../lib/rethinkdbProvider");
const r = provider.r;
const seedData = require("../data/initial-create.json");

module.exports.applyScript = async function () {
	try {

		const tables = [
			"sys_entityType",
			"sys_shape",
			"sys_entityCollections",
			"sys_user",
			"sys_userApplication",
			"sys_userIntegration",
			"sys_userAppState",
			"sys_organization",
			"sys_orgApplication",
			"sys_orgIntegration",
			"sys_event",
			"sys_eventEntities",
			"sys_eventFeedCache",
			"sys_application",
			"sys_feedTypes",
			"sys_feedEntities",
			"sys_activity",
			"sys_attachment",
			"sys_notification",
			"sys_orgRoles",
			"sys_camera",
			"sys_cameraSystem",
			"sys_list",
			"sys_mapStyles"
		];

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			const tc = config.tableConfig || {};
			const ctResult = await r.tableCreate(table, tc).run();
			console.log(`created table :${table}`, tc, ctResult);
		}

		const secondaryIndexes = {
			"sys_user": ["email"],
			"sys_organization": ["orgId"],
			"sys_application": ["appId"],
			"sys_activity": ["published"],
			"sys_feedTypes": ["feedId"],
			"sys_orgRoles": ["roleId"],
			"sys_eventEntities": ["eventId", "entityId"],
			"sys_eventFeedCache": ["entityId", "eventId"]
		};

		const siKeys = Object.keys(secondaryIndexes);
		for (let i = 0; i < siKeys.length; i++) {
			const key = siKeys[i];
			const si = secondaryIndexes[key];
			for (let j = 0; j < si.length; j++) {
				const indexName = si[j];
				const siResult = await r.table(key).indexCreate(indexName).run();
				console.log(`created index :${indexName} on table ${key}`, siResult);
			}
		}

		//compound indexes
		const cIdx = await r.table("sys_feedEntities").indexCreate("feedId_isActive_timestamp",
			function (row) { return [row("feedId"), row("isActive"), row("timestamp")]; });
		console.log("created compound index :feedId_isActive_timestamp on table sys_feedEntities", cIdx);

		const cIdx2 = await r.table("sys_userIntegration").indexCreate("userId_intId_feedOwnerOrg",
			function (row) { return [row("userId"), row("intId"), row("feedOwnerOrg")]; });
		console.log("created compound index :userId_intId_feedOwnerOrg on table sys_userIntegration", cIdx2);

		const cIdx3 = await r.table("sys_orgIntegration").indexCreate("orgId_intId_feedOwnerOrg",
			function (row) { return [row("orgId"), row("intId"), row("feedOwnerOrg")]; });
		console.log("created compound index :orgId_intId_feedOwnerOrg on table sys_orgIntegration", cIdx3);

		const seedDataKeys = Object.keys(seedData);
		for (let i = 0; i < seedDataKeys.length; i++) {
			// key is the table to insert seed data to
			const key = seedDataKeys[i];
			// seedData is an array of entities to insert into this table
			const tableSeedData = seedData[key];
			const seedDataResult = await r.table(key).insert(tableSeedData, { conflict: "update" }).run();
			console.log(`inserted seed data into table :${key}`, seedDataResult);
		}


		// -- Add Data (from json file)

		return { "success": true };
	}
	catch (err) {
		return err;
	}
};

// create default user(s)
// create default org
// create applications (could vary based on deployment so need to figure that out)
// create integrations (will vary based on deployment so need to figure that out)
// create org apps
// create org integrations
// create user apps
// create user integrations
