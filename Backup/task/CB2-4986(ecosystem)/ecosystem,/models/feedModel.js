"use strict";
const FEED_ENTITIES_TABLE = "sys_feedEntities";
const FEED_TYPES_TABLE = "sys_feedTypes";
const ENTITY_TYPE_TABLE = "sys_entityType";
const EVENT_FEED_CACHE_TABLE = "sys_eventFeedCache";
const USER_INTEGRATION_TABLE = "sys_userIntegration";
const ORG_INTEGRATION_TABLE = "sys_orgIntegration";
const USER_TABLE = "sys_user";
const EXTERNAL_ENTITY_MAPPING_TABLE = "sys_externalEntityMapping";

const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/feedModel.js");
const uuidv4 = require("uuid/v4");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const _global = require("../app-global.js");
const userModel = require("./userModel.js")({});
const feedTypeCache = {};
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/feedEntities.json"));
const entityTypeCache = require("../lib/entityTypeCache");
const ChangefeedPIPFilter = require("../lib/changefeedPIPFilter");
const userPolicyCache = new (require("../lib/userPolicyCache"));
const feedStream = new (require("../lib/feedStream"));
const {
	authExclusionFilter
} = require("../lib/authExclusionFilter.js");
const _ = require("lodash");

module.exports = FeedModel;

function FeedModel(options) {
	if (!(this instanceof FeedModel)) return new FeedModel(options);
	this.options = options;
	try {
		const feeds = this.getAllFeedTypes();
		for (let i = 0; i < feeds.length; i++) {
			const feed = feeds[i];
			feedTypeCache[feed.feedId] = feed;
		}
	} catch (reason) {
		throw new Error(reason);
	}
}

setTimeout(function () {
}, 30000);

// -- todo - add feed sharing


// --------------------------- HELPER FUNCTIONS ---------------------------

/**
 * Helper function to select nested object properties by string, properties separated by underscore
 * @param: obj -- the object you'd like to grab properties from
 * @param: path -- the path you'd like to follow, a string with properties separated by underscores ("entityData_properties_callsign")
 */
const getNestedPropertyByPath = (obj, path) => {
	// Array of property names
	const array = path.split("_");
	// While array has length and obj is not null, 
	// set object equal to property that matches first item in array then remove first item
	while (array.length && obj && (obj = obj[array.shift()]));
	return obj;
};

/**
 *  Helper function to create nested properties in an object
 * @param: obj -- the object you'd like to add a nested property to
 * @param: path -- the path you'd like to create, a string with properties separated by underscores ("entityData_properties_callsign")
 * @param: value -- the value you'd like to set to the last property in the path param
 */
const assignPropertyByPath = (obj, path, value) => {
	const keys = path.split("_");
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);

	lastObj[lastKey] = value;
};

/**
 *  Helper function to compare specific properties from new_val and old_val on a change, and return if those specific properties changed
 *  @param: change -- rethinkDB changefeed response. ({type: "change", new_val: {...}, old_val: {...}})
 *  @param: propertiesArray -- an array of strings. Each string is a property path separated by underscores. ("entityData_properties_callsign")
 */
const compareProps = (change, propertiesArray) => {
	let update = false;

	propertiesArray.forEach(path => {
		// If an update has not been found already, check for updates
		if (!update) {
			const newVal = getNestedPropertyByPath(change.new_val, path);
			const oldVal = getNestedPropertyByPath(change.old_val, path);

			// If comparing arrays or objects, use deep equals
			// Otherwise, use default equality checks
			update = Array.isArray(newVal) || typeof newVal === "object"
				? !_.isEqual(newVal, oldVal)
				: newVal !== oldVal;
		}
	});

	return update;
};

/**
 *  Helper function to create a response based on an object and an array of property paths
 *  @param: obj -- the object you'd like to grab values from
 *  @param: propertiesArray -- an array of strings. Each string is a property path separated by underscores. ("entityData_properties_callsign")
 *
 *  How it works: For each item in the properties array, finds the value in the obj param that corresponds to that path, and assigns it to 
 *  a new object, following the same path. Then returns the new object.
 *  Basically, allows you to take an object and pare it down to only the properties you want. 
 */
const createResponse = (obj, propertiesArray) => {
	const object = {};

	propertiesArray.forEach(path => {
		assignPropertyByPath(object, path, getNestedPropertyByPath(obj, path));
	});

	// We always want an id
	obj.id ? object.id = obj.id : null;

	return object;
};

// --------------------------- Methods ---------------------------

FeedModel.prototype.getUserPolicyCache = function () {
	return userPolicyCache.getAllCachedData();
};

FeedModel.prototype.create = async function (feed) {
	const self = this;
	try {
		const result = await r.table(FEED_TYPES_TABLE).insert(feed).run();

		return result;

	} catch (err) {
		return err;
	}
};


FeedModel.prototype.getEntityUpsertOps = function (
	feedId,
	id,
	entity,
	acquisitionTime = new Date(),
	latencyTimestamps = null
) {

	const feedType = feedTypeCache[feedId];
	if (!feedType) {
		throw { "success": false, "reason": "could not find feed type for feed id " + feedId };
	}

	const ent = {
		"id": id || feedId + "." + entity.properties.sourceId,
		"sourceId": entity.properties.sourceId,
		"feedId": feedId, // source
		"appId": feedType.appId,
		"ownerOrg": feedType.ownerOrg,
		"entityType": feedType.entityType,
		"entityData": entity,
		"timestamp": new Date(),
		"acquisitionTime": acquisitionTime,
		"isPublic": true,
		"isActive": true
	};

	// Add pre upsert timestamp
	if (latencyTimestamps) {
		ent.latencyTimestamps = latencyTimestamps;
	}

	if (!entity.properties.iconType) ent.entityData.properties.iconType = entity.properties.type;
	// -- geometry is reserved property, should always be geojson format
	// -- currently wrong format on client so not setting to Geometry type for now.
	//if(op.entityData.geometry) {
	//    op.entityData.geometry = r.geojson(op.entityData.geometry);
	//}

	try {

		// Validate data against schema, throw AJV error on callback if present
		// todo: don't really want want validation overhead here. Only our system should be writing to this
		// really tempted to just move into integration app or maybe make a separte process that picks up directly off NATS rather that via rest
		// if(!validate(ent)) {
		// 	return bluebird.resolve(validate.errors).then(() => {
		// 		callback({ "message": "Validation Error", "err": validate.errors});
		// 	});
		// }

		const insertOp = r.table(FEED_ENTITIES_TABLE)
			.insert(ent, { conflict: "update", "durability": "soft", returnChanges: false });

		const updateCacheOp = r.table(EVENT_FEED_CACHE_TABLE)
			.getAll(ent.id, { "index": "entityId" })
			.update({ "inScope": true, "lastUpdated": new Date() }, { "durability": "soft" });

		return [insertOp, updateCacheOp];
	} catch (err) {
		logger.error("getEntityUpsertOps", "Unexpected exception", { entity: ent, err: JSON.stringify(err) }, SYSTEM_CODES.UNSPECIFIED);
		throw err;
	}

};

