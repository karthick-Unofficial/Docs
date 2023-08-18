"use strict";
const ORG_EXTERNAL_SYSTEM_TABLE = "sys_orgExternalSystem";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userModel = require("../models/userModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/orgExternalSystemModel.js");

module.exports = OrgExternalSystemModel;

function OrgExternalSystemModel(options) {
	if (!(this instanceof OrgExternalSystemModel)) return new OrgExternalSystemModel(options);
	this.options = options;
}

OrgExternalSystemModel.prototype.getAll = async function (orgId) {
	try {
		return await r.table(ORG_EXTERNAL_SYSTEM_TABLE).filter(r.row("orgId").eq(orgId));
	} catch (e) {
		logger.error("getAll", `There was an error fetching orgExternalSystems for org ${orgId}`, e);
		throw e;
	}
};

OrgExternalSystemModel.prototype.getBySystemId = async function (userId, externalSystemId) {
	try {
		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		const result = await r.table(ORG_EXTERNAL_SYSTEM_TABLE)
			.filter(
				r.and(
					r.row("orgId").eq(orgId),
					r.row("externalSystemId").eq(externalSystemId)
				)
			)
			.run();
		return result;
	} catch (e) {
		console.log(e);
		throw e;
	}
};

OrgExternalSystemModel.prototype.create = async function (userId, externalSystemId) {
	try {
		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		const newOrgExternalSystem = {
			externalSystemId: externalSystemId,
			orgId: orgId,
			id: `${orgId}_${externalSystemId}`
		};
		const result = await r.table(ORG_EXTERNAL_SYSTEM_TABLE)
			.insert(newOrgExternalSystem)
			.run();

		return result;
	} catch (e) {
		console.log(e);
		throw e;
	}
};