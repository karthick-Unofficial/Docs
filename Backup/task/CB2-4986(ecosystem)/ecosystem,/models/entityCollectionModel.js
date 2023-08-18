"use strict";
const ENTITY_COLLECTIONS_TABLE = "sys_entityCollections";

const provider = require("../lib/rethinkdbProvider");
const activityModel = require("../models/activityModel")();
const _ = require("lodash");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/entityCollection.json"));
const feedModel = require("../models/feedModel")();
const userPolicyCache = new (require("../lib/userPolicyCache"));
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/entityCollectionModel.js");

module.exports = EntityCollectionModel;

function EntityCollectionModel(options) {
	if (!(this instanceof EntityCollectionModel))
		return new EntityCollectionModel(options);
	const self = this;
	self.options = options;
}

/**
 * Create a new collection. Also used for copying entities to a new collection.
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} name 
 * @param {array} entities - Array of entity objects {id: string, name: string, entityType: string, feedId: string}
 */
EntityCollectionModel.prototype.create = async function (
	userId,
	orgId,
	name,
	entities,
	translations
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to create entity collections", code: 403 };
		}

		const opTime = new Date().getTime() / 1000;
		const entityIds = entities.map(ent => ent.id);
		const op = {
			owner: userId,
			ownerOrg: orgId,
			entityType: "collection",
			name: name,
			isDeleted: false,
			createdDate: opTime,
			lastModifiedDate: opTime,
			entities: entityIds,
			sharedWith: {}
		};

		if (!validate(op)) {
			throw { message: "Validation Error", err: validate.errors };
		}

		const insertResult = await r
			.table(ENTITY_COLLECTIONS_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		// If successful
		if (insertResult.inserted) {
			const collection = insertResult.changes[0].new_val;

			// todo: ENT_AUTH - none of the entities or access to org authorized
			// -- create an activity for each added entity as object and collection as target

			const activity = {
				summary: "",
				type: "shared",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"collection",
					collection.id,
					collection.name
				),
				detail: {
					added: entityIds
				},
				to: [
					{
						token: "auth-users:true",
						system: true,
						email: false,
						pushNotification: false
					}
				]
			};
			activity.summary = `${activity.actor.name} ${translations.summary.added} ${entityIds.length > 1 ? `${translations.summary.entities}` : `${translations.summary.anEntity}`
			} ${translations.summary.to} ${activity.object.name}`;

			activityModel.queueActivity(activity);

			// Queue activity for each entity added to collection
			for (let i = 0; i < entities.length; i++) {
				const collectionEntity = entities[i];
				const entityActivity = {
					summary: "",
					type: "shared",
					actor: activityModel.generateObject("user", userId),
					target: activityModel.generateObject(
						collectionEntity.entityType,
						collectionEntity.id,
						collectionEntity.name,
						collectionEntity.feedId
					),
					object: activityModel.generateObject(
						"collection",
						collection.id,
						collection.name
					),
					to: [
						{
							token: "auth-users:true",
							system: true,
							email: false,
							pushNotification: false
						}
					]
				};
				entityActivity.summary = `${entityActivity.actor.name} ${translations.summary.added} ${entityActivity.target.name} ${translations.summary.toCollection} ${entityActivity.object.name}`;

				activityModel.queueActivity(entityActivity);
			}
		}

		return insertResult;
	} catch (err) {
		logger.error("create", "There was an error while creating a collection", { err: err });
		throw { message: err, err: err };
	}
};

// -- todo add tags property
EntityCollectionModel.prototype.update = async function (
	userId,
	orgId,
	entityCollectionId,
	name
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to update entity collections", code: 403 };
		}

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");

		const opTime = new Date().getTime() / 1000;
		const op = {
			name: name,
			lastModifiedDate: opTime
		};

		if (collection) {
			const updateResult = await r
				.table(ENTITY_COLLECTIONS_TABLE)
				.get(entityCollectionId)
				.update(op)
				.run();
			console.log("EntityCollectionModel update result:", updateResult);
			return updateResult;
		} else {
			throw {
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			};
		}

	} catch (err) {
		console.log("EntityCollectionModel update error:", err);
		throw err;
	}

};