// -- support sending cached archive tracks along with current
// -- will need to address impact to global changefeed as well
FeedModel.prototype.upsertEntity = async function (
	feedId,
	id,
	entity,
	acquisitionTime = new Date(),
	latencyTimestamps = null
) {
	try {
		const ops = this.getEntityUpsertOps(feedId, id, entity, acquisitionTime, latencyTimestamps);
		const result = await r
			.expr(ops)
			.run();

		logger.info("upsertEntity", "Feed entity upsert success", { entity: entity, result: result }, SYSTEM_CODES.RETHINKDB);

		return { success: true };
	} catch (err) {
		logger.error(
			"upsertEntity",
			"Unexpected exception attempting to upsert a feedEntity",
			{ entity: entity, errMessage: err.message, errStack: err.stack },
			provider.isReqlError(err) ? SYSTEM_CODES.RETHINKDB : SYSTEM_CODES.UNSPECIFIED
		);
		throw err;
	}

};


/**
 * This supports case where you are publishing bulk realtime unique tracks
 * @param entities
 */
FeedModel.prototype.bulkUpsertEntities = async function (entities) {

	try {
		const ops = entities.map((ent) => {
			return this.getEntityUpsertOps(ent.feedId, ent.id, ent.entity, ent.acquisitionTime, ent.latencyTimestamps);
		});
		const result = await r
			.expr(ops)
			.run();

		logger.info("bulkUpsertEntities", "Feed entity upsert success", { result: result }, SYSTEM_CODES.RETHINKDB);

		return { success: true };
	} catch (err) {
		logger.error(
			"bulkUpsertEntities",
			"Unexpected exception",
			{ errMessage: err.message, errStack: err.stack },
			provider.isReqlError(err) ? SYSTEM_CODES.RETHINKDB : SYSTEM_CODES.UNSPECIFIED
		);
		throw err;
	}

};

FeedModel.prototype.getDisplayNameByEntity = async function (entity) {
	const properties = entity && entity.entityData ? entity.entityData.properties : {};
	const feedType = userPolicyCache.getFeedType(entity.feedId);
	if (feedType && feedType.labels) {
		return getDisplayName(entity, feedType);
	} else if (properties && properties.name) {
		return properties.name;
	} else {
		return "";
	}
};

const getDisplayName = (entity, feedType) => {
	const nameFallbacks = feedType.labels.displayName;

	// Check fallbacks one by one and order and return first prefix+value present.
	for (let i = 0; i < nameFallbacks.length; i++) {
		if (entity.entityData.properties[nameFallbacks[i].property]) {
			return nameFallbacks[i].prefix + entity.entityData.properties[nameFallbacks[i].property];
		}
	}
};


/**
 * streamGlobalFeed: stream a feed globally, using a system based changefeed (one changefeed per feed, as opposed to one per user per feed)
 * This method can stream both internal and external feeds. 
 * 
 * @param intId - integrationId for the user (userId + _ + feedId)
 * @param userId - user's id
 * @param orgId - user's organization id
 * @param sessionId - A unique id pertaining to the user's current session, to ensure one user using the app in multiple places still gets all data
 * @param inclusionGeo - optional geojson polygon to filter by region
 * @param handler - callback function used to send batches of changes to the user
 */
