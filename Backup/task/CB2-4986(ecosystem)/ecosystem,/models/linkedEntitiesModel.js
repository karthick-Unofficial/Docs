"use strict";
const LINKED_ENTITIES_TABLE = "sys_linkedEntities";
const ENTITY_TYPE_TABLE = "sys_entityType";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const entityTypeCache = require("../lib/entityTypeCache");
const feedModel = require("../models/feedModel")();
const activityModel = require("../models/activityModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validateLinkedEntity = ajv.compile(require("./schema/linkedEntities.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/linkedEntitiesModel.js");
const userPolicyCache = new (require("../lib/userPolicyCache"));

module.exports = LinkedEntitiesModel;

function LinkedEntitiesModel(options) {
	if (!(this instanceof LinkedEntitiesModel)) return new LinkedEntitiesModel();
	const self = this;
	self.options = options;
}

/**
 * Create a linkedEntities entry
 * @param {string} userId 
 * @param {object} linkedEntities 
 */
LinkedEntitiesModel.prototype.create = async function (userId, linkedEntities, translations) {
	try {
		const authorized = await checkEntitiesAuth(userId, linkedEntities.entities, userPolicyCache.feedPermissionTypes.contribute);
		if (authorized) {
			// Build linkedEntity object
			const op = {
				"created": new Date(),
				"createdBy": userId,
				"type": linkedEntities.type,
				"entities": linkedEntities.entities
			};

			// Validate vs schema
			if (!validateLinkedEntity(op)) {
				throw { "message": "Linked Entities failed schema validation", code: validateLinkedEntity.errors };
			}

			const result = await r.table(LINKED_ENTITIES_TABLE)
				.insert(op, { returnChanges: true })
				.run();

			const activity = {
				summary: "",
				type: "created",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"linkedEntities",
					result.changes[0].new_val.id,
					result.changes[0].new_val.id
				),
				to: []
			};

			activity.summary = `${activity.actor.name} ${translations.created} ${activity.object.name}.`;
			activityModel.queueActivity(activity);
			mockUpdate(linkedEntities.entities);
			return { success: true, result: result.changes[0].new_val };
		}
		else {
			throw { "message": "User does not have access to all of the entities", code: 401 };
		}
	}
	catch (ex) {
		logger.error(
			"create",
			"Error creating linkedEntities object",
			{ err: { message: ex.message, code: ex.code, stack: "/models/linkedEntitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update a linkedEntities entry
 * @param {string} userId 
 * @param {string} linkedEntitiesId 
 * @param {object} update 
 */
LinkedEntitiesModel.prototype.update = async function (userId, linkedEntitiesId, update, translations) {
	try {
		const newAuthorized = await checkEntitiesAuth(userId, update.entities, userPolicyCache.feedPermissionTypes.contribute);
		if (newAuthorized) {
			const linkedEntity = await r.table(LINKED_ENTITIES_TABLE).get(linkedEntitiesId).run();
			const oldAuthorize = await checkEntitiesAuth(userId, linkedEntity.entities, userPolicyCache.feedPermissionTypes.contribute);
			if (oldAuthorize) {
				const result = await r.table(LINKED_ENTITIES_TABLE)
					.get(linkedEntitiesId)
					.update(update, { returnChanges: true })
					.run();

				const activity = {
					summary: "",
					type: "updated",
					actor: activityModel.generateObject("user", userId),
					object: activityModel.generateObject(
						"linkedEntities",
						result.changes[0].new_val.id,
						result.changes[0].new_val.id
					),
					to: []
				};

				activity.summary = `${activity.actor.name} ${translations.updated} ${activity.target.name}`;
				activityModel.queueActivity(activity);
				mockUpdate(update.entities);
				return { success: true, result: result };
			} else {
				throw { "message": "User does not have access to all of the previously linked entities", code: 401 };
			}
		} else {
			throw { "message": "User does not have access to all of the newly linked entities", code: 401 };
		}

	}
	catch (ex) {
		logger.error(
			"update",
			"Error updating linkedEntities",
			{ err: { message: ex.message, code: ex.code, stack: "/models/linkedEntitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Set a flag on a linkedEntities entry to mark it as deleted
 * @param {string} userId 
 * @param {string} linkedEntitiesId 
 */
LinkedEntitiesModel.prototype.delete = async function (userId, entities, linkType, translations) {
	try {
		const authorize = await checkEntitiesAuth(userId, entities, userPolicyCache.feedPermissionTypes.contribute);

		if (authorize) {
			let linkedEntities = null;
			if (linkType) {
				linkedEntities = await r.table(LINKED_ENTITIES_TABLE).filter(r.row("type").eq(linkType));
			} else {
				linkedEntities = await r.table(LINKED_ENTITIES_TABLE);
			}
			const linkedEntitiesForDeletionIds = linkedEntities.filter(link => {
				if (link.entities.length === entities.length) {
					const linkEntitiesIds = link.entities.reduce((a, b) => [...a, b.id], []);
					let returnValue = true;
					entities.some(entity => {
						if (!linkEntitiesIds.includes(entity.id)) {
							returnValue = false;
							return true;
						}
					});
					return returnValue;
				}
				return false;
			}).map(link => link.id);
			const result = await r.table(LINKED_ENTITIES_TABLE)
				.getAll(r.args(linkedEntitiesForDeletionIds))
				.delete({ returnChanges: true })
				.run();

			const activity = {
				summary: "",
				type: "deleted",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"linkedEntities",
					result.changes[0].old_val.id,
					result.changes[0].old_val.id
				),
				to: []
			};

			activity.summary = `${activity.actor.name} ${translations.deleted} ${activity.object.name}`;
			activityModel.queueActivity(activity);
			mockUpdate(entities);
			return { success: true, result: result };
		} else {
			throw { "message": "User does not have contribute access to all of the linked entities", code: 401 };
		}

	}
	catch (ex) {
		logger.error(
			"delete",
			"Error deleting linkedEntities",
			{ err: { message: ex.message, code: ex.code, stack: "/models/linkedEntitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get linkedEntities by a singular entity ID and linkType
 * @param {string} userId 
 * @param {string} entityId
 * @param {string} entityType
 * @param {string} linkType
 */
LinkedEntitiesModel.prototype.getByEntityId = async function (userId, entityId, entityType, linkType, permission = userPolicyCache.feedPermissionTypes.view) {
	try {
		const filter = linkType ? r.and(r.row("type").eq(linkType), r.row("isDeleted").default(false).eq(false)) : r.row("isDeleted").default(false).eq(false);
		const linkedEntities = await r.table(LINKED_ENTITIES_TABLE).filter(filter);
		const result = [];
		for (let i = 0; i < linkedEntities.length; i++) {
			const entitiesIds = linkedEntities[i].entities.map(entity => entity.id);
			if (entitiesIds.includes(entityId)) {
				for (let j = 0; j < linkedEntities[i].entities.length; j++) {
					let authorized = true;
					if (linkedEntities[i].entities[j].id !== entityId) {
						authorized = await feedModel.getEntityWithAuthorization(userId, linkedEntities[i].entities[j].id, linkedEntities[i].entities[j].type, permission);
						if (!authorized) {
							break;
						} else {
							result.push(linkedEntities[i]);
						}
					}
				}
			}
		}

		return result;

	}
	catch (ex) {
		logger.error(
			"getByEntityId",
			"Error getting linkedEntities",
			{ err: { message: ex.message, code: ex.code, stack: "/models/linkedEntitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get linkedEntities by a singular entity ID and linkType
 * @param {string} entityId
 * @param {string} linkType
 */
LinkedEntitiesModel.prototype.getByEntityIdWithoutAuth = async function (entityId, linkType) {
	try {
		const filter = linkType ? r.and(r.row("type").eq(linkType), r.row("isDeleted").default(false).eq(false)) : r.row("isDeleted").default(false).eq(false);
		const linkedEntities = await r.table(LINKED_ENTITIES_TABLE).filter(filter);
		const result = [];
		for (let i = 0; i < linkedEntities.length; i++) {
			const entitiesIds = linkedEntities[i].entities.map(entity => entity.id);
			if (entitiesIds.includes(entityId)) {
				result.push(linkedEntities[i]);
			}
		}

		return result;
	} catch (error) {
		logger.error(
			"getByEntityIdWithoutAuth",
			"Error getting linkedEntities",
			{ err: { message: error.message, code: error.code, stack: "/models/linkedEntitiesModel.js" } }
		);
		throw error;
	}


};

/**
 * streamLinkedEntities: stream all entities the entity is linked to that the user has access to
 * @param {*} userId
 * @param {*} entityId
 * @param {*} linkType
 * @param {*} handler
 */

LinkedEntitiesModel.prototype.streamLinkedEntities = async (userId, entityId, entityType, linkType, handler) => {

	let linkedCache = [];

	try {
		const authEntity = await feedModel.getEntityWithAuthorization(userId, entityId, entityType, userPolicyCache.feedPermissionTypes.view);
		if (!authEntity) {
			throw { message: `FeedModel.getEntityWithAuthorization entity unauthorized for user id ${userId}`, code: 401 };
		}

		const q = r.table(entityTypeCache[entityType].sourceTable)
			.get(entityId)
			.changes({ "includeInitial": true, "includeTypes": true });

		const getByEntityIdWithoutAuth = async function (entityId, linkType) {
			const filter = linkType ? r.and(r.row("type").eq(linkType), r.row("isDeleted").default(false).eq(false)) : r.row("isDeleted").default(false).eq(false);
			const linkedEntities = await r.table(LINKED_ENTITIES_TABLE).filter(filter);
			const result = [];
			for (let i = 0; i < linkedEntities.length; i++) {
				const entitiesIds = linkedEntities[i].entities.map(entity => entity.id);
				if (entitiesIds.includes(entityId)) {
					result.push(linkedEntities[i]);
				}
			}

			return result;

		};
		const onFeedItem = async function (change) {
			if (change && change.new_val) {
				const linkedEntityRelations = await getByEntityIdWithoutAuth(entityId, linkType);
				let linkedEntities = [];
				linkedEntityRelations.forEach(relation => {
					const temp = relation.entities.filter(entity => entity.id !== entityId).map(entity => entity);
					linkedEntities = [...linkedEntities, ...temp];
				});
				const linkedEntitiesData = [];
				if (linkedEntities.length) {
					for (let i = 0; i < linkedEntities.length; i++) {
						const authLinkedEntity = await feedModel.getEntityWithAuthorization(userId, linkedEntities[i].id, linkedEntities[i].type, userPolicyCache.feedPermissionTypes.view);
						if (authLinkedEntity) {
							authLinkedEntity.linkedWith = entityId;
							linkedEntitiesData.push(authLinkedEntity);
						}
					}
				}
				const linkedAdd = linkedEntitiesData.filter(entity => {
					return !linkedCache.some(linked => entity.id === linked.id);
				});
				const linkedRemove = linkedCache.filter(entity => {
					return !linkedEntitiesData.some(linked => entity.id === linked.id);
				});

				linkedCache = linkedEntitiesData;


				// Stream entities
				linkedEntitiesData.forEach(entity => {
					if (!linkedAdd.some(linked => entity.id === linked.id) && !linkedRemove.some(linked => entity.id === linked.id)) {
						feedModel.streamEntityWithAuthorization(userId, entity.id, entity.entityType, (err, rec) => {
							if (err) handler(err, null);
							if (rec && rec.new_val) {
								rec.new_val.linkedWith = entityId;
								const changes = {
									new_val: rec.new_val,
									type: rec.type
								};
								handler(null, [changes]);
							} else if (rec && rec.old_val) {
								rec.old_val.linkedWith = entityId;
								const changes = {
									new_val: rec.old_val,
									type: rec.type
								};
								handler(null, [changes]);
							}
						}
						);
					}
				});
				if (linkedAdd.length > 0 || linkedRemove.length > 0) {
					const changes = [];
					if (linkedAdd.length > 0) {
						changes["add"] = linkedAdd;
						linkedAdd.forEach(added => {
							changes.push({
								type: "add",
								new_val: added
							});
						});
					}
					if (linkedRemove.length > 0) {
						linkedRemove.forEach(remove => {
							changes.push({
								type: "remove",
								old_val: remove
							});
						});
					}
					handler(null, changes);
				}
			}
		}.bind(this);

		const onError = (err) => {
			console.log("LinkedEntitiesModel.streamLinkedEntities changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("LinkedEntitiesModel.streamLinkedEntities", q, onFeedItem, onError);
		return cancelFn;
	} catch (error) {
		throw error;
	}
};

const checkEntitiesAuth = async (userId, entities, permission) => {
	for (let i = 0; i < entities.length; i++) {
		const authorized = await feedModel.getEntityWithAuthorization(userId, entities[i].id, entities[i].type, permission);
		if (!authorized) {
			return false;
		}
	}
	return true;
};

const mockUpdate = async (entities) => {
	for (let i = 0; i < entities.length; i++) {
		const et = await r.table(ENTITY_TYPE_TABLE)
			.filter(r.row("name").eq(entities[i].type))(0)
			.default(null);
		if (et) {
			await r
				.table(et.sourceTable)
				.filter({
					id: entities[i].id
				})
				.update(
					{
						lastModifiedDate: new Date()
					},
					{
						returnChanges: true
					}
				)
				.run();
		}

	}

};