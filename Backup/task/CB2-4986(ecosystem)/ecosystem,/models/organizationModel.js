"use strict";
const ORGANIZATION_TABLE = "sys_organization";
const ORG_INTEGRATION_TABLE = "sys_orgIntegration";
const ORG_APPLICATION_TABLE = "sys_orgApplication";
const APPLICATION_TABLE = "sys_application";
const ROLE_INTEGRATION_TABLE = "sys_roleIntegration";
const ROLE_APPLICATION_TABLE = "sys_roleApplication";
const ORG_ROLES_TABLE = "sys_orgRoles";
const USER_TABLE = "sys_user";
const FEED_TYPES_TABLE = "sys_feedTypes";
const ENTITY_TYPE_TABLE = "sys_entityType";

const config = require("../config.json");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userModel = require("../models/userModel")();
const orgEventTypeModel = require("../models/orgEventTypeModel")();
const sharingConnectionModel = require("../models/sharingConnectionModel")();
const SharingConnection = require("../logic/sharingConnection");
const sharingConnection = new SharingConnection();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/organization.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/organizationModel.js");
const global = require("../app-global.js");


module.exports = OrganizationModel;

function OrganizationModel(options) {
	if (!(this instanceof OrganizationModel)) return new OrganizationModel(options);
	const self = this;
	self.options = options;
}

/**
 *  create:
 * @param _org
 * @param _user
 */
