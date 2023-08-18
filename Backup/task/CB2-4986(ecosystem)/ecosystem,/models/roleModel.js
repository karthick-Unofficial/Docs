"use strict";
const USER_TABLE = "sys_user";
const ORG_ROLES_TABLE = "sys_orgRoles";
const ORG_INTEGRATION_TABLE = "sys_orgIntegration";
const ROLE_APPLICATION_TABLE = "sys_roleApplication";
const ROLE_INTEGRATION_TABLE = "sys_roleIntegration";
const FEED_TYPES_TABLE = "sys_feedTypes";
const ENTITY_TYPE_TABLE = "sys_entityType";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const uuidv4 = require("uuid/v4");
const validate = ajv.compile(require("./schema/orgRoles.json"));
const userPolicyCache = new (require("../lib/userPolicyCache"));
const global = require("../app-global.js");

module.exports = roleModel;

function roleModel(options) {
	if (!(this instanceof roleModel)) return new roleModel(options);
	const self = this;
	self.options = options;
}

/**
 *  create:
 * @param role 
 */
roleModel.prototype.create = async function(userId, orgId, role) {
	try {

		if(!userPolicyCache.userIsOrgAdmin(userId)) {
			throw { message: "Access Denied", code: 403 };
		}

		if(role.orgId != orgId) {
			throw { message: "Role must be assigned to users organization", code: 405 };
		}
		
		const orgRoleApps = [ ...role.applications || [] ]; 
		delete role.applications;
		const orgRoleInts = [ ...role.integrations || [] ]; 
		delete role.integrations;

		role.id = uuidv4();
		role.createdDate = new Date();
		role.lastModifiedDate = new Date();
		for(const orgRoleApp of orgRoleApps) { 
			orgRoleApp["roleId"] = role.id;
			orgRoleApp["lastModifiedDate"] = new Date();
		}
		for(const orgRoleInt of orgRoleInts) { 
			orgRoleInt["roleId"] = role.id;
			orgRoleInt["lastModifiedDate"] = new Date();
		}

		const insertOrgRoleQ = await r.table(ORG_ROLES_TABLE)
			.insert(role, { returnChanges: true });

		const insertRoleAppsQ = r.table(ROLE_APPLICATION_TABLE)
			.insert(orgRoleApps, { returnChanges: false });

		const insertRoleIntsQ = r.table(ROLE_INTEGRATION_TABLE)
			.insert(orgRoleInts, { returnChanges: false });

		const result = await r
			.expr([insertOrgRoleQ, insertRoleAppsQ, insertRoleIntsQ])
			.run();

		return result;

	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 *  update:
 * @param userId
 * @param orgId
 * @param orgRoleId
 * @param role
 */
roleModel.prototype.update = async function(userId, orgId, orgRoleId, role) {
	try {

		if(!userPolicyCache.userIsOrgAdmin(userId) || (!await this.roleIsInOrg(orgId, orgRoleId))) {
			throw { message: "Access Denied", code: 403 };
		}

		const userInRoleCount = await this.getOrgRoleUsers(orgRoleId).length;
		if(userInRoleCount > 0) {
			throw { message: "Cannot delete role with assigned users.", code: 405 };
		}

		const orgRoleApps = [ ...role.applications || [] ]; 
		delete role.applications;
		const orgRoleInts = [ ...role.integrations || [] ]; 
		delete role.integrations;

		const orgRoleCurrentApps = await r.table(ROLE_APPLICATION_TABLE).filter({ "roleId": orgRoleId });
		const orgRoleCurrentInts = await r.table(ROLE_INTEGRATION_TABLE).filter({ "roleId": orgRoleId });

		const orgRoleAppsOp = [];
		for(const updateRoleApp of orgRoleApps) {
			updateRoleApp["lastModifiedDate"] = new Date();
			const currentApp = orgRoleCurrentApps.find((roleApp) => {
				return roleApp.appId == updateRoleApp.appId;
			});
			if(currentApp) {
				// update an existing app for this role
				orgRoleAppsOp.push({ ...currentApp, ...updateRoleApp });
			}
			else {
				// insert a new app for this role
				orgRoleAppsOp.push({...updateRoleApp, roleId: orgRoleId});
			}
		}

		const orgRoleIntsOp = [];
		for(const updateRoleInt of orgRoleInts) {
			updateRoleInt["lastModifiedDate"] = new Date();
			const currentInt = orgRoleCurrentInts.find((roleInt) => {
				return roleInt.intId == updateRoleInt.intId;
			});
			if(currentInt) {
				// update an existing int for this role
				orgRoleIntsOp.push({ ...currentInt, ...updateRoleInt });
			}
			else {
				// insert a new int for this role
				orgRoleIntsOp.push({...updateRoleInt, roleId: orgRoleId});
			}
		}

		role.lastModifiedDate = new Date();

		const updateOrgRoleQ = await r.table(ORG_ROLES_TABLE)
			.filter({"id": orgRoleId})
			.update(role, { returnChanges: true });

		const upsertRoleAppsQ = r.table(ROLE_APPLICATION_TABLE)
			.insert(orgRoleAppsOp, { conflict: "update", returnChanges: true });

		const upsertRoleIntsQ = r.table(ROLE_INTEGRATION_TABLE)
			.insert(orgRoleIntsOp, { conflict: "update", returnChanges: true });

		const deleteRoleAppsQ = r.table(ROLE_APPLICATION_TABLE)
			.filter(r.row("config")("canView").eq(false))
			.delete();
		const deleteRoleIntegrationsQ = r.table(ROLE_INTEGRATION_TABLE)
			.filter(r.row("config")("canView").eq(false))
			.delete();


		const result = await r
			.expr([updateOrgRoleQ, upsertRoleAppsQ, upsertRoleIntsQ])
			.run();

		await r.expr([deleteRoleAppsQ, deleteRoleIntegrationsQ]).run();
		
		return result;

	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 *  delete:
 * @param id 
 */
roleModel.prototype.delete = async function(userId, orgId, roleId){
	try {

		if(!userPolicyCache.userIsOrgAdmin(userId) || !await this.roleIsInOrg(orgId, roleId)) {
			throw { message: "Access Denied", code: 403 };
		}
		if (roleId === "org_user") {
			throw { message: "Cannot delete the default role.", code: 405 };
		}
		const userInRoleCount = await this.getOrgRoleUsers(roleId).length;
		if(userInRoleCount > 0) {
			throw { message: "Cannot delete role with assigned users.", code: 405 };
		}
			
		// set role deleted
		const result = await r.table(ORG_ROLES_TABLE)
			.get(roleId)
			.update({"deleted": true})
			.run();
		return result;
	}
	catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 *  getByOrg:
 * @param orgId
 */
roleModel.prototype.getByOrg = async function(orgId) {
	try {
		const result = await r.table(ORG_ROLES_TABLE)
			.filter({"orgId": orgId})
			.filter({"deleted": false}, {default: true})
			.without("deleted")
			.merge((orgRole) => {
				return {
					applications: r.table(ROLE_APPLICATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array"),
					integrations: r.table(ROLE_INTEGRATION_TABLE).filter({ "roleId": orgRole("id") }).coerceTo("array")
				};
			})
			.run();

		return result;

	} catch (err) {
		throw err;
	}

};

/**
 * getOrgRoleUsers  - retrieve all users for a particular role
 * @param orgId
 * @param callerIdentity
 */
roleModel.prototype.getOrgRoleUsers = async function(roleId) {
	try {
		const result = await r.table(USER_TABLE)
			.filter({ "id": roleId })
			.filter({"deleted": false}, {default: true})
			.without("password")
			.run();
		return result;
	} catch (err) {
		throw err;
	}

};

/**
 * roleIsInOrg
 * @param orgId
 * @param roleId
 */
roleModel.prototype.roleIsInOrg = async function(orgId, orgRoleId) {
	try {
		const result = await r.table(ORG_ROLES_TABLE)
			.filter({ "id": orgRoleId })
			.filter({ "orgId": orgId })
			.count()
			.run();
		return result === 1;
	} catch (err) {
		throw err;
	}

};

roleModel.prototype.getRoleIntegrations = async function(roleId, orgId) {
	
	const ints = await r.table(ROLE_INTEGRATION_TABLE)
		.merge((roleInt) => {
			return r.table(ORG_INTEGRATION_TABLE)
				.get(roleInt("orgIntId"))
				.default({ policy: { remote: true } })
				.pluck("policy"); 
		})
		.filter((roleInt) => {
			return roleInt("roleId").eq(roleId)
				.and(
					roleInt.hasFields({ "policy": "term" }).not()
						.or(r.now().during(roleInt("policy")("term")("start"), roleInt("policy")("term")("end"), { leftBound: "closed", rightBound: "closed" }))
				);
		})
		.merge((roleInt) => {
			return r.table(FEED_TYPES_TABLE)
				.filter((row) => {
					return row("feedId").eq(roleInt("intId"));
				})(0)
				.default({ "remote": true });
		})
		// .eqJoin("intId", r.table(FEED_TYPES_TABLE), {
		// 	index: "feedId"
		// })
		.without([
			{ left: ["lastModifiedDate", "userId", "roleId"] },
			{ right: ["id", "metadata", "isShareable"] }
		])
		.coerceTo("ARRAY");

	const orgInts = await this._getOrgIntegrations(orgId);

	const mergedInts = [];
	for(const int of ints) {
		if(int.remote) {
			const remoteInt = orgInts.find((orgInt) => {
				return orgInt.feedId === int.intId;
			});
			const mergedInt = { ...remoteInt, ...int };
			mergedInt.feedId = int.intId;
			mergedInt.policy = { type: "always" };
			mergedInts.push(mergedInt);
		}
		else {
			mergedInts.push(int);
		}
	}

	return mergedInts;

};


/**
 * _getOrgIntegrations internal use for linked ecos
 * THIS WILL NEED TO FILTER BY ECO ID AS WELL
 * @param orgId
 */
roleModel.prototype._getOrgIntegrations = async function (orgId, remote) {
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
				.pluck("permissionOptions")(0);
		})
		.coerceTo("ARRAY");

	let remoteOrgInts = [];
	if(global.ecoLinkManager.isActive() && !remote) { // then include remote
		remoteOrgInts = await global.ecoLinkManager.getOrgIntegrations(orgId, remote);
	}

	const fullResult = [...ints, ...remoteOrgInts];

	return fullResult;
};
