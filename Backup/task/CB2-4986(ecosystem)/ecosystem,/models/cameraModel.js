"use strict";
const CAMERA_TABLE = "sys_camera";
const CAMERA_SYSTEM_TABLE = "sys_cameraSystem";
const CAMERA_CONTEXT_TABLE = "sys_cameraContextMapping";
const SHAPE_TABLE = "sys_shape";
const FEED_ENTITIES_TABLE = "sys_feedEntities";
const FACILITY_TABLE = "sys_facility";
const EVENT_TABLE = "sys_event";
const LINKED_ENTITIES_TABLE = "sys_linkedEntities";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userPolicyCache = new (require("../lib/userPolicyCache"));
const feedModel = require("../models/feedModel")();
const {
	authExclusionChangefeedFilter
} = require("../lib/authExclusionFilter.js");
const userModel = require("../models/userModel")();
const linkedEntitiesModel = require("../models/linkedEntitiesModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/camera.json"));
const activityModel = require("../models/activityModel")();
const shapeModel = require("../models/shapeModel")();
const diff = require("deep-diff").diff;
const _global = require("../app-global.js");
const entityTypeCache = require("../lib/entityTypeCache");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/cameraModel.js");
const _ = require("lodash");
const { transform } = require("lodash");

module.exports = CameraModel;

function CameraModel(options) {
	if (!(this instanceof CameraModel)) return new CameraModel(options);
	const self = this;
	self.options = options;
}

// TODO: ENTITY_AUTH Maybe treat camera systems like entity collections???
CameraModel.prototype.getCameraSystems = async (userId) => {

	try {
		const result = await r.table(CAMERA_SYSTEM_TABLE)
			.filter(
				r.row.hasFields("isDeleted").not()
					.or(r.row("isDeleted").eq(false))
			);
		return result;
	}
	catch (ex) {
		throw { message: "Unhandled exception in CameraModel.getCameraSystems: " + ex.message, code: 500 };
	}

};

CameraModel.prototype.getCameraSystemById = async (userId, cameraSystemId) => {

	try {
		const result = await r.table(CAMERA_SYSTEM_TABLE)
			.get(cameraSystemId);
		if (result && result.isDeleted) {
			return null;
		}
		else {
			return result;
		}
	}
	catch (ex) {
		throw { message: "Unhandled exception in CameraModel.getCameraSystemById: " + ex.message, code: 500 };
	}

};

// -- INTERNAL USE ONLY - DO NOT EXPOSE VIA PUBLIC API
CameraModel.prototype._internalSearchCameras = async (filterJSON) => {

	try {
		const result = await r.table(CAMERA_TABLE)
			.filter(filterJSON);
		return result;
	}
	catch (ex) {
		throw { message: "Unhandled exception in CameraModel._internalSearchCameras: " + ex.message, code: 500 };
	}

};


/**
 * create  - create camera
 * @param camera
 */
// CameraModel.prototype.create = async function (userId, orgId, camera, callback) {
// 	try {

// 		const userProfile = await userModel.getProfile(userId);
// 		const orgId = userProfile.user.orgId;

// 		camera.startDate = new Date(camera.startDate);
// 		if (camera.endDate) {
// 			camera.endDate = new Date(camera.endDate);
// 		} else {
// 			delete camera.endDate;
// 		}

// 		camera.owner = userId;
// 		camera.ownerOrg = orgId;
// 		camera.isPublic = false;
// 		camera.sharedWith = [];

// 		if (!validate(camera)) {
// 			return bluebird.resolve(validate.errors).then(() => {
// 				console.log("Validation Errors below ", validate.errors);
// 				callback({ "message": "Validation Error ", "err": validate.errors });
// 			});
// 		}

// 		camera.createdDate = new Date();
// 		camera.lastModified = new Date();
// 		camera.isDeleted = false;

// 		const result = await r.table(CAMERA_TABLE)
// 			.insert(camera, { returnChanges: true })
// 			.run();

// 		const activity = {
// 			"summary": "",
// 			"type": "created",
// 			"actor": activityModel.generateObject("user", userId),
// 			"target": activityModel.generateObject("camera", camera.id, camera.name),
// 			"to": [{
// 				"token": `organization:${orgId}`,
// 				"system": true,
// 				"email": false,
// 				"pushNotification": false
// 			}]
// 		};

// 		activity.summary = `${activity.target.name} created.`;
// 		activityModel.queueActivity(activity);

// 		// remove lastModified and createdDate
// 		const created = result.changes[0].new_val;

