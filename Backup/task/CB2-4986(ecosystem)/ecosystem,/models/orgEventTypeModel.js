"use strict";
const ORG_EVENT_TYPE_TABLE = "sys_orgEventType";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/event.json"));

module.exports = OrgEventTypeModel;

function OrgEventTypeModel(options) {
	if (!(this instanceof OrgEventTypeModel)) return new OrgEventTypeModel(options);
	this.options = options;
}

OrgEventTypeModel.prototype.getAll = async function (orgId) {
	try {

		const result = await r.table(ORG_EVENT_TYPE_TABLE)
			.filter(
				r
				// user can view own events
					.and(r.row("orgId").eq(orgId))
			)
			.pluck("eventTypeId");
		return result;
	} catch (e) {
		console.log(e);
		throw e;
	}
};

OrgEventTypeModel.prototype.create = async function (orgId, eventTypeId) {
	try {

		const newOrgEventType = {
			eventTypeId: eventTypeId,
			orgId: orgId,
			id: `${orgId}_${eventTypeId}`
		};
		const result = await r.table(ORG_EVENT_TYPE_TABLE)
			.insert(newOrgEventType)
			.run();

		return result;
	} catch (e) {
		console.log(e);
		throw e;
	}
};