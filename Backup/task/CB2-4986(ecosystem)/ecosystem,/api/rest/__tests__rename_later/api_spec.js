// const frisby = require("frisby");
// const Joi = frisby.Joi;
// const TokenProvider = require("../../../lib/tokenProvider.js")({});
// const crypto = require("crypto");

// const environment = "cb2-dev.commandbridge.com";
// const url = "https://" + environment + "/ecosystem/api";

// // Connecting to CB2-Dev database
// const config = require("../../../config.json");
// const RethinkDBDash = require("rethinkdbdash");

// // ------------------------- Rethink & Frisby Setup -------------------------

// function RethinkDBProvider() {
// 	this.r = RethinkDBDash({
// 		"pool": true,
// 		"cursor": false,
// 		"pingInterval": 15,
// 		"servers": [
// 			{
// 				"host": "98.101.57.101",
// 				"port": 28015
// 			}
// 		],
// 		"db": "ecosystem"
// 	});
// }
// const provider = new RethinkDBProvider();
// const r = provider.r; // reference to rething connection/db


// // Seeding the DB
// async function seedDB(){
// 	await r.table(NOTIFICATION_TABLE).insert({"activityId": "JestTestSeed", "actor": "JestTest", "summary": "JestTest", "message": "JestTest", "to": [{"token": "organization:ares_security_corporation", "system": true, "email": false, "pushNotification": false}]}).run();
// 	await r.table(APPLICATION_TABLE).insert({"appId": "JestTest", "icon": "JestTest", "name": "JestTest"}).run();
// 	await r.table(USER_APPLICATION_TABLE).insert({"appId": "JestTest", "config": {"canView": true, "role": "viewer"}, "userId": "JestTest"}).run();
// 	return console.log("Done seeding DB");
// }

// // Running seed and setting Jest timeout before tests
// beforeAll(() => {
// 	jest.setTimeout(30000);
// 	return seedDB();
// });

// // Generate access token for request headers
// const testToken = TokenProvider.generate({
// 	"id": "2c9c0362-345b-4f33-9976-219a4566b9c3",
// 	"email": "orgadmin@aressecuritycorp.com",
// 	"role": "system-user",
// 	"orgId": "ares_security_corporation"
// }, "access");

// // Headers for all tests and fetch timeout for each test
// frisby.globalSetup({
// 	request: {
// 		headers: {
// 			"Authorization": "Bearer " + testToken,
// 			"Content-Type": "application/json"
// 		},
// 		timeout: 30000
// 	}
// });

// // ------------------------- Activities -------------------------
// describe("Activities", () => {

// 	it("should have correct status code of 200 and create activity on POST", function(done){
// 		const body = {
// 			"activity": {
// 				"id": "JestTest",
// 				"name": "JestTest",
// 				"type": "JestTest",
// 				"url": "JestTest"
// 			},
// 			"app": {
// 				"feedId": "JestTest",
// 				"id": "JestTest",
// 				"filename": "JestTest",
// 				"url": "JestTest",
// 				"type": "JestTest"
// 			},
// 			"type": "JestTest",
// 			"summary": "JestTest"
// 		};

// 		frisby
// 			.post(url + "/activities", body)
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	// THIS IS CURRENTLY TIMING OUT
	
// 	// it("should return a list of activities by entity and page", async function(done) {
// 	// 	const data = await r.table(ACTIVITY_TABLE).run();
// 	// 	const entityId = data[0].id;

// 	// 	frisby
// 	// 		.get(url + "/activities?entityType=shapes&entityId=" + entityId + "&page=1")
// 	// 		.expect("status", 200)
// 	// 		.done(done);
// 	// });
// });

// // ------------------------- Applications -------------------------
// describe("Applications", () => {

// 	it("should have correct status code of 200 on GET", function (done) {
// 		frisby
// 			.get(url + "/applications")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return correct data types on GET", function (done) {
// 		frisby
// 			.get(url + "/applications")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "?", {
// 				"appId": Joi.string().allow(""),
// 				"icon": Joi.string().allow(""),
// 				"id": Joi.string().allow(""),
// 				"name": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/applications")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should create database entry correctly on POST", function (done) {
// 		const body = {
// 			"application": {
// 				"appId": "JestTest",
// 				"icon": "Jest Test",
// 				"filename": "Jest Test",
// 				"name": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/applications", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.done(done);
// 	});

// 	it("should return a validation error on incorrect data on POST", function (done) {
// 		const body = {
// 			"application": {
// 				"appId": true,
// 				"icon": "Jest Test",
// 				"filename": "Jest Test",
// 				"name": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/applications", body)
// 			.expect("status", 200)
// 			.expect("json", "success", false)
// 			.expect("json", "reason.message", "Validation Error")
// 			.done(done);
// 	});

// 	it("should get the correct application by appId", function (done) {
// 		frisby
// 			.get(url + "/applications" + "/JestTest")
// 			.expect("status", 200)
// 			.expect("json", "?", {
// 				"appId": "JestTest"
// 			})
// 			.done(done);
// 	});

// 	it("should get org profile with appId and orgId on GET", function(done){
// 		frisby
// 			.get(url + "/applications/JestTest/orgProfile/JestTest")
// 			.expect("status", 200)
// 			.expect("json", "?", {
// 				"appId": "JestTest",
// 				"name": "JestTest"
// 			})
// 			.done(done);
// 	});

