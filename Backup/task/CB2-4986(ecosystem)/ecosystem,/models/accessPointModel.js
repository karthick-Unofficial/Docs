"use strict";
const ACCESS_POINT_TABLE = "sys_accessPoints";
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/accessPointModel.js");
const feedModel = require("../models/feedModel")();
const activityModel = require("../models/activityModel")();
const userPolicyCache = new (require("../lib/userPolicyCache"));
const _global = require("../app-global.js");
const diff = require("deep-diff").diff;
const userModel = require("../models/userModel")();
const {
	authExclusionChangefeedFilter
} = require("../lib/authExclusionFilter.js");
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/accessPoints.json"));
const uuidv4 = require("uuid/v4");

module.exports = AccessPointModel;

function AccessPointModel(options) {
	if (!(this instanceof AccessPointModel)) return new AccessPointModel(options);
	this.options = options;
}

/**
 * Get all access points for a user
 * @param {string} userId
 */
AccessPointModel.prototype.getAll = async function (userId) {

	try {
		return await feedModel.getEntitiesByTypeWithAuthorization(userId, "accessPoint", true, null, true);
	} catch (e) {
		logger.error("getlAll access points", "There was an error while getting all access points", {
			err: { message: e.message, stack: e.stack }
		});
	}
};

/**
 * Get an access point by its id
 * @param {string} userId
 * @param {string} accessPointId
 */
AccessPointModel.prototype.getById = async function (userId, accessPointId) {
	try {
		return await feedModel.getEntityWithAuthorization(userId, accessPointId, "accessPoint", userPolicyCache.feedPermissionTypes.view);
	} catch (e) {
		logger.error("getById", "There was an error while getting an access point by id", {
			err: { message: e.message, stack: e.stack }
		});
	}
};

/**
 * Get an access point by its source id
 * @param {string} userId
 * @param {string} sourceId
 */
AccessPointModel.prototype.getBySourceId = async function (userId, sourceId) {
	try {
		const accessPoints = await r.table(ACCESS_POINT_TABLE).filter((accessPoint) => {
			return r.and(
				accessPoint.hasFields("sourceId"),
				accessPoint("sourceId").eq(sourceId)
			);
		});

		// We're going to assume there is only 1 matching access point
		if (accessPoints.length === 1) {
			const authorized = await feedModel.authorizeEntity(userId, accessPoints[0].id, "accessPoint", userPolicyCache.feedPermissionTypes.view);
			if (!authorized) {
				throw { err: { "message": "User is not authorized to view accessPoint", "code": 401 } };
			}
			else {
				return accessPoints[0];
			}
		}
		else {
			throw { err: { "message": "More than one access point found matching source id.", "code": 500 } };
		}
	} catch (e) {
		logger.error("getBySourceId", "There was an error while getting an access point by its source id", {
			err: { message: e.message, stack: e.stack }
		});
		throw e;
	}
};

/**
 * Update an access point
 * @param {string} userId 
 * @param {string} accessPointId 
 * @param {object} accessPoint 
 * @param {object} translations 
 */
