"use strict";
const EVENT_TABLE = "sys_event";
const EVENT_ENTITIES_TABLE = "sys_eventEntities";
const EXTERNAL_ENTITY_MAPPING_TABLE = "sys_externalEntityMapping";
const LIST_TABLE = "sys_list";
const AUTH_EXCLUSION_TABLE = "sys_authExclusion";
const EVENT_FEED_CACHE_TABLE = "sys_eventFeedCache";
const ENTITY_ATTACHMENT_TABLE = "sys_entityAttachment";
const ORGANIZATION_TABLE = "sys_organization";
const EVENT_FEED_ID = "event";

const appConfig = require("../app-config.json");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rethink connection/db
const turf = require("@turf/turf");
const externalEntityMappingModel = require("../models/externalEntityMappingModel")();
const activityModel = require("../models/activityModel")();
const attachmentModel = require("../models/attachmentModel")();
const fileStorage = require("node-app-core").fileStorage();
const feedModel = require("../models/feedModel")();
const listModel = require("../models/listModel")();
const facilitiesModel = require("../models/facilitiesModel")();
const notificationModel = require("../models/notificationModel")();
const cameraModel = require("../models/cameraModel")();
const userPolicyCache = new (require("../lib/userPolicyCache"))();
const shapeModel = require("../models/shapeModel")();

const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/eventModel.js");
const { authExclusionChangefeedFilter } = require("../lib/authExclusionFilter.js");
const _ = require("lodash");

const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/event.json"));

const _global = require("node-app-core/dist/app-global.js");
const ChangefeedPIPFilter = require("../lib/changefeedPIPFilter");

module.exports = EventModel;

function EventModel(options) {
	if (!(this instanceof EventModel)) return new EventModel(options);
	this.options = options;
}

/**
 * getAll  - retrieve all events in the system accessible by given user
 */