// TODO: 
// 3. Ensure stream works for all permission types
FeedModel.prototype.streamGlobalFeed = async function (
	feedId,
	userId,
	orgId,
	sessionId,
	additionalFilters,
	inclusionGeo,
	expandRefs,
	ignoreBatches,
	excludeEntities,
	handler
) {
	try {
		const feedType = await r.table(FEED_TYPES_TABLE)
			.filter(
				r.and(
					r.row("feedId").eq(feedId),
					r.row.hasFields("ownerOrg")
				)
			)
			.merge((row) => {
				return r.table(ENTITY_TYPE_TABLE)
					.filter((et) => {
						return et("name").eq(row("entityType"));
					})(0);
			})(0).default(null)
			.run();

		// -- Not sure if the mergeRef is set properly
		// -- but it also looks like expandedRefs is
		// -- never actually used so I can't confirm - CD
		const entityTypeRefs = feedType.refProperties;
		const mergeRefs = [];
		if (expandRefs && entityTypeRefs) {
			// -- lookup entityTypeInfo for each ref(FK) property
			for (const ref of entityTypeRefs) {
				const refEntType = await r.table(ENTITY_TYPE_TABLE)
					.filter({ "name": ref.entityType })(0).default(null)
					.run();
				if (refEntType) {
					const refObj = { "new_val": {} };
					//refObj.new_val[ref.name] = r.table(refEntType.sourceTable).get(change("new_val")(ref.name));
					const mergeRef = (change) => {
						return r.branch(
							change.hasFields({ "new_val": ref.name }).and(change("new_val")(ref.name).ne(null)),
							{ "new_val": r.object(ref.name, r.table(refEntType.sourceTable).get(change("new_val")(ref.name))) },
							{}
						);
					};
					mergeRefs.push(mergeRef);
				}
			}
		}

		const pipFilter = inclusionGeo ? new ChangefeedPIPFilter(inclusionGeo) : null;
		if (pipFilter) {
			if (!additionalFilters) additionalFilters = {};
			additionalFilters = { ...additionalFilters, ...{ pipFilter: pipFilter } };
		}

		// Check if user is authorized to stream
		const authorized = userPolicyCache.authorizeFeedAccess(userId, feedId);
		logger.info("streamGlobalFeed", "authorizing feed acess", { userId: userId, feedId: feedId, authorized: authorized });
		let registered;
		// If not authorized, bail
		if (!authorized) {
			const name = userPolicyCache.getName(userId);
			const e = { message: "User " + name + " unauthorized access to feed: " + feedId };
			console.log("Authorization Error:", e);
			throw e;
		}
		// If event authorized, register and set event filter flag
		else if (authorized === "event") {
			registered = userPolicyCache.registerUser(userId, feedId, sessionId, handler, true, additionalFilters);
		}
		// Otherwise, register user normally
		else {
			registered = userPolicyCache.registerUser(userId, feedId, sessionId, handler, false, additionalFilters);
		}

		// If the user failed to register, bail
		if (!registered) {
			const name = userPolicyCache.getName(userId);
			const e = { message: "User " + name + " failed to register to feed: " + feedId };
			console.log("Registration Error:", e);
			throw e;
		}

		// ------------------- User successfully registered, so send initial batch -----------------------------

		// Start stream, if needed. Will handle sending changes once initial batch is done.
		feedStream.streamFeed(feedId, feedType.sourceTable, feedType.source);

		// Queue up changes user will miss while getting initial batch
		feedStream.addUserToChangesQueue(userId, feedId, pipFilter, ignoreBatches, additionalFilters);

		let query = r.table(feedType.sourceTable)
			.filter(
				r.and(
					r.row("feedId").eq(feedId),
					// r.row.hasFields({"entityData": {"geometry": true}}), // This was preventing events from being returned if they were yet to be placed on the map
					r.branch(r.row.hasFields("isActive"),
						r.row("isActive").default(false).eq(true),
						r.row.hasFields("isDeleted"),
						r.row("isDeleted").default(true).eq(false),
						r.row.hasFields("deleted"),
						r.row("deleted").default(false).eq(false),
						true
					),
					r.or(
						r.row.hasFields("inScope").not(),
						r.row("inScope").eq(true)
					),
					r.or(
						r.row.hasFields("parentEntity").not(),
						r.row("parentEntity").eq(null)
					),
					r.or(
						r.row.hasFields("targetId").not(),
						r.row("targetId").eq(null)
					)
				)
			)
			.merge(function (row) {
				return {
					entityData: { properties: { id: row("id") } },
					isOwner: row("ownerOrg").eq(orgId)
				};
			});

		// Filter out excluded entities, if any
		if (excludeEntities) {
			query = query.filter((row) => {
				return r.branch(
					row.hasFields("id"),
					r.expr(excludeEntities).contains(row("id")).not(),
					true
				);
			});
		}

		// -- add any refs that need to be expanded
		for (const mergeRef of mergeRefs) {
			query = query.merge(mergeRef);
		}

		let initialEnts = await query.run();
		// If event policy, filter initial batch
		initialEnts = initialEnts.filter(entity => {
			if (pipFilter)
				return userPolicyCache.authorizeEntity(userId, entity) && (pipFilter.filter({ new_val: entity }) !== null);
			else
				return userPolicyCache.authorizeEntity(userId, entity);
		});


		if (additionalFilters && additionalFilters.eventId) {
			logger.info("streamGlobalFeed", "Event feed initial filter", { additionalFilters: additionalFilters });
			initialEnts = initialEnts.filter(entity => {
				return userPolicyCache.isPinnedToEvent(additionalFilters.eventId, entity.id);
			});
		}

		// Batching properties
		const streamProperties = feedType.streamProperties;
		const initialBatches = {};

		if (ignoreBatches) {
			if (!initialBatches["all-data"]) initialBatches["all-data"] = [];
			initialEnts.forEach(ent => {
				const change = { type: "initial", new_val: ent };
				initialBatches["all-data"].push(change);
			});
		}
		else {
			// Format entity, push to initial batches for user
			initialEnts.forEach(ent => {
				const obj = { type: "initial", new_val: ent };
				if (!obj.new_val.entityData.properties.name && !obj.new_val.name) {
					obj.new_val.entityData.properties.name = getDisplayName(obj.new_val, feedType);
				}

				streamProperties.forEach(streamProp => {
					const batchType = streamProp.batch;

					if (!initialBatches[batchType]) initialBatches[batchType] = [];

					initialBatches[batchType].push({
						type: obj.type,
						new_val: createResponse(obj.new_val, streamProp.properties.initial)
					});
				});
			});
		}

		// Send across all initial batches, including queued changes while initial batch is processing
		Object.keys(initialBatches).forEach(key => {
			const initialBatch = initialBatches[key];
			const queuedBatch = feedStream.getQueuedChanges(userId, feedId, key);

			const combinedChanges = initialBatch.concat(queuedBatch);
			logger.info("streamGlobalFeed", "Sending initial batch", { changes: combinedChanges });
			handler(null, { "batch": key, "changes": combinedChanges });
			initialBatches[key] = [];
		});

		// Missed initial changes have been sent, remove user from queue
		feedStream.removeUserFromChangesQueue(userId, feedId);

		// A curried function to bind the correct arguments to removeRegisteredUser to call on a disconnect event
		const curriedRemoveRegisteredUser = () => {
			return userPolicyCache.removeRegisteredUser(userId, feedId, sessionId);
		};

		return curriedRemoveRegisteredUser;
	}
	catch (err) {
		console.log("Error:", err);
		throw err;
	}
};


