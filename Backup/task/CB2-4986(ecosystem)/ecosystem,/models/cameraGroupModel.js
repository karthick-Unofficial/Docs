"use strict";
const CAMERA_GROUP_TABLE = "sys_cameraGroup";
const AUTH_EXCLUSION_TABLE = "sys_authExclusion";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/cameraGroup.json"));
const activityModel = require("../models/activityModel")();
const feedModel = require("../models/feedModel")();
const {
	Logger
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/cameraGroupModel.js");
const _global = require("../app-global.js");
const userPolicyCache = new (require("../lib/userPolicyCache"));

module.exports = CameraGroupModel;

function CameraGroupModel(options) {
	if (!(this instanceof CameraGroupModel)) return new CameraGroupModel(options);
	const self = this;
	self.options = options;
}

/**
 * create  - create cameraGroup
 * @param userId
 * @param groupName
 * @param cameras
 */
CameraGroupModel.prototype.create = async function (userId, orgId, group, translations) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to create camera groups", code: 403 };
		}

		group.owner = userId,
		group.ownerOrg = orgId,
		group.sharedWith = {};
		if (!validate(group)) {
			throw {
				"message": "Validation Error",
				"err": validate.errors
			};
		}

		const layoutKeys = Object.keys(group.cameras);
		if (layoutKeys.length > 0) {
			//check that the keys are valid
			layoutKeys.forEach(key => {
				if (!key.match(/[0-8]/g)) {
					throw {
						"message": "Validation Error",
						"err": "cameras object has illegal keys."
					};
				}
			});
		}

		group.createdDate = new Date();
		group.lastModified = new Date();
		group.isDeleted = false;

		const result = await r
			.table(CAMERA_GROUP_TABLE)
			.insert(group, {
				returnChanges: true
			})
			.run();

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: null,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			authAppId: "camera-wall-app",
			summary: "",
			type: "created",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"camera group",
				result.changes[0].new_val.id,
				group.name
			),
			to: [{
				// "token": `organization:${orgId}`,
				token: "auth-users:true",
				system: true,
				email: false,
				pushNotification: false
			}]
		};

		activity.summary = `${activity.target.name} ${translations.summary.created}`;
		activityModel.queueActivity(activity);

		// todo -- remove lastModified and createdDate
		const created = result.changes[0].new_val;
		return created;
	} catch (err) {
		logger.error("create", "There was an error while creating the camera group", {
			err: err
		});
		throw err;
	}
};

/**
 * delete  - delete event
 * @param userId
 * @param groupId
 */