AccessPointModel.prototype.update = async function (userId, accessPointId, accessPoint, translations) {

	const authorized = await feedModel.authorizeEntity(userId, accessPointId, "accessPoint", userPolicyCache.feedPermissionTypes.manage);
	if (!authorized) {
		throw { err: { "message": "User is not authorized to edit accessPoint", "code": 401 } };
	}

	const op = {
		entityData: accessPoint,
		lastModifiedBy: userId,
		lastModifiedDate: new Date()
	};

	try {
		const updateResult = await r
			.table(ACCESS_POINT_TABLE)
			.get(accessPointId)
			.update(op, { returnChanges: true })
			.run();

		const oldVal = updateResult.changes[0].old_val;
		const newVal = updateResult.changes[0].new_val;

		const entityDiff = diff(
			oldVal.entityData,
			newVal.entityData
		);
		const entityChanges = [];
		let geoChanged = false;

		if (entityDiff) {
			entityDiff.forEach(d => {
				if (d.path[0] === "geometry") {
					if (!geoChanged) {
						geoChanged = true;
						entityChanges.push({
							kind: "E",
							property: "geometry",
							lhs: oldVal.entityData.geometry,
							rhs: newVal.entityData.geometry
						});
					}
				} else {
					entityChanges.push({
						kind: d.kind,
						property: d.path.join("."),
						lhs: d.lhs,
						rhs: d.rhs
					});
				}
			});
		}

		if (_global.globalChangefeed) {
			if (updateResult && updateResult.changes[0]) {
				const change = {
					new_val: updateResult.changes[0].new_val,
					old_val: updateResult.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const accessPointName = newVal.entityData.properties ? newVal.entityData.properties.name || newVal.entityData.properties.sourceName : "UNKNOWN";
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"accessPoint",
				accessPointId,
				accessPointName,
				"accessPoints"
			),
			detail: {
				changes: entityChanges
			},
			to: [{
				token: `user:${userId}`,
				system: true,
				email: false,
				pushNotification: false
			}]
		};

		activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		return updateResult;
	} catch (ex) {
		logger.error(
			"update",
			"Error updating accessPoint",
			{ err: { message: ex.message, code: ex.code, stack: "/models/accessPointModel.js" } }
		);
		throw ex;
	}
};

/**
 * Stream all accessPoints a user has access to that are associated with a specific display entity (such as accessPoints on a facility floor plan)
 * @param {string} userId 
 * @param {string} displayType 
 * @param {string} displayTargetId 
 * @param {function} handler 
 */
AccessPointModel.prototype.streamAccessPointsByDisplayEntity = async (userId, displayType, displayTargetId, handler) => {
	try {
		// Permissions
		const userProfile = await userModel.getProfile(userId);
		const { integrations } = userProfile.user;
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
		const q = r.table(ACCESS_POINT_TABLE)
			.filter((accessPoint) => {
				return r.and(
					accessPoint.hasFields("entityData"),
					accessPoint("entityData")("displayType").default(null).eq(displayType),
					accessPoint("entityData")("displayTargetId").default(null).eq(displayTargetId)
				);
			})
			.filter((accessPoint) => {

				const int = r.expr(integrations).filter(function (integration) {
					return integration("intId").eq(accessPoint("feedId"));
				})(0).default(null);

				return r.and(
					int,
					int("config")("canView").eq(true)
				);
			})
			.changes({ includeInitial: true, includeTypes: true })
			.filter(authExclusionChangefeedFilter(userId));

		const onFeedItem = (change) => {
			batch.push(change);
		};
		const onError = (ex) => {
			logger.error(
				"onError",
				"AccessPointModel.streamAccessPointsByDisplayEntity changefeed error",
				{ err: { message: ex.message, code: ex.code, stack: "/models/accessPointModel.js" } }
			);
			handler(ex, null);
		};

		const cancelFn = provider.processChangefeed("AccessPointModel.getAll", q, onFeedItem, onError);
		return cancelFn;
	}
	catch (ex) {
		logger.error(
			"streamAccessPointsByDisplayEntity",
			"Error streaming camera by display entity",
			{ err: { message: ex.message, code: ex.code, stack: "/models/accessPointModel.js" } }
		);
		throw ex;
	}
};

/**
 * Remove accessPoints tied to a display target
 * @param {string} userId 
 * @param {string} accessPointId 
 * @param {string} displayTargetId
 */
AccessPointModel.prototype.removeAccessPointByIdFromDisplayTarget = async function (userId, accessPointId, displayTargetId) {
	try {
		const accessPoint = await feedModel.getEntityWithAuthorization(userId, accessPointId, "accessPoint", userPolicyCache.feedPermissionTypes.manage);
		if (!accessPoint) {
			throw { err: { "message": "User is not authorized to view accessPoint", "code": 401 } };
		}
		await r.table(ACCESS_POINT_TABLE)
			.filter(
				r.and(
					r.row("id").eq(accessPointId),
					r.row("entityData")("displayTargetId").default("").eq(displayTargetId)
				)
			)
			.replace(
				r.row.without({ entityData: { displayTargetId: true, displayType: true } })
			).run();
	}
	catch (ex) {
		logger.error(
			"removeAccessPointByIdFromDisplayTarget",
			"Error removing accessPoints from display target.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/accessPointModel.js" } }
		);
		throw ex;
	}
};

/**
 * Create new access point
 * @param {string} userId
 * @param {string} orgId
 * @param {object} accessPoint
 */
AccessPointModel.prototype.create = async function (userId, orgId, accessPoint) {
	try {
		accessPoint.owner = userId;
		accessPoint.ownerOrg = orgId;
		accessPoint.isPublic = false;
		accessPoint.sharedWith = [];

		if (!validate(accessPoint)) {
			throw { message: "User is not authorized to create accessPoint", code: 403 };
		}
		accessPoint.createdDate = new Date();
		accessPoint.lastModifiedDate = new Date();
		accessPoint.isDeleted = false;
		accessPoint.id = uuidv4();
		accessPoint.entityData.properties.id = accessPoint.id;

		const result = await r.table(ACCESS_POINT_TABLE)
			.insert(accessPoint, { returnChanges: true })
			.run();
		const activity = {
			"summary": "",
			"type": "created",
			"actor": activityModel.generateObject("user", userId),
			"target": activityModel.generateObject("accessPoint", accessPoint.id, accessPoint.name),
			"to": [{
				"token": `organization:${orgId}`,
				"system": true,
				"email": false,
				"pushNotification": false
			}]
		};

		activity.summary = `${activity.target.name} created.`;
		activityModel.queueActivity(activity);

		return { success: true, result: result.changes[0].new_val };
	}
	catch (err) {
		logger.error(
			"create",
			"There was an error while creating access point",
			{ err: { message: err.message, stack: err.stack } }
		);
	}
};


/**
 * get snapShots of access points 
 */
AccessPointModel.prototype.getSnapshot = async function () {
	try {
		const result = await r
			.table(ACCESS_POINT_TABLE)
			.filter(
				r.row("isDeleted").default(false).eq(false),
			);

		return result;

	} catch (err) {
		logger.error(
			"getSnapshot",
			"An unexpected error occurred",
			{ errMessage: err.message, errStack: err.stack }
		);
		throw err;
	}
};