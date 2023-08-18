"use strict";
const EXTERNAL_ENTITY_MAPPING_TABLE = "sys_externalEntityMapping";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const feedModel = require("../models/feedModel")();
const userModel = require("../models/userModel")();
const activityModel = require("../models/activityModel")();
const shapeModel = require("../models/shapeModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/entityModel.js");
const linkedEntitiesModel = require("../models/linkedEntitiesModel")();
const userPolicyCache = new (require("../lib/userPolicyCache"));

module.exports = EntityModel;


function EntityModel(options) {
	if (!(this instanceof EntityModel)) return new EntityModel(options);
	const self = this;
	self.options = options;
}

EntityModel.prototype.addComment = async function (
	userId,
	orgId,
	entityId,
	entityType,
	comment,
	translations) {
	try {

		// -- THIS NEEDS TO BE ADDED TO AUTHROIZATION METHODS
		// -- auth for "contribute" is:
		//    -- Entity not deleted
		//    -- user is owner and event is private
		//    -- isPublic user in owner org and user canContribute own
		//    -- isPublic is shared with user org and user canContribute shared
		const entity = await feedModel.getEntityWithAuthorization(userId, entityId, entityType, userPolicyCache.feedPermissionTypes.contribute);
		console.dir(entity);
		if (entity) {
			const activity = {
				"summary": "",
				"type": "comment",
				"actor": activityModel.generateObject("user", userId),
				"object": {
					"message": comment,
					"type": "comment"
				},
				"target": activityModel.generateObject(entityType, entity.id, entity.entityData.properties.name, entity.feedId),
				"to": [{
					"token": "auth-users:true",
					"system": true,
					"email": false,
					"pushNotification": true
				}]
			};

			activity.summary = `${activity.actor.name} ${translations.summary.commentedOn} ${entity.entityData.properties.name}`;
			activityModel.queueActivity(activity);

			return {
				"success": true
			};
		} else {
			return {
				"success": false
			};
		}
	}
	catch (ex) {
		console.log("EntityModel add comment exception:", ex);
		throw ex;
	}
};

/**
 * Query all linkable items via a search term, searching against displayProperties, if they exist, and falling back to name
 * @param {string} userId -- User's id
 * @param {string} query -- query string used to search
 * @param {number} pageSize -- number of entities you'd like to send back
 */
EntityModel.prototype.queryLinkable = async function (
	userId,
	entityId,
	entityType,
	query,
	pageSize
) {
	try {
		// Remove all whitespace
		const regex = /([^\s]+)/g;

		console.log("queryLinkable", entityId, entityType);

		// Array of search terms
		const queries = query.match(regex);

		const userProfile = await userModel.getProfile(userId);
		const feedIds = userProfile.user.integrations
			.filter(feed => feed.config.canView)
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
		const linkedCameraRelations = await linkedEntitiesModel.getByEntityIdWithoutAuth(entityId, "");
		const filterRecursively = (entities, queryStrings) => {
			// If there are no more queries to filter, return the entities that are left
			if (!queryStrings.length) {
				return entities;
			}

			const query = queryStrings[0].toLowerCase();

			// Filter entities based on current query string
			const filtered = entities.filter(ent => {
				const properties = ent.entityData.properties;

				const linkedEntityIds = linkedCameraRelations.reduce((a, b) => {
					const temp = b.entities.filter(entity => entity.id !== entityId).map(entity => entity.id);
					return [...a, ...temp];
				}, []);


				// Check name for match and bail early
				if (properties.name && properties.name.toLowerCase().includes(query)) {
					if (!linkedEntityIds.length) {
						return true;
					} else {
						return !linkedEntityIds.includes(ent.id);
					}
				}

				// If entity has alternate display properties, filter by them
				if (displayProperties[ent.feedId]) {
					const propertyArr = Object.keys(displayProperties[ent.feedId]);

					for (const prop of propertyArr) {
						if (properties[prop]) {
							if (properties[prop].toString().toLowerCase().includes(query)) {
								if (!linkedEntityIds.length) {
									return true;
								} else {
									return !linkedEntityIds.includes(ent.id);
								}
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
			queryAndFilter(feedModel.getEntitiesByTypeWithAuthorization, [userId, "facility", true, null, true]),
			queryAndFilter(shapeModel.getAll, [userId, userPolicyCache.feedPermissionTypes.contribute])
		]);
		const filterResult = [...values[0], ...values[1], ...values[2]];
		const result = filterResult.slice(0, pageSize);

		return { success: true, result: result };
	} catch (err) {
		logger.error(
			"queryLinkable",
			"An error occurred while querying pinnable items",
			{ err: { message: err.message, stack: err.stack } }
		);
		throw err;
	}
};

/**
 * Get all published events/cameras logged in external system containing specified entity
 * @param {string} entityId
 */
EntityModel.prototype.getExternalPublishedEntityMappings = async function (entityId, entityType) {
	try {
		const targetField = entityType == "event" ? "entities" : "fovs";
		const result = await r
			.table(EXTERNAL_ENTITY_MAPPING_TABLE)
			.filter({ "targetType": entityType })
			.filter(
				r.row("additionalProperties")(targetField).hasFields(entityId)
			)
			.filter(
				r.row("additionalProperties")(targetField)(entityId)("deletedOn").eq(null)
			);

		return result;

	} catch (error) {
		logger.error(
			"entityModel",
			"An error occurred while attempting to query externalEntityMapping by the entity's ID",
			{ err: error }
		);
		throw error;
	}
};

/**
 * Get all published events logged in external system containing specified camera as fov
 * @param {string} cameraId
 */
/* EntityModel.prototype.getExternalFovCameraMapping = async function (cameraId) {
	try {
		const result = await r
			.table(EXTERNAL_ENTITY_MAPPING_TABLE)
			.filter({ "targetType" : "event" })
			.filter(
				r.row("additionalProperties").hasFields("deletedOn").not()
					.or(
						r.row("additionalProperties")("deletedOn").eq(null)
					)
			)
			.filter(
				r.row("additionalProperties")("fovCameras").contains(cameraId)
			);
			
		return result;
			
	} catch (error) {
		logger.error(
			"entityModel",
			"An error occurred while attempting to query externalEntityMapping by the camera's ID",
			{ err: error }
		);
		throw error;
	}
}; */