// });

// // ------------------------- Attachments -------------------------
// describe("Attachments", () => {
// 	it("should create database entry correctly on POST", function (done) {
// 		const body = {
// 			"app": "Jest Test",
// 			"targetType": "Jest Test",
// 			"targetId": "Jest Test",
// 			"files": [
// 				{
// 					"handle": "JestTest",
// 					"name": "Jest Test 1",
// 					"type": "image/jpg"
// 				}
// 			],
// 			"notify": "Jest test"
// 		};

// 		frisby
// 			.post(url + "/attachments", body)
// 			.inspectJSON()
// 			.inspectResponse()
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.post(url + "/attachments")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should return a validation error on incorrect data on POST", function (done) {
// 		const body = {
// 			"app": 1,
// 			"targetType": "Jest Test",
// 			"targetId": "Jest Test",
// 			"files": [
// 				{
// 					"handle": "JestTest1",
// 					"name": "Jest Test 1",
// 					"type": "image/jpg"
// 				}
// 			],
// 			"notify": "Jest test"
// 		};

// 		frisby
// 			.post(url + "/attachments", body)
// 			.expect("status", 200)
// 			.expect("json", "success", false)
// 			.expect("json", "reason.message", "Validation Error")
// 			.done(done);
// 	});

// 	it("should change database entry to deleted on DELETE", function (done) {
// 		frisby
// 			.del(url + "/attachments" + "/JestTest")
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "changes.?", {
// 				"new_val": {
// 					"deleted": true
// 				}
// 			})
// 			.done(done);
// 	});

// });

// // ------------------------- Auth -------------------------
// describe("Auth", () => {

// 	it("should return 200 and give token with correct username/password on POST", function (done) {
// 		const body = {
// 			"username": "orgadmin@aressecuritycorp.com",
// 			"password": "P@ssw0rd"
// 		};

// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Content-Type": "application/json"
// 					}
// 				}
// 			})
// 			.post(url + "/auth/token", body)
// 			.expect("status", 200)
// 			.expect("jsonTypes", {
// 				"access_token": Joi.string(),
// 				"refresh_token": Joi.string()
// 			})
// 			.done(done);
// 	});

// 	it("should not return a token if username/password are incorrect on POST", function (done) {
// 		const body = {
// 			"username": "testingman@aressecuritycorp.com",
// 			"password": "easy_as_123"
// 		};

// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Content-Type": "application/json"
// 					}
// 				}
// 			})
// 			.post(url + "/auth/token", body)
// 			.expect("status", 404)
// 			.done(done);
// 	});

// 	it("should receive code 200 when resetting password with email that exists", function (done) {
// 		const email = "orgadmin@aressecuritycorp.com";

// 		frisby
// 			.get(url + "/auth/" + email + "/forgot")
// 			.expect("status", 200)
// 			.expect("json", "message", "ok")
// 			.done(done);
// 	});

// 	// it("should receive code 404 when resetting password with email that does not exist", function (done) {
// 	// 	const badEmail = "doesnotexist@fake.com";

// 	// 	frisby
// 	// 		.get(url + "/auth/" + badEmail + "/forgot")
// 	// 		.expect("status", 404)
// 	// 		.done(done);
// 	// });

// 	it("should allow not allow a get if token is incorrect on GET", function(done){
// 		const token = 123;

// 		frisby
// 			.get(url + "/auth/initial/" + token)
// 			.expect("status", 401)
// 			.done(done);
// 	});	

// 	it("should return correct code with initial token on GET", async function(done){
// 		const data = await r.table("sys_user").filter({"roleId": "JestTest"}).run();
// 		const token = data[0].setPasswordToken;

// 		frisby
// 			.get(url + "/auth/initial/" + token)
// 			.expect("status", 200)
// 			.expect("json", "code", 200)
// 			.expect("json", "message", "ok")
// 			.done(done);
// 	});

// 	it("should update password on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"roleId": "JestTest"}).run();
// 		const token = data[0].setPasswordToken;
// 		const body = {
// 			"password": "JestTest"
// 		};

// 		frisby
// 			.put(url + "/auth/initial/" + token, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should give new resetToken on GET", function(done){
// 		const email = "JestTest@JestTest.com";

// 		frisby
// 			.get(url + "/auth/" + email + "/forgot")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should allow password reset on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"roleId": "JestTest"}).run();
// 		const token = data[0].resetToken;
// 		const body = {
// 			"password": "JestTestReset"
// 		};

// 		frisby
// 			.put(url + "/auth/reset/" + token, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});
// });

// // ------------------------- Daily Brief -------------------------
// describe("Daily Brief", () => {

// 	it("should have correct status code of 200 and create a post", function (done) {
// 		const body = {
// 			"post": {
// 				"author": "JestTest",
// 				"authorId": "JestTest",
// 				"endDate": "tomorrow",
// 				"endTime": "12pm",
// 				"orgId": "ares_securit_corporation",
// 				"startDate": "today",
// 				"startTime": "12pm",
// 				"title": "JestTestPost"
// 			}
// 		};

// 		frisby
// 			.post(url + "/dailybrief", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.done(done);
// 	});

// 	it("should not allow incorrect data to enter database", function (done) {
// 		const body = {
// 			"post": {
// 				"author": true,
// 				"authorId": "JestTest",
// 				"endDate": "tomorrow",
// 				"endTime": "12pm",
// 				"orgId": "ares_securit_corporation",
// 				"startDate": "today",
// 				"startTime": "12pm",
// 				"title": "JestTestPost"
// 			}
// 		};

// 		frisby
// 			.post(url + "/dailybrief", body)
// 			.expect("json", "success", false)
// 			.expect("json", "reason.message", "Validation Error")
// 			.done(done);
// 	});

// 	it("should remove post by ID on delete", async function (done) {
// 		const data = await r.table("sys_dailyBrief").filter({ "authorId": "JestTest" }).run();
// 		const dailyBriefId = data[0].id;

// 		frisby
// 			.del(url + "/dailybrief/" + dailyBriefId)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should update post by ID on PUT", async function (done) {
// 		const data = await r.table("sys_dailyBrief").filter({ "authorId": "JestTest" }).run();
// 		const dailyBriefId = data[0].id;

// 		const body = {
// 			"post": {
// 				"author": "JestTest",
// 				"authorId": "JestTest",
// 				"endDate": "tomorrow",
// 				"endTime": "12pm",
// 				"orgId": "ares_securit_corporation",
// 				"startDate": "today",
// 				"startTime": "12pm",
// 				"title": "JestTestUpdated"
// 			}
// 		};

// 		frisby
// 			.put(url + "/dailybrief/" + dailyBriefId, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.expect("json", "changes[?].new_val.title", "JestTestUpdated")
// 			.done(done);
// 	});

// });

// // // ------------------------- Entities -------------------------
// // describe("Entities", () => {

// // 	it("should have status code of 200 and create on POST", function (done) {
// // 		const body = {
// // 			"feedId": "JestTest",
// // 			"app": "JestTest",
// // 			"entityType": "JestTest",
// // 			"entityData": { "properties": { "name": "JestTest", "type": "point" } },
// // 			"tags": ["JestTest1", "JestTest2"]
// // 		};

// // 		frisby
// // 			.post(url + "/entities", body)
// // 			.expect("status", 200)
// // 			.expect("json", "inserted", 1)
// // 			.expect("json", "errors", 0)
// // 			.done(done);
// // 	});

// // 	it("should return an entity by ID", async function (done) {
// // 		const data = await r.table("sys_entityStore").filter({ "feedId": "JestTest" }).run();
// // 		const entityId = data[0].id;

// // 		frisby
// // 			.get(url + "/entities/" + entityId)
// // 			.expect("status", 200)
// // 			.expect("json", "appId", "JestTest")
// // 			.done(done);
// // 	});

// // 	it("should filter correctly by entityType, appId, and an optional filter", function (done) {
// // 		frisby
// // 			.get(url + "/entities?et=JestTest&app=JestTest&filter=all")
// // 			.expect("status", 200)
// // 			.expect("json", "?", {
// // 				"appId": "JestTest",
// // 				"entityType": "JestTest"
// // 			})
// // 			.done(done);
// // 	});

// // 	it("should update an entity by ID", async function (done) {
// // 		const data = await r.table("sys_entityStore").filter({ "feedId": "JestTest" }).run();
// // 		const entityId = data[0].id;
// // 		const body = {
// // 			"feedId": "JestTest",
// // 			"app": "JestTest",
// // 			"entityType": "JestTest",
// // 			"entityData": { "properties": { "name": "JestTest1", "type": "point" } },
// // 			"tags": ["JestTest1", "JestTest2"]
// // 		};

// // 		frisby
// // 			.put(url + "/entities/" + entityId, body)
// // 			.expect("status", 200)
// // 			.expect("json", "replaced", 1)
// // 			.expect("json", "errors", 0)
// // 			.done(done);
// // 	});

// // 	it("should be able to be shared", async function (done) {
// // 		const data = await r.table("sys_entityStore").filter({ "feedId": "JestTest" }).run();
// // 		const entityId = data[0].id;
// // 		const body = {
// // 			"shares": {
// // 				"ares_security_corporation": "VIEW/EDIT"
// // 			}
// // 		};

// // 		frisby
// // 			.put(url + "/entities/" + entityId + "/share", body)
// // 			.expect("status", 200)
// // 			.expect("json", "replaced", 1)
// // 			.expect("json", "errors", 0)
// // 			.expect("json", "changes[?].new_val.sharedWith", { "ares_security_corporation": "VIEW/EDIT" })
// // 			.done(done);
// // 	});

// // 	it("should be able to be unshared", async function (done) {
// // 		const data = await r.table("sys_entityStore").filter({ "feedId": "JestTest" }).run();
// // 		const entityId = data[0].id;
// // 		const body = {
// // 			"shares": {
// // 				"ares_security_corporation": "VIEW/EDIT"
// // 			}
// // 		};

// // 		frisby
// // 			.put(url + "/entities/" + entityId + "/unshare", body)
// // 			.expect("status", 200)
// // 			.expect("json", "replaced", 1)
// // 			.expect("json", "errors", 0)
// // 			.done(done);
// // 	});

// // 	it("should be able to be deleted by updating deleted property to true", async function (done) {
// // 		const data = await r.table("sys_entityStore").filter({ "feedId": "JestTest" }).run();
// // 		const entityId = data[0].id;

// // 		frisby
// // 			.del(url + "/entities/" + entityId)
// // 			.expect("status", 200)
// // 			.expect("json", "replaced", 1)
// // 			.expect("json", "errors", 0)
// // 			.done(done);
// // 	});

// // 	it("should get entity by entity type, app, and filter on GET", function(done){
// // 		const entityType = "JestTest";
// // 		const app = "JestTest";
// // 		const filter = "all";

// // 		frisby
// // 			.get(url + "/entities?et=" + entityType + "&app=" + app + "&filter=" + filter)
// // 			.expect("status", 200)
// // 			.done(done);
// // 	});

// // 	it("should get all single-segment lines for user", function(done){
// // 		frisby
// // 			.get(url + "/entities/shapes/singleSegmentLines")
// // 			.expect("status", 200)
// // 			.done(done);
// // 	});
// // });

// // ------------------------- Entity Collections -------------------------
// describe("Entity Collections", () => {

// 	it("should have correct status code of 200", function (done) {
// 		frisby
// 			.get(url + "/entityCollections")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/entityCollections")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should be able to get all entity collections", function (done) {
// 		frisby
// 			.get(url + "/entityCollections")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should be able to create with POST", function (done) {
// 		const body = {
// 			"name": "JestTest",
// 			"app": "JestTest",
// 			"entities": ["JestTest1", "JestTest2"]
// 		};

// 		frisby
// 			.post(url + "/entityCollections", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should be able to get by ID with GET", async function(done){
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest" }).run();
// 		const entityCollectionId = data[0].id;
		
// 		frisby
// 			.get(url + "/entityCollections?id=" + entityCollectionId)
// 			.expect("status", 200)
// 			.expect("json", "name", "JestTest")
// 			.done(done);
// 	});

// 	it("should be able to update with PUT", async function (done) {
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest" }).run();
// 		const entityCollectionId = data[0].id;
// 		const body = {
// 			"name": "JestTest1",
// 			"app": "JestTest",
// 			"entities": ["JestTest1", "JestTest2"]
// 		};

// 		frisby
// 			.put(url + "/entityCollections/" + entityCollectionId, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should be able to check for member in collection", async function(done){
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 		const entityCollectionId = data[0].id;

// 		frisby
// 			.get(url + "/entityCollections/hasMember/" + entityCollectionId + "?entityId=" + "JestTest2")
// 			.expect("status", 200)
// 			.expect("json", "hasMember", true)
// 			.done(done);
// 	});

// 	// it("should be able to add member to collection", async function(done){
// 	// 	const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 	// 	const entityCollectionId = data[0].id;
// 	// 	const dataTwo = await r.table("sys_entityStore").filter({"entityType": "JestTest" }).run();
// 	// 	const entityId = dataTwo[0].id;
// 	// 	const body = {
// 	// 		"entityIds": [
// 	// 			entityId
// 	// 		]
// 	// 	};

// 	// 	frisby
// 	// 		.put(url + "/entityCollections/" + entityCollectionId + "/addMembers", body)
// 	// 		.expect("status", 200)
// 	// 		.expect("json", "replaced", 1)
// 	// 		.expect("json", "errors", 0)
// 	// 		.done(done);
// 	// });

// 	// it("should be able to remove members from collections", async function(done){
// 	// 	const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 	// 	const entityCollectionId = data[0].id;
// 	// 	const dataTwo = await r.table("sys_entityStore").filter({"entityType": "JestTest" }).run();
// 	// 	const entityId = dataTwo[0].id;
// 	// 	const body = {
// 	// 		"entityIds": [
// 	// 			entityId
// 	// 		]
// 	// 	};

// 	// 	frisby
// 	// 		.put(url + "/entityCollections/" + entityCollectionId + "/removeMembers", body)
// 	// 		.expect("status", 200)
// 	// 		.expect("json", "replaced", 1)
// 	// 		.expect("json", "errors", 0)
// 	// 		.done(done);
// 	// });

// 	it("should be able to share a collection", async function(done){
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 		const entityCollectionId = data[0].id;
// 		const body = {
// 			"shares": {
// 				"ares_security_corporation": "VIEW/EDIT"
// 			}
// 		};

// 		frisby
// 			.put(url + "/entityCollections/" + entityCollectionId + "/share", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should be able to unshare a collection", async function(done){
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 		const entityCollectionId = data[0].id;
// 		const body = {
// 			"shares": {
// 				"ares_security_corporation": "VIEW/EDIT"
// 			}
// 		};

// 		frisby
// 			.put(url + "/entityCollections/" + entityCollectionId + "/unshare", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should be able to update a collection as deleted", async function(done){
// 		const data = await r.table("sys_entityCollections").filter({ "name": "JestTest1" }).run();
// 		const entityCollectionId = data[0].id;

// 		frisby
// 			.del(url + "/entityCollections/" + entityCollectionId)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});
// });

// // ------------------------- Feeds -------------------------
// describe("Feeds", () => {

// 	it("should have correct status code of 200", function (done) {
// 		frisby
// 			.get(url + "/feeds")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/feeds")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should create a new feed on POST", function (done) {
// 		const body = {
// 			"feed": {
// 				"appId": "JestTest",
// 				"entityType": "track",
// 				"feedId": "JestTest",
// 				"isShareable": false,
// 				"labels": {
// 					"displayName": [
// 						{
// 							"prefix": "",
// 							"property": "Jest"
// 						}
// 					]
// 				},
// 				"metadata": {
// 					"for": "JestTest"
// 				},
// 				"name": "JestTest",
// 				"ownerOrg": "JestTest",
// 				"source": "Jest",
// 				"ttl": 60
// 			}
// 		};

// 		frisby
// 			.post(url + "/feeds", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should create a new feed entity on POST", function (done) {
// 		const body = {
// 			"geometry": {
// 			},
// 			"properties": {
// 				"sourceId": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/feeds/aishub/entities", body)
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should get data by ID on GET", function (done) {
// 		frisby
// 			.get(url + "/feeds/aishub")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should get all feeds", function (done) {
// 		frisby
// 			.get(url + "/feeds")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should get by type", function (done) {
// 		frisby
// 			.get(url + "/feeds/search-by-type/track")
// 			.expect("jsonTypes", "*", {
// 				"id": Joi.string().allow(""),
// 				"name": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should get shareprofile", function (done) {
// 		frisby
// 			.get(url + "/feeds/aishub/shareProfile")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	// Need a test for GET /feeds/:type/geojson 
// });

// // ------------------------- Notifications -------------------------
// describe("Notifications", () => {

// 	it("should have correct status code of 200", function (done) {
// 		frisby
// 			.get(url + "/notifications")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/notifications")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should add a new notification to the queue on POST", function (done) {
// 		const body = {
// 			"activityId": "JestTest",
// 			"actor": "JestTest",
// 			"summary": "JestTest",
// 			"message": "JestTest",
// 			"to": [{
// 				"token": "organization:ares_security_corporation",
// 				"system": true,
// 				"email": false,
// 				"pushNotification": false
// 			}]
// 		};

// 		frisby
// 			.post(url + "/notifications", body)
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should close notification on PUT", async function (done) {
// 		const data = await r.table("sys_notification").filter({ "activityId": "JestTestSeed" }).run();
// 		const notificationId = data[0].id;

// 		frisby
// 			.put(url + "/notifications/" + notificationId + "/close")
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should reopen notification on put", async function (done) {
// 		const data = await r.table("sys_notification").filter({ "activityId": "JestTestSeed" }).run();
// 		const notificationId = data[0].id;

// 		frisby
// 			.put(url + "/notifications/" + notificationId + "/reopen")
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should fail to close bulk with no ID", function (done) {
// 		frisby
// 			.put(url + "/notifications/closebulk")
// 			.expect("status", 500)
// 			.done(done);
// 	});

// 	it("should fail to reopen bulk with no ID", function (done) {
// 		frisby
// 			.put(url + "/notifications/reopenbulk")
// 			.expect("status", 500)
// 			.done(done);
// 	});

// 	it("should closebulk", async function (done) {
// 		const idArr = [];
// 		const data = await r.table("sys_notification").filter({ "activityId": "JestTest111" }).run()
// 			.then(data => data.map(item => idArr.push(item)));

// 		const body = {
// 			"ids": idArr
// 		};

// 		frisby
// 			.put(url + "/notifications/closebulk", body)
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should reopenbulk", async function (done) {
// 		const idArr = [];
// 		const data = await r.table("sys_notification").filter({ "activityId": "JestTest111" }).run()
// 			.then(data => data.map(item => idArr.push(item)));

// 		const body = {
// 			"ids": idArr
// 		};

// 		frisby
// 			.put(url + "/notifications/reopenbulk", body)
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should show notifications since a certain time", function (done) {
// 		frisby
// 			.get(url + "/notifications?since=" + "1")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "*", {
// 				"activityId": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should get all notifications by user", function (done) {
// 		frisby
// 			.get(url + "/notifications")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "*", {
// 				"activityId": Joi.string().allow(""),
// 				"closed": Joi.boolean(),
// 				"isPriority": Joi.boolean(),
// 				"message": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should get notifications by page", function (done) {
// 		frisby
// 			.get(url + "/notifications/archive/1")
// 			.expect("status", 200)
// 			.done(done);
// 	});
// });

// // ------------------------- Organizations -------------------------
// describe("Organizations", () => {

// 	it("should create an organization on post", function (done) {
// 		const body = {
// 			"organization": {
// 				"description": "JestTest",
// 				"name": "JestTest",
// 				"orgId": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/organizations", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should have correct status code of 200 and get organizations on GET", function (done) {
// 		frisby
// 			.get(url + "/organizations")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "?", {
// 				"description": Joi.string().allow(""),
// 				"name": Joi.string().allow(""),
// 				"orgId": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/organizations")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should update an organization on PUT", function (done) {
// 		const body = {
// 			"organization": {
// 				"description": "JestTestEdit",
// 				"name": "JestTest",
// 				"orgId": "JestTest"
// 			}
// 		};

// 		frisby
// 			.put(url + "/organizations/JestTest", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.expect("json", "changes[?].new_val.description", "JestTestEdit")
// 			.done(done);
// 	});

// 	it("should get users by org on GET", function(done){
// 		frisby
// 			.get(url + "/organizations/ares_security_corporation/users")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "?", {
// 				"admin": Joi.boolean(),
// 				"orgId": Joi.string().allow(""),
// 				"username": Joi.string().allow("") 
// 			})
// 			.done(done);
// 	});

// 	it("should add application to organization on POST", function(done){
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/organizations/JestTest/applications/map-app", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should update an application to organization on PUT", function(done){
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest",
// 				"JestTest1": "JestTest1"
// 			}
// 		};

// 		frisby
// 			.put(url + "/organizations/JestTest/applications/map-app", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should delete an application on an org on DELETE", function(done){
// 		frisby
// 			.del(url + "/organizations/JestTest/applications/map-app")
// 			.expect("status", 200)
// 			.expect("json", "deleted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should add an orgIntegration on POST", function(done){
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/organizations/JestTest/integrations/shapes", body)
// 			.expect("status", 200)
// 			// .expect("json", {
// 			// 	"inserted": 1,
// 			// 	"errors": 0
// 			// })
// 			.done(done);
// 	});

// 	it("should update an orgIntegration on PUT", function(done){
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest",
// 				"JestTest1": "JestTest1"
// 			}
// 		};

// 		frisby
// 			.post(url + "/organizations/JestTest/integrations/shapes", body)
// 			.expect("status", 200)
// 			// .expect("json", {
// 			// 	"replaced": 1,
// 			// 	"errors": 0
// 			// })
// 			.done(done);
// 	});

// 	it("should delete an orgIntegration on DELETE", function(done){
// 		frisby
// 			.del(url + "/organizations/JestTest/integrations/shapes")
// 			.expect("status", 200)
// 			.expect("json", "deleted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	// -- /organizations/:orgId/applications POST

// 	// -- /organizations/:orgId/integrations POST

// 	it("should get all org apps on GET", function(done){
// 		frisby
// 			.get(url + "/orgApplications")
// 			.expect("status", 200)
// 			.expect("jsonTypes", "?", {
// 				"name": Joi.string().allow(""),
// 				"orgId": Joi.string().allow("")
// 			})
// 			.done(done);
// 	});

// 	it("should set org image on POST", function(done){
// 		const body = {
// 			"fileHandle": "JestTest"
// 		};

// 		frisby
// 			.post(url + "/organizations/JestTest/image", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should update an organization as deleted on DELETE", function(done){
// 		frisby
// 			.del(url + "/organizations/JestTest")
// 			.expect("status", 200)
// 			.expect("json", "?", {
// 				"errors": 0,
// 				"replaced": 1
// 			})
// 			.done(done);
// 	});
// });

// // ------------------------- Roles -------------------------
// describe("Roles", () => {

// 	// it("should create a new role on POST", function (done) {
// 	// 	const body = {
// 	// 		"role": {
// 	// 			"items": {
// 	// 				"canContribute": true,
// 	// 				"canEdit": true,
// 	// 				"canView": true
// 	// 			},
// 	// 			"orgId": "JestTest",
// 	// 			"roleId": "JestTest",
// 	// 			"events": {
// 	// 				"canContribute": true,
// 	// 				"canView": true
// 	// 			},
// 	// 			"title": "JestTest"
// 	// 		}
// 	// 	};

// 	// 	frisby
// 	// 		.post(url + "/roles", body)
// 	// 		.expect("status", 200)
// 	// 		.expect("json", "title", "JestTest")
// 	// 		.done(done);
// 	// });

// 	it("should update role by ID on PUT", async function (done) {
// 		const data = await r.table("sys_orgRoles").filter({ "orgId": "JestTest" }).run();
// 		const roleId = data[0].id;
// 		const body = {
// 			"role": {
// 				"items": {
// 					"canContribute": true,
// 					"canEdit": true,
// 					"canView": true
// 				},
// 				"orgId": "JestTest",
// 				"roleId": "JestTest",
// 				"events": {
// 					"canContribute": true,
// 					"canView": true
// 				},
// 				"title": "JestTestEdit"
// 			}
// 		};

// 		frisby
// 			.put(url + "/roles/" + roleId, body)
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should update a role as deleted on DELETE", async function (done) {
// 		const data = await r.table("sys_orgRoles").filter({ "orgId": "JestTest" }).run();
// 		const roleId = data[0].id;

// 		frisby
// 			.del(url + "/roles/" + roleId)
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should get org roles by org id", function (done) {
// 		frisby
// 			.get(url + "/roles/JestTest")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	// need test for PUT /roles
// 	it("should upsert on PUT", function(done){
// 		const body = {
// 			"roles": [
// 				{
// 					"items": {
// 						"canContribute": true,
// 						"canEdit": true,
// 						"canView": true
// 					},
// 					"orgId": "JestTest",
// 					"roleId": "JestTest",
// 					"events": {
// 						"canContribute": true,
// 						"canView": true
// 					},
// 					"title": "JestTestUpsert"
// 				}
// 			]
// 		};

// 		frisby
// 			.put(url + "/roles", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});
// });

// // ------------------------- User Devices -------------------------
// describe("User Devices", () => {
// 	it("should create a new device on POST", function (done) {
// 		const body = {
// 			"deviceId": "12345",
// 			"settings": {
// 				"pushNotificationsEnabled": false
// 			},
// 			"token": "JestTest",
// 			"userId": "JestTest"
// 		};

// 		frisby
// 			.post(url + "/userDevices", body)
// 			.expect("status", 200)
// 			.expect("json", "userId", "JestTest")
// 			.done(done);
// 	});

// 	it("should find a device by DeviceID on GET", function (done) {
// 		frisby
// 			.get(url + "/userDevices/12345")
// 			.expect("status", 200)
// 			.expect("json", "deviceId", "12345")
// 			.expect("json", "userId", "JestTest")
// 			.done(done);
// 	});

// 	it("should not find a device by incorrect Device ID on GET", function (done) {
// 		frisby
// 			.get(url + "/userDevices/123454321")
// 			.expect("status", 200)
// 			.expect("json", "result", "not found")
// 			.done(done);
// 	});

// 	it("should update a device by Device ID on PUT", function (done) {
// 		const body = {
// 			"deviceId": "12345",
// 			"settings": {
// 				"pushNotificationsEnabled": false
// 			},
// 			"token": "JestTestUpdate",
// 			"userId": "JestTest"
// 		};

// 		frisby
// 			.put(url + "/userDevices/12345", body)
// 			.expect("status", 200)
// 			.expect("json", "token", "JestTestUpdate")
// 			.expect("json", "deviceId", "12345")
// 			.done(done);
// 	});

// 	it("should update deleted field on by Device ID on DELETE", function (done) {
// 		frisby
// 			.del(url + "/userDevices/12345")
// 			.expect("status", 200)
// 			.expect("json", "deleted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// });

// // ------------------------- Users -------------------------
// describe("Users", () => {

// 	it("should have correct status code of 200", function (done) {
// 		frisby
// 			.get(url + "/users")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should have correct status code of 200", function (done) {
// 		frisby
// 			.get(url + "/users/myProfile")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return 401 Unauthorized status when no auth token is on headers on GET", function (done) {
// 		frisby
// 			.setup({
// 				request: {
// 					headers: {
// 						"Authorization": "Bearer fake token"
// 					}
// 				}
// 			})
// 			.get(url + "/users")
// 			.expect("status", 401)
// 			.done(done);
// 	});

// 	it("should give a user by ID on GET", async function(done){
// 		const data = await r.table(USER_TABLE).filter({"name": "JestTest"}).run();
// 		const userId = data[0].id;

// 		frisby
// 			.get(url + "/users/" + userId)
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should return data on GET", function(done){
// 		frisby
// 			.get(url + "/users")
// 			.expect("status", 200)
// 			.done(done);
// 	});

// 	it("should create a user on POST", function(done){
// 		const body = {
// 			"user": {
// 				"admin": false,
// 				"contact": {
// 					"address": null,
// 					"cellPhone": null,
// 					"city": null,
// 					"officePhone": null,
// 					"state": null,
// 					"zip": null
// 				},
// 				"deleted": false,
// 				"ecoAdmin": false,
// 				"email": "JestTest1@JestTest.com",
// 				"name": "JestTest",
// 				"orgId": "JestTest",
// 				"orgRole": {
// 					"items": {
// 						"canContribute": true,
// 						"canEdit": true,
// 						"canView": true
// 					},
// 					"roleId": null,
// 					"events": {
// 						"canContribute": true,
// 						"canView": true
// 					},
// 					"title":  "Custom"
// 				},
// 				"role": "system-user",
// 				"roleId": "JestTest",
// 				"username": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/users", body)
// 			.expect("status", 200)
// 			.expect("json", "success", true)
// 			.done(done);
// 	});

// 	it("should allow updates to users with PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"user": {
// 				"admin": false,
// 				"contact": {
// 					"address": null,
// 					"cellPhone": null,
// 					"city": null,
// 					"officePhone": null,
// 					"state": null,
// 					"zip": null
// 				},
// 				"deleted": false,
// 				"ecoAdmin": false,
// 				"email": "JestTest1@JestTest.com",
// 				"name": "JestTestUpdated",
// 				"orgId": "JestTest",
// 				"orgRole": {
// 					"items": {
// 						"canContribute": true,
// 						"canEdit": true,
// 						"canView": true
// 					},
// 					"roleId": null,
// 					"events": {
// 						"canContribute": true,
// 						"canView": true
// 					},
// 					"title":  "Custom"
// 				},
// 				"role": "system-user",
// 				"roleId": "JestTest",
// 				"username": "JestTest"
// 			}
// 		};

// 		frisby
// 			.put(url + "/users/" + userId, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should update password on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"name": "JestTestUpdated"}).run();
// 		const token = data[0].setPasswordToken;
// 		const body = {
// 			"password": "JestTest"
// 		};

// 		frisby
// 			.put(url + "/auth/initial/" + token, body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should create or update a userApplication by ID on POST", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/users/" + userId + "/applications/map-app", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should create or update a userAppication by ID on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest",
// 				"JestTest1": "JestTest1"
// 			}
// 		};

// 		frisby
// 			.put(url + "/users/" + userId + "/applications/map-app", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should delete a userApplication by ID on DELETE", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;

// 		frisby
// 			.del(url + "/users/" + userId + "/applications/map-app")
// 			.expect("status", 200)
// 			.expect("json", "deleted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should create or update a userIntegration by ID on POST", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest"
// 			}
// 		};

// 		frisby
// 			.post(url + "/users/" + userId + "/integrations/shapes", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should create or update a userIntegration by ID on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"config": {
// 				"JestTest": "JestTest",
// 				"JestTest1": "JestTest1"
// 			}
// 		};

// 		frisby
// 			.put(url + "/users/" + userId + "/integrations/shapes", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should delete a userIntegration by ID on DELETE", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;

// 		frisby
// 			.del(url + "/users/" + userId + "/integrations/shapes")
// 			.expect("status", 200)
// 			.expect("json", "deleted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should allow user app state to be set on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"collectionsExpanded": {
// 				"0179dd5a-fcaa-4b59-b4b3-b652b9977090": false,
// 				"my-items": false,
// 				"shared-with-me": true
// 			},
// 			"disabledFeeds": [],
// 			"isOpen": false,
// 			"mapCenter": [
// 				-89.91123334336334,
// 				29.613634404876123
// 			],
// 			"mapZoom": 16.278407096290447,
// 			"selectedEntityId": null,
// 			"JestTest": "JestTest"
// 		};

// 		frisby
// 			.put(url + "/users/" + userId + "/applications/map-app/state", body)
// 			.expect("status", 200)
// 			.expect("json", "inserted", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should get user app state on GET", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;

// 		frisby
// 			.get(url + "/users/" + userId + "/applications/map-app/state")
// 			.expect("status", 200)
// 			.expect("json", "appId", "map-app")
// 			.expect("json", "user", userId)
// 			.done(done);
// 	});

// 	it("should add user profile image on POST", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"fileHandle": "JestTest"
// 		};

// 		frisby
// 			.post(url + "/users/" + userId + "/image", body)
// 			.expect("status", 200)
// 			.expect("json", "replaced", 1)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should update user role on PUT", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;
// 		const body = {
// 			"role": "JestTest"
// 		};

// 		frisby
// 			.put(url + "/users/" + userId + "/role", body)
// 			.expect("status", 200)
// 			.expect("json", "errors", 0)
// 			.done(done);
// 	});

// 	it("should get access to an app on GET", function(done){
// 		frisby
// 			.get(url + "/users/map-app/access")
// 			.expect("status", 200)
// 			.expect("json", "canView", true)
// 			.done(done);
// 	});

// 	it("should have status code 500 on incorrect app-id on GET", function(done){
// 		frisby
// 			.get(url + "/users/maps-apps/access")
// 			.expect("status", 500)
// 			.done(done);
// 	});

// 	it("should delete a user by ID on DELETE", async function(done){
// 		const data = await r.table("sys_user").filter({"email": "JestTest1@JestTest.com"}).run();
// 		const userId = data[0].id;

// 		frisby
// 			.del(url + "/users/" + userId)
// 			.expect("status", 200)
// 			.expect("json", "?", {
// 				"errors": 0,
// 				"replaced": 1
// 			})
// 			.done(done);
// 	});
// });

// // Clean up test data from DB after tests
// // Some tables are cleaned twice to account for edits, edge cases, and as a backup
// async function cleanUp() {
// 	await r.table(APPLICATION_TABLE).filter({"appId": "JestTest"}).delete().run(); 
// 	await r.table(ATTACHMENT_TABLE).filter({"app": "Jest Test"}).delete().run(); 
// 	await r.table(DAILY_BRIEF_TABLE).filter({"post": {"author": "JestTest"}}).delete().run(); 
// 	await r.table(DAILY_BRIEF_TABLE).filter({"author": "JestTest"}).delete().run(); 
// 	await r.table(FEED_TYPES_TABLE).filter({"appId": "JestTest"}).delete().run(); 
// 	await r.table(FEED_ENTITIES_TABLE).filter({"entityData": {"properties": {"sourceId": "JestTest"}}}).delete().run(); 
// 	await r.table(ENTITY_COLLECTIONS_TABLE).filter({"appId": "JestTest"}).delete().run(); 
// 	await r.table(NOTIFICATION_TABLE).filter({"activityId": "JestTest"}).delete().run(); 
// 	await r.table(NOTIFICATION_TABLE).filter({"activityId": "JestTestSeed"}).delete().run(); 
// 	await r.table(ORGANIZATION_TABLE).filter({"name": "JestTest"}).delete().run(); 
// 	await r.table(ORG_ROLES_TABLE).filter({"orgId": "JestTest"}).delete().run(); 
// 	await r.table(USER_DEVICE_TABLE).filter({"userId": "JestTest"}).delete().run(); 
// 	await r.table(USER_APPLICATION_TABLE).filter({"appId": "JestTest"}).delete().run();
// 	await r.table(USER_TABLE).filter({"roleId": "JestTest"}).delete().run();
// 	await r.table(ORG_APPLICATION_TABLE).filter({"config": {"JestTest": "JestTest"}}).delete().run();
// 	await r.table(ORG_INTEGRATION_TABLE).filter({"config": {"JestTest": "JestTest"}}).delete().run();
// 	await r.table(USER_INTEGRATION_TABLE).filter({"intId": "JestTest"}).delete().run();
// 	await r.table(USER_APP_STATE_TABLE).filter({"state": {"JestTest": "JestTest"}}).delete().run();
// 	await r.table(ACTIVITY_TABLE).filter({"object": {"feedId": "JestTest"}}).delete().run();
// 	await r.table(ACTIVITY_TABLE).filter({"object": {"name": "JestTest"}}).delete().run(); 
// 	await r.table(ACTIVITY_TABLE).filter({"object": {"name": "JestTestUpdated"}}).delete().run(); 
// 	await r.table(ACTIVITY_TABLE).filter({"object": {"name": "JestTestPost"}}).delete().run(); 
// 	await r.table(ACTIVITY_TABLE).filter({"object": {"name": "JestTest1"}}).delete().run(); 
// 	await r.table(ACTIVITY_TABLE).filter({"target": {"id": "Jest Test"}}).delete().run(); 
// }

// //Running DB cleanup
// afterAll(async (done) => {
// 	await cleanUp();
// 	done();
// });