OrganizationModel.prototype.create = async (_org, _user) => {
	_org.createdDate = new Date();
	_org.lastModifiedDate = new Date();
	_org.authProviderId = "system";
	_org.supportURL = _org.supportURL || "http://aressecuritycorp.com/contact/";

	// If sharing tokens are required for this installation, set initial property
	if (config.useSharingTokens) {
		_org.maxSharingConnections = 0;
	}
	_org.orgId = _org.orgId.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

	const initialRole = {
		"orgId": _org.orgId,
		"roleId": "org_user",
		"title": "Org User",
		id: `${_org.orgId}_org_user`,
		"initialRole": true
	};
	const initialRoleIntegrations = [];
	try {

		// Check to see if user exists, will async return true or false
		const userExists = await userModel.checkEmailAvailability(_user.email);
		// If user exists, abort and send message
		if (userExists) {
			throw { "message": "That email already exists", "err": "409" };
		}

		// Validate data against schema, throw AJV error on callback if present
		if (!validate(_org)) {
			console.log({ "message": "Validation Error", "err": validate.errors });
			throw { "message": "Validation Error", "err": validate.errors };
		}
		// Check to see if user exists, will async return true or false
		const orgExists = await r.table(ORGANIZATION_TABLE).filter({
			"orgId": _org.orgId
		});
		// If user exists, abort and send message
		if (orgExists.length) {
			throw { "message": "That organization already exists", "err": "409" };
		}
		const result = await r.table(ORGANIZATION_TABLE).insert(_org).run();
		const orgDBId = result.generated_keys[0];

		if (result) {
			await orgEventTypeModel.create(_org.orgId, "cb_event");

			// add owned shapes feed
			const shapeFeedResult = await r.table(FEED_TYPES_TABLE)
				.filter({ "feedId": "shapes" })
				.without("id");
			if (shapeFeedResult.length > 0) {
				const shapeFeed = shapeFeedResult[0];
				shapeFeed.feedId = `${_org.orgId}_shapes`;
				shapeFeed.name = `${_org.name} Shapes`;
				shapeFeed.ownerOrg = _org.orgId;
				await r.table(FEED_TYPES_TABLE).insert(shapeFeed).run();

				const ownedShapeFeed = {
					"config": {},
					"feedOwnerOrg": _org.orgId,
					"id": `${_org.orgId}_shapes`,
					"intId": shapeFeed.feedId,
					"orgId": _org.orgId,
					"policy": {
						"type": "owner"
					}
				};
				initialRoleIntegrations.push({
					"config": {
						"canView": true,
						"role": "viewer"
					},
					"lastModifiedDate": new Date(),
					"feedOwnerOrg": _org.orgId,
					"intId": shapeFeed.feedId,
					"orgIntId": `${_org.orgId}_shapes`,
					"permissions": [
						"manage"
					],
					"roleId": `${_org.orgId}_org_user`
				});
				await r.table(ORG_INTEGRATION_TABLE).insert(ownedShapeFeed).run();
			} else {
				throw { "message": "No shape feed template available", "code": 500 };
			}
			// add owned facilities feed
			const facilityFeedResult = await r.table(FEED_TYPES_TABLE)
				.filter({ "feedId": "facilities" })
				.without("id");
			if (facilityFeedResult.length > 0) {
				const facilityFeed = facilityFeedResult[0];
				facilityFeed.feedId = `${_org.orgId}_facilities`;
				facilityFeed.name = `${_org.name} Facilities`;
				facilityFeed.ownerOrg = _org.orgId;
				await r.table(FEED_TYPES_TABLE).insert(facilityFeed).run();

				const ownedFacilityFeed = {
					"config": {},
					"feedOwnerOrg": _org.orgId,
					"id": `${_org.orgId}_facilities`,
					"intId": facilityFeed.feedId,
					"orgId": _org.orgId,
					"policy": {
						"type": "owner"
					}
				};
				initialRoleIntegrations.push({
					"config": {
						"canView": true,
						"role": "viewer"
					},
					"lastModifiedDate": new Date(),
					"feedOwnerOrg": _org.orgId,
					"intId": facilityFeed.feedId,
					"orgIntId": `${_org.orgId}_facilities`,
					"permissions": [
						"manage"
					],
					"roleId": `${_org.orgId}_org_user`
				});
				await r.table(ORG_INTEGRATION_TABLE).insert(ownedFacilityFeed).run();
			} else {
				throw {
					"message": "No facility feed template available",
					"code": 500
				};
			}
			// add owned lists feed
			const listFeedResult = await r.table(FEED_TYPES_TABLE)
				.filter({ "feedId": "lists" })
				.without("id");
			if (listFeedResult.length > 0) {
				const listFeed = listFeedResult[0];
				listFeed.feedId = `${_org.orgId}_lists`;
				listFeed.name = `${_org.name} Lists`;
				listFeed.ownerOrg = _org.orgId;
				await r.table(FEED_TYPES_TABLE).insert(listFeed).run();

				const ownedListFeed = {
					"config": {},
					"feedOwnerOrg": _org.orgId,
					"id": `${_org.orgId}_lists`,
					"intId": listFeed.feedId,
					"orgId": _org.orgId,
					"policy": {
						"type": "owner"
					}
				};
				initialRoleIntegrations.push({
					"config": {
						"canView": true,
						"role": "viewer"
					},
					"lastModifiedDate": new Date(),
					"feedOwnerOrg": _org.orgId,
					"intId": listFeed.feedId,
					"orgIntId": `${_org.orgId}_lists`,
					"permissions": [
						"manage"
					],
					"roleId": `${_org.orgId}_org_user`
				});
				await r.table(ORG_INTEGRATION_TABLE).insert(ownedListFeed).run();
			} else {
				throw {
					"message": "No list feed template available",
					"code": 500
				};
			}
			await r.table(ORG_ROLES_TABLE).insert(initialRole).run();
			await r.table(ROLE_INTEGRATION_TABLE).insert(initialRoleIntegrations).run();
		}
		return { orgId: _org.orgId };
	}
	catch (err) {
		logger.error("create", "An error occurred while attempting to create an organization", { err: { message: err.message, stack: err.stack } });
		throw { "message": err.message, "err": err.err };
	}
};

OrganizationModel.prototype.update = async function (orgId, org) {
	try {
		org.lastModifiedDate = new Date();
		const result = await r.table(ORGANIZATION_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "deleted": false }, { default: true })
			.update(org, { "returnChanges": true })
			.run();
		return result;
	} catch (err) {
		logger.error("update", "An error occurred while attempting to update an organization", { err: { message: err.message, stack: err.stack } });
		throw { "message": err.message, "err": err.err };
	}
};

OrganizationModel.prototype.orgExists = async function (orgId) {
	const orgCount = await r.table(ORGANIZATION_TABLE)
		.filter({ orgId: orgId })
		.count()
		.run();
	return orgCount === 1;
};

