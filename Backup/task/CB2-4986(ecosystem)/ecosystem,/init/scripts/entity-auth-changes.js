const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/entity-auth-changes.js"
);

module.exports.applyScript = async function() {
	const scriptName = "entity-auth-changes";
	try {
		// -- set app permissions property
		const appPermissionResult = await r
			.table("sys_application")
			.update({
				permissionOptions: 
					r.branch(
						r.row("appId").eq("map-app"),
						["manage"],
						r.row("appId").eq("events-app"),
						["manage", "share"],
						r.row("appId").eq("status-board-app"),
						["manage", "share"],
						r.row("appId").eq("berth-schedule-app"),
						["manage"],
						r.row("appId").eq("camera-wall-app"),
						["manage"],
						r.row("appId").eq("rules-app"),
						["manage"],
						r.row("appId").eq("law-enforcement-search-app"),
						["manage"],
						r.row("appId").eq("lists-app"),
						["manage"],
						[]
					)
			})
			.run();

		if(appPermissionResult.errors > 0)  {
			throw { message: "errors updating app permissionOptions", result: appPermissionResult };
		}


		const updateUserAppPermissionsResult = await r.table("sys_userApplication")
			.merge((ua) => {
				return r.table("sys_user").get(ua("userId"))
					.pluck("admin", "ecoAdmin", "roleId", "role", "orgRole");
			})
			.merge((uau) => {
				return {
					"app": r.table("sys_application").filter({ "appId": uau("appId") })(0).default({}),
					"orgRole": r.branch(
						uau("roleId").ne(null),
						r.table("sys_orgRoles").filter({ "id": uau("roleId") })(0).default({}),
						uau("orgRole")
					)
				};
			})
			.forEach((ua) => {
				return r.table("sys_userApplication")
					.get(ua("id"))
					.update({
						"permissions":
							r.branch(
								ua("app")("permissionOptions").contains("manage")
									.and(ua("app")("permissionOptions").contains("share"))
									.and(ua("orgRole")("ecosystem")("canShare").eq(true))
									.and(ua("orgRole")("organization")("canEdit").eq(true)),
								["manage", "share"],
								ua("app")("permissionOptions").contains("manage")
									.and(ua("app")("permissionOptions").contains("share"))
									.and(ua("orgRole")("ecosystem")("canShare").eq(false))
									.and(ua("orgRole")("organization")("canEdit").eq(true)),
								["manage"],
								ua("app")("permissionOptions").contains("manage")
									.and(ua("app")("permissionOptions").contains("share"))
									.and(ua("orgRole")("ecosystem")("canShare").eq(true))
									.and(ua("orgRole")("organization")("canEdit").eq(false)),
								["share"],
								ua("app")("permissionOptions").contains("manage")
									.and(ua("orgRole")("organization")("canEdit").eq(true)),
								["manage"],
								[]
							)
					});
			})
			.run();

		if(updateUserAppPermissionsResult.errors > 0)  {
			throw { message: "errors updating user app permissions", result: updateUserAppPermissionsResult };
		}

		// -- set sys_entityType permissionOptions property
		const entityTypePermissionOptionsResult = await r
			.table("sys_entityType")
			.update({
				permissionOptions: 
				r.branch(
					r.row("name").eq("shape"),
					["manage"],
					r.row("name").eq("shapes"),
					["manage"],
					r.row("name").eq("list"),
					["manage"],
					r.row("name").eq("camera"),
					["manage", "control"],
					r.row("name").eq("facility"),
					["manage"],
					[]
				)
			})
			.run();

		if(entityTypePermissionOptionsResult.errors > 0)  {
			throw { message: "errors setting permissionOptions for entityTypes", result: entityTypePermissionOptionsResult };
		}


		const feedTypesRemoveAppIdResult = await r.table("sys_feedTypes").replace(r.row.without("appId")).run();
		if(feedTypesRemoveAppIdResult.errors > 0)  {
			throw { message: "errors removing appId from feedTypes", result: feedTypesRemoveAppIdResult };
		}


		const entityTypeAppIdResult = await r
			.table("sys_entityType")
			.update({
				"appId": 
				r.branch(
					r.row("name").eq("track"),
					"map-app",
					r.row("name").eq("collection"),
					"map-app",
					r.row("name").eq("shape"),
					"map-app",
					r.row("name").eq("shapes"),
					"map-app",
					r.row("name").eq("list"),
					"lists-app",
					r.row("name").eq("camera"),
					"cameras-app",
					r.row("name").eq("facility"),
					"facilities-app",
					r.row("name").eq("event"),
					"events-app",
					""
				)
			})
			.run();

		if(entityTypeAppIdResult.errors > 0)  {
			throw { message: "errors updating entityTypes appId", result: entityTypeAppIdResult };
		}


		const userIntPermissionsResult = await r.table("sys_userIntegration")
			.merge((ui) => {
				return r.table("sys_user").get(ui("userId"))
					.pluck("admin", "ecoAdmin", "roleId", "role", "orgRole");
			})
			.merge((uiu) => {
				return {
					"feedType": r.table("sys_feedTypes")
						.filter({ "feedId": uiu("intId") })(0).default({})
						.pluck("entityType"),
					"orgRole": r.branch(
						uiu("roleId").ne(null),
						r.table("sys_orgRoles").filter({ "id": uiu("roleId") })(0).default({}),
						uiu("orgRole")
					)
				};
			})
			.merge((ui) => {
				return {
					"entityType": r.table("sys_entityType")
						.filter({ "name": ui("feedType")("entityType") })(0).default({})
				};
			})
			.forEach((ua) => {
				return r.table("sys_userIntegration")
					.get(ua("id"))
					.update({
						"permissions":
							r.branch(
								ua("entityType")("permissionOptions").contains("manage")
									.and(ua("entityType")("permissionOptions").contains("control"))
									.and(ua("orgRole")("organization")("canEdit").eq(true)),
								["manage", "control"],
								ua("entityType")("permissionOptions").contains("manage")
									.and(ua("orgRole")("organization")("canEdit").eq(true)),
								["manage"],
								[]
							)
					});
			})
			.run();
  
		if(userIntPermissionsResult.errors > 0)  {
			throw { message: "errors updating userIntegration permissions", result: userIntPermissionsResult };
		}

		const entityCollectionEntityTypeResult = await r.table("sys_entityCollections")
			.update({ "entityType": "collection" })
			.run();

		if(entityCollectionEntityTypeResult.errors > 0)  {
			throw { message: "errors updating entity collections with entity type", result: entityCollectionEntityTypeResult };
		}

		const insertStatusCardEntityTypeResult = await r.table("sys_entityType")
			.insert({
				"appId": "status-board-app",
				"id": "3b2a3124-8ee1-4649-9865-85554f2db3d7",
				"name": "statusCard",
				"sourceTable": "sys_statusCard",
				"permissionOptions": []
			  })
			.run();

		if(insertStatusCardEntityTypeResult.errors > 0)  {
			throw { message: "errors creating statusCard entity type", result: insertStatusCardEntityTypeResult };
		}


		const feedIdIndexTables = ["sys_feedEntities", "sys_camera", "sys_facility", "sys_shape", "sys_list"];
		for(const table of feedIdIndexTables) {
			const createFeedIdIndexResult = await r.table(table).indexCreate("feedId").run();
			if(createFeedIdIndexResult.errors > 0)  {
				throw { message: "errors encountered creating feedId indexes", result: createFeedIdIndexResult };
			}
		}

		// -- remove config property from sys_userApplication, sys_userIntegration
		// -- remove isPublic from entity tables
		// -- remove orgRole related fields from sys_user
		// -- remove sys_orgRole table

		// logger.info(
		// 	"applyScript",
		// 	`Result of ${scriptName}: ${result}`,
		// 	null,
		// 	SYSTEM_CODES.UNSPECIFIED
		// );

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
