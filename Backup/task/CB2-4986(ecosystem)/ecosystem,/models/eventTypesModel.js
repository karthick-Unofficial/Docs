"use strict";
const EVENT_TYPES_TABLE = "sys_eventTypes";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userModel = require("../models/userModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/eventTypes.json"));
const orgEventTypeModel = require("../models/orgEventTypeModel")();

module.exports = EventTypesModel;

function EventTypesModel(options) {
	if (!(this instanceof EventTypesModel)) return new EventTypesModel(options);
	this.options = options;
}



/**
 * Create an eventType
 * @param eventType
 */
EventTypesModel.prototype.create = async (userId, eventType) => {
	try {
		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		if (!validate(eventType)) {
			await validate.errors;
			console.log("Validation Errors below ", validate.errors);
			throw {
				"message": "Validation Error ",
				"err": validate.errors
			};
		}
		let subtypes = [];
		if (eventType.subtypes) {
			subtypes = eventType.subtypes.map(subtype => {
				return {
					"id": subtype.name.slice().split(" ").join("_"),
					...subtype
				};
			});
		}
		eventType.subtypes = subtypes;


		const result = await r.table(EVENT_TYPES_TABLE)
			.insert(eventType, {
				returnChanges: true
			})
			.run();
		if (result.changes) {
			orgEventTypeModel.create(userId, eventType.eventTypeId);
		}

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}

};

/**
 * getByID - Get all eventTypes
 */
EventTypesModel.prototype.getAll = async (userId) => {
	try {
		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		const availableEventTypes = await orgEventTypeModel.getAll(orgId);

		const result = [];

		for (let i = 0; i < availableEventTypes.length; i++) {
			const fullEventType = await r.table(EVENT_TYPES_TABLE)
				.filter(
					r.row("eventTypeId").eq(availableEventTypes[i].eventTypeId)
				)(0)
				.default("");
			if (fullEventType) {
				result.push(fullEventType);
			}
		}

		return result;
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * getByID - Get eventType by its ID
 * @param eventTypeId
 */
EventTypesModel.prototype.getById = async (userId, eventTypeId) => {
	try {
		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		const availableEventTypes = await orgEventTypeModel.getAll(orgId);

		let result = [];

		const eventTypeIDs = availableEventTypes.map(evenType => {
			return evenType.eventTypeId;
		});

		if (eventTypeIDs.includes(eventTypeId)) {
			result = await r.table(EVENT_TYPES_TABLE)
				.filter(
					r
						.row("eventTypeId").eq(eventTypeId)
				)
				.run();
		}

		if (result[0]) {
			return result[0];
		} else {
			throw {
				err: {
					"message": "Event type not found or requester does not have access",
					"code": 404
				}
			};
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * update  - update eventType
 * @param eventTypeId
 * @param update
 */
EventTypesModel.prototype.update = async (userId, eventTypeId, update) => {
	try {

		// only allow through properties that are allowed to be changed through this method
		const permittedProps = ["name", "widgets", "subtypes"];

		const op = {};

		let updating = false;
		for (const property in update) {
			if (permittedProps.includes(property)) {
				updating = true;
				op[property] = update[property];
			}
		}

		const userProfile = await userModel.getProfile(userId);
		const orgId = userProfile.user.orgId;

		const availableEventTypes = await orgEventTypeModel.getAll(orgId);
		const eventTypeIDs = availableEventTypes.map(evenType => {
			return evenType.eventTypeId;
		});

		// check user permitted to edit
		if (eventTypeIDs.includes(eventTypeId)) {

			const result = await r.table(EVENT_TYPES_TABLE)
				.filter({
					"eventTypeId": eventTypeId
				})
				.update(op, {
					returnChanges: true
				})
				.run();

			const updated = result.changes[0].new_val;

			return updated;
		} else {
			throw {
				err: {
					"message": "Event Type not found",
					"code": 404
				}
			};
		}

	} catch (err) {
		console.log(err);
		throw {
			err: {
				"message": err,
				"code": 500
			}
		};
	}
};