// 		callback(null, created);
// 	}
// 	catch (err) {
// 		console.log(err);
// 		callback(err, null);
// 	}
// };

/**
 * Remove cameras tied to a display target
 * @param {string} displayTargetId
 */
CameraModel.prototype.removeCamerasFromDisplayTarget = async function (displayTargetId) {
	try {
		await r.table(CAMERA_TABLE)
			.filter(
				r.row("entityData")("displayTargetId").default("").eq(displayTargetId)
			)
			.replace(
				r.row.without({ entityData: { displayTargetId: true, geometry: true, displayType: true } })
			).run();
	}
	catch (ex) {
		logger.error(
			"removeCamerasFromDisplayTarget",
			"Error removing cameras from display target.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * Remove cameras tied to a display target
 * @param {string} displayTargetId
 * @param {string} displayTargetId
 */
CameraModel.prototype.removeCameraByIdFromDisplayTarget = async function (userId, cameraId, displayTargetId) {
	try {
		const camera = await feedModel.getEntityWithAuthorization(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!camera) {
			throw { err: { "message": "User is not authorized to view camera", "code": 401 } };
		}
		await r.table(CAMERA_TABLE)
			.filter(
				r.and(
					r.row("id").eq(cameraId),
					r.row("entityData")("displayTargetId").default("").eq(displayTargetId)
				)
			)
			.replace(
				r.row.without({ entityData: { displayTargetId: true, displayType: true } })
			).run();
	}
	catch (ex) {
		logger.error(
			"removeCameraByIdFromDisplayTarget",
			"Error removing cameras from display target.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get all cameras a user has access to
 * @param {string} userId 
 */
CameraModel.prototype.getAll = async function (userId, permission = null) {
	try {

		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "camera", true, permission, true);
		return result;
	}
	catch (ex) {
		logger.error(
			"getAll",
			"Error getting all authorized cameras.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update a camera
 * @param {string} userId 
 * @param {string} cameraId 
 * @param {object} camera 
 */
CameraModel.prototype.update = async function (userId, cameraId, camera, translations) {

	const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
	if (!authorized) {
		throw { err: { "message": "User is not authorized to view camera", "code": 401 } };
	}

	const op = {
		entityData: camera,
		lastModifiedBy: userId,
		lastModifiedDate: new Date()
	};

	try {
		const updateResult = await r
			.table(CAMERA_TABLE)
			.get(cameraId)
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

		const cameraName = newVal.entityData.properties ? newVal.entityData.properties.name || newVal.entityData.properties.sourceName : "UNKNOWN";
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"camera",
				cameraId,
				cameraName,
				"cameras"
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
			"Error updating camera",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * setSlewLock  - set slewLock property on camera
 * @param userId
 * @param cameraId
 * @param target
 */
CameraModel.prototype.setSlewLock = async function (
	userId,
	cameraId,
	target,
	translations
) {
	if (!target || !target.id || !target.type || !target.initialGeo) {
		throw { err: { "message": "Invalid target", "code": 500 } };
	}

	const camAuthorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.control);
	const targetAuthorized = await feedModel.authorizeEntity(userId, target.id, target.type);
	if (!camAuthorized || !targetAuthorized) {
		throw { err: { "message": "Unauthorized", "code": 401 } };
	}

	target.controller = userId;

	const op = {
		slewLock: target,
		lastModifiedBy: userId,
		lastModifiedDate: new Date()
	};

	try {
		const updateResult = await r
			.table(CAMERA_TABLE)
			.get(cameraId)
			.update(op, { returnChanges: true })
			.run();

		const oldVal = updateResult.changes[0].old_val;
		const newVal = updateResult.changes[0].new_val;

		if (_global.globalChangefeed) {
			const change = {
				new_val: newVal,
				old_val: oldVal,
				rt: true
			};
			_global.globalChangefeed.publish(change);
		}

		await r.table(CAMERA_CONTEXT_TABLE)
			.filter(r.row("cameraId").eq(cameraId))
			.update({ timestamp: new Date() })
			.run();

		const entityDiff = diff(
			oldVal.entityData,
			newVal.entityData
		);

		let entityChanges;
		if (entityDiff) {
			entityChanges = entityDiff.map(d => {
				return {
					kind: d.kind,
					property: d.path.join("."),
					lhs: d.lhs,
					rhs: d.rhs
				};
			});

			const cameraName = newVal.entityData.properties ? newVal.entityData.properties.name || newVal.entityData.properties.sourceName : "UNKNOWN";
			const activity = {
				summary: "",
				type: "updated",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"camera", // -- entityType
					cameraId,
					cameraName,
					"cameras" // -- feedId
				),
				detail: {
					changes: entityChanges
				},
				to: [
					{
						token: `user:${userId}`,
						system: true,
						email: false,
						pushNotification: false
					}
				]
			};
			activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
			activityModel.queueActivity(activity);
		}

	} catch (err) {
		logger.error(
			"setSlewLock",
			"Unexpected error",
			{ err: { message: err.message, stack: err.stack } }
		);
		throw err;
	}
};

/**
 * releaseSlewLock  - release slewLock property on camera
 * @param userId
 * @param cameraId
 */
CameraModel.prototype.releaseSlewLock = async function (
	userId,
	cameraId,
	translations
) {
	const camAuthorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.control);
	if (!camAuthorized) {
		throw { err: { "message": "Unauthorized", "code": 401 } };
	}

	const op = {
		slewLock: null,
		lastModifiedBy: userId,
		lastModifiedDate: new Date()
	};

	try {
		const updateResult = await r
			.table(CAMERA_TABLE)
			.get(cameraId)
			.update(op, { returnChanges: true })
			.run();

		const oldVal = updateResult.changes[0].old_val;
		const newVal = updateResult.changes[0].new_val;

		if (_global.globalChangefeed) {
			const change = {
				new_val: newVal,
				old_val: oldVal,
				rt: true
			};
			_global.globalChangefeed.publish(change);
		}

		await r.table(CAMERA_CONTEXT_TABLE)
			.filter(r.row("cameraId").eq(cameraId))
			.update({ timestamp: new Date() })
			.run();

		const entityDiff = diff(
			oldVal.entityData,
			newVal.entityData
		);

		let entityChanges;
		if (entityDiff) {
			entityChanges = entityDiff.map(d => {
				return {
					kind: d.kind,
					property: d.path.join("."),
					lhs: d.lhs,
					rhs: d.rhs
				};
			});

			const cameraName = newVal.entityData.properties ? newVal.entityData.properties.name || newVal.entityData.properties.sourceName : "UNKNOWN";
			const activity = {
				summary: "",
				type: "updated",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"camera", // -- entityType
					cameraId,
					cameraName,
					"cameras" // -- feedId
				),
				detail: {
					changes: entityChanges
				},
				to: [
					{
						token: `user:${userId}`,
						system: true,
						email: false,
						pushNotification: false
					}
				]
			};
			activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
			activityModel.queueActivity(activity);
		}

	} catch (err) {
		logger.error(
			"releaseSlewLock",
			"Unexpected error",
			{ err: { message: err.message, stack: err.stack } }
		);
		throw err;
	}
};

/**
 * delete  - delete camera
 * @param userId
 * @param cameraId
 */
CameraModel.prototype.delete = async function (
	userId,
	cameraId
) {
	try {

		// -- authorizeEntity will need to take into account rules for deleting an entity
		//   -- User deleting is owner && entity is private
		//   -- user is admin and entity is owned by user org and entity is public
		// -- currently you should not be able to delete a camera so will not expose via rest api
		const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorized) {
			throw { err: { "message": "Unauthorized", "code": 401 } };
		}

		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.update({ "isDeleted": true, "lastModified": new Date() }, { returnChanges: true })
			.run();

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
		// -- not sure why this is here
		// sync cameraFeedCache on change
		// this.synccameraFeedCache(cameraId);

		return result;
	}
	catch (err) {
		console.log(err);
		throw { err: { "message": err, "code": 500 } };
	}

};

/**
 * get fov
 * @param userId
 * @param cameraId
 */
CameraModel.prototype.getFOV = async function (
	userId,
	cameraId
) {
	try {

		const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera");
		if (!authorized) {
			throw { err: { "message": "Unauthorized", "code": 401 } };
		}

		const camera = await r.table(CAMERA_TABLE).get(cameraId);
		if (camera && camera.fov) {
			const fov = await feedModel.getEntityWithAuthorization(userId, camera.fov, "shape");
			return fov;
		}
		else {
			throw { err: { "message": "camera does not have an fov", "code": 404 } };
		}

	}
	catch (err) {
		console.log(err);
		throw { err: { "message": err, "code": 500 } };
	}

};


/**
 * create fov
 * @param userId
 * @param cameraId
 * @param shape
 */
CameraModel.prototype.createFOV = async function (
	userId,
	orgId,
	cameraId,
	shape,
	translations
) {
	try {

		const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorized) {
			throw { err: { "message": "Unauthorized", "code": 401 } };
		}
		await shapeModel.deleteByParent(cameraId);
		let shapeId = null;
		try {
			const createResult = await shapeModel.create(userId, orgId, shape, cameraId, true, translations);
			shapeId = createResult.generated_keys[0];
		}
		catch (ex) {
			throw { err: { message: `error creating fov (shape) ${ex.message}`, code: 500 } };
		}

		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.update({ "fov": shapeId }, { returnChanges: true })
			.run();

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

		return result;
	}
	catch (err) {
		console.log(err);
		throw { err: { "message": err, "code": 500 } };
	}

};


/**
 * update fov
 * @param userId
 * @param cameraId
 * @param shapeId
 */
CameraModel.prototype.updateFOV = async function (
	userId,
	cameraId,
	shapeId
) {
	try {

		const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorized) {
			throw { err: { "message": "Unauthorized", "code": 401 } };
		}

		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.update({ "fov": shapeId }, { returnChanges: true })
			.run();

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

		return result;
	}
	catch (err) {
		console.log(err);
		throw { err: { "message": err, "code": 500 } };
	}

};

/**
 * create fov
 * @param userId
 * @param cameraId
 * @param shape
 */
CameraModel.prototype.deleteFOV = async function (
	userId,
	cameraId
) {
	try {
		const authorized = await feedModel.authorizeEntity(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorized) {
			throw { err: { "message": "Unauthorized", "code": 401 } };
		}
		await shapeModel.deleteByParent(cameraId);
		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.update({ "fov": null }, { returnChanges: true })
			.run();

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

		return result;
	}
	catch (err) {
		logger.error(
			"cameraModel",
			"An error occurred while attempting to delete a camera's FOV",
			{ err: err }
		);
		throw { err: { "message": err, "code": 500 } };
	}
};

/**
 * getCamerasInRangeOfEntity: Return camera entities whose FOVs contain the geometry of the given entity
 * Written to handle Point coordinates from Event & Facility EntityTypes
 * @param entityId
 * @param entityType
 */
CameraModel.prototype.getCamerasInRangeOfEntity = async (entityId, entityType) => {
	try {
		const et = entityTypeCache[entityType];
		const results = await r
			.table(et.sourceTable)
			.filter({ "id": entityId })
			.filter(function (row) {
				return row("entityData").hasFields("geometry");
			});

		if (results.length > 0) {
			const geometry = results[0].entityData.geometry;

			const filter = r.geojson(geometry)
				.intersects(r.geojson(r.row("fov")("entityData")("geometry")));

			return await r
				.table(CAMERA_TABLE)
				.merge((ent) => r.object("fov", r.table(SHAPE_TABLE).get(ent("fov")).default({})))
				.filter(filter);

		} else { // requested entity doesn't have geometry data
			return results;
		}

	} catch (error) {
		throw error;
	}
};

/**
 * getCamerasInRange: Return cameras whose fovs contain the entity's geometry
 * @param geometry
 */
CameraModel.prototype.getCamerasInRange = async (geometry) => {
	try {
		const filter = r.geojson(geometry)
			.intersects(r.geojson(r.row("fov")("entityData")("geometry")));

		const inRangeCameras = await r
			.table(CAMERA_TABLE)
			.merge((ent) => r.object("fov", r.table(SHAPE_TABLE).get(ent("fov")).default({})))
			.filter(filter);

		return inRangeCameras;
	} catch (error) {
		logger.error("getCamerasInRange", "There was an error while retrieving the cameras in range of an entity", {
			err: error
		});
		throw error;
	}
};

/**
 * getCamerasInRange: Return cameras whose fovs contain the entity's geometry
 * @param geometry
 */
CameraModel.prototype.getEntitiesInRangeOfCamera = async function (cameraId) {
	try {
		let cam = null;
		try {
			cam = await r.table(CAMERA_TABLE)
				.get(cameraId)
				.merge((ent) => r.object("fov", r.table(SHAPE_TABLE).get(ent("fov"))).default({}));

		}
		catch (err) {
			logger.error("getEntitiesInRangeOfCamera", "Unexpected error getting fov", { cameraId: cameraId, err: { message: err.message, stack: err.stack } });
			throw err;
		}

		let inRangeEntities = [];
		if (cam.fov) {
			inRangeEntities = await r.db("ecosystem").table(FEED_ENTITIES_TABLE)
				.union(r.db("ecosystem").table(SHAPE_TABLE))
				.union(r.db("ecosystem").table(FACILITY_TABLE))
				.union(r.db("ecosystem").table(CAMERA_TABLE))
				.union(r.db("ecosystem").table(EVENT_TABLE))
				.filter((ro) => {
					return r.and(
						ro("isActive").default(true).eq(true),
						ro("isDeleted").default(false).eq(false),
						ro("deleted").default(false).eq(false),
						ro("id").ne(cameraId),
						ro("id").ne(cam.fov.id),
					);
				})
				.filter((ro) =>
					r.geojson(ro("entityData")("geometry")).intersects(
						r.geojson(cam.fov.entityData.geometry)
					)
				)
				.map((ro) => ro("id"))
				.coerceTo("array");
		}

		return inRangeEntities;

	} catch (err) {
		logger.error("getEntitiesInRangeOfCamera", "Unexpected error", { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};


/**
 * getByDisplayTargetId: Returns camera by display target id
 * @param displayTargetId
 */
CameraModel.prototype.getByDisplayTargetId = async (displayTargetId) => {
	try {
		const results = await r
			.table(CAMERA_TABLE)
			.filter({ "entityData": { "displayTargetId": displayTargetId } });
		return results;

	} catch (error) {
		logger.error("displayTargetId", "There was an error while retrieving the cameras.", {
			err: error
		});
		throw error;
	}
};

/**
 * getEntitiesInFOV: Return tracks and shapes that are inside a camera's fov
 * @param geometry
 */
CameraModel.prototype.getEntitiesInFOV = async (geometry) => {
	try {
		const geoFilter = r.geojson(r.row("entityData")("geometry"))
			.intersects(r.geojson(geometry));

		const inRangeTracks = await r
			.table(FEED_ENTITIES_TABLE)
			.merge((ent) => r.object("fov", r.table(SHAPE_TABLE).get(ent("fov")).default({})))
			.filter(
				r.row("entityType").eq("track")
					.and(geoFilter)
			);

		const inRangeShapes = await r
			.table(SHAPE_TABLE)
			.filter(r.row("entityData")("properties")("type").ne("FOV")
				.and(
					r.row("isDeleted").default(true).eq(false),
					geoFilter
				)
			);

		const inRangeEntityIds = [...inRangeShapes, ...inRangeTracks].map((entity) => entity.id);

		return inRangeEntityIds;
	} catch (error) {
		logger.error("getEntitiesInFOV", "There was an error while retrieving the entities inside a camera's fov", {
			err: error
		});
		throw error;
	}
};

/**
 * streamCamerasInRange: stream authorized cameras where FOV contains/intersects with the given entity
 * @param {*} userId 
 * @param {*} entityId 
 * @param {*} entityType 
 * @param {*} handler 
 */
CameraModel.prototype.streamCamerasInRange = async function (
	userId,
	entityId,
	entityType,
	handler) {

	// todo: this was refactored to eliminate container unresponsive issue. Model code that belongs to other models
	//       needs to be refactored there and leveraged here. I.e. linkedEntitiesModel should be source of stremed linked entities 

	try {
		const authEntity = await feedModel.getEntityWithAuthorization(userId, entityId, entityType);
		if (!authEntity) {
			throw { message: `FeedModel.inRangeFeed entity unauthorized for user id ${userId}`, code: 401 };
		}

		const onFeedItem = async function (change) {
			const changeObj = {};
			const changeVal = change.type === "remove" ? change.old_val : change.new_val;
			logger.info("CameraModel.streamCamerasInRange.onFeedItem", "change receieved", { changeVal: changeVal });

			let cameraId = null;
			if (changeVal.entities) {
				// change in linked entity
				const cameraLink = changeVal.entities.find((link) => link.type === "camera");
				cameraId = cameraLink.id;
			}
			else {
				// change in camera context
				cameraId = changeVal.cameraId;
			}
			const camera = await feedModel.getEntityWithAuthorization(userId, cameraId, "camera");
			logger.info("CameraModel.streamCamerasInRange", "authorized and fetched camera", { camera: camera });
			if (camera) {
				camera.linkedWith = entityId;
				const changeType = change.type === "change" ? "update" : change.type === "initial" ? "add" : change.type;
				changeObj[changeType] = [camera];
			}
			handler(null, changeObj);
		};

		const onError = (err) => {
			logger.error("CameraModel.streamCamerasInRange", "Changefeed error", { err: { message: err.message, stack: err.stack } });
			handler(err, null);
		};

		const linkedEntQ = r.table(LINKED_ENTITIES_TABLE)
			.filter(r.row("entities").contains({
				"id": entityId,
				"type": entityType
			}).and(r.row("type").eq("manually-assigned-camera")))
			.changes({ "includeInitial": true, "includeTypes": true });
		const linkedEntCancelFn = provider.processChangefeed("CameraModel.streamCamerasInRange.linked", linkedEntQ, onFeedItem, onError);

		const camerasInRangeQ = r.table(CAMERA_CONTEXT_TABLE)
			.filter(r.row("entityId").eq(entityId))
			.changes({ "includeInitial": true, "includeTypes": true });
		const camerasInRangeCancelFn = provider.processChangefeed("CameraModel.streamCamerasInRange.in-range", camerasInRangeQ, onFeedItem, onError);

		const cancelFn = function () {
			linkedEntCancelFn();
			camerasInRangeCancelFn();
		};

		return cancelFn;
	}
	catch (ex) {
		throw ex;
	}
};

/**
 * streamAssociatedCameras: stream authorized cameras where FOV contains/intersects with the given entity,
 *                          is linked to the given entity, or the camera is within a given polygon entity
 * @param {*} userId
 * @param {*} entityId
 * @param {*} entityType
 * @param {*} handler
 */
CameraModel.prototype.streamAssociatedCameras = async function (
	userId,
	entityId,
	entityType,
	handler) {

	let inRangeCache = [];
	let linkedCache = [];

	try {
		const authEntity = await feedModel.getEntityWithAuthorization(userId, entityId, entityType);
		if (!authEntity) {
			throw { message: `FeedModel.inRangeFeed entity unauthorized for user id ${userId}`, code: 401 };
		}

		const q = r.table(entityTypeCache[entityType].sourceTable)
			.get(entityId)
			.changes({ "includeInitial": true, "includeTypes": true });

		const onFeedItem = async function (change) {
			if (change && change.new_val) {
				// -- build out cameras in range/FOV filter
				const geometry = change.new_val.geometry || change.new_val.entityData.geometry;
				const filter = r.or(
					// -- entity in camera FOV
					r.and(
						r.row.hasFields("fov"),
						r.geojson(geometry)
							.intersects(r.geojson(r.row("fov")("entityData")("geometry")))
					),
					// -- camera inside polygon
					r.and(
						(change.new_val.entityData.type === "Polygon"),
						r.geojson(geometry).includes(r.geojson(r.row("entityData")("geometry")))
					)
				);

				// -- retrieve cameras in range list
				const inRangeCameras = await feedModel.getEntitiesByTypeWithAuthorization(userId, "camera", true, null, true, filter, null, true);
				const inRangeCameraIds = inRangeCameras.map((camera) => camera.id);

				// -- retrieve linked cameras id list
				const linkedCameraRelations = await linkedEntitiesModel.getByEntityId(userId, entityId, entityType, "manually-assigned-camera");
				const linkedCamerasIds = linkedCameraRelations.reduce((a, b) => {
					const temp = b.entities.filter(entity => entity.id !== entityId).map(camera => camera.id);
					return [...a, ...temp];
				}, []);

				// -- build out data from linked camera ids
				let linkedCamerasData = [];
				if (linkedCamerasIds.length) {
					const linkedFilter = (doc) => r.expr(linkedCamerasIds).contains(doc("id"));
					linkedCamerasData = await feedModel.getEntitiesByTypeWithAuthorization(userId, "camera", true, null, true, linkedFilter, null, true);
				}
				if (linkedCamerasData.length) {
					linkedCamerasData.forEach(linkedCamera => {
						linkedCamera.linkedWith = entityId;
					});
				}

				// -- build out add/removal lists for cameras in range and linked cameras
				const inRangeAdd = inRangeCameraIds.filter((cameraId) => {
					return inRangeCache.indexOf(cameraId) === -1;
				});
				const inRangeRemove = inRangeCache.filter((cameraId) => {
					return inRangeCameraIds.indexOf(cameraId) === -1;
				});
				const linkAdd = linkedCamerasData.filter(camera => {
					return camera.linkedWith === entityId && !linkedCache.some(cachedCamId => camera.id === cachedCamId) && !inRangeAdd.some(inRange => camera.id === inRange.id);
				}).map(camera => camera.id);
				const linkRemove = linkedCache.filter(cachedCameraId => {
					return !linkedCamerasData.some(linked => cachedCameraId === linked.id);
				});

				// -- cache camera ids for future reference
				linkedCache = linkedCamerasData.map(camera => camera.id);
				inRangeCache = inRangeCameraIds;

				// -- send updates if relevant changes have been made
				if (inRangeAdd.length > 0 || inRangeRemove.length > 0 || linkAdd.length > 0 || linkRemove.length > 0) {
					const changes = { add: [], remove: [] };
					if (inRangeAdd.length > 0) changes["add"] = [...changes["add"], ...inRangeAdd];
					if (inRangeRemove.length > 0) changes["remove"] = [...changes["remove"], ...inRangeRemove];
					if (linkAdd.length > 0) changes["add"] = [...changes["add"], ...linkAdd];
					if (linkRemove.length > 0) changes["remove"] = [...changes["remove"], ...linkRemove];

					handler(null, changes);
				}

			}
		}.bind(this);

		const onError = (err) => {
			logger.error("streamCamerasInRange", "Changefeed error", { err: { message: err.message, stack: err.stack } });
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("CameraModel.streamAssociatedCameras", q, onFeedItem, onError);
		return cancelFn;
	}
	catch (ex) {
		throw ex;
	}

};


CameraModel.prototype.getMultipleFovs = async function (userId, cameraIds, handler) {
	try {
		// More performant camera authorization than using FeedModel.getEntityWithAuthorization 
		// Prevents ecosystem crash when getting large numbers of FOVs
		const authCamIds = await this.authorizeCameras(userId, cameraIds);

		// Batching
		let isInitialState = true;
		let initialFovs = [];

		const q = r.table(SHAPE_TABLE)
			.filter((row) => {
				return r.and(row("isDeleted").eq(false), r.expr(authCamIds).contains(row("parentEntity")));
			})
			.changes({ "includeInitial": true, "includeTypes": true, "includeStates": true });

		const onFeedItem = (change) => {
			if (change.state) {
				if (change.state === "initializing") {
					isInitialState = true;
				} else {
					isInitialState = false;

					// We have all the initial documents
					// So send them across!
					handler(null, { "type": "initial-batch", "changes": initialFovs });
					initialFovs = [];
				}
			} else {
				if (isInitialState) {
					// If we're still in the initial state,
					// throw the change in our array
					initialFovs.push(change.new_val);
				}
				else {
					// Send across non-initial changes as they come
					handler(null, change);
				}
			}
		};

		const onError = (err) => {
			console.log("CameraModel.getMultipleFovs changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("CameraModel.getMultipleFovs", q, onFeedItem, onError);
		return cancelFn;

	}
	catch (ex) {
		throw ex;
	}
};

/**
 * getCamerasWithSlewLock: stream cameras with a slewLock property not equal to null
 * @param {*} handler 
 */
CameraModel.prototype.getCamerasWithSlewLock = async function (handler) {
	try {
		const q = r.table(CAMERA_TABLE)
			.hasFields("slewLock")
			.changes({ "includeInitial": true, "includeTypes": true });

		const onFeedItem = (change) => {
			handler(null, change);
		};

		const onError = (err) => {
			console.log("CameraModel.getCamerasWithSlewLock changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("CameraModel.getCamerasWithSlewLock", q, onFeedItem, onError);
		return cancelFn;

	}
	catch (ex) {
		throw ex;
	}
};

/**
 * Check user access to one or more cameras
 * @param {string} userId 
 * @param {array} cameraIds 
 */
CameraModel.prototype.authorizeCameras = async function (userId, cameraIds) {
	try {
		const userProfile = await userModel.getProfile(userId);
		const { orgId, integrations } = userProfile.user;

		const authorizedCameras = await r.table(CAMERA_TABLE)
			.filter(function (camera) {

				// Find userIntegration matching camera
				const int = r.expr(integrations).filter(function (integration) {
					return integration("intId").eq(camera("feedId"));
				})(0).default(null);

				return r.and(
					// User must have an integration to view cameras
					int,
					int("config")("canView").eq(true),
					r.expr(cameraIds).contains(camera("id"))
				);
			})
			.map((row) => {
				return row("id");
			})
			.run();

		if (authorizedCameras.length) {
			return authorizedCameras;
		}

		logger.info("authorizeCameras", `No authorized cameras found for user ${userId}`);

		return [];
	}
	catch (ex) {
		logger.error("authorizeCameras", `Error authorizing camera Ids for user ${userId}`, { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * Stream all cameras a user has access to that are associated with a specific display entity (such as cameras on a facility floor plan)
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} displayType 
 * @param {string} displayTargetId 
 * @param {function} handler 
 */
CameraModel.prototype.streamCameraByDisplayEntity = async (userId, orgId, displayType, displayTargetId, handler) => {
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
		const q = r.table(CAMERA_TABLE)
			.filter((cam) => {
				return r.and(
					cam.hasFields("entityData"),
					cam("entityData")("displayType").default(null).eq(displayType),
					cam("entityData")("displayTargetId").default(null).eq(displayTargetId)
				);
			})
			.filter((cam) => {

				const int = r.expr(integrations).filter(function (integration) {
					return integration("intId").eq(cam("feedId"));
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
				"CameraModel.streamCameraByDisplayEntity changefeed error",
				{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
			);
			handler(ex, null);
		};

		const cancelFn = provider.processChangefeed("CameraModel.getCamerasWithSlewLock", q, onFeedItem, onError);
		return cancelFn;
	}
	catch (ex) {
		logger.error(
			"streamCameraByDisplayEntity",
			"Error streaming camera by display entity",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};


/**
 * Create or update a spotlight shape on a camera object
 * @param {string} userId 
 * @param {string} cameraId 
 * @param {object} data - geojson
 */
CameraModel.prototype.upsertSpotlight = async function (userId, cameraId, data) {
	try {
		const authorizedCamera = await feedModel.getEntityWithAuthorization(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedCamera) {
			throw { message: "User is not authorized to edit camera", code: 401 };
		}
		if (data.id) delete data.id;
		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.update({
				spotlightShape: data
			})
			.run();

		if (result.replaced) {
			return { success: true };
		}
		else {
			throw { message: "An error occurred. Spotlight shape not created or updated.", code: 500 };
		}
	}
	catch (ex) {
		logger.error(
			"createSpotlight",
			"Error creating or updating spotlight shape",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * Remove the spotlightShape property from a camera
 * @param {string} userId 
 * @param {string} cameraId 
 */
CameraModel.prototype.deleteSpotlight = async function (userId, cameraId) {
	try {
		const authorizedCamera = await feedModel.getEntityWithAuthorization(userId, cameraId, "camera", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedCamera) {
			throw { message: "User is not authorized to edit camera", code: 401 };
		}

		const result = await r.table(CAMERA_TABLE)
			.get(cameraId)
			.replace(
				r.row.without("spotlightShape")
			)
			.run();

		if (result.replaced) {
			return { success: true };
		}
		else {
			throw { message: "An error occurred. Spotlight shape not deleted.", code: 500 };
		}
	}
	catch (ex) {
		logger.error(
			"deleteSpotlight",
			"Error deleting spotlight shape",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * Return all cameras a user should have access to for linking with an entity
 * @param {string} userId 
 * @param {string} entityId
 * @param {string} entityType
 */
CameraModel.prototype.getCamerasForLinking = async function (userId, entityId, entityType, query, pageSize) {
	try {
		const unfilteredCameras = await this.getAll(userId);
		// Remove all whitespace
		const regex = /([^\s]+)/g;

		// Array of search terms
		const queries = query.match(regex);
		const filterRecursively = (entities, queryStrings) => {
			// If there are no more queries to filter, return the entities that are left
			if (!queryStrings.length) {
				return entities;
			}

			const query = queryStrings[0].toLowerCase();

			// Filter entities based on current query string
			const filtered = entities.filter(ent => {
				const properties = ent.entityData.properties;

				// Check name for match and bail early
				if (properties.name && properties.name.toLowerCase().includes(query)) {
					return true;
				}

				return false;
			});

			const updatedQueryStrings = [...queryStrings];
			updatedQueryStrings.shift();
			return filterRecursively(filtered, updatedQueryStrings);
		};

		const cameras = filterRecursively(unfilteredCameras, queries);
		const linkedCameraRelations = await linkedEntitiesModel.getByEntityIdWithoutAuth(entityId, "manually-assigned-camera");
		const linkedCamerasIds = linkedCameraRelations.reduce((a, b) => {
			const temp = b.entities.filter(entity => entity.type && entity.type.toLowerCase() === "camera").map(camera => camera.id);
			return [...a, ...temp];
		}, []);

		const filterResult = cameras.filter(camera => {
			if (!linkedCamerasIds.length) {
				return true;
			} else {
				return !linkedCamerasIds.includes(camera.id);
			}
		});
		const result = filterResult.slice(0, pageSize);

		return { success: true, result: result };
	} catch (ex) {
		logger.error(
			"getCamerasForLinking",
			"Error retrieving cameras available to be linked with an entity.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/cameraModel.js" } }
		);
		throw ex;
	}
};

/**
 * getSnapshot - get all available cameras to include in replay snapshot
 * @param
 */
// INETERNAL USE ONLY
CameraModel.prototype.getSnapshot = async function () {
	try {
		const result = await r
			.table(CAMERA_TABLE)
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