EntityCollectionModel.prototype.delete = async function (
	userId,
	entityCollectionId
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to delete entity collections", code: 403 };
		}

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");

		const opTime = new Date().getTime() / 1000;
		const op = {
			isDeleted: true,
			lastModifiedDate: opTime
		};
		if (collection) {

			const deleteResult = await r
				.table(ENTITY_COLLECTIONS_TABLE)
				.get(entityCollectionId)
				.update(op)
				.run();

			console.log("EntityCollectionModel delete result:", deleteResult);
			return deleteResult;
			// -- error handling
		} else {
			throw {
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			};

		}

	} catch (err) {
		console.log("EntityCollectionModel delete error:", err);
		throw err;
	}

};

EntityCollectionModel.prototype.restore = async function (
	userId,
	entityCollectionId,
	isDeleted
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to restore entity collections", code: 403 };
		}

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");


		const opTime = new Date().getTime() / 1000;
		const op = {
			isDeleted: isDeleted,
			lastModifiedDate: opTime
		};
		if (collection) {

			const restoreResult = await r
				.table(ENTITY_COLLECTIONS_TABLE)
				.get(entityCollectionId)
				.update(op)
				.run();
			console.log("EntityCollectionModel restore result:", restoreResult);
			return restoreResult;
			// -- error handling
		} else {
			throw {
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			};
		}

	} catch (err) {
		console.log("EntityCollectionModel restore error:", err);
		throw err;
	}

};

EntityCollectionModel.prototype.getById = async function (userId, entityCollectionId) {
	try {

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");

		if (!collection) {
			throw ({
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			});
		}

		return collection;
	} catch (err) {
		throw err;
	}
};

EntityCollectionModel.prototype.getAll = async function (
	userId,
	permission = null
) {
	try {
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "collection", true, permission, true);
		return result;
	}
	catch (err) {
		logger.error(
			"getAll",
			"An error occurred while getting all entity collections",
			{ err: { message: err.message, code: err.code } }
		);
		throw err;
	}
};

EntityCollectionModel.prototype.containsEntity = async (userId, entityId, permission = null) => {
	try {

		const filter = r.row("entities").contains(entityId);
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "collection", true, permission, true, filter);
		return result;
	}
	catch (err) {
		throw { message: err.message, code: 500 };
	}
};