OrganizationModel.prototype.getById = async function (orgId, remote = false) {
	try {
		const sharingConnections = await sharingConnection.getAllSharingConnections();

		const result = await r.table(ORGANIZATION_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "deleted": false }, { default: true })
			.merge(function (org) {
				return {
					applications: r.table(ORG_APPLICATION_TABLE)
						.filter({ orgId: org("orgId") })
						.eqJoin("appId", r.table(APPLICATION_TABLE), { index: "appId" })
						.without([{ left: ["id", "appId", "lastModifiedDate", "orgId"] }, { right: ["id"] }])
						.zip()
						.coerceTo("ARRAY"),
					roles: r.table(ORG_ROLES_TABLE)
						.filter({ "orgId": org("orgId") })
						.filter({ "deleted": false }, { default: true })
						.without(["lastModified", "orgId"])
						.merge((orgRole) => {
							return {
								applications: r.table(ROLE_APPLICATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array"),
								integrations: r.table(ROLE_INTEGRATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array")
							};
						})
						.coerceTo("ARRAY"),
					sharingConnections: r.expr(sharingConnections)
						.filter((conn) => {
							return r.or(
								conn("sourceOrg").eq(org("orgId")),
								conn("targetOrg").eq(org("orgId"))
							);
						})
						.without(["createdBy", "importedBy"])
						.coerceTo("ARRAY")
				};
			})
			.run();

		let org = result[0];

		if (org) {
			const ints = await this._getOrgIntegrations(orgId, org._ecosystem);
			org["integrations"] = ints;
		}
		else if (global.ecoLinkManager.isActive()) { // search for org in linked ecosystems
			org = await global.ecoLinkManager.getOrganizationById(orgId);
		}

		return org;
	} catch (err) {
		logger.error("getById", "Unexpected error", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

OrganizationModel.prototype.getName = async function (orgId) {
	try {
		const result = await r.table(ORGANIZATION_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "deleted": false }, { default: true })
			.run();

		let org;
		if (result.length > 0) {
			org = result[0];
		}
		else {
			org = await global.ecoLinkManager.getOrganizationById(orgId);
		}

		return org.name;
	} catch (err) {
		logger.error("getName", "Unexpected error", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

OrganizationModel.prototype.delete = async function (orgId) {
	try {
		const orgUsers = await r.table(USER_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "deleted": false }, { default: true })
			.without("password")
			.run();
		const removeSharingConnections = sharingConnectionModel.removeConnectionsByOrgQuery(orgId);

		const roleIds = [];
		orgUsers.forEach(user => {
			if (!roleIds.includes(user.roleId)) {
				roleIds.push(user.roleId);
			}
		});
		const result = await r.expr([
			r.table(ORGANIZATION_TABLE)
				.filter({ "orgId": orgId })
				.filter({ "deleted": false }, { default: true })
				.update({ "deleted": true }),

			r.table(USER_TABLE)
				.filter((user) => {
					return r.expr(orgUsers).contains(user("id"));
				})
				.update({ "deleted": true }),

			r.table(ORG_APPLICATION_TABLE)
				.filter({ "orgId": orgId })
				.delete(),

			removeSharingConnections,

			r.table(ORG_INTEGRATION_TABLE)
				.filter({ "orgId": orgId })
				.delete(),

			r.table(ROLE_APPLICATION_TABLE)
				.filter((app) => {
					return r.expr(roleIds).contains(app("roleId"));
				})
				.delete(),

			r.table(ROLE_INTEGRATION_TABLE)
				.filter((int) => {
					return r.expr(roleIds).contains(int("roleId"));
				})
				.delete()

		]).run();
		console.log(result);
		return result;

	} catch (err) {
		logger.error("delete", "An error occurred while attempting to delete an organization", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

OrganizationModel.prototype.getAll = async function (remote = false) {
	try {
		const sharingConnections = await sharingConnection.getAllSharingConnections();
		console.log("SHARING_CONNECTIONS", JSON.stringify(sharingConnections, null, 4));

		const orgs = await r.table(ORGANIZATION_TABLE)
			.filter({ "deleted": false }, { default: true })
			.merge(function (org) {
				return {
					applications: r.table(ORG_APPLICATION_TABLE)
						.filter({ orgId: org("orgId") })
						.eqJoin("appId", r.table(APPLICATION_TABLE), { index: "appId" })
						.without([{ left: ["id", "appId", "lastModifiedDate", "orgId"] }, { right: ["id"] }])
						.zip()
						.coerceTo("ARRAY"),
					roles: r.table(ORG_ROLES_TABLE)
						.filter({ "orgId": org("orgId") })
						.filter({ "deleted": false }, { default: true })
						.without(["lastModified", "orgId"])
						.merge((orgRole) => {
							return {
								applications: r.table(ROLE_APPLICATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array"),
								integrations: r.table(ROLE_INTEGRATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array")
							};
						})
						.coerceTo("ARRAY"),
					sharingConnections: r.expr(sharingConnections)
						.filter((conn) => {
							return r.or(
								conn("sourceOrg").eq(org("orgId")),
								conn("targetOrg").eq(org("orgId"))
							);
						})
						.without(["createdBy", "importedBy"])
						.coerceTo("ARRAY")
				};
			})
			.run();

		for (const org of orgs) {
			const ints = await this._getOrgIntegrations(org.orgId, org._ecosystem);
			org["integrations"] = ints;
		}

		let remoteOrgs = [];
		if (global.ecoLinkManager.isActive() && !remote) { // then include remote
			remoteOrgs = await global.ecoLinkManager.getOrganizations();
		}

		return [...orgs, ...remoteOrgs];
	} catch (err) {
		logger.error("getAll", "An error occurred while attempting to get all organizations", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

/**
 * _getOrgIntegrations internal use for linked ecos
 * @param orgId
 */
OrganizationModel.prototype._getOrgIntegrations = async function (orgId, remote) {
	const ints = await r.table(ORG_INTEGRATION_TABLE)
		.filter({ orgId: orgId })
		.eqJoin("intId", r.table(FEED_TYPES_TABLE), { index: "feedId" })
		.without([{ left: ["intId", "lastModifiedDate", "orgId"] }, { right: ["id"] }])
		.zip()
		.merge((row) => {
			return r.table(ENTITY_TYPE_TABLE)
				.filter((et) => {
					return et("name").eq(row("entityType"));
				})
				.pluck("permissionOptions", "externalEcoPermissionOptions")(0);
		})
		.coerceTo("ARRAY");

	let remoteOrgInts = [];
	if (global.ecoLinkManager.isActive() && !remote) { // then include remote
		remoteOrgInts = await global.ecoLinkManager.getOrgIntegrations(orgId, remote);
	}

	const fullResult = [...ints, ...remoteOrgInts];
	return fullResult;
};


/**
 * streamAll
 * @param handler
 */
OrganizationModel.prototype.streamAll = function (handler) {
	try {

		const changesQuery = r.table(ORGANIZATION_TABLE)
			.filter({ "deleted": false }, { default: true })
			.changes({ "includeInitial": true, "includeTypes": true });

		const onFeedItem = function (change) {
			handler(change);
		};

		const onError = function (err) {
			console.log("OrganizationModel.streamAll changefeed error", err);
		};

		const cancelFn = provider.processChangefeed("OrganizationModel.streamAll", changesQuery, onFeedItem, onError);
		return cancelFn;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

/**
 * getOrgUsers  - retrieve all users in an organization, must be org admin role
 * @param orgId
 * @param callerIdentity
 */
OrganizationModel.prototype.getOrgUsers = async function (orgId) {
	// -- todo validate caller is an org-admin and orgId matches the callers orgId
	try {
		const result = await r.table(USER_TABLE)
			.filter(r.and(
				r.row("orgId").eq(orgId),
				r.row("deleted").eq(false).default(true),
				r.row("api").default(false).ne(true)
			)
			)
			.without("password")
			.run();
		return result;
	} catch (err) {
		throw err;
	}
};



OrganizationModel.prototype.upsertApplication = async function (
	orgId,
	appId,
	configuration,
) {

	const opDate = new Date();
	const op = {
		"id": orgId + "_" + appId,
		"orgId": orgId,
		"appId": appId,
		"config": configuration, // -- allows for arbitrary config
		"lastModifiedDate": opDate
	};

	try {

		const insertResult = await r.table(ORG_APPLICATION_TABLE)
			.insert(op, { conflict: "update" })
			.run();
		console.log("OrganizationModel upsertApplication result:", insertResult);
		return insertResult;
		// -- error handling
	} catch (err) {
		console.log("OrganizationModel upsertApplication error:", err);
		throw err;
	}


};


OrganizationModel.prototype.removeApplication = async function (
	orgId,
	appId) {

	const id = orgId + "_" + appId;
	try {

		const deleteResult = await r.table(ORG_APPLICATION_TABLE).get(id).delete().run();
		console.log("OrganizationModel removeApplication result:", deleteResult);
		return deleteResult;
		// -- error handling
	} catch (err) {
		console.log("OrganizationModel removeApplication error:", err);
		throw err;
	}


};


OrganizationModel.prototype.upsertIntegration = async function (
	userId,
	orgId,
	intId,
	request
) {

	try {

		const userProfile = await userModel.getProfile(userId);
		const userOrg = userProfile.user.orgId;
		const isAdmin = userProfile.user.admin;


		// Need to verify that the requesting user's org owns the feed
		const integration = await r.table(FEED_TYPES_TABLE).filter({ feedId: intId }).run();
		if (!integration[0]) {
			throw { err: { "message": "Integration not found.", "code": 404 } };
		}

		// ownerOrg not present for shapes and shapes always A-OK
		const ownsIntegration = integration[0].ownerOrg ? (integration[0].ownerOrg === userOrg) : true;

		// Check out if policy already exists
		// const policy = await r.table(ORG_INTEGRATION_TABLE)
		// 	.getAll([orgId, intId, userOrg], { "index": "orgId_intId_feedOwnerOrg" })
		// 	.run();

		const policy = await r.table(ORG_INTEGRATION_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "intId": intId })
			.filter({ "feedOwnerOrg": userOrg })
			.run();

		if (
			// User is admin
			isAdmin &&
			// User's org owns integration
			ownsIntegration
		) {
			const policyRequest = request;

			// Ensure start and end date are valid date objects
			if (policyRequest.policy.term) {
				policyRequest.policy.term.start ? policyRequest.policy.term.start = new Date(policyRequest.policy.term.start) : null;
				policyRequest.policy.term.end ? policyRequest.policy.term.end = new Date(policyRequest.policy.term.end) : null;
			}

			let updateQuery;
			if (!policy[0]) {
				const newPolicy = {
					...policyRequest,
					feedOwnerOrg: userOrg,
					orgId: orgId,
					intId: intId
				};
				// need to create
				updateQuery = r.table(ORG_INTEGRATION_TABLE)
					.insert(newPolicy, { "returnChanges": true });

			}
			else {
				const policyUpdate = {
					...policyRequest,
					feedOwnerOrg: userOrg,
					orgId: orgId,
					intId: intId
				};
				if (!policyRequest.policy.term) {
					policyUpdate.policy.term = null;
				}
				updateQuery = r.table(ORG_INTEGRATION_TABLE)
					.get(policy[0].id)
					.update(policyUpdate, { "returnChanges": true });
			}

			try {
				const result = await updateQuery.run();
				return result;
			}
			catch (err) {
				throw err;
			}

		}
		else {
			throw { err: { "message": "Requester does not have permission", "code": 401 } };
		}

	} catch (err) {
		console.log("OrganizationModel upsertIntegration error:", err);
		throw err;
	}

};

// -- internal sync for remote eco org int
// -- make this just a simple method yo upsert and move actual logic into biz logic
OrganizationModel.prototype.syncOrgIntegration = async function (syncInt) {
	const result = await r.table(ORG_INTEGRATION_TABLE)
		.insert(syncInt, { "conflict": "update" });
	console.log("syncOrgIntegration", result);
	return result;
};

OrganizationModel.prototype.removeIntegration = async function (
	userId,
	orgId,
	intId
) {

	try {

		const userProfile = await userModel.getProfile(userId);
		const userOrg = userProfile.user.orgId;
		const isAdmin = userProfile.user.admin;

		// Need to verify that the requesting user's org owns the feed
		const integration = await r.table(FEED_TYPES_TABLE).filter({ feedId: intId }).run();
		if (!integration[0]) {
			throw { err: { "message": "Integration not found.", "code": 404 } };
		}

		// ownerOrg not present for shapes and shapes always A-OK
		const ownsIntegration = integration[0].ownerOrg ? (integration[0].ownerOrg === userOrg) : true;

		// Check out if policy already exists
		// const policy = await r.table(ORG_INTEGRATION_TABLE)
		// 	.getAll([orgId, intId, userOrg], { "index": "orgId_intId_feedOwnerOrg" })
		// 	.run();

		const policy = await r.table(ORG_INTEGRATION_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "intId": intId })
			.filter({ "feedOwnerOrg": userOrg })
			.run();

		if (!policy[0]) {
			return { "result": "No such policy exists." };
		}

		if (
			// User is admin
			isAdmin &&
			// User's org owns integration
			ownsIntegration
		) {
			const removalOrgUsers = await this.getOrgUsers(orgId);
			const roleIds = [];
			removalOrgUsers.forEach(user => {
				if (!roleIds.includes(user.roleId)) {
					roleIds.push(user.roleId);
				}
			});
			// r.expr, when given an array of queries, allows you to run them all at the same time. If any of the queries would
			// throw an error, none of them will complete and no data will be changes. This allows us to avoid leaving partial
			// data around if a single userInt fails to remove.
			const result = await r.expr([

				r.table(ORG_INTEGRATION_TABLE)
					.get(r.expr(policy[0].id))
					.delete(),

				r.table(ROLE_INTEGRATION_TABLE)
					.filter((int) => {
						return r.and(
							r.expr(roleIds).contains(int("roleId")),
							r.expr(intId).eq((int("intId")))
						);
					})
					.delete()

			]).run();
			console.log("OrganizationModel removeIntegration result:", result);
			return result;
		}
		else {
			throw { err: { "message": "Requester does not have permission", "code": 401 } };
		}

	} catch (err) {
		console.log("OrganizationModel removeIntegration error:", err);
		throw err;
	}

};

// Eco-admin sets assignments for all apps to a particular org
// Adds and deletes permissions appropriately from db
OrganizationModel.prototype.assignApps = async function (
	orgId,
	apps) {

	const opDate = new Date();
	// filter out share and unshare organizations, and map to array of string ids
	const appsOn = apps.filter(app => app.active)
		.map((app) => app.appId);
	const appsOff = apps.filter(app => !app.active)
		.map((app) => app.appId);

	// Create all entries to be inserted into sys_orgApplication
	const orgOps = appsOn.map((appId) => {
		return {
			"id": orgId + "_" + appId,
			"orgId": orgId,
			"appId": appId,
			// "config": configuration, 
			"lastModifiedDate": opDate
		};
	});

	try {
		const orgUsers = await r.table(USER_TABLE)
			.filter({ "orgId": orgId })
			.run();

		const roleIds = [];
		orgUsers.forEach(user => {
			if (!roleIds.includes(user.roleId)) {
				roleIds.push(user.roleId);
			}
		});

		// Inserted ops do not override if already present, because this would overwrite user permissions. However, rethink
		// records these as errors in the return result. A better way?
		const result = await r.expr([

			r.table(ORG_APPLICATION_TABLE)
				.insert(orgOps),

			r.table(ORG_APPLICATION_TABLE)
				.filter((orgApp) => {
					return r.expr(appsOff).contains(orgApp("appId"));
				})
				.delete(),

			r.table(ROLE_APPLICATION_TABLE)
				.filter((roleApp) => {
					return (r.expr(roleIds).contains(roleApp("roleId")) &&
						(r.expr(appsOff).contains(roleApp("appId"))));
				})
				.delete()

		])
			.run();
		console.log("organizationModel assignApps results: ", result);
		return result;
	}
	catch (err) {
		console.log(err);
		throw err;
	}

};

// Eco-admin sets assignments for all ints to a particular org
// Adds and deletes permissions appropriately from db
OrganizationModel.prototype.assignIntegrations = async function (
	orgId,
	ints
) {

	const opDate = new Date();
	// filter out share and unshare organizations, and map to array of string ids
	const intsOn = ints.filter(int => int.active)
		.map((int) => int.feedId);
	const intsOff = ints.filter(int => !int.active)
		.map((int) => int.feedId);

	// Create all entries to be inserted into sys_orgApplication
	const orgOps = intsOn.map((intId) => {
		return {
			"id": orgId + "_" + intId,
			"orgId": orgId,
			"intId": intId,
			// "config": configuration, 
			"lastModifiedDate": opDate
		};
	});


	try {
		const orgUsers = await r.table(USER_TABLE)
			.filter({ "orgId": orgId })
			.run();

		const roleIds = [];
		orgUsers.forEach(user => {
			if (!roleIds.includes(user.roleId)) {
				roleIds.push(user.roleId);
			}
		});

		// Inserted ops do not override if already present, because this would overwrite user permissions. However, rethink
		// records these as errors in the return result. A better way?
		const result = await r.expr([

			r.table(ORG_INTEGRATION_TABLE)
				.insert(orgOps),

			r.table(ORG_INTEGRATION_TABLE)
				.filter((orgInt) => {
					return r.expr(intsOff).contains(orgInt("intId"));
				})
				.delete(),

			r.table(ROLE_INTEGRATION_TABLE)
				.filter((roleInt) => {
					return (r.expr(roleIds).contains(roleInt("roleId")) &&
						(r.expr(intsOff).contains(roleInt("intId"))));
				})
				.delete()

		])
			.run();
		console.log("organizationModel assignIntegrations results: ", result);
		return result;
	}
	catch (err) {
		console.log(err);
		throw err;
	}

};




OrganizationModel.prototype.shareIntegration = async function (
	orgId,
	intId,
	orgs
) {

	const opDate = new Date();
	// filter out share and unshare organizations, and map to array of string ids
	const shareToOrgs = orgs.filter(org => org.share)
		.map((org) => org.orgId);
	const unshareToOrgs = orgs.filter(org => !org.share)
		.map((org) => org.orgId);

	// Create all entries to be inserted into sys_orgIntegration
	const ops = shareToOrgs.map(function (orgId) {
		return {
			"id": orgId + "_" + intId,
			"orgId": orgId,
			"intId": intId,
			// "config": configuration, 
			"lastModifiedDate": opDate
		};
	});


	try {

		// Get all users in all orgs being unshared to
		const unshareToUsers = await r.table(USER_TABLE)
			.filter(function (user) {
				return r.expr(unshareToOrgs).contains(user("orgId"));
			})
			.without("password")
			.run();

		const roleIds = [];
		unshareToUsers.forEach(user => {
			if (!roleIds.includes(user.roleId)) {
				roleIds.push(user.roleId);
			}
		});

		const result = await r.expr([

			r.table(ORG_INTEGRATION_TABLE)
				.insert(ops, { conflict: "update" }),

			r.table(ORG_INTEGRATION_TABLE)
				.filter(function (org) {
					return r.expr(unshareToOrgs).contains(org("orgId"));
				})
				.delete(),

			r.table(ROLE_INTEGRATION_TABLE)
				.filter(function (roleIntegration) {
					return r.expr(roleIds).contains(roleIntegration("roleId"));
				})
				.delete()

		])
			.run();

		console.log("OrganizationModel shareIntegration result:", result);
		return result;
	} catch (err) {
		console.log("OrganizationModel shareIntegration error:", err);
		throw err;
	}


};

OrganizationModel.prototype.setOrgProfileImage = async function (
	orgId,
	fileHandle) {
	try {

		const updateResult = await r.table(ORGANIZATION_TABLE)
			.filter({ "orgId": orgId })
			.update({ "profileImage": fileHandle }, { "returnChanges": true })
			.run();

		console.log("Set organization profile image:", updateResult);
		return updateResult;

	}
	catch (err) {
		throw err;
	}


};

OrganizationModel.prototype.getAllOrgApps = async function () {

	try {
		const result = await r.table(ORGANIZATION_TABLE)
			.filter({ "disabled": false }, { default: true })
			.merge(function (org) {
				return {
					applications: r.table(ORG_APPLICATION_TABLE)
						.filter({ orgId: org("orgId") })
						.eqJoin("appId", r.table(APPLICATION_TABLE), { index: "appId" })
						.without([{ left: ["id", "appId", "lastModifiedDate", "orgId"] }, { right: ["id"] }])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			.run();

		return result;
		// -- error handling
	} catch (err) {
		console.log("error:", err);
		throw err;
	}

};

/**
 * Get all organizations you are allowed to share with
 * @param {string} orgId 
 */
OrganizationModel.prototype.getAllOrgsForSharing = async function (orgId) {
	try {
		const sharingTokensEnabled = !!config.useSharingTokens;

		let result = [];

		// If sharing tokens are enabled, only get orgs you can share with
		if (sharingTokensEnabled) {
			const sharingConnections = await sharingConnectionModel.getBySource(orgId);
			const orgIds = sharingConnections.map(conn => {
				return conn.targetOrg;
			});

			result = sharingConnections.map(conn => {
				return {
					orgId: conn.targetOrg,
					name: conn.targetOrgName
				};
			});

		}
		// Otherwise, get all orgs
		else {
			result = await r.table(ORGANIZATION_TABLE)
				.filter({ "deleted": false }, { default: true })
				.run();
		}

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"getAllOrgsForSharing",
			"An error occurred while getting organizations for sharing.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/organizationModel.js" } }
		);
		throw ex;
	}
};

OrganizationModel.prototype.createSharingConnection = async function (userId, orgId) {
	try {
		const organization = await r.table(ORGANIZATION_TABLE)
			.filter({ orgId: orgId })(0)
			.default({})
			.run();

		if (!organization.id) {
			throw {
				"message": "No organization found",
				"stack": "/models/sharingConnectionModel.js"
			};
		}

		const maxConnections = organization.maxSharingConnections;

		const result = await sharingConnectionModel.createConnection(userId, orgId, organization.name, maxConnections);
		return result;
	}
	catch (ex) {
		logger.error("createSharingConnection", "An error occurred when creating a sharing connection", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

OrganizationModel.prototype.establishSharingConnection = async function (connectionId, userId, orgId) {
	try {
		const organization = await r.table(ORGANIZATION_TABLE)
			.filter({ orgId: orgId })(0)
			.default({})
			.run();

		if (!organization.id) {
			throw {
				"message": "No organization found",
				"stack": "/models/sharingConnectionModel.js"
			};
		}

		return await sharingConnection.establishSharingConnection(connectionId, userId, orgId, organization.name);
	}
	catch (err) {
		logger.error("establishSharingConnection", "An error occurred when establishing a sharing connection", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

OrganizationModel.prototype.disconnectSharingConnection = async function (connectionId) {
	try {
		const orgData = await sharingConnectionModel.disconnectConnection(connectionId);
		const { targetOrg, sourceOrg } = orgData;

		// Ids of every user in the targetOrg
		const targetOrgUserIds = await r.table(USER_TABLE)
			.filter({ "orgId": targetOrg })
			.without("password")
			.map((user) => user("roleId"))
			.run();

		const roleIds = [];
		targetOrgUserIds.forEach(roleId => {
			if (!roleIds.includes(roleId)) {
				roleIds.push(roleId);
			}
		});

		const orgIntRemoval = r.table(ORG_INTEGRATION_TABLE)
			.filter({
				"orgId": targetOrg,
				"feedOwnerOrg": sourceOrg
			})
			.delete();
		const userIntRemoval = r.table(ROLE_INTEGRATION_TABLE)
			.filter((roleInt) => {
				return r.and(
					roleInt("feedOwnerOrg").eq(sourceOrg),
					r.expr(roleIds).contains(roleInt("roleId"))
				);
			})
			.delete();

		// Run both queries
		const result = await r.expr([
			orgIntRemoval,
			userIntRemoval
		]).run();

		return { success: true };
	}
	catch (ex) {
		logger.error("disconnectSharingConnection", "An error occurred when disconnecting a sharing connection", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};