/**
 * streamFeed -  stream external feeds ("tracks") to a user with filtering, giving them their own changefeed connections
 * -- This is only used in specific scenarios, when inclusionGeo or ignoreBatches need to be used. For general, global streaming,
 * -- we use streamGlobalFeed to connect a user to a system-based changefeed to keep connections down.
 * @param intId - the integrationId (feedId)
 * @param userId - for authorization
 * @param orgId - for authorization
 * @param inclusionGeo - optional geojson polygon to filter by region
 * @param ignoreBatches - optional boolean, defaults to false. If true, stream will return entire document, ignoring batch types.
 * @param handler - callback to pass matching tracks to
 */
FeedModel.prototype.streamFeed = async function (
	intId,
	userId,
	orgId,
	inclusionGeo,
	expandRefs,
	ignoreBatches,
	sessionId,
	handler) {

	return await this.streamGlobalFeed(
		intId,
		userId,
		orgId,
		sessionId,
		null, // additionalFilters - currently eventId for eventFeed
		inclusionGeo,
		expandRefs,
		ignoreBatches,
		null,	// excludeEntities
		handler
	);

};

FeedModel.prototype.getFeedTypeById = async function (feedId) {
	try {
		const feedType = await r.table(FEED_TYPES_TABLE)
			.filter({ "feedId": feedId })
			.run();
		return feedType[0];
	} catch (err) {
		return err;
	}
};

FeedModel.prototype.getFeedEntityById = async function (entityId) {
	try {
		const result = await r.table(FEED_ENTITIES_TABLE)
			.get(entityId)
			.run();
		return result;
	} catch (err) {
		return err;
	}
};

FeedModel.prototype.getEntityTypeByFeedId = async function (feedId) {
	try {
		const entityType = await r.table(FEED_TYPES_TABLE)
			.filter(
				r.row("feedId").eq(feedId)
			)
			.merge((row) => {
				return r.table(ENTITY_TYPE_TABLE)
					.filter((et) => {
						return et("name").eq(row("entityType"));
					})(0);
			})(0)
			.run();
		return entityType;
	} catch (err) {
		logger.error("streamGlobalFeed", "Unexpected error", { feedId: feedId, errMessage: err.message, errStack: err.stack });
		throw { message: "FeedModel.getEntityTypeByFeedId exception: " + err.message, code: 500 };
	}
};

/**
 * getAll
 * @param feedId
 */
FeedModel.prototype.getAll = async function (orgId) {

	try {

		const result = await r.table(ORG_INTEGRATION_TABLE)
			.filter({ "orgId": orgId })
			.map((orgInt) => {
				return {
					orgIntId: orgInt("id"),
					intId: orgInt("intId"),
					config: orgInt("config"),
					feedOwnerOrg: orgInt("feedOwnerOrg"),
					orgId: orgInt("orgId"),
					policy: orgInt("policy")
				};
			})
			.merge((orgInt) => {
				return r.table(FEED_TYPES_TABLE)
					.filter({ "feedId": orgInt("intId") })(0).default({});
			})
			.run();
		return result;
	} catch (err) {
		throw { message: "FeedModel.getAll exception: " + err.message, code: 500 };
	}

};

/**
 * getAllFeedTypes
 */
FeedModel.prototype.getAllFeedTypes = async function () {
	try {
		const result = await r.table(FEED_TYPES_TABLE)
			.run();
		return result;
	} catch (err) {
		throw { message: "FeedModel.getAll exception: " + err.message, code: 500 };
	}

};

/**
 * getUserFeedEntitiesByType
 * @param type - the entity type to search - types should be system wide but are yet undefined, using just track at moment
 * @param userId - id of user to determine what feeds results will be returned for
 */
FeedModel.prototype.getUserFeedEntityListByType = async function (userId, type) {
	try {
		// get user integrations as input to query
		const userProfile = await userModel.getProfile(userId);
		const feedIds = userProfile.user.integrations.map(function (feed) {
			return feed.feedId;
		});

		const ents = await r.table(FEED_ENTITIES_TABLE)
			.filter(authExclusionFilter(userId))
			.filter(
				entity => r.expr(feedIds).contains(entity("feedId"))
					.and(entity("entityType").eq(type))
			)
			.map(function (row) {
				return {
					"id": row("id"),
					//  "name": row("entityData")("friendlyName")
					"name": row("entityData")("properties")("name").default(row("id"))
				};
			})
			.run();
		return ents;
	} catch (err) {
		return err;
	}
};


/**
 * getFeedProfile
 * @param feedId
 */