CameraGroupModel.prototype.delete = async function (userId, orgId, groupId) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to delete camera groups", code: 403 };
		}

		// Test that user can has access to camera group
		const group = await r.table(CAMERA_GROUP_TABLE).get(groupId);
		// check user permitted to delete
		if (
			!group.isDeleted &&
			group.ownerOrg === orgId
		) {
			// we good
			const result = await r
				.table(CAMERA_GROUP_TABLE)
				.filter({
					id: groupId
				})
				.update({
					isDeleted: true,
					lastModified: new Date()
				}, {
					returnChanges: true
				})
				.run();


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
			return result;
		} else {
			logger.error("create", "There was an error while creating the camera group", {
				err: {
					message: "Camera group not found or requester does not have access",
					code: 404
				}
			});
			return {
				err: {
					message: "Camera group not found or requester does not have access",
					code: 404
				}
			};
		}
	} catch (err) {
		logger.error("create", "There was an error while creating the camera group", {
			err: err
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
CameraGroupModel.prototype.update = async function (
	userId,
	orgId,
	groupId,
	update,
	translations
) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to update camera groups", code: 403 };
		}

		const group = await r.table(CAMERA_GROUP_TABLE).get(groupId);

		const permittedProps = [
			"name",
			"cameras"
		];

		const op = {};
		let updating = false;
		if (update.cameras) {
			const layoutKeys = Object.keys(update.cameras);
			if (layoutKeys.length > 0) {
				//check that the keys are valid
				layoutKeys.forEach(key => {
					if (!key.match(/[0-8]/g)) {
						throw {
							"message": "Validation Error",
							"err": "cameras object has illegal keys."
						};
					}
				});
			}
		}

		for (const property in update) {
			if (permittedProps.includes(property)) {
				updating = true;
				op[property] = update[property];
			}
		}


		if (updating) {
			op.lastModified = new Date();
		}

		// check user permitted to edit
		if (
			!group.isDeleted &&
			updating &&
			group.ownerOrg === orgId
		) {

			const result = await r
				.table(CAMERA_GROUP_TABLE)
				.get(groupId)
				.update(op, {
					returnChanges: true
				})
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

			const activity = {
				authAppId: "camera-wall-app",
				summary: "",
				type: "updated",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject("camera group", group.id, group.name),
				// target: activityModel.generateObject("organization", orgId),
				to: [{
					// "token": `organization:${orgId}`,
					token: "auth-users:true",
					system: true,
					email: false,
					pushNotification: false
				}]
			};

			activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
			activityModel.queueActivity(activity);

			const updated = result.changes[0].new_val;
			return updated;
		} else {
			const err = {
				err: {
					message: "Camera group not found or requester does not have access",
					code: 404
				}
			};
			logger.error("update", "There was an error while updating the camera group", {
				err: err
			});
			throw err;
		}
	} catch (err) {
		logger.error("update", "There was an error while updating the camera group", {
			err: err
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

/**
 * getAll  - retrieve all camera groups in the system accessible by given user
 * @param userId
 */
CameraGroupModel.prototype.getAll = async function (userId, orgId) {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app")) {
			throw { message: "User is not authorized to view camera groups", code: 403 };
		}

		const result = await r
			.table(CAMERA_GROUP_TABLE)
			.filter(
				r
					.row("isDeleted")
					.eq(false)
					.and(r.row("orgId").eq(orgId))
			)
			.run();
		return result;
	} catch (e) {
		logger.error("getAll", "There was an error while getting all camera groups", {
			err: e
		});
		throw e;
	}
};

/**
 * getById  - Retrieve a specific event by id
 * @param userId
 * @param groupId
 */
CameraGroupModel.prototype.getById = async (userId, orgId, groupId) => {
	try {

		if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app")) {
			throw { message: "User is not authorized to view camera groups", code: 403 };
		}

		const result = await r
			.table(CAMERA_GROUP_TABLE)
			.filter(
				r
					.row("isDeleted")
					.eq(false)
					.and(r.row("id").eq(groupId))
					.and(r.row("orgId").eq(orgId))
			).run();

		if (result[0]) {
			return result[0];
		} else {
			const err = {
				message: "Camera group not found or requester does not have access",
				code: 404
			};
			logger.error("getById", "There was an error while getting the specific camera group", {
				err
			});
			return err;
		}
	} catch (e) {
		logger.error("getById", "There was an error while getting the specific camera group", {
			err: e
		});
		throw e;
	}
};

/**
 *	Stream:
 *	@param userId: User's ID from identity on request
 *	@param handler: handler from stream
 */
CameraGroupModel.prototype.streamCameraGroups = async (
	userId,
	orgId,
	handler
) => {

	if (!userPolicyCache.authorizeApplication(userId, "camera-wall-app")) {
		throw { message: "User is not authorized to view camera groups", code: 403 };
	}

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


	const q = r
		.table(CAMERA_GROUP_TABLE)
		.filter(
			r.row("isDeleted").eq(false)
				.and(r.row("ownerOrg").eq(orgId))
		)
		.changes({
			includeInitial: true,
			includeTypes: true
		});

	// Check cameras in camera group for authExclusion entry
	const authorizeCameras = async (cameras) => {
		const authCameras = {};

		// For each key, ensure user has access to camera and then set to authorization object by key
		for (const key in cameras) {
			if (cameras.hasOwnProperty(key)) {
				const cameraId = cameras[key];

				const approved = await r.table(AUTH_EXCLUSION_TABLE)
					.filter({
						"userId": userId,
						"entityId": cameraId
					})
					.count()
					.gt(0)
					.not();

				if (approved) {
					authCameras[key] = cameraId;
				}
			}
		}

		return authCameras;
	};


	const onFeedItem = async (change) => {

		// Check for hidden cameras in new values (initial & change)
		if ((change.new_val)) {
			const cameras = change.new_val.cameras;
			change.new_val.cameras = await authorizeCameras(cameras);
		}

		// Check for hidden cameras in old values (change & removal)
		if (change.old_val) {
			const cameras = change.old_val.cameras;
			change.old_val.cameras = await authorizeCameras(cameras);
		}

		batch.push(change);
	};

	const onError = err => {
		logger.error("streamCameraGroups", "There was a changefeed error while streaming cameraGroups", {
			err: err
		});
		handler(err, null);
	};

	const cancelFn = provider.processChangefeed(
		"cameraGroupsModel.streamCameraGroups",
		q,
		onFeedItem,
		onError
	);
	return cancelFn;
};

/**
 *	Stream:
 *	@param userId: User's ID from identity on request
 *	@param name: The name to search against
 * 	@param types: Array of entity types to search for
 */
CameraGroupModel.prototype.searchForPinning = async (
	userId,
	name,
	types = ["track", "event", "shapes", "collection", "facility"]
) => {
	try {
		let pinnableEntities = [];
		for (let i = 0; i < types.length; i++) {

			const filter = ["collection", "event"].includes(types[i])
				? r.row("name").match(`(?i)${name}`)
				: r.and(
					r.row("entityData")("properties")("name").match(`(?i)${name}`),
					r.row("entityData")("properties")("type").ne("FOV")
				);

			const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, types[i], true, null, true, filter, 5);
			const mappedResult = result.map(entity => {
				return {
					name: entity.name ? entity.name : entity.entityData.properties.name,
					id: entity.id,
					entityType: entity.entityType,
					type: entity.entityData && entity.entityData.properties && entity.entityData.properties.subtype ?
						entity.entityData.properties.subtype :
						entity.entityData && entity.entityData.properties && entity.entityData.properties.type ?
							entity.entityData.properties.type :
							types[i].charAt(0).toUpperCase() + types[i].slice(1)
				};
			});

			pinnableEntities = [...pinnableEntities, ...mappedResult];
		}
		return pinnableEntities;

	} catch (error) {
		logger.error("searchForPinning", "There was an error while seraching for items to pin", {
			err: error
		});
		throw error;
	}
};