EventModel.prototype.getAll = async function (userId, orgId) {
	try {
		const filter = r
			.row("isDeleted")
			.eq(false)
			.and(
				r.row("disabled").default(false).eq(false),
				r.row("isTemplate").default(false).eq(false),
				r.row("ownerOrg").eq(orgId).default(false).or(r.row("sharedWith").default([]).contains(orgId))
			);

		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "event", true, null, true, filter);
		return result;
	} catch (e) {
		logger.error("getAll", "There was an error while getting all events", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * activeWithData  - retrieve all active events with external entity mapping data
 */
// -- INTERNAL USE ONLY - DO NOT EXPOSE VIA PUBLIC API
EventModel.prototype.activeWithData = async function (includePinned = false) {
	try {
		let q = r
			.table(EVENT_TABLE)
			.filter(
				r.and(
					r.row("isDeleted").eq(false),
					r.row("disabled").default(false).eq(false),
					r.row("isTemplate").default(false).eq(false),
					r.row("isActive").eq(true)
				)
			)
			.merge((event) => {
				return r
					.table(EXTERNAL_ENTITY_MAPPING_TABLE)
					.filter({
						targetId: event("id")
					})(0)
					.default({})
					.pluck("sourceId", "additionalProperties");
			});

		if (includePinned) {
			q = q.merge((event) => {
				return {
					pinnedItems: r
						.table(EVENT_ENTITIES_TABLE)
						.getAll(event("id"), { index: "eventId" })
						.pluck("entityId", "feedId", "entityType")
						.coerceTo("array")
				};
			});
		}

		const result = await q.run();
		return result;
	} catch (e) {
		logger.error("activeWithData", "There was an error while getting all active events with data", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * getTemplates  - retrieve all event templates in the system accessible by given user
 */
EventModel.prototype.getTemplates = async function (userId, orgId) {
	try {
		const filter = r.and(
			r.row("isDeleted").eq(false),
			r.row("isTemplate").default(false).eq(true),
			r.or(r.row("ownerOrg").eq(orgId).default(false), r.row("sharedWith").default([]).contains(orgId))
		);

		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "event", true, null, true, filter);
		return result;
	} catch (e) {
		logger.error("getPublicTemplates", "There was an error while getting all public templates", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

EventModel.prototype.getByEventType = async function (userId, eventType, subtype) {
	try {
		const checkSubType = subtype !== undefined ? subtype : null;

		const filter = r
			.row("isDeleted")
			.eq(false)
			.and(
				r.row("disabled").default(false).eq(false),
				r.row("isTemplate").default(false).eq(false),
				r.row("type").eq(eventType),
				r.branch(r.expr(checkSubType).ne(null), r.row("subtype").eq(checkSubType), {})
			);

		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "event", true, null, true, filter);
		return result;
	} catch (e) {
		logger.error("getByEventType", "There was an error while getting events by type", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * getById  - Retrieve a specific event by id
 */
EventModel.prototype.getById = async (userId, eventId) => {
	try {
		const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
		if (!event) {
			throw `Event with id "${eventId}" not found.`;
		}

		return event;
	} catch (e) {
		logger.error("getById", "There was an error while getting an event by id", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * getByIdWithAllData  - Retrieve a specific event by id
 */
EventModel.prototype.getByIdWithAllData = async function (userId, eventId) {
	try {
		const [event, activities, attachments, pinnedItems, lists, cameras] = await Promise.all([
			this.getById(userId, eventId),
			activityModel.getAllEntityActivities(userId, eventId),
			attachmentModel.getByTargetId(eventId),
			getPinnedItems(eventId, userId),
			r
				.table(LIST_TABLE)
				.filter(r.row("targetId").eq(eventId).and(r.row("deleted").eq(false)))
				.run(),
			this.getAssociatedCameras(userId, eventId)
		]);

		if (event) {
			return {
				event,
				activities,
				attachments,
				lists,
				pinnedItems,
				cameras
			};
		} else {
			throw {
				err: {
					message: "Event not found or requester does not have access",
					code: 404
				}
			};
		}
	} catch (e) {
		logger.error("getByIdWithAllData", "There was an error while getting an event by id with all data", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

EventModel.prototype.getAssociatedCameras = async function (userId, eventId) {
	const pinnedItemsIds = (await getPinnedItems(eventId, userId)).filter((item) => item.entityType === "camera");
	const camerasInRange = await cameraModel.getCamerasInRangeOfEntity(eventId, "event");
	const associatedCameras = _.unionBy(pinnedItemsIds, camerasInRange, "id");

	return associatedCameras;
};

/**
 * getByIdWithAllData  - Retrieve a specific event by id
 */
EventModel.prototype.getEventEntityIds = async function (userId, eventId) {
	try {
		const pinnedItemsIds = (await getPinnedItems(eventId, userId)).map((ent) => ent.id);
		const camerasInRange = (await cameraModel.getCamerasInRangeOfEntity(eventId, "event")).map((ent) => ent.id);
		const allEventEntityIds = [...pinnedItemsIds, ...camerasInRange];
		const allUniqueEventEntityIds = allEventEntityIds.filter((entId, index, self) => self.indexOf(entId) === index);
		return allUniqueEventEntityIds;
	} catch (e) {
		logger.error("getByIdWithAllData", "There was an error while getting an event by id with all data", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

const getPinnedItems = async function (eventId, userId) {
	const pinnedItems = [];
	const pinnedIDs = await r.table(EVENT_ENTITIES_TABLE).filter(r.row("eventId").eq(eventId));

	for (let i = 0; i < pinnedIDs.length; i++) {
		const item = await feedModel.getEntityWithAuthorizationUseFeedId(
			userId,
			pinnedIDs[i].entityId,
			pinnedIDs[i].feedId
		);
		if (item) {
			item.entityData.properties.pinnedBy = pinnedIDs[i].pinnedBy;
			pinnedItems.push(item);
		}
	}

	return pinnedItems;
};

const _internalGetPinnedEntities = async function (eventId) {
	// Get pinned IDs
	const pinnedIds = await r.table(EVENT_ENTITIES_TABLE).filter(r.row("eventId").eq(eventId));
	const pinnedIdsByFeedId = {};
	// Group pinned IDs by feedId
	pinnedIds.forEach((pinnedId) => {
		if (!pinnedIdsByFeedId[pinnedId.feedId]) {
			pinnedIdsByFeedId[pinnedId.feedId] = [];
		}
		pinnedIdsByFeedId[pinnedId.feedId].push(pinnedId.entityId);
	});
	let pinnedItems = [];

	// Get entity data for each feedId
	for (let i = 0; i < Object.keys(pinnedIdsByFeedId).length; i++) {
		const entityId = pinnedIdsByFeedId[Object.keys(pinnedIdsByFeedId)[i]];
		const feedId = Object.keys(pinnedIdsByFeedId)[i];
		const thisFeedsEntities = await feedModel.getFeedEntitiesInternal(feedId, entityId);
		pinnedItems = [...pinnedItems, ...thisFeedsEntities];
	}

	return pinnedItems;
};

/**
 * getByExternalSourceId - get the target event by the external source id
 */
EventModel.prototype.getByExternalSourceId = async function (userId, sourceId) {
	try {
		const result = await externalEntityMappingModel.getBySourceId(sourceId, "event");
		if (result && result.targetId) {
			const event = await this.getById(userId, result.targetId);
			return event;
		} else {
			logger.error("getByExternalSourceId", "There was an error while getting an external source by id", {
				err: {
					message: "No existing external mapping model found with sourceId: " + sourceId
				}
			});
			return null;
		}
	} catch (error) {
		logger.error("getByExternalSourceId", "There was an error while getting an external source by id", {
			err: { message: error.message, stack: error.stack }
		});
		throw error;
	}
};

/**
 * getAllForPinning - Retrieve an array of events that are available for pinning
 * @param userId
 * @param orgId
 * @param entityId
 */
EventModel.prototype.getAllForPinning = async (userId, orgId, entityId) => {
	try {
		if (!userPolicyCache.authorizeApplication(userId, "events-app", userPolicyCache.appPermissionTypes.manage)) {
			return [];
		}

		const filter = r.and(
			r.row("isDeleted").eq(false),
			r.row("disabled").default(false).eq(false),
			r.row("isTemplate").default(false).eq(false),
			r.row("ownerOrg").eq(orgId).default(false).or(r.row("sharedWith").default([]).contains(orgId)),
			r.or(
				r.row.hasFields("endDate").not(), // -- no end date specified
				r.row("endDate").gt(r.now()) // -- end date is beyond current date
			)
		);

		// get all open events
		const activeEvents = await feedModel.getEntitiesByTypeWithAuthorization(
			userId,
			"event",
			true,
			null,
			true,
			filter
		);

		const entityPinnedToEventIds = await r
			.table(EVENT_ENTITIES_TABLE)
			.filter(r.row("entityId").eq(entityId))
			.map((pi) => {
				return pi("eventId");
			})
			.coerceTo("array");

		const mergeEntityPinned = activeEvents.map((evt) => {
			evt["entityPinned"] = entityPinnedToEventIds.includes(evt.id);
			return evt;
		});

		return mergeEntityPinned;
	} catch (e) {
		logger.error("getAllForPinning", "There was an error while getting all pinnable events", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * create  - create event
 * @param event
 */
EventModel.prototype.create = async function (userId, orgId, event) {
	try {
		// -- todo: ENTITY AUTH retrieve app Id when registering with app-gateway so not hardcoded app id
		if (!userPolicyCache.authorizeApplication(userId, "events-app", userPolicyCache.appPermissionTypes.manage)) {
			throw {
				message: "User is not authorized to create an event",
				code: 403
			};
		}

		let additionalProperties = "";
		let template = "";
		let templatePinnedItems = [];
		let templateLists = [];
		let templateAttachments = [];
		event.startDate = new Date(event.startDate);
		if (event.endDate) {
			event.endDate = new Date(event.endDate);
		} else {
			delete event.endDate;
		}
		event.owner = userId;
		event.ownerOrg = orgId;
		event.sharedWith = [];

		event.entityType = "event";
		if (!event.entityData) {
			event.entityData = {
				geometry: null
			};
		}

		if (event.additionalProperties) {
			additionalProperties = { ...event.additionalProperties };
			delete event.additionalProperties;
		}
		event.isPublic = true;
		if (!validate(event)) {
			logger.error("create", "There was an error creating an event", {
				err: {
					message: "Validation Errors below " + JSON.stringify(validate.errors)
				}
			});
			const validateErr = {
				message: "Validation Error ",
				err: validate.errors
			};
			throw validateErr;
		}

		event.feedId = EVENT_FEED_ID;
		event.createdDate = new Date();
		event.lastModifiedDate = new Date();
		event.isDeleted = false;

		if (event.template) {
			template = await this.getById(userId, event.template);
			const notesBucket = appConfig.minio.buckets ? appConfig.minio.buckets.notesAttachmentBucket.name : null;
			const newNote = template.notes ? await fileStorage.copyNote(template.notes, notesBucket) : null;
			templatePinnedItems = await _internalGetPinnedEntities(event.template);
			templateLists = await listModel._internalGetByTargetId(event.template);
			templateAttachments = await attachmentModel.getByTargetId(event.template);
			if (newNote) {
				event.notes = newNote;
			}
			if (template.proximities) {
				event.proximities = template.proximities;
			}
			if (template.additionalProperties) {
				additionalProperties = template.additionalProperties;
			}
		}

		const result = await r
			.table(EVENT_TABLE)
			.insert(event, {
				returnChanges: true
			})
			.run();

		if (additionalProperties) {
			const newMapping = {
				targetId: result.changes[0].new_val.id,
				targetType: "event",
				additionalProperties: additionalProperties
			};
			try {
				const result = await externalEntityMappingModel.upsert(null, null, newMapping);
				logger.info("create", "External entity mapping result", {
					result: result
				});
			} catch (err) {
				logger.error("create", "There was an error creating an event", {
					err: { message: err }
				});
			}
		}

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: additionalProperties
						? {
							...result.changes[0].new_val,
							additionalProperties: additionalProperties
						}
						: result.changes[0].new_val,
					old_val: null,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const generatedObject = activityModel.generateObject("event", result.changes[0].new_val.id, event.name);
		const activity = {
			summary: "",
			type: "created",
			actor: activityModel.generateObject("user", userId),
			object: {
				...generatedObject,
				entity: event
			},
			to: [
				{
					// "token": `organization:${orgId}`,
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};
		if (event.entityData && event.entityData.geometry) {
			activity.geometry = event.entityData.geometry;
		}

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.create;
		activity.summary = `${activity.object.name} ${translations.summary.created}`;
		activityModel.queueActivity(activity);

		// todo -- remove lastModifiedDate and createdDate
		const created = result.changes[0].new_val;

		if (templateAttachments.length > 0) {
			await attachmentModel.copyAttachment(userId, created.id, created.template, created.entityType, false);
		}

		if (templateLists.length > 0) {
			const listIds = [];
			templateLists.forEach((list) => {
				listIds.push(list.id);
			});
			await listModel.createByTemplate(listIds, templateLists.targetType, created.id, userId);
		}

		if (templatePinnedItems.length > 0) {
			try {
				await this.pinEntities(userId, created.id, templatePinnedItems);
			} catch (err) {
				logger.error("pinEntities", "There was an issue pinning activity entities to escalated event.", {
					err: { message: err.message, stack: err.stack }
				});
				throw err;
			}
		}

		return created;
	} catch (err) {
		logger.error("create", "There was an error creating an event", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * create  - escalate to event
 */
EventModel.prototype.escalateEvent = async function (userId, orgId, id) {
	try {
		const notification = await notificationModel.getNotification(id);
		const activity = await activityModel.getActivityDetail(userId, notification.activityId);
		let newEvent;
		const activityAttachments = await attachmentModel.getByTargetId(activity.id);
		let allPinnedItems = activity.contextEntities ? activity.contextEntities : [];
		const startDate = activity.activityDate || activity.published || new Date().toISOString();

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel;

		if (notification.escalationEvent) {
			const eventTemplate = await this.getById(userId, notification.escalationEvent);
			const notificationPinnedItems = await _internalGetPinnedEntities(notification.escalationEvent);
			allPinnedItems = allPinnedItems.concat(notificationPinnedItems);
			const notesBucket = appConfig.minio.buckets ? appConfig.minio.buckets.notesAttachmentBucket.name : null;
			const newNote = eventTemplate.notes ? await fileStorage.copyNote(eventTemplate.notes, notesBucket) : null;
			const templateLists = await listModel._internalGetByTargetId(notification.escalationEvent);
			const templateAttachments = await attachmentModel.getByTargetId(eventTemplate.id);

			const event = {
				desc: notification.message,
				name: eventTemplate.name,
				startDate: startDate,
				subtype: eventTemplate.subtype,
				type: eventTemplate.type,
				proximities: eventTemplate.proximities
			};

			if (activity.geometry) {
				event.entityData = {
					geometry: activity.geometry,
					properties: {
						description: notification.message,
						name: eventTemplate.name,
						type: "Event",
						id: null
					}
				};
			}

			if (newNote) {
				event.notes = newNote;
			}

			newEvent = await this.create(userId, orgId, event, translations.create);

			if (newEvent.entityData.properties) {
				newEvent.entityData.properties.id = newEvent.id;
				await r.table(EVENT_TABLE).get(newEvent.id).update(newEvent).run();
			}

			if (templateAttachments.length > 0) {
				await attachmentModel.copyAttachment(
					userId,
					newEvent.id,
					notification.escalationEvent,
					newEvent.entityType,
					false
				);
			}

			if (templateLists.length > 0) {
				const listIds = [];
				templateLists.forEach((list) => {
					listIds.push(list.id);
				});
				await listModel.createByTemplate(listIds, templateLists.targetType, newEvent.id, userId);
			}
		} else {
			const event = {
				desc: notification.message,
				name: "New Escalated Event",
				startDate: startDate,
				type: "event"
			};

			if (activity.geometry) {
				event.entityData = {
					geometry: activity.geometry,
					properties: {
						description: notification.message,
						name: "New Escalated Event",
						type: "Event",
						id: null
					}
				};
			}

			newEvent = await this.create(userId, orgId, event, translations.create);
		}

		if (newEvent.entityData.properties) {
			newEvent.entityData.properties.id = newEvent.id;
			await r.table(EVENT_TABLE).get(newEvent.id).update(newEvent).run();
		}

		if (activityAttachments.length > 0) {
			await attachmentModel.copyAttachment(userId, newEvent.id, activity.id, newEvent.entityType, false);
		}

		if (allPinnedItems.length > 0) {
			try {
				await this.pinEntities(userId, newEvent.id, allPinnedItems, translations.pinEntities);
			} catch (err) {
				logger.error("pinEntities", "There was an issue pinning activity entities to escalated event.", {
					err: { message: err.message, stack: err.stack }
				});
				throw err;
			}
		}

		return newEvent;
	} catch (err) {
		logger.error("escalate", "There was an error escalating event", {
			err: { message: err.message, stack: err.stack }
		});
	}
};

/**
 * delete  - delete event
 * @param userId
 * @param eventId
 */
EventModel.prototype.enableEvent = async function (userId, eventId) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}

		// we good
		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(
				{
					disabled: false,
					lastModifiedDate: new Date()
				},
				{ returnChanges: true }
			)
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);

		// Get additionalInfo
		const externalEntityMapping = await externalEntityMappingModel.getByTargetId(eventId, "event");
		const oldAdditionalProperties = externalEntityMapping ? externalEntityMapping.additionalProperties : "";

		result.changes[0].new_val.additionalProperties = oldAdditionalProperties;
		result.changes[0].old_val.additionalProperties = oldAdditionalProperties;

		// -- Send globalchangefeed update for delete
		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject("event", event.id, event.name),
			to: [
				{
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.enableEvent;
		activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		// const updated = result.changes[0].new_val;

		// return updated;
		return result;
	} catch (err) {
		logger.error("enableEvent", "There was an error enabling an event", {
			err: { message: err.message, stack: err.stack }
		});
		throw {
			err: {
				message: err,
				code: 500
			}
		};
	}
};

/**
 * update  - update event
 * @param userId
 * @param eventId
 * @param update
 */
EventModel.prototype.update = async function (userId, eventId, update) {
	try {
		const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		const canManage = await feedModel.authorizeEntity(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);

		let permittedProps = [];
		// only allow through properties that are allowed to be changed through this method
		// use redundancy to disallow updating on properties user isn't allowed to update
		if (canManage) {
			permittedProps = [
				"desc",
				"endDate",
				"name",
				"startDate",
				"type",
				"subtype",
				"additionalProperties",
				"entityData"
			];
		}
		// -- allowed for contribute
		permittedProps.push("notes");

		const op = {};
		const oldEEM = await externalEntityMappingModel.getByTargetId(eventId, "event");
		const oldAdditionalProperties = oldEEM ? oldEEM.additionalProperties : "";

		let newAdditionalProperties = "";
		let updating = false;

		for (const property in update) {
			if (permittedProps.includes(property)) {
				updating = true;

				if (property === "startDate") {
					op[property] = new Date(update[property]);
				} else if (property === "endDate") {
					if (update[property] === null) {
						op[property] = null;
					} else {
						op[property] = new Date(update[property]);
					}
				} else if (property === "additionalProperties") {
					newAdditionalProperties = { ...update[property] };
					const newMapping = {
						targetType: "event",
						additionalProperties: { ...newAdditionalProperties }
					};
					try {
						const result = await externalEntityMappingModel.upsert(null, eventId, newMapping);
					} catch (err) {
						logger.error("update", "There was an error updating an event", {
							err: { message: err.message, stack: err.stack }
						});
					}
				} else {
					op[property] = update[property];
				}
			}
		}

		if (updating) {
			op.lastModifiedDate = new Date();
		}

		// If removing end date, remove key from update and document
		if (op.endDate === null) {
			delete op.endDate;

			await r.table(EVENT_TABLE).get(eventId).replace(r.row.without("endDate")).run();

			// Check hidden items, updating entries to allow icon change from Planned to Emergent
			await r.table(AUTH_EXCLUSION_TABLE).filter({ entityId: eventId }).update({ iconType: "Emergent" }).run();
		}
		// If adding end date, update hidden event entries in authExclusion to change icon from Planned to Emergent
		else if (op.endDate) {
			await r.table(AUTH_EXCLUSION_TABLE).filter({ entityId: eventId }).update({ iconType: "Planned" }).run();
		}

		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(op, {
				returnChanges: true
			})
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);
		const new_valAdditionalProperties = newAdditionalProperties
			? newAdditionalProperties
			: oldAdditionalProperties
				? oldAdditionalProperties
				: "";
		const old_valAdditionalProperties = oldAdditionalProperties ? oldAdditionalProperties : "";

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: new_valAdditionalProperties
						? {
							...result.changes[0].new_val,
							additionalProperties: new_valAdditionalProperties
						}
						: result.changes[0].new_val,
					old_val: old_valAdditionalProperties
						? {
							...result.changes[0].old_val,
							additionalProperties: old_valAdditionalProperties
						}
						: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject("event", event.id, event.name),
			// target: activityModel.generateObject("organization", orgId),
			to: [
				{
					// "token": `organization:${orgId}`,
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.update;
		activity.summary = `${activity.actor.name} ${translations.summary.update} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		const updated = result.changes[0].new_val;

		return updated;
	} catch (err) {
		logger.error("update", "There was an error updating an event", {
			err: { message: err.message, stack: err.stack }
		});
		const unhandledErr = {
			err: {
				message: err,
				code: 500
			}
		};
		throw unhandledErr;
	}
};

EventModel.prototype.setActiveStatus = async function (eventId, isActive) {
	try {
		const result = await r
			.table(EVENT_TABLE)
			.get(eventId)
			.update({ isActive: isActive }, { returnChanges: true })
			.run();

		this.syncEventFeedCache(eventId);

		const additionalProperties = await r
			.table(EXTERNAL_ENTITY_MAPPING_TABLE)
			.filter({
				targetId: eventId
			})(0)
			.default({})
			.pluck("additionalProperties")("additionalProperties")
			.default({});

		const pinnedEntities = await this.getEventFeedCacheEntities([eventId]);
		result.changes[0].new_val["pinChanges"] = {
			pinned: pinnedEntities[eventId]
		};

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: {
						...result.changes[0].new_val,
						additionalProperties: additionalProperties
					},
					rt: true,
					statusChange: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// Update any shapes that should be displayed only when event is active.
		const eventShapeIds = await r
			.table(EVENT_ENTITIES_TABLE)
			.filter({
				eventId: eventId,
				entityType: "shapes"
			})
			.pluck("entityId");

		if (eventShapeIds && eventShapeIds.length) {
			const eventShapes = await shapeModel.getMultipleByIdInternal(eventShapeIds.map((e) => e.entityId));

			eventShapes.forEach(async (eventShape) => {
				if (eventShape.entityData.properties.displayOnEventActive) {
					// If deactivating event that was created from a template, we want to make sure
					// no other events referring to this shape are active
					if (!isActive && result.changes[0].new_val.template) {
						const { inUseByActiveEvent } = await this.getShapeUsageSummary(eventShape);
						if (inUseByActiveEvent) return;
					}

					shapeModel.setScope(eventShape.id, isActive);
				}
			});
		}
	} catch (err) {
		throw err;
	}
};

EventModel.prototype.getShapeUsageSummary = async function (shape) {
	try {
		const activeEvents = await r
			.table(EVENT_ENTITIES_TABLE)
			.filter({ entityId: shape.id })
			.merge((eventEntity) => {
				return r
					.table(EVENT_TABLE)
					.filter({
						id: eventEntity("eventId")
					})(0)
					.default({});
			})
			.filter({
				isDeleted: false,
				isActive: true
			});

		const usageSummary = {
			templateShape: false,
			inUseByActiveEvent: false
		};

		activeEvents.forEach((activeEvent) => {
			if (activeEvent.isTemplate) usageSummary.templateShape = true;
			else usageSummary.inUseByActiveEvent = true;
		});

		return usageSummary;
	} catch (err) {
		throw err;
	}
};

/**
 * mockUpdate - fake an update, causing streaming events to send across a new object with new data
 * -- This is mainly used after commenting (or pinning an item for intermediately streamed events) to cause the stream to
 * -- send across a new response, as we still can't stream from a changefeed after a table join
 * @param userId
 * @param eventId
 */
EventModel.prototype.mockUpdate = async (userId, eventId, permission) => {
	try {
		const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event", permission);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}

		const update = {
			lastModifiedDate: new Date()
		};

		await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(update, {
				returnChanges: true
			})
			.run();

		return "Success";
	} catch (err) {
		logger.error("mockUpdate", "There was an error sending a mock event update", {
			err: { message: err.message, stack: err.stack }
		});
		throw {
			err: {
				message: err,
				code: 500
			}
		};
	}
};

/**
 * delete  - delete event
 * @param userId
 * @param eventId
 */
EventModel.prototype.delete = async function (userId, eventId) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}

		// we good
		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(
				{
					isDeleted: true,
					lastModifiedDate: new Date()
				},
				{ returnChanges: true }
			)
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);

		// Get additionalInfo
		const externalEntityMapping = await externalEntityMappingModel.getByTargetId(eventId, "event");
		const oldAdditionalProperties = externalEntityMapping ? externalEntityMapping.additionalProperties : "";

		result.changes[0].new_val.additionalProperties = oldAdditionalProperties;
		result.changes[0].old_val.additionalProperties = oldAdditionalProperties;

		// -- Send globalchangefeed update for delete
		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// Delete any shapes that should be displayed only when event is active.
		const eventShapeIds = await r
			.table(EVENT_ENTITIES_TABLE)
			.filter({
				eventId: eventId,
				entityType: "shapes"
			})
			.pluck("entityId");

		if (eventShapeIds && eventShapeIds.length) {
			const eventShapes = await shapeModel.getMultipleByIdInternal(eventShapeIds.map((e) => e.entityId));

			eventShapes.forEach(async (eventShape) => {
				if (eventShape.entityData.properties.displayOnEventActive) {
					// If deleting event that has been created from a template, the shape may be referred elsewhere, so
					// we want to make sure that we handle this appropriately.
					let deleteShape = true;

					if (!event.isTemplate && event.template) {
						const { templateShape, inUseByActiveEvent } = await this.getShapeUsageSummary(eventShape);
						if (inUseByActiveEvent) return;

						if (templateShape) deleteShape = false; // only change shape scope
					}

					if (deleteShape) shapeModel.delete(userId, eventShape.id);
					else shapeModel.setScope(eventShape.id, false);
				}
			});
		}

		return result;
	} catch (err) {
		logger.error("delete", "There was an error deleting an event", {
			err: { message: err.message, stack: err.stack }
		});
		throw {
			err: {
				message: err,
				code: 500
			}
		};
	}
};

/**
 * pinEntities  - pin entities to event
 * @param userId
 * @param eventId
 * @param entities
 */
EventModel.prototype.pinEntities = async function (userId, eventId, entities) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw {
				message: "Cannot pin entities to deleted event",
				code: 404
			};
		}

		if (event.endDate) {
			const now = Date.now();
			const endDate = new Date(event.endDate);
			const eventClosed = now > endDate.getTime();
			if (eventClosed) {
				throw new Error("Event has ended and cannot have new items pinned to it");
			}
		}
		const ops = [];
		const authEntities = [];
		for (let i = 0; i < entities.length; i++) {
			const ent = await feedModel.getEntityWithAuthorizationUseFeedId(userId, entities[i].id, entities[i].feedId);
			if (ent) ent.entityData.properties["id"] = ent.id;
			if (ent !== null) {
				authEntities.push(ent);
				const id = eventId + "_" + entities[i].id;
				//check that the event entity doesn't exist  before attempting to add/generate an activity
				const entityCheck = await r.table(EVENT_ENTITIES_TABLE).get(id).run();
				if (!entityCheck) {
					ops.push({
						id,
						eventId,
						entityType: ent.entityType,
						feedId: ent.feedId,
						entityId: ent.id,
						pinnedBy: userId
					});
				} else {
					throw {
						err: {
							message: "Entity has already been pinned to the event",
							code: 404
						}
					};
				}
			}
		}

		const result = await r
			.table(EVENT_ENTITIES_TABLE)
			.insert(ops, {
				conflict: "update",
				returnChanges: true
			})
			.run();

		// sync eventFeedCache on change
		await this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: {
						...event,
						...{ pinChanges: { pinned: authEntities } }
					},
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.pinEntities;

		// Activities for each successful insertion
		const promises = result.changes.map(async (change) => {
			const entity = authEntities.find((ent) => ent.id === change.new_val.entityId);
			if (entity) {
				const activity = {
					summary: "",
					type: "pinned",
					actor: activityModel.generateObject("user", userId),
					object: activityModel.generateObject(
						entity.entityType,
						entity.id,
						entity.entityData.properties.name,
						entity.feedId
					),
					target: activityModel.generateObject("event", event.id, event.name),
					to: []
				};

				activity.summary = `${activity.object.name} ${translations.summary.addedToEvent} ${event.name}`;
				activityModel.queueActivity(activity);
			}
		});

		const response = Promise.all(promises).then(() => {
			return result;
		});
		return response;
	} catch (e) {
		logger.error("pinEntities", "There was an error while pinning an entity to an event", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * unpinEntity - unpin entity to event
 * @param userId
 * @param eventId
 * @param entityId
 * @param entityType
 */
EventModel.prototype.unpinEntity = async function (userId, eventId, entityId, entityType) {
	try {
		// -- todo: ENT_AUTH previously looked like manage should be required to unpin but only collaboration required to pin
		// -- temp going to require user has manage access to item to unpin as if you can pin to shared event I feel like you should be able to unpin
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw {
				message: "Cannot unpin entities from deleted event",
				code: 404
			};
		}

		// used for name in activity, and to authorize entity
		const entity = await feedModel.getEntityWithAuthorization(userId, entityId, entityType);

		if (entity) entity.entityData.properties["id"] = entity.id;

		const id = eventId + "_" + entityId;

		const result = await r.table(EVENT_ENTITIES_TABLE).get(id).delete({ returnChanges: true }).run();

		// sync eventFeedCache on change
		await this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: {
						...event,
						...{ pinChanges: { unpinned: [entity] } }
					},
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// generate activity for pinned item removal
		const activity = {
			summary: "",
			type: "unpinned",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				entityType,
				entityId,
				entity.entityData.properties.name,
				entity.feedId
			),
			target: activityModel.generateObject("event", event.id, event.name),
			to: []
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.unpinEntity;
		activity.summary = `${activity.object.name} ${translations.summary.removedEvent} ${event.name}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (e) {
		logger.error("unpinEntity", "There was an error while unpinning an entity to an event", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * shareEvent  - make event public
 * @param userId
 * @param eventId
 * @param orgIds
 */

// cannot make private once public
EventModel.prototype.shareEvent = async function (userId, eventId, orgIds) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.share
		);
		if (!event) {
			throw {
				message: "User is not authorized to share this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw { message: "Cannot share a deleted event", code: 404 };
		}

		const op = {
			sharedWith: orgIds
		};

		const result = await r
			.table(EVENT_TABLE)
			.get(eventId)
			.update(op, {
				returnChanges: true
			})
			.merge((event) => {
				return {
					new_val: {
						additionalProperties: r
							.table(EXTERNAL_ENTITY_MAPPING_TABLE)
							.filter({
								targetId: event("new_val")("id")
							})(0)
							.default({})
							.pluck("additionalProperties")("additionalProperties")
							.default({})
					}
				};
			})
			.run();

		this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const updated = result.changes[0].new_val;

		return updated;
	} catch (e) {
		logger.error("shareEvent", "There was an error while sharing an event", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * addComment  - add comment activity to event
 * @param userId
 * @param eventId
 * @param orgIds
 */

EventModel.prototype.addComment = async function (userId, eventId, comment) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		// -- todo: ENT_AUTH err was originally returned via callback
		if (event.isDeleted) {
			throw {
				message: "Cannot add comments to a deleted event",
				code: 404
			};
		}

		const permission = userPolicyCache.feedPermissionTypes.view;
		await this.mockUpdate(userId, eventId, permission);
		const activity = {
			summary: "",
			type: "comment",
			actor: activityModel.generateObject("user", userId),
			object: {
				message: comment,
				type: "comment"
			},
			target: activityModel.generateObject("event", event.id, event.name),
			to: [
				{
					// "token": `organization:${orgId}`,
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: true
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.addComment;
		activity.summary = `${activity.actor.name} ${translations.summary.commentedOn} ${event.name}`;
		activityModel.queueActivity(activity);

		return { success: true };
	} catch (e) {
		logger.error("addComment", "There was an error while adding a comment activity to an event", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * syncEventFeedCache  - sync eventFeedCache based on current state of event
 * @param eventId
 */
EventModel.prototype.syncEventFeedCache = async function (eventId) {
	try {
		const result = await r
			.table(EVENT_TABLE)
			.get(eventId)
			.merge((row) => {
				return {
					isInScope: r
						.now()
						.during(row("startDate"), row("endDate").default(r.time(3000, 1, 1, "Z")))
						.and(row("isDeleted").eq(false))
				};
			})
			.merge((row) => {
				return {
					pinned: r.branch(
						row("isInScope").eq(true),
						r
							.table(EVENT_ENTITIES_TABLE)
							.getAll(row("id"), {
								index: "eventId"
							})
							.coerceTo("array"),
						[]
					),
					cached: r
						.table(EVENT_FEED_CACHE_TABLE)
						.getAll(row("id"), {
							index: "eventId"
						})
						.coerceTo("array")
				};
			})
			.merge((row) => {
				return {
					add: row("pinned")
						.filter((r) => {
							return row("cached")
								.map((c) => {
									return c("entityId");
								})
								.contains(r("entityId"))
								.not();
						})
						.merge(() => {
							return {
								inScope: true,
								lastUpdated: r.now()
							};
						}),
					remove: row("cached")
						.map((r) => {
							return r("entityId");
						})
						.setDifference(
							row("pinned").map((r) => {
								return r("entityId");
							})
						)
				};
			})
			.do((row) => {
				return r.expr([
					r.branch(
						row("remove").count().gt(0),
						r
							.table(EVENT_FEED_CACHE_TABLE)
							.getAll(r.args(row("remove")), {
								index: "entityId"
							})
							.delete(),
						{
							removed: 0
						}
					),
					r.branch(row("add").count().gt(0), r.table(EVENT_FEED_CACHE_TABLE).insert(row("add")), {
						added: 0
					})
				]);
			});
		return result;
	} catch (ex) {
		throw ex;
	}
};

/**
 * Query all pinnable items via a search term, searching against displayProperties, if they exist, and falling back to name
 * @param {string} userId -- User's id
 * @param {string} eventId -- Event's id
 * @param {string} query -- query string used to search
 * @param {number} pageSize -- number of entities you'd like to send back
 */
EventModel.prototype.queryPinnable = async function (userId, eventId, query, pageSize) {
	try {
		// Remove all whitespace
		const regex = /([^\s]+)/g;

		// Array of search terms
		const queries = query.match(regex);

		const user = userPolicyCache.getUserById(userId);
		const userIntegrations = userPolicyCache.getUserIntegrations(userId);
		const feedIds = userIntegrations
			.filter((feed) => {
				return feed.config.canView && !feed.isRemote;
			})
			.map(function (feed) {
				return feed.feedId;
			});

		// Set feed's displayProperties to object key by feedId, if available
		const displayProperties = {};
		for (let i = 0; i < feedIds.length; i++) {
			const feedId = feedIds[i];

			const data = await feedModel.getFeedTypeById(feedId);

			const properties = data.displayProperties ? data.displayProperties : null;
			if (properties) {
				displayProperties[feedId] = properties;
			}
		}

		const filterRecursively = (entities, queryStrings) => {
			// If there are no more queries to filter, return the entities that are left
			if (!queryStrings.length) {
				return entities;
			}

			const query = queryStrings[0].toLowerCase();

			// Filter entities based on current query string
			const filtered = entities.filter((ent) => {
				const properties = ent.entityData.properties;

				// Check name for match and bail early
				if (properties.name && properties.name.toLowerCase().includes(query)) {
					return true;
				}

				// If entity has alternate display properties, filter by them
				if (displayProperties[ent.feedId]) {
					const propertyArr = displayProperties[ent.feedId].map((a) => a.key);

					for (const prop of propertyArr) {
						if (properties[prop]) {
							if (properties[prop].toString().toLowerCase().includes(query)) {
								return true;
							}
						}
					}
				}

				return false;
			});

			const updatedQueryStrings = [...queryStrings];
			updatedQueryStrings.shift();
			return filterRecursively(filtered, updatedQueryStrings);
		};

		const queryAndFilter = async (queryFn, args) => {
			const entities = await queryFn(...args);
			const result = filterRecursively(entities, queries);
			return result;
		};
		const values = await Promise.all([
			queryAndFilter(feedModel.getEntitiesByTypeWithAuthorization, [userId, "track", true, null, true]),
			queryAndFilter(shapeModel.getAll, [userId]),
			queryAndFilter(feedModel.getEntitiesByTypeWithAuthorization, [userId, "camera", true, null, true]),
			queryAndFilter(facilitiesModel.getAll, [userId, user.orgId]),
			queryAndFilter(feedModel.getEntitiesByTypeWithAuthorization, [userId, "accessPoint", true, null, true])
		]);

		const uniqueRemoteEcoIds = userIntegrations
			.filter((feed) => feed.config.canView && feed.isRemote)
			.map((feed) => feed.intId.split("@@")[1])
			.filter((feedId, index, self) => self.indexOf(feedId) === index);

		let remotePinnable = [];
		if (uniqueRemoteEcoIds.length > 0) {
			remotePinnable = await _global.ecoLinkManager.queryPinnable(uniqueRemoteEcoIds, userId, eventId, query);
		}

		const filterResult = [...values[0], ...values[1], ...values[2], ...values[3], ...values[4]];
		const result = filterResult.slice(0, pageSize);

		return [...result, ...remotePinnable];
	} catch (err) {
		logger.error("queryPinnable", "An error occurred while querying pinnable items", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

EventModel.prototype.streamPinnedItems = async (userId, eventId, handler) => {
	let batch = [];
	const batchDuration = 300;

	const sendBatch = () => {
		handler(null, { changes: batch });
		batch = [];
	};

	setInterval(() => {
		if (batch.length > 0) {
			sendBatch();
		}
	}, batchDuration);

	const pinnedEntCache = [];

	const entityCheck = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
	if (entityCheck) {
		const q = r.table(EVENT_ENTITIES_TABLE).filter({ eventId: eventId }).changes({
			includeInitial: true,
			includeTypes: true
		});

		const onFeedItem = async (change) => {
			const valType = change.new_val ? "new_val" : "old_val";
			const pinnedItem = change[valType];
			const pinnedEnt = await feedModel.getEntityWithAuthorization(
				userId,
				pinnedItem.entityId,
				pinnedItem.entityType
			);
			if (pinnedEnt) {
				const pinnedObj = { type: change.type };
				pinnedObj[valType] = pinnedEnt;
				if (valType === "new_val") {
					if (!pinnedEntCache.includes(pinnedItem.entityId)) pinnedEntCache.push(pinnedItem.entityId);
				} else {
					if (pinnedEntCache.includes(pinnedItem.entityId))
						pinnedEntCache.splice(pinnedEntCache.indexOf(pinnedItem.entityId), 1);
				}
				batch.push(pinnedObj);
			}
		};

		const gcfSid = await _global.globalChangefeed.subscribe({ entityType: "*" }, null, (change) => {
			const valType = change.new_val ? "new_val" : "old_val";
			const ent = change[valType];
			if (pinnedEntCache.includes(ent.id)) {
				if (!change["type"]) {
					change["type"] = !change.old_val
						? "add"
						: change.new_val.deleted ||
							change.new_val.isDeleted ||
							change.new_val.isActive === false ||
							(Object.hasOwn(change.new_val, "inScope") && !change.new_val.inScope)
							? "remove"
							: "change";
				}
				batch.push(change);
			}
		});

		const onError = (err) => {
			logger.error("streamPinnedItems", "eventModel.streamPinnedItems changefeed error", {
				err: { message: err }
			});
			handler(err, null);
		};

		const cancelCF = provider.processChangefeed("eventModel.streamPinnedItems", q, onFeedItem, onError);

		const cancelFn = function () {
			try {
				cancelCF();
				_global.globalChangefeed.unsubscribe(gcfSid);
			} catch (err) {
				logger.error("streamPinnedItems", "Error cancelling stream", {
					errMessage: err.message,
					errStack: err.stack
				});
			}
		};

		return cancelFn;
	} else {
		throw {
			message: "Event not found or requester does not have access",
			code: 404
		};
	}
};

EventModel.prototype.streamPinnedItemsByType = async (userId, eventId, pinnedItemType, handler) => {
	let batch = [];
	const batchDuration = 300;

	const sendBatch = () => {
		handler(null, batch);
		batch = [];
	};

	setInterval(() => {
		if (batch.length > 0) {
			sendBatch();
		}
	}, batchDuration);

	const entityCheck = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
	if (entityCheck) {
		const q = r
			.table(EVENT_ENTITIES_TABLE)
			.filter({ eventId: eventId })
			.map((ent) => {
				return ent("entityId");
			})
			.changes({
				includeInitial: true,
				includeTypes: true
			});

		const onFeedItem = async (change) => {
			let valType = null;
			switch (change.type) {
				case "add":
				case "initial":
					valType = "new_val";
					break;
				// case "change":	// I don't think this is ever used in this scenario
				case "remove":
					valType = "old_val";
					break;
				default:
					break;
			}

			const pinnedItemEntityIds = [];
			if (change[valType]) {
				pinnedItemEntityIds.push(change[valType]);
			}

			const entities = await feedModel.getEntitiesWithAuthorization(userId, pinnedItemEntityIds, pinnedItemType);
			if (entities && entities.length > 0) {
				const entityIdsArray = entities.map((entity) => entity.id);
				const batchObj = {
					type: change.type
				};
				batchObj[valType] = {
					entityId: eventId,
					[pinnedItemType + "s"]: entityIdsArray
				};
				batch.push(batchObj);
			}
		};

		const onError = (err) => {
			logger.error("streamPinnedItemsByType", "eventModel.streamPinnedItemsByType changefeed error", {
				err: { message: err }
			});
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("eventModel.streamPinnedItemsByType", q, onFeedItem, onError);
		return cancelFn;
	} else {
		throw {
			message: "Event not found or requester does not have access",
			code: 404
		};
	}
};

/**
 *	Stream:
 *	@param userId: User's ID from identity on request
 *  @param format: string, determines the amount of data returned ("light", "intermediate", or, if not provide, default to "full")
 *	@param handler: handler from stream
 */
EventModel.prototype.streamEvents = async (userId, format = "full", status, type, templates, inclusionGeo, handler) => {
	let batch = [];
	const batchDuration = 300;
	const sendBatch = () => {
		handler(null, batch);
		batch = [];
	};

	setInterval(() => {
		if (batch.length > 0) {
			sendBatch();
		}
	}, batchDuration);

	let filter = r
		.row("isDeleted")
		.eq(false)
		.and(r.row("isTemplate").default(false).eq(templates))
		.and(r.row("disabled").default(false).eq(false));

	// Set up the correct type filters
	if (type && type.length) {
		let typeFilter = "";
		type.forEach((value, index) => {
			const typeQuery = r.row("type").eq(value);
			typeFilter = index > 0 ? typeFilter.or(typeQuery) : typeQuery;
		});
		filter = typeFilter ? filter.and(typeFilter) : filter;
	}
	// Set up the correct status filters
	if (status && status.length) {
		let statusFilter = "";
		status.forEach((value, index) => {
			switch (value) {
				case "active": {
					const statusQuery = r.row("isActive").default(true).eq(true);

					statusFilter = index > 0 ? statusFilter.or(statusQuery) : statusQuery;

					break;
				}

				case "upcoming": {
					const statusQuery = r.row("startDate").gt(r.now());

					statusFilter = index > 0 ? statusFilter.or(statusQuery) : statusQuery;

					break;
				}

				case "closed": {
					const statusQuery = r.row("endDate").le(r.now()).default(false);

					statusFilter = index > 0 ? statusFilter.or(statusQuery) : statusQuery;

					break;
				}

				default:
					break;
			}
		});

		filter = statusFilter ? filter.and(statusFilter) : filter;
	}

	const q = r
		.table(EVENT_TABLE)
		.without("notes")
		.filter(filter)
		.map((event) => {
			return r.branch(
				r.expr(format).eq("light"),
				event.pluck(
					"startDate",
					"endDate",
					"name",
					"id",
					"owner",
					"ownerOrg",
					"lastModifiedDate",
					"entityType"
				),
				r.expr(format).eq("intermediate"),
				event.pluck(
					"startDate",
					"endDate",
					"name",
					"id",
					"owner",
					"ownerOrg",
					"lastModifiedDate",
					"entityType",
					"entityData",
					"sharedWith"
				),
				event
			);
		})
		// .without("lastModifiedDate")
		.changes({
			includeInitial: true,
			includeTypes: true
		})
		.filter(authExclusionChangefeedFilter(userId))
		.merge((row) => {
			return r.branch(
				row("new_val").ne(null),
				r.branch(
					row("new_val").hasFields("template"),
					{
						new_val: {
							templateName: r.table(EVENT_TABLE).get(row("new_val")("template"))("name")
						}
					},
					{}
				),
				{}
			);
		})
		.merge((event) => {
			return r.branch(
				event("new_val").ne(null),
				{
					new_val: {
						additionalProperties: r
							.table(EXTERNAL_ENTITY_MAPPING_TABLE)
							.filter({
								targetId: event("new_val")("id")
							})(0)
							.default({})
							.pluck("additionalProperties")("additionalProperties")
							.default({})
					}
				},
				{}
			);
		}).merge((event) => {
			return r.branch(
				event("new_val").ne(null),
				r.branch(
					event("new_val")("sharedWith").default([]).isEmpty().not(),
					{
						new_val: {
							sharedBy: r
								.table(ORGANIZATION_TABLE)
								.filter({
									orgId: event("new_val")("ownerOrg")
								})(0)
								.default({})
								.pluck("name")("name")
						}
					},
					{}
				),
				{}
			);
		});

	let pipFilter = null;
	if (inclusionGeo) {
		pipFilter = new ChangefeedPIPFilter(inclusionGeo);
	}
	const onFeedItem = async function (change) {
		if (pipFilter) {
			change = pipFilter.filter(change);
		}
		if (change) {
			if (change.new_val) {
				if (userPolicyCache.authorizeEntity(userId, change.new_val)) {
					if (format === "intermediate") {
						const pinnedItems = await getPinnedItems(change.new_val.id, userId);
						change.new_val["pinnedItems"] = pinnedItems.map((ent) => {
							return ent.id;
						});
					}
					batch.push(change);
				} else if (change.old_val) {
					// -- if old value was authorized then send a remove command
					if (userPolicyCache.authorizeEntity(userId, change.old_val)) {
						change.type = "remove";
						batch.push(change);
					}
				}
			} else {
				batch.push(change);
			}
		}
	};

	const onError = (err) => {
		logger.error("streamEvents", "eventModel.streamEvents changefeed error", {
			err: { message: err }
		});
		handler(err, null);
	};

	const cancelFn = provider.processChangefeed("eventModel.streamEvents", q, onFeedItem, onError);
	return cancelFn;
};

EventModel.prototype.mockUpdatePinnedItem = async (userId, eventId, entityId) => {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw { message: "Not found", code: 404 };
		}

		const update = {
			lastModifiedDate: new Date()
		};
		await r
			.table(EVENT_ENTITIES_TABLE)
			.filter({
				entityId
			})
			.update(update, {
				returnChanges: true
			})
			.run();

		return "Success";
	} catch (err) {
		logger.error("mockUpdatePinnedItem", "There was an error while mocking an update for a pinned item", {
			err: { message: err.message, stack: err.stack }
		});
		throw {
			err: {
				message: err,
				code: 500
			}
		};
	}
};

/**
 * IMPORTANT: This route is unauthorized for a customer-specific feature. Do not use this in general development.
 * @param {array} listIds
 * @param {string} eventId
 * @param {string} userId
 */
EventModel.prototype.autoPinLists = async function (listIds, eventId, userId) {
	try {
		// List templates
		const originalLists = await r
			.table(LIST_TABLE)
			.filter((item) => {
				return r.expr(listIds).contains(item("id"));
			})
			.run();

		const updates = [];

		originalLists.forEach((list) => {
			const clonedList = { ...list };

			// Remove ID
			delete clonedList.id;

			// Generate update object
			const update = {
				createdDate: new Date(),
				lastModifiedDate: new Date(),
				owner: userId,
				deleted: false,
				isPublic: false,
				targetId: eventId,
				targetType: "Event",
				category: null
			};

			// Merge template list copy and update object
			const newList = { ...clonedList, ...update };

			// Store in updates array
			updates.push(newList);
		});

		if (updates.length) {
			const result = await r.table(LIST_TABLE).insert(updates, { returnChanges: true }).run();

			logger.info("autoPinLists", "Lists were automatically pinned to a created event by subtype", {
				result: result
			});

			// If at least one list was pinned
			if (result && result.changes.length) {
				const attachmentUpdates = [];

				result.changes.forEach((change) => {
					const newList = change.new_val;

					if (newList.rows) {
						newList.rows.forEach((row) => {
							if (row.attachments && row.attachments.length) {
								row.attachments.forEach((attachmentId) => {
									attachmentUpdates.push({
										fileId: attachmentId,
										targetId: newList.id
									});
								});
							}
						});
					}
				});

				if (attachmentUpdates.length) {
					const attachmentResult = await r.table(ENTITY_ATTACHMENT_TABLE).insert(attachmentUpdates).run();

					logger.info("autoPinLists", "List attachments were updated", { result: attachmentResult });
				}

				return { success: true };
			} else {
				const err = {
					message: "Error automatically pinning lists to event by subtype",
					stack: "/models/eventModel.js"
				};
				throw err;
			}
		} else {
			const err = {
				message: "Error generating new lists from templates",
				stack: "/models/eventModel.js"
			};
			throw err;
		}
	} catch (err) {
		logger.error(
			"autoPinLists",
			"An error occurred while attempting to automatically pin lists to a created event",
			{ err: { message: err.message, stack: err.stack } }
		);
		throw err;
	}
};

/**
 * Delete a list from an Event
 * @param {string} userId -- User's id
 * @param {string} eventId -- Event's id
 * @param {string} listId -- List's id
 */
EventModel.prototype.deleteList = async function (userId, orgId, eventId, listId) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		try {
			const res = await listModel.delete(userId, orgId, listId, true);
			const list = res[0].changes[0].new_val;
			// generate activity for pinned item removal
			const activity = {
				summary: "",
				type: "unpinned",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject("list", list.id, list.name, list.feedId),
				target: activityModel.generateObject("event", event.id, event.name),
				to: []
			};

			const i18n = await _global.geti18n();
			const translations = i18n.ecosystem.activities.eventsModel.deleteList;
			activity.summary = `${activity.object.name} ${translations.summary.removedFrom}`;
			activityModel.queueActivity(activity);

			return res;
		} catch (err) {
			throw err;
		}
	} catch (error) {
		logger.error("deleteList", "An error occurred while attempting to delete a list from an event", {
			err: { message: error.message, stack: error.stack }
		});
		throw error;
	}
};

/**
 * Update a list on an Event
 * @param {string} userId -- User's id
 * @param {string} eventId -- Event's id
 * @param {string} listId -- List's id
 * @param {string} update -- the list's update
 */
EventModel.prototype.updateList = async function (userId, orgId, eventId, listId, update, timezone) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.manage
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		try {
			const res = await listModel.update(userId, orgId, listId, update, timezone, event);
			const postUpdateList = res.changes[0].new_val;
			const preUpdateList = res.changes[0].old_val;
			if (preUpdateList.name !== postUpdateList.name) {
				// generate activity for pinned item removal
				const activity = {
					summary: "",
					type: "updated",
					actor: activityModel.generateObject("user", userId),
					object: activityModel.generateObject(
						"list",
						postUpdateList.id,
						postUpdateList.name,
						postUpdateList.feedId
					),
					target: activityModel.generateObject("event", event.id, event.name),
					to: []
				};

				const i18n = await _global.geti18n();
				const translations = i18n.ecosystem.activities.eventsModel.updateList;
				activity.summary = `${activity.actor.name} ${translations.summary.renameList} '${preUpdateList.name} ${translations.summary.to} ${postUpdateList.name}'`;
				activityModel.queueActivity(activity);
			}

			return res;
		} catch (err) {
			throw err;
		}
	} catch (err) {
		logger.error("updateList", "An error occurred while attempting to update a list on an event", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * Pin lists to an Event
 * @param {string} userId -- User's id
 * @param {string} eventId -- Event's id
 * @param {string} listId -- List's id
 * @param {string} update -- the list's update
 */
EventModel.prototype.pinList = async function (userId, orgId, eventId, listIds, type) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		try {
			const res = await listModel.createByTemplate(listIds, type, eventId, userId, orgId);

			const i18n = await _global.geti18n();
			const translations = i18n.ecosystem.activities.eventsModel.pinList;

			// Activities for each successful insertion
			res.listResult.changes.forEach((change) => {
				const list = change.new_val;
				const activity = {
					summary: "",
					type: "pinned",
					actor: activityModel.generateObject("user", userId),
					object: activityModel.generateObject("list", list.id, list.name, list.feedId),
					target: activityModel.generateObject("event", event.id, event.name),
					to: []
				};
				activity.summary = `${activity.object.name} ${translations.summary.addedToEvent} ${event.name}`;
				activityModel.queueActivity(activity);
			});
			return res;
		} catch (err) {
			throw err;
		}
	} catch (error) {
		logger.error("pinList", "An error occurred while attempting to pin a list(s) to an event", {
			err: { message: error.message, stack: error.stack }
		});
		throw error;
	}
};

/**
 * Pin lists to an Event
 * @param {string} userId -- User's id
 * @param {string} eventId -- Event's id
 * @param {string} listId -- List's id
 * @param {string} update -- the list's update
 */
EventModel.prototype.streamLists = async function (eventId, userId, expandRefs, handler) {
	try {
		const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}

		const result = await listModel.streamByEvent(eventId, userId, expandRefs, handler);
		return result;
	} catch (error) {
		logger.error("stream lists", "An error occurred while attempting to stream lists pinned to an event", {
			err: { message: error.message, stack: error.stack }
		});
		throw error;
	}
};

/**
 * addProximity  - add proximity object to event
 * @param userId
 * @param eventId
 * @param proximity
 */
EventModel.prototype.addProximity = async function (userId, eventId, proximity) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw {
				message: "Cannot unpin entities from deleted event",
				code: 404
			};
		}

		const op = {};
		op.lastModifiedDate = new Date();

		op.proximities = event.proximities ? event.proximities : [];
		op.proximities.push(proximity.proximity);

		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(op, {
				returnChanges: true
			})
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// Create Activity for successful update
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject("event", event.id, event.name),
			to: [
				{
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.addProximity;
		activity.summary = `${activity.actor.name} ${translations.summary.addedNew} ${proximity.proximity.name}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (err) {
		logger.error("addProximity", "There was an error while adding a proximity object to an event", {
			errMessage: err.message,
			errStack: err.stack
		});
		throw { message: err.message, code: 500 };
	}
};

/**
 * updateProximity  - update proximity object in event
 * @param userId
 * @param eventId
 * @param proximityId
 * @param proximity
 */
EventModel.prototype.updateProximity = async function (userId, eventId, proximityId, proximity) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw {
				message: "Cannot unpin entities from deleted event",
				code: 404
			};
		}

		const op = {};
		op.lastModifiedDate = new Date();

		op.proximities = event.proximities ? event.proximities : [];
		const proximityIndex = op.proximities.findIndex((x) => x.id === Number(proximityId));
		//Replace old proximity of same id with updated proximity
		op.proximities.splice(proximityIndex, 1, proximity.proximity);

		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(op, {
				returnChanges: true
			})
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// Create Activity for successful update
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject("event", event.id, event.name),
			to: [
				{
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.updateProximity;
		activity.summary = `${activity.actor.name} ${translations.summary.updated} ${proximity.proximity.name}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (err) {
		logger.error("updateProximity", "There was an error while updating a proximity object in an event", {
			errMessage: err.message,
			errStack: err.stack
		});
		throw { message: err.message, code: 500 };
	}
};

/**
 * deleteProximity  - delete proximity object from event
 * @param userId
 * @param eventId
 * @param proximityId
 */
EventModel.prototype.deleteProximity = async function (userId, eventId, proximityId) {
	try {
		const event = await feedModel.getEntityWithAuthorization(
			userId,
			eventId,
			"event",
			userPolicyCache.feedPermissionTypes.contribute
		);
		if (!event) {
			throw {
				message: "User is not authorized to access this event",
				code: 403
			};
		}
		if (event.isDeleted) {
			throw {
				message: "Cannot unpin entities from deleted event",
				code: 404
			};
		}

		const op = {};
		op.lastModifiedDate = new Date();

		op.proximities = event.proximities ? event.proximities : [];
		const proximityIndex = op.proximities.findIndex((x) => x.id === Number(proximityId));
		const proximityName = op.proximities[proximityIndex].name;
		op.proximities.splice(proximityIndex, 1);

		const result = await r
			.table(EVENT_TABLE)
			.filter({
				id: eventId
			})
			.update(op, {
				returnChanges: true
			})
			.run();

		// sync eventFeedCache on change
		this.syncEventFeedCache(eventId);

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		// Create Activity for successful update
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject("event", event.id, event.name),
			to: [
				{
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		const i18n = await _global.geti18n();
		const translations = i18n.ecosystem.activities.eventsModel.deleteProximity;
		activity.summary = `${activity.actor.name} ${translations.summary.delete} ${proximityName}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (err) {
		logger.error("deleteProximity", "There was an error while deleting a proximity object from an event", {
			errMessage: err.message,
			errStack: err.stack
		});
		throw { message: err.message, code: 500 };
	}
};

/**
 * getEventsInFov: Return Ids of active Events that are inside a camera's fov
 * @param userId
 * @param cameraId
 */
EventModel.prototype.getEventsInFov = async function (userId, cameraId) {
	try {
		const cameraFov = await cameraModel.getFOV(userId, cameraId);
		const { geometry } = cameraFov.entityData;

		const geoFilter = r.geojson(r.row("entityData")("geometry")).intersects(r.geojson(geometry));

		const fovEvents = await r
			.table(EVENT_TABLE)
			.filter(
				r
					.row("isDeleted")
					.default(true)
					.eq(false)
					.and(
						r.row("isActive").default(false).eq(true),
						r.row("disabled").default(false).eq(false),
						geoFilter
					)
			);

		return fovEvents.map((e) => e.id);
	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 * getEventFeedCacheEntities
 * @param eventIds
 */
EventModel.prototype.getEventFeedCacheEntities = async function (eventIds) {
	try {
		const cacheEntities = await r.table(EVENT_FEED_CACHE_TABLE).getAll(r.args(eventIds), { index: "eventId" });

		const feedGroups = {};
		for (const cacheEnt of cacheEntities) {
			if (!feedGroups[cacheEnt["feedId"]]) feedGroups[cacheEnt["feedId"]] = [];
			feedGroups[cacheEnt["feedId"]].push(cacheEnt);
		}

		const result = {};
		for (const feedId of Object.keys(feedGroups)) {
			const entityIds = feedGroups[feedId].map((fg) => fg.entityId);
			const entities = await feedModel.getFeedEntitiesInternal(feedId, entityIds);
			for (const ent of entities) {
				const cacheEnt = cacheEntities.find((ce) => ce.entityId === ent.id);
				if (!result[cacheEnt.eventId]) result[cacheEnt.eventId] = [];
				result[cacheEnt.eventId].push(ent);
			}
		}

		return result;
	} catch (err) {
		throw { message: err.message, code: 500 };
	}
};

/**
 * getEntitiesInEventProximity: Return tracks, shapes, and facilities that are inside an event's proximity
 * @param geometry
 * @param radiuses
 */
EventModel.prototype.getEventProximityEntities = async function (userId, feedId, geometry, radiuses, handler) {
	try {
		const feedType = await feedModel.getEntityTypeByFeedId(feedId);

		// Batching
		let isInitialState = true;
		let initialEntities = [];
		const q = r
			.table(feedType.sourceTable)
			.filter(
				r.and(
					r.row("isActive").default(true).eq(true),
					r.row("isDeleted").default(false).eq(false),
					r.row("entityData")("properties")("type").default("other").ne("FOV"), // -- keep FOVs out of shape entities
					r
						.geojson(r.row("entityData")("geometry"))
						.intersects(r.circle(geometry.coordinates, radiuses[radiuses.length - 1], { unit: "km" }))
				)
			)
			.changes({
				includeInitial: true,
				includeTypes: true,
				includeStates: true
			})
			.filter(authExclusionChangefeedFilter(userId));

		const onFeedItem = (change) => {
			if (change.new_val && change.new_val.entityData) {
				if (userPolicyCache.authorizeEntity(userId, change.new_val)) {
					const geo = change.new_val.entityData.geometry;

					// -- default to max int value so it's not included if can't be calculated
					let distance = Number.MAX_SAFE_INTEGER;
					try {
						if (geo.type === "Point") {
							const point1 = turf.point(geometry.coordinates);
							const point2 = turf.point(geo.coordinates);
							distance = turf.distance(point1, point2); // -- defaults to KM
						} else if (geo.type === "LineString") {
							const point = turf.point(geometry.coordinates);
							const line = turf.lineString(geo.coordinates);
							distance = turf.pointToLineDistance(point, line); // -- defaults to KM
						} else if (geo.type === "Polygon") {
							const point = turf.point(geometry.coordinates);
							const poly = turf.polygon(geo.coordinates);

							if (turf.booleanPointInPolygon(point, poly)) {
								// -- point inside of polygon
								distance = -1;
							} else {
								const line = turf.polygonToLine(poly);
								distance = turf.pointToLineDistance(point, line); // -- defaults to KM
							}
						}
					} catch (err) {
						logger.error(
							"getEventProximityEntities",
							"There was an error calculating distance to event point.",
							{ err }
						);
					}

					// -- set owner proximity group
					change.new_val.distanceFromEvent = distance;
					for (const proximityDist of radiuses) {
						if (change.new_val.distanceFromEvent <= proximityDist) {
							change.new_val.proximityId = proximityDist;
							break;
						}
					}

					// -- handle weird edge case causing null reference
					if (!change.new_val.proximityId) {
						change.new_val.proximityId = -1;
					}
				}
			}
			if (change.state) {
				if (change.state === "initializing") {
					isInitialState = true;
				} else {
					isInitialState = false;

					// We have all the initial documents
					// So send them across!
					handler(null, {
						type: "initial-batch",
						changes: initialEntities
					});
					initialEntities = [];
				}
			} else {
				if (isInitialState) {
					if (change.new_val && change.new_val.proximityId && change.new_val.proximityId !== -1) {
						// If we're still in the initial state,
						// throw the change in our array
						initialEntities.push(change.new_val);
					}
				} else {
					// -- don't include entity if no assigned proximityId
					if (
						change.type === "remove" ||
						(change.new_val && change.new_val.proximityId && change.new_val.proximityId !== -1)
					) {
						// Send across non-initial changes as they come
						handler(null, change);
					}
				}
			}
		};

		const onError = (err) => {
			logger.error("getEventProximityEntities", "An error occurred while streaming event proximity entities", {
				err: { message: err.message, code: err.code }
			});
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("EventModel.getEventProximityEntities", q, onFeedItem, onError);
		return cancelFn;
	} catch (error) {
		logger.error(
			"getEventProximityEntities",
			"There was an error while retrieving the entities within an event's proximities",
			{
				err: error
			}
		);
		throw error;
	}
};

EventModel.prototype.deleteEventNotes = async function (userId, eventId) {
	const event = await this.getById(userId, eventId);
	const notesBucket = appConfig.minio.buckets ? appConfig.minio.buckets.notesAttachmentBucket.name : null;

	try {
		await fileStorage.deleteNote(event.notes, notesBucket);

		const result = await r
			.table(EVENT_TABLE)
			.get(eventId)
			.replace(r.row.without("notes"), { returnChanges: true })
			.run();

		return result.changes[0].new_val;
	} catch (ex) {
		logger.error("delete", "Error deleting notes", {
			err: {
				message: ex.message,
				code: ex.code,
				stack: "/models/eventModel.js"
			}
		});
		throw ex;
	}
};

/**
 * retrieve all pinned cameras for non-archived events
 */
EventModel.prototype._internalGetPinnedCameras = async function () {
	try {
		const result = r
			.table(EVENT_ENTITIES_TABLE)
			.filter(r.row("entityType").eq("camera"))
			.filter((ee) => {
				return r.table(EVENT_TABLE).get(ee("eventId")).hasFields("archiveDate").not();
			})
			.map((pc) => {
				return {
					eventId: pc("eventId"),
					cameraId: pc("entityId")
				};
			})
			.run();

		return result;
	} catch (err) {
		logger.error("_internalGetPinnedCameras", "Unexpected exception", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * generateLocationActivity - generate an activity associated with an event that has point geometry of specified coordinates
 * @param {string} userId - id of user executing operation
 * @param {string} eventId
 * @param {array} coordinates
 * @param {boolean} isPublic
 */
EventModel.prototype.generateLocationActivity = function (userId, eventId, coordinates, isPublic = true) {
	try {
		const activity = {
			activityDate: new Date().toISOString(),
			isPublic: isPublic,
			actor: activityModel.generateObject("user", userId),
			app: "ecosystem",
			geometry: {
				coordinates: coordinates,
				type: "Point"
			},
			target: {
				id: eventId,
				type: "event"
			},
			summary: `Target observed at longitude ${_.round(coordinates[0], 4)}, latitude ${_.round(
				coordinates[1],
				4
			)}`,
			type: "manual-location",
			to: [
				{
					email: false,
					isPriority: true,
					pushNotification: false,
					system: true,
					token: "auth-users:true"
				}
			]
		};

		activityModel.queueActivity(activity);
		return { success: true };
	} catch (err) {
		logger.error("generateLocationActivity", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * internalActiveByType - created specifically for associating a unit-status-change activity with the current active gate_runner event
 *   included some flexibility in case used elsewhere or if behavior changes for status change
 * -- INTERNAL USE ONLY - DO NOT EXPOSE VIA PUBLIC API --
 * @param {eventType} eventType
 * @param {integer} limit
 * @param {boolean} includeAdditionalProps
 */
EventModel.prototype.internalActiveByType = async function (eventType, limit = -1, includeAdditionalProps) {
	try {
		let q = r
			.table(EVENT_TABLE)
			.filter(
				r.and(
					r.row("type").eq(eventType),
					r.row("isDeleted").eq(false),
					r.row("disabled").default(false).eq(false),
					r.row("isTemplate").default(false).eq(false),
					r.row("isActive").eq(true)
				)
			);

		if (includeAdditionalProps) {
			q = q.merge((event) => {
				return r
					.table(EXTERNAL_ENTITY_MAPPING_TABLE)
					.filter({
						targetId: event("id")
					})(0)
					.default({})
					.pluck("sourceId", "additionalProperties");
			});
		}

		q = q.orderBy(r.desc("createdDate"));

		if (limit != -1) {
			q = q.limit(parseInt(limit));
		}

		const result = await q.run();
		return result;
	} catch (err) {
		logger.error("internalActiveByType", "Unexpected error", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};