FeedModel.prototype.getFeedProfile = async function (feedId) {
	try {
		const result = await r.table(FEED_TYPES_TABLE)
			.filter({ "feedId": feedId })
			.limit(1)
			.without("isShareable", "metadata")
			.merge(function (feed) {
				return {
					users: r.table(USER_INTEGRATION_TABLE)
						.filter({ intId: feed("feedId") })
						.eqJoin("userId", r.table(USER_TABLE))
						.without([{ left: ["id", "intId", "lastModifiedDate", "userId"] },
							{ right: ["id", "contact", "password", "lastModifiedDate"] }])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			.run();
		return result;
	} catch (err) {
		return err;
	}

};

/**
 * getFeedProfile
 * @param feedId
 */
FeedModel.prototype.getFeedOrgProfile = async function (feedId, orgId) {
	try {
		const result = await r.table(FEED_TYPES_TABLE)
			.filter({ "feedId": feedId })
			.limit(1)
			.without("isShareable", "metadata")
			.merge(function (feed) {
				return {
					users: r.table(USER_INTEGRATION_TABLE)
						.filter({ intId: feed("feedId") })
						.eqJoin("userId", r.table(USER_TABLE))
						.filter({ "right": { "orgId": orgId } })
						.without([{ left: ["id", "intId", "lastModifiedDate", "userId"] },
							{ right: ["contact", "password", "lastModifiedDate"] }])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			.run();
		return result;
	} catch (err) {
		return err;
	}

};

/**
 * getFeedAuthorizedUsers  - get a list of users who have access to a particular feed
 *                           simply users that have been assigned access to the feed
 * @param feedId
 */
FeedModel.prototype.getFeedAuthorizedUsers = async function (feedId) {
	try {
		const result = await r.table(USER_INTEGRATION_TABLE)
			.filter({ "intId": feedId })
			.map(function (userInt) { return userInt("userId"); })
			.distinct()
			.run();
		return result;
	} catch (err) {
		return err;
	}

};

/**
 * getShareProfile  - get a list of orgs who have access to a particular feed
 *                           
 * @param feedId
 */

FeedModel.prototype.getShareProfile = async function (feedId) {
	try {
		const result = await r.table(USER_TABLE)
			.filter({ "intId": feedId })
			.distinct()
			.run();
		return result;
	} catch (err) {
		return err;
	}
};

FeedModel.prototype.getEntityTypes = async function () {
	return await r.table(ENTITY_TYPE_TABLE).run();
};

/**
* streamUserIntegration -  stream internal feeds (cameras, shapes, etc) to a user with filtering, giving them their own changefeed connections
* -- This is only used in specific scenarios, when inclusionGeo, ignoreBatches, or excludeEntities need to be used. For general, global streaming,
* -- we use streamGlobalFeed to connect a user to a system-based changefeed to keep connections down.
* @param intId -- Integration id
* @param userId -- user's id
* @param orgId -- organization's id
* @param inclusionGeo -- Geo coordinates used to test if an entitiy exists within their boundaries
* @param ignoreBatches -- Ignore sys_feedTypes batch types and stream all entities back fully
* @param excludeEntities -- An array of entityIds to ignore when streaming, used for preventing camera streaming in their own FOVs
*/
FeedModel.prototype.streamUserIntegration = async function (intId, userId, orgId, inclusionGeo, expandRefs, ignoreBatches, excludeEntities, sessionId, handler) {
	return await this.streamGlobalFeed(intId, userId, orgId, sessionId, null, inclusionGeo, expandRefs, ignoreBatches, excludeEntities, handler);
};


/**
* @param userId
* @param eventId 
* @param entityType
* @param handler
*/
FeedModel.prototype.eventEntitiesFeed = async function (userId, eventId, entityType, handler) {
	const userProfile = await userModel.getProfile(userId);
	const feedIds = userProfile.user.integrations.filter(function (feed) {
		return !entityType ? true : entityType === feed.entityType;
	})
		.map((feed) => feed.feedId);

	const sessionId = uuidv4();

	const cancelFunctions = await Promise.all(
		feedIds.map(async function (feedId) {
			logger.info("eventFeed", `Subscribing to feed ${feedId}`, { feedId: feedId });
			try {
				return await this.streamGlobalFeed(
					feedId,
					userId,
					userProfile.user.orgId,
					sessionId,
					{ eventId: eventId },
					null,
					false,
					false,
					null,
					function (err, record) {
						if (err) {
							logger.error("eventEntitiesFeed", "Publish change unexpected error", { errMessage: err.message, errStack: err.stack });
						}
						logger.info("eventEntitiesFeed", "Publish change", { change: record });
						handler(null, record);
					}
				);
			}
			catch (err) {
				logger.error("eventEntitiesFeed", "Unexpected error", { errMessage: err.message, errStack: err.stack });
			}
		}.bind(this))
	);

	const cancelAll = function () {
		for (const cancelFunc of cancelFunctions) {
			try {
				cancelFunc();
			}
			catch (err) {
				logger.error("eventEntitiesFeed", "Error cancelling subscriptions", { errMessage: err.message, errStack: err.stack });
			}
		}
	};

	return cancelAll;

};

// -- TODO: REFACTOR: move to logic/feed.js and fix all references
FeedModel.prototype.getEntityWithAuthorizationUseFeedId = async function (userId, entityId, feedId) {

	try {

		const remote = _global.ecoLinkManager.getRemoteFromId(entityId);
		// if no proxy then it's local
		// if local then strip @@ and get local
		if (remote && remote.proxy) {
			// TODO: split feedId in remote???
			return await remote.proxy.getEntityWithAuthorizationUseFeedId(userId, remote.id, feedId.split("@@")[0]);
		}
		else if (remote) {
			entityId = remote.id;
			feedId = feedId.split("@@")[0];
		}


		const localFeedId = feedId.includes("@@") ? feedId.split("@@")[0] : feedId;
		const feedType = await r.table(FEED_TYPES_TABLE)
			.filter(r.row("feedId").eq(localFeedId))(0)
			.default(null);

		if (feedType) {
			return this.getEntityWithAuthorization(userId, entityId, feedType.entityType);
		}
		else {
			throw { message: `Invalid feedId ${feedId}`, code: 500 };
		}
	}
	catch (ex) {
		throw (ex);
	}
};

// -- TODO: REFACTOR: move to logic/feed.js and fix all references
FeedModel.prototype.getEntity = async function (entityId, entityType) {
	try {
		if (entityType === "activity") {
			logger.error("getEntity", "Get Activity not supported", { activityId: entityId });
			return null;
		}

		const remote = _global.ecoLinkManager.getRemoteFromId(entityId);
		if (remote && remote.proxy) {
			return await remote.proxy.getEntity(remote.id, entityType);
		}
		else if (remote) {
			entityId = remote.id;
		}

		// -- improve naming here
		const et = await r.table(ENTITY_TYPE_TABLE)
			.filter(r.row("name").eq(entityType))(0)
			.default(null);

		if (!et) {
			throw { err: { message: "Invalid entity type", code: 404 } };
		}

		//  TODO: This previously had a case where userId === system then return the entity. Wherever that is being used it needs to be modified to use internal routes
		const result = await r.table(et.sourceTable)
			.filter({ "id": entityId })
			.merge(ent => {
				return {
					additionalProperties: r
						.table(EXTERNAL_ENTITY_MAPPING_TABLE)
						.filter({
							targetId: ent("id")
						})(0)
						.default({})
						.pluck("additionalProperties")("additionalProperties")
						.default({})
				};
			});
		const entity = result && result.length > 0 ? result[0] : null;
		if (!entity) {
			return null;
		}

		//if the entity is a list attached to an entity, we need to check the permissions of the entity NOT the list
		if (entityType === "list" && entity.targetId && entity.targetType) {
			const listCheck = await this.getEntity(entity.targetId, entity.targetType.toLowerCase());
			if (listCheck) {
				return entity;
			} else {
				return null;
			}
		}

		return entity;

	}
	catch (err) {
		logger.error("getEntity", "Unexpected Error", { "errMessage": err.message, errStack: err.stack }, SYSTEM_CODES.UNSPECIFIED);
		throw err;
	}

};

// -- TODO: REFACTOR: move to logic/feed.js and fix all references
FeedModel.prototype.getEntityWithAuthorization = async function (userId, entityId, entityType, permission = null) {

	const remote = _global.ecoLinkManager.getRemoteFromId(entityId);
	if (remote && remote.proxy) {
		return await remote.proxy.getEntityWithAuthorization(userId, remote.id, entityType, permission);
	}
	else if (remote) {
		entityId = remote.id;
	}

	try {
		const entity = await this.getEntity(entityId, entityType);
		if (!entity) {
			logger.error("getEntityWithAuthorization", "Entity not found.", { entityType, entityId });
			return null;
		}

		return userPolicyCache.authorizeEntity(userId, entity, permission) ? entity : null;
	}
	catch (err) {
		logger.error("getEntityWithAuthorization", "Error retrieving entity.", { entityType, entityId, err });
		return false;
	}
};

// -- INTERNAL USE ONLY - DO NOT CREATE PUBLIC INTERFACE
FeedModel.prototype.getFeedEntitiesInternal = async function (feedId, entityIds) {

	try {
		const feedType = await r.table(FEED_TYPES_TABLE)
			.filter(r.row("feedId").eq(feedId))(0)
			.merge((feedType) => {
				return r.table(ENTITY_TYPE_TABLE)
					.filter({ "name": feedType("entityType") })(0).default({});
			})
			.default(null);

		if (feedType) {
			const entities = await r.table(feedType.sourceTable)
				.filter((ent) => {
					return r.expr(entityIds).contains(ent("id"));
				});

			return entities;
		}
		else {
			throw { message: `Invalid feedId ${feedId}`, code: 500 };
		}
	}
	catch (ex) {
		throw (ex);
	}
};


// todo: ENTITY_AUTH might make entityIds optional in getEntitiesByTypeWithAuthorization and combine this with that method because should just be the option entityIds Array
FeedModel.prototype.getEntitiesWithAuthorization = async function (userId, entityIds, entityType, authExclude = true, permission = userPolicyCache.feedPermissionTypes.view) {

	try {
		// -- improve naming here
		const et = await r.table(ENTITY_TYPE_TABLE)
			.filter(r.row("name").eq(entityType))(0)
			.default(null);

		if (!et) {
			throw { err: { message: "Invalid entity type", code: 404 } };
		}

		//  TODO: This previously had a case where userId === system then return the entity. Wherever that is being used it needs to be modified to use internal routes
		let entityQuery = r.table(et.sourceTable);
		entityQuery = authExclude ? entityQuery.filter(authExclusionFilter(userId)) : entityQuery;
		entityQuery = entityQuery.filter(function (row) {
			return r.expr(entityIds).contains(row("id"));
		});

		const result = await entityQuery.run();
		const entities = result && result.length > 0 ? result : null;
		if (!entities) {
			return [];
		}

		//if the entity is a list attached to an entity, we need to check the permissions of the entity NOT the list
		const resultList = [];
		for (const entity of entities) {
			if (entityType === "list" && entity.targetId && entity.targetType) {
				const listCheck = await this.getEntityWithAuthorization(userId, entity.targetId, entity.targetType.toLowerCase(), permission);
				if (listCheck) {
					resultList.push(entity);
				} else {
					return null;
				}
			}
			else {
				if (userPolicyCache.authorizeEntity(userId, entity)) {
					resultList.push(entity);
				}
			}
		}

		return resultList;

	}
	catch (ex) {
		console.dir(ex);
		return false;
	}
};

/**
 * queryUserFeedEntities
 * @param query - substring to search by
 * @param userId - id of user to determine what feeds results will be returned for
 */
FeedModel.prototype.queryUserFeedEntities = async function (substringMatch, idsOnly, userId, permission = null) {
	try {
		// This method requires that we resolve display name prior to filtering thus the filter is not executed in rethink
		// Todo: need to eliminate need for display name resolution, resolve in transformer. this was previously an issue in AIS due to split messages but
		//       with introduction of REDIS for keeping current entity state this should no longer be an issue.
		const filteredResult = [];
		const result = await this.getEntitiesByTypeWithAuthorization(userId, "track", true, permission, true);
		for (const ent of result) {
			const name = await this.getDisplayNameByEntity(ent);
			ent.entityData.properties.name = name;
			if (!substringMatch || substringMatch === "") {
				filteredResult.push(ent);
			}
			else {
				if (name && name.toLowerCase().includes(substringMatch.toLowerCase())) {
					filteredResult.push(ent);
				}
			}
		}

		const filteredEnts = filteredResult.map(ent => {
			return {
				id: ent.id,
				entityType: ent.entityType,
				feedId: ent.feedId,
				entityData: { ...ent.entityData }
			};
		});
		return idsOnly ? filteredEnts.map(ent => ent.id) : filteredEnts;
	} catch (err) {
		console.log(err.message, err.stack);
		throw err;
	}
};

// TODO: ENT_AUTH AVOID SUPPORTING ACTIVITIES AND LISTS HERE BUT MAY HAVE TO
FeedModel.prototype.getEntitiesByTypeWithAuthorization = async function (
	userId,
	entityType,
	authExclude = true,
	permission = null,
	includeDetails = false,
	filter = null,
	limit = null,
	expandRefs = false,
	includeAddlProps = true
) {
	try {
		const et = entityTypeCache[entityType];
		if (!et) {
			throw { err: { message: "Invalid entity type", code: 404 } };
		}

		let userIntegrationsForType = [];
		if (["collection", "event"].includes(entityType)) {
			// -- check user app permissions for these unique integrations
			const appId = entityType === "collection" ? "map-app" : "events-app";
			const appPermissions = userPolicyCache._getUserAppPermission(userId, appId);
			if (appPermissions && appPermissions.config.canView) {
				userIntegrationsForType.push({ feedId: entityType, policy: { type: "owner" } });
			}
		}
		else {
			// -- need to only return feeds with proper if permission matches
			// - can retrieve from userPolicyCache
			userIntegrationsForType = userPolicyCache.getUserIntegrationsByEntityType(userId, entityType, permission)
				.filter((int) => !int.isRemote);
			logger.info("getEntitiesByTypeWithAuthorization", "User integrations for type", { userIntegrationsForType: userIntegrationsForType });
		}

		// user has no integrations for the type specified
		if (userIntegrationsForType.length === 0) return [];


		// -- all entity tables will have an index on feedId
		// -- the filter expression needs to come from event cache pinned items to active events user has access to
		// -- could also just run whatever is returned through auth filter
		let resultList = [];
		for (const userIntegration of userIntegrationsForType) {
			let q = r.table(et.sourceTable);
			// -- feedId does not apply to collections and events

			if (!["collection", "event"].includes(userIntegration.feedId)) {
				q = q.getAll(userIntegration.feedId, { "index": "feedId" });
			}


			// Filter out explicitly deleted entities
			q = q.filter(r.row.hasFields("isDeleted").not().or(r.row("isDeleted").eq(false)));
			// -- exclude ref entities
			q = q.filter(r.row.hasFields("parentEntity").not());
			// Exclude results that user explicitly wanted excluded
			if (authExclude) q = q.filter(authExclusionFilter(userId));
			// Event policy - get all entity ids of ents pinned to events user has access to and only return those for feed
			if (userIntegration.policy.type === "event") {
				const eventPolicyEntIds = userPolicyCache.getEventPolicyFeed(userId, userIntegration.feedId);
				q = q.filter((ent) => {
					return r.expr(eventPolicyEntIds).contains(ent("id"));
				});
			}
			// merge reference fields. I.e. camera fov is shape
			const entityTypeRefs = et.refProperties;
			if (expandRefs && entityTypeRefs) {
				// -- lookup entityTypeInfo for each ref(FK) property
				for (const ref of entityTypeRefs) {
					const refEntType = await r.table(ENTITY_TYPE_TABLE)
						.filter({ "name": ref.entityType })(0).default(null)
						.run();
					if (refEntType) {
						const mergeRef = (ent) => {
							return r.branch(
								ent.hasFields(ref.name).and(ent(ref.name).ne(null)),
								r.object(ref.name, r.table(refEntType.sourceTable).get(ent(ref.name))),
								{}
							);
						};
						q = q.merge(mergeRef);
					}
				}
			}
			// arbitrary filter from caller. Filter could include refs so this is applied post expansion
			if (filter) q = q.filter(filter);
			if (limit) q = q.limit(limit);

			if (includeAddlProps) {
				q = q.merge(ent => {
					return {
						additionalProperties: r
							.table(EXTERNAL_ENTITY_MAPPING_TABLE)
							.filter({
								targetId: ent("id")
							})(0)
							.default({})
							.pluck("additionalProperties")("additionalProperties")
							.default({})
					};
				});
			}

			if (!includeDetails) {
				q = q.map(function (row) {
					return {
						"id": row("id"),
						//  "name": row("entityData")("friendlyName")
						"name": row("entityData")("properties")("name").default(row("id"))	// *** Not sure what exactly this is returning, but this format won't let us call the GetDisplayName() function
					};
				});
			}
			else {
				q = q.without("userInt");
			}

			const result = await q.run();
			resultList = [...resultList, ...(result.constructor === Array ? result : [])];
		}

		return resultList;

	}
	catch (ex) {
		console.dir(ex);
		return false;
	}
};


FeedModel.prototype.getFeedEntitiesWithAuthorizationById = async function (userId, entityIds) {
	try {

		const feedTypes = [];
		const result = await r.table(FEED_ENTITIES_TABLE)
			.filter(authExclusionFilter(userId))
			.filter(function (row) {
				return r.expr(entityIds).contains(row("id"));
			});


		// Grab feed types for adding name
		for (let i = 0; i < result.length; i++) {
			const feedEnt = result[i];
			if (userPolicyCache.authorizeEntity(userId, feedEnt)) {

				// Don't add duplicates
				if (feedTypes.map(item => item.feedId).includes(feedEnt.feedId)) {
					continue;
				}

				const ft = await r.table(FEED_TYPES_TABLE)
					.filter(function (row) {
						return row("feedId").eq(feedEnt.feedId);
					})(0)
					.run();

				feedTypes.push(ft);
			}
		}

		// Add name based on fallbacks
		result.map(feedEnt => {
			const entFeedType = feedTypes.find(item => {
				return item.feedId === feedEnt.feedId;
			});

			if (!feedEnt.entityData.properties.name) {
				feedEnt.entityData.properties.name = getDisplayName(feedEnt, entFeedType);
			}

			return feedEnt;
		});

		return result;
	}
	catch (ex) {
		logger.error("getFeedEntitiesWithAuthorizationById", { "err": ex }, SYSTEM_CODES.UNSPECIFIED);
		throw ex;
	}
};

// TODO: ENT_AUTH this will not use rethink changefeed anymore rather global we need only a single listener with a handler for each user/session
// -- also rather than just authorize once it will be authorized every update piped to user which will be fast and secure
FeedModel.prototype.streamEntityWithAuthorization = async function (userId, entityId, entityType, handler) {
	try {
		// Check to see if entityType is valid
		const dbEntityType = await r.table(ENTITY_TYPE_TABLE)
			.filter(r.row("name").eq(entityType))(0)
			.default(null);

		// If entityType is not valid, throw error
		if (!dbEntityType) {
			throw { err: { message: "Invalid entity type", code: 404 } };
		}

		// Run the data through getEntityWithAuthorization to ensure the user is authorized to view
		// the data this stream will provide. This will bubble up errors for userId or entityType.
		const userAuthorized = await this.getEntityWithAuthorization(userId, entityId, entityType);

		// If user is not authorized and no other errors, throw this
		if (!userAuthorized) {
			throw { err: { message: "User is not authorized to stream this entity", code: 401 } };
		} else {
			// Start stream
			const q = r.table(dbEntityType.sourceTable)
				.filter({ "id": entityId })
				.filter((entity) => {
					return (
						// If any of these are true:
						r.or(
							// 1.) Entity does not have a deleted field and an isDeleted field.
							//       This occurs on tracks, as they do not have either field.
							r.and(
								entity.hasFields("deleted").not(),
								entity.hasFields("isDeleted").not()
							),
							// 2.) The "isDeleted" field is false
							entity("isDeleted").eq(false),
							// 3.) The "deleted" field is false
							entity("deleted").eq(false)
						)
					);
				})
				.changes({ "includeInitial": true, "includeTypes": true })
				// Before sending the change across, if the data on the entity has an 'owner' field, 
				// grab the owner's name and append it to the entity object for display purposes 
				.merge((row) => {
					return r.branch(
						row.hasFields({ "new_val": { "owner": true } }),
						{ new_val: { ownerName: r.table(USER_TABLE).get(row("new_val")("owner")).pluck("name")("name") } },
						{}
					);
				})
				.merge((row) => {
					return {
						new_val: {
							additionalProperties: r.table(EXTERNAL_ENTITY_MAPPING_TABLE)
								.filter({
									"targetId": row("new_val")("id")
								})(0)
								.default({})
								.pluck("additionalProperties")("additionalProperties")
								.default({})
						}
					};
				});

			// If asking

			const onFeedItem = async function (change) {
				if (change && change.new_val && change.new_val.entityData && change.new_val.entityData.properties && !change.new_val.entityData.properties.name) {
					change.new_val.entityData.properties.name = await this.getDisplayNameByEntity(change.new_val);
				}
				handler(null, change);
			}.bind(this);

			const onError = (err) => {
				console.log("feedModel.streamEntityWithAuthorization changefeed error", err);
				handler(err, null);
			};

			const cancelFn = provider.processChangefeed("feedModel.streamEntityWithAuthorization", q, onFeedItem, onError);
			return cancelFn;

		}
	}
	catch (ex) {
		return ex;
	}
};


// TODO: ENT_AUTH remove this and combine with previous method having optional prop/val as object
FeedModel.prototype.streamEntityByPropertyWithAuthorization = async function (userId, property, value, entityType, handler) {
	try {
		const self = this;

		// Check to see if entityType is valid
		const dbEntityType = await r.table(ENTITY_TYPE_TABLE)
			.filter(r.row("name").eq(entityType))(0)
			.default(null);

		// If entityType is not valid, throw error
		if (!dbEntityType) {
			throw { err: { message: "Invalid entity type", code: 404 } };
		}

		const entity = await r.table(dbEntityType.sourceTable)
			.filter({
				"entityData": {
					"properties": {
						[property]: value
					}
				}
			})(0)
			.run();

		if (entity) {

			// Run the data through getEntityWithAuthorization to ensure the user is authorized to view
			// the data this stream will provide. This will bubble up errors for userId or entityType.
			const userAuthorized = await this.getEntityWithAuthorization(userId, entity.id, entityType);

			// If user is not authorized and no other errors, throw this
			if (!userAuthorized) {
				throw { err: { message: "User is not authorized to stream this entity", code: 401 } };
			} else {
				const q = r.table(dbEntityType.sourceTable)
					.filter({ "id": entity.id })
					.filter((entity) => {
						return (
							r.or(
								r.and(
									entity.hasFields("deleted").not(),
									entity.hasFields("isDeleted").not()
								),
								entity("isDeleted").eq(false),
								entity("deleted").eq(false)
							)
						);
					})
					.changes({ "includeInitial": true, "includeTypes": true });

				const onFeedItem = async function (change) {
					if (!change.new_val.entityData.properties.name) {
						change.new_val.entityData.properties.name = await self.getDisplayNameByEntity(change.new_val);
					}
					handler(null, change);
				};

				const onError = (err) => {
					console.log("feedModel.streamEntityByPropertyWithAuthorization changefeed error", err);
					handler(err, null);
				};

				const cancelFn = provider.processChangefeed("feedModel.streamEntityByPropertyWithAuthorization", q, onFeedItem, onError);
				return cancelFn;
			}
		}
		else {
			throw { err: { message: "No entity found", code: 404 } };
		}
	}
	catch (ex) {
		logger.error("streamEntityByPropertyWithAuthorization", "Unexpected exception attempting to stream a feedEntity via property", { err: JSON.stringify(ex) }, SYSTEM_CODES.UNSPECIFIED);
		return ex;
	}
};

// -- NOW
// -- View, Contribute implied if you are assigned access to the feed the entity belongs to
// -- Manage|Control|? Would be specified in userIntegration in a string array so just need to check if array includes permission
// -- Entity.sharedWith I think is unique to types where entities can be shared explictly and individually with org (need to confirm) Events and Status Cards
FeedModel.prototype.authorizeEntity = async function (userId, entityId, entityType, permission = null) {

	try {
		return this.getEntityWithAuthorization(userId, entityId, entityType, permission);
	}
	catch (ex) {
		console.dir(ex);
		throw ex;
	}

};

/**
 * getSnapshot  - retrieve all active feed entities to be included in snapshot
 */
// -- INTERNAL USE ONLY - DO NOT EXPOSE VIA PUBLIC API
FeedModel.prototype.getSnapshot = async function () {
	try {
		const result = await r.table(FEED_ENTITIES_TABLE)
			.filter(
				r.row("isActive").default(true).eq(true)
			);
		return result;
	}
	catch (err) {
		logger.error("getSnapshot", "Unexpected exception attempting to get feedEntities snapshot", { errMessage: err.message, errStack: err.stack }, SYSTEM_CODES.UNSPECIFIED);
		throw err;
	}
};