EntityCollectionModel.prototype.streamPinnedItemsByType = async (
	userId,
	collectionId,
	pinnedItemType,
	handler) => {

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

	const entityCheck = await feedModel.getEntityWithAuthorization(userId, collectionId, "collection");
	if (entityCheck) {
		const q = r
			.table(ENTITY_COLLECTIONS_TABLE)
			.get(collectionId)
			.changes({
				includeInitial: true,
				includeTypes: true
			});

		const onFeedItem = async change => {
			// if (change.new_val && change.old_val && !_.isEqual(change.new_val[pinnedItemType + "s"], change.old_val[pinnedItemType + "s"])) {
			if (change.type === "initial" || (change.new_val && change.old_val && !_.isEqual(change.new_val["entities"], change.old_val["entities"]))) {
				const entities = await feedModel.getEntitiesWithAuthorization(userId, change.new_val["entities"], pinnedItemType);
				const entityIdsArray = entities.map(entity => entity.id);
				batch.push({
					type: change.type,
					new_val: {
						entityId: collectionId,
						[pinnedItemType + "s"]: entityIdsArray
					}
				});

				// -- remove old entities
				if (change.type !== "initial") {
					const removeIds = change.old_val["entities"].filter(ent => !change.new_val["entities"].includes(ent));
					const removeEntities = await feedModel.getEntitiesWithAuthorization(userId, removeIds, pinnedItemType);
					const removeEntityIdsArray = removeEntities.map(entity => entity.id);
					if (removeEntityIdsArray.length > 0) {
						batch.push({
							type: "remove",
							old_val: {
								entityId: collectionId,
								[pinnedItemType + "s"]: removeEntityIdsArray
							}
						});
					}
				}

			} else if (change.message && change.code) {
				batch.push(change);
			}
		};

		const onError = err => {
			console.log("entityCollectionModel.streamPinnedItemsByType changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed(
			"entityCollectionModel.streamPinnedItemsByType",
			q,
			onFeedItem,
			onError
		);
		return cancelFn;
	} else {
		return [{
			message: "Collection not found or requester does not have access",
			code: 404
		}];
	}


};

EntityCollectionModel.prototype.streamAll = async (
	appId,
	userId,
	orgId,
	handler) => {
	try {

		const canAccessApp = userPolicyCache.authorizeApplication(userId, "map-app");
		if (!canAccessApp) {
			throw { message: "User is not authorized for map app", code: 403 };
		}


		const changesQuery = r.table(ENTITY_COLLECTIONS_TABLE)
			.filter(
				r
					.row("ownerOrg")
					.eq(orgId)
					.and(r.row("isDeleted").eq(false))
			)
			.merge(function (row) {
				return {
					isOwner: row("owner").eq(userId)
				};
			})
			.merge((doc) => {
				return {
					members: doc("entities").map((entity) => {   // Need to find a way to set properties here from other DB, async doesn't work
						return entity;
					})
				};
			})
			.without("createdDate", "isDeleted", "lastModifiedDate", "owner", "entities")
			.changes({ includeInitial: true, includeTypes: true });

		const onFeedItem = (change) => {
			const entityCollection = change.new_val ? change.new_val : change.old_val;
			if (userPolicyCache.authorizeEntity(userId, entityCollection)) {
				handler(null, change);
			}
		};

		const onError = (err) => {
			console.log("entityCollectionModel.streamAll changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("EntityCollectionModel.streamAll", changesQuery, onFeedItem, onError);
		return cancelFn;

	} catch (err) {
		throw err;
	}
};

EntityCollectionModel.prototype.hasMember = async function (
	entityCollectionId,
	entityId
) {

	try {
		const getResult = await r
			.table(ENTITY_COLLECTIONS_TABLE)
			.filter(
				r
					.row("id")
					.eq(entityCollectionId)
					.and(r.row("entities").contains(entityId))
			)
			.run();
		return getResult.length > 0;
		// -- error handling
	} catch (err) {
		console.log("EntityCollection hasMember error:", err);
		throw err;
	}
};

// TODO: Adding duplicates is a real possibility right now so need to make this method smarter,
// although a dupe won't technically cause problems
/**
 * Add one or more entities to a collection
 * -- This is currently mainly used while adding a single entity to multiple collections
 * -- The only time it is used with multiple entities in the entityIds property is when reverting a removal of multiple
 * -- entities from a collection.
 * @param {string} userId 
 * @param {string} entityCollectionId 
 * @param {array} entityIds -- Array of entity ids (majority of the time, one entity)
 * @param {object || null} entityData -- Object containing {name: string, feedId: string, entityType: string} or null, if you don't want activities generated
 */
EntityCollectionModel.prototype.addMembers = async function (
	userId,
	entityCollectionId,
	entityIds,
	entityData,
	translations
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app")) {
			throw { message: "User is not authorized to add members to entity collections", code: 403 };
		}

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");

		const opTime = new Date().getTime() / 1000;
		const op = {
			entities: r.row("entities").setUnion(entityIds),
			lastModifiedDate: opTime
		};

		if (collection) {
			const updateResult = await r
				.table(ENTITY_COLLECTIONS_TABLE)
				.get(entityCollectionId)
				.update(op, { returnChanges: true })
				.run();

			// If there has actually been an update
			if (
				updateResult.replaced
				&& updateResult.changes[0].new_val.entities.length !== updateResult.changes[0].old_val.entities.length
			) {
				const collection = updateResult.changes[0].new_val;

				const activity = {
					summary: "",
					type: "shared",
					actor: activityModel.generateObject("user", userId),
					object: activityModel.generateObject(
						"collection",
						entityCollectionId,
						collection.name
					),
					detail: {
						added: entityIds
					},
					to: [
						{
							token: "auth-users:true",
							system: true,
							email: false,
							pushNotification: false
						}
					]
				};
				activity.summary = `${activity.actor.name} ${translations.summary.added} ${entityIds.length > 1 ? `${translations.summary.entities}` : ` ${translations.summary.anEntity}`
				} ${translations.summary.to} ${activity.object.name}`;

				// Queue activity the entity added to the collection. This will only be passed when adding a single
				// entity to a collection. If the entityIds argument contains multiple ids, we don't want to generate activities
				// and won't pass entityData, as we only use that for undoing a multi-removal
				if (entityData) {
					const entityActivity = {
						summary: "",
						type: "shared",
						actor: activityModel.generateObject("user", userId),
						target: activityModel.generateObject(
							entityData.entityType,
							entityData.id,
							entityData.name,
							entityData.feedId
						),
						object: activityModel.generateObject(
							"collection",
							collection.id,
							collection.name
						),
						to: [
							{
								token: "auth-users:true",
								system: true,
								email: false,
								pushNotification: false
							}
						]
					};
					entityActivity.summary = `${entityActivity.actor.name} ${translations.summary.added} ${entityActivity.target.name} ${translations.summary.toCollection} ${entityActivity.object.name}`;

					// Queue activity for collection and entity
					activityModel.queueActivity(activity);
					activityModel.queueActivity(entityActivity);
				}
			}

			return updateResult;
		} else {
			throw {
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			};
		}
	} catch (err) {
		console.log("EntityCollectionModel addMembers error:", err);
		throw err;
	}
};

EntityCollectionModel.prototype.removeMembers = async function (
	userId,
	entityCollectionId,
	entityIds,
	translations
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to remove members from entity collections", code: 403 };
		}

		const collection = await feedModel.getEntityWithAuthorization(userId, entityCollectionId, "collection");

		const op = {
			entities: r.row("entities").difference(entityIds),
			lastModifiedDate: new Date()
		};
		if (collection) {
			const updateResult = await r
				.table(ENTITY_COLLECTIONS_TABLE)
				.get(entityCollectionId)
				.update(op, {
					returnChanges: true
				})
				.run();

			// If there has actually been an update
			if (
				updateResult.changes[0].new_val.entities.length !==
				updateResult.changes[0].old_val.entities.length
			) {
				const entity = updateResult.changes[0].new_val;
				const orgs = Object.keys(entity.sharedWith);
				for (let i = 0; i < orgs.length; i++) {
					const activity = {
						summary: "",
						type: "shared",
						actor: activityModel.generateObject("user", userId),
						object: activityModel.generateObject(
							"collection",
							entityCollectionId,
							entity.name
						),
						detail: {
							removed: entityIds
						},
						to: [{
							token: "auth-users:true",
							system: true,
							email: false,
							pushNotification: false
						}]
					};
					activity.summary = `${activity.actor.name} ${translations.summary.removed} ${entityIds.length > 1 ? `${translations.summary.entities}` : `${translations.summary.anEntity}`
					} ${translations.summary.from} ${activity.object.name}`;
					activityModel.queueActivity(activity);
				}
			}

			console.log("EntityCollectionModel removeMembers result:", updateResult);
			return updateResult;
			// -- error handling}
		} else {
			throw {
				err: {
					"message": "Collection not found or requester does not have access",
					"code": 404
				}
			};
		}

	} catch (err) {
		console.log("EntityCollectionModel removeMembers error:", err);
		throw err;
	}

};

/***
*	Get all collections, and add a field that tells whether or not an entity is included in the collection
*	@param userId -- user's ID
*	@param entityId -- entity's ID
*/
EntityCollectionModel.prototype.getAllForPinning = async (userId, orgId, entityId) => {
	try {
		if (!userPolicyCache.authorizeApplication(userId, "map-app", userPolicyCache.appPermissionTypes.manage)) {
			throw "User is not authorized to pin a collection";
		}

		const filter = r
			.row("isDeleted").eq(false)
			.and(r.row("ownerOrg").eq(orgId).default(false));

		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "collection", true, null, true, filter);
		const results = result.map((ec) => {
			const entIsPinned = ec.entities.includes(entityId);
			delete ec.createdDate;
			delete ec.entities;
			delete ec.isDeleted;
			delete ec.lastModifiedDate;
			delete ec.ownerOrg;
			delete ec.sharedWith;
			return { ...ec, ...{ entityPinned: entIsPinned } };
		});

		if (results[0]) {
			return results;
		} else {
			return "No collections found!";
		}
	}
	catch (err) {
		throw err;
	}
};