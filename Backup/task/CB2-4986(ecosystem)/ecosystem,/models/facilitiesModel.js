"use strict";
const FACILITY_TABLE = "sys_facility";
const FLOORPLAN_TABLE = "sys_floorplan";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const attachmentModel = require("../models/attachmentModel")();
const activityModel = require("../models/activityModel")();
const _global = require("../app-global.js");
const feedModel = require("../models/feedModel")();
const cameraModel = require("../models/cameraModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validateFacility = ajv.compile(require("./schema/facility.json"));
const validateFloorplan = ajv.compile(require("./schema/floorplan.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/facilitiesModel.js");
const userPolicyCache = new (require("../lib/userPolicyCache"));
const accessPointModel = require("../models/accessPointModel")();


module.exports = FacilitiesModel;


function FacilitiesModel() {
	if (!(this instanceof FacilitiesModel)) return new FacilitiesModel();
}

/**
 * Create a facility
 * @param {string} userId 
 * @param {object} facility 
 */
FacilitiesModel.prototype.create = async function (userId, orgId, facility, translations) {
	try {

		const facilityFeedId = `${orgId}_facilities`;
		if (!userPolicyCache.authorizeFeedAccess(userId, facilityFeedId, userPolicyCache.feedPermissionTypes.manage)) {
			throw { message: "User is not authorized to create a facility", code: 403 };
		}

		// Build facility object
		const op = {
			"owner": userId,
			"ownerOrg": orgId,
			"isPublic": true,
			"feedId": facilityFeedId,
			"entityType": "facility",
			"isDeleted": false,
			"createdDate": new Date(),
			"lastModifiedDate": new Date(),
			...facility
		};

		// Validate vs schema
		if (!validateFacility(op)) {
			throw { "message": "Facility failed schema validation", code: validateFacility.errors };
		}

		const result = await r.table(FACILITY_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "created",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				result.changes[0].new_val.id,
				result.changes[0].new_val.entityData.properties.name,
				op.feedId
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.created} ${activity.object.name}.`;
		activityModel.queueActivity(activity);
		// The id of the newly created facility needs to be added to properties for map layer purposes
		await r.table(FACILITY_TABLE)
			.get(result.changes[0].new_val.id)
			.update({
				"entityData": {
					"properties": {
						"id": result.changes[0].new_val.id
					}
				}
			});

		return { success: true, result: result.changes[0].new_val };
	}
	catch (ex) {
		logger.error(
			"create",
			"Error creating facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update a facility
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {object} update 
 */
FacilitiesModel.prototype.update = async function (userId, orgId, facilityId, update, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}

		const result = await r.table(FACILITY_TABLE)
			.get(facilityId)
			.update(update, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (result.changes && result.changes[0]) {
				const change = {
					new_val: result.changes[0].new_val,
					old_val: result.changes[0].old_val
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				result.changes[0].new_val.id,
				result.changes[0].new_val.entityData.properties.name,
				result.changes[0].new_val.feedId
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"update",
			"Error updating facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Set a flag on a facility to mark it as deleted
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 */
FacilitiesModel.prototype.delete = async function (userId, orgId, facilityId, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to delete facility", code: 403 };
		}

		// Delete associated floorplans, including attachments on those floorplans
		const floorplanDeleteSuccess = await this.deleteFloorplansByFacility(facilityId);

		if (floorplanDeleteSuccess) {
			const result = await r.table(FACILITY_TABLE)
				.get(facilityId)
				.update({
					isDeleted: true,
					lastModifiedDate: new Date()
				}, { returnChanges: true })
				.run();

			if (_global.globalChangefeed) {
				if (result.changes && result.changes[0]) {
					const change = {
						new_val: result.changes[0].new_val,
						old_val: result.changes[0].old_val
					};
					_global.globalChangefeed.publish(change);
				}
			}

			const activity = {
				summary: "",
				type: "deleted",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"facility",
					result.changes[0].new_val.id,
					result.changes[0].new_val.entityData.properties.name,
					result.changes[0].new_val.feedId
				),
				to: []
			};

			activity.summary = `${activity.actor.name} ${translations.summary.deleted} ${activity.object.name}`;
			activityModel.queueActivity(activity);

			return { success: true, result: result };
		}
		else {
			throw { message: "An error occurred while deleting floor plans associated with this facility" };
		}
	}
	catch (ex) {
		logger.error(
			"delete",
			"Error deleting facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Create a floorplan associated with a facility
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {object} floorplan 
 */
FacilitiesModel.prototype.createFloorplan = async function (userId, orgId, facilityId, floorplan, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}

		const floorplanOrders = await r.table(FLOORPLAN_TABLE)
			.filter({ facilityId: facilityId })
			.map((fp) => {
				return fp("order");
			})
			.run();

		const order = floorplanOrders.length
			? Math.max(...floorplanOrders) + 1
			: 1;

		const op = {
			...floorplan,
			order: order,
			facilityId: facilityId,
			createdBy: userId,
			createdDate: new Date(),
			lastModifiedDate: new Date()
		};

		// Validate vs schema
		if (!validateFloorplan(op)) {
			throw { "message": "Floorplan failed schema validation", code: validateFloorplan.errors };
		}

		const result = await r.table(FLOORPLAN_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		const facility = await r.table(FACILITY_TABLE).get(facilityId).run();
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				facility.id,
				facility.entityData.properties.name
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.addFloorPlan} ${result.changes[0].new_val.name} ${translations.summary.toFacility} ${activity.object.name}.`;
		activityModel.queueActivity(activity);


		if (result.changes[0].new_val.attachmentId) {
			let attachment = null;
			try {
				const res = await attachmentModel.getById(result.changes[0].new_val.attachmentId);
				attachment = res;
				if (attachment.length) {
					result.changes[0].new_val.handle = attachment[0].handle;
				}
			} catch (err) {
				throw new Error("Error retrieving attachment when updating floorplan");
			}
		}

		return { success: true, result: result.changes[0].new_val };
	}
	catch (ex) {
		logger.error(
			"createFloorplan",
			"Error creating floor plan",
			{ err: { message: ex.message, code: ex.code, stack: ex.stack } }
		);
		throw ex;
	}
};

/**
 * Get all floorplans associated with a facility
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 */
FacilitiesModel.prototype.getFacilityFloorplans = async function (userId, orgId, facilityId) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to view facility", code: 403 };
		}

		const floorplans = await r.table(FLOORPLAN_TABLE)
			.filter({ facilityId: facilityId })
			.run();

		const facilityAttachments = floorplans
			.map(facility => {
				const { attachmentId } = facility;
				return attachmentId || null;
			})
			.filter(id => id !== null);

		const attachments = await attachmentModel.getByIds(facilityAttachments);

		const result = floorplans.map(fp => {
			let handle = null;

			if (fp.attachmentId) {
				const attachment = attachments.find(attachment => attachment.id === fp.attachmentId);
				handle = attachment.handle;
			}

			return {
				...fp,
				handle: handle
			};
		});

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"getFacilityFloorplans",
			"Error getting floor plans for facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get a floor plan by its id
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} floorPlanId 
 */
FacilitiesModel.prototype.getFloorPlanById = async function (userId, orgId, floorPlanId) {
	try {
		const result = await r.table(FLOORPLAN_TABLE)
			.get(floorPlanId)
			.run();

		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, result.facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to view facility", code: 403 };
		}

		if (result.attachmentId) {
			let attachment = "";
			try {
				const result = await attachmentModel.getById(result.attachmentId);
				attachment = result[0];
			} catch (err) {
				throw new Error(err);
			}
			result.handle = attachment.handle;
		}
		return { success: true, result };
	}
	catch (ex) {
		logger.error(
			"getFloorPlanById",
			"Error getting floor plan",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get a facility by its id
 * @param {string} userId 
 * @param {string} facilityId 
 */
FacilitiesModel.prototype.getFacilityById = async function (userId, facilityId) {
	try {

		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to view facility", code: 403 };
		}

		const result = await r.table(FACILITY_TABLE)
			.get(facilityId)
			.run();

		return { success: true, result };
	}
	catch (ex) {
		logger.error(
			"getFacilityById",
			"Error getting facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * INTERNAL USE ONLY - DO NOT EXPOSE VIA PUBLIC API
 * Get a facility by its id
 * @param {string} facilityId 
 */
FacilitiesModel.prototype._internalGetById = async function (facilityId) {
	try {
		const result = await r.table(FACILITY_TABLE)
			.get(facilityId)
			.run();

		return result;
	}
	catch (ex) {
		logger.error(
			"_internalGetById",
			"Error getting facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update an existing floorplan
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 * @param {object} update 
 */
FacilitiesModel.prototype.updateFloorplan = async function (userId, orgId, facilityId, floorplanId, update, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}

		// Ensure floorplan.order is an integer, if it exists
		if (update.order && !Number.isInteger(update.order)) {
			throw { "message": "Floorplan order must be an integer", code: "Incorrect value for floorplan order" };
		}

		// If the update will remove the file from the floorplan, save the attachmentId for later deletion
		let attachmentId = null;
		if (update.hasOwnProperty("attachmentId")) {
			attachmentId = await r.table(FLOORPLAN_TABLE)
				.get(floorplanId)("attachmentId")
				.default(null)
				.run();
		}

		const op = {
			lastModifiedDate: new Date(),
			...update
		};

		const result = await r.table(FLOORPLAN_TABLE)
			.get(floorplanId)
			.update(op, { returnChanges: true })
			.run();

		const facility = await r.table(FACILITY_TABLE).get(facilityId).run();
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				facility.id,
				facility.entityData.properties.name
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.updatedFloorPlan} ${result.changes[0].new_val.name} ${translations.summary.onFaclitiy} ${activity.object.name}.`;
		activityModel.queueActivity(activity);

		// If an attachment needs to be deleted, permanently delete it
		if (attachmentId) {
			await attachmentModel.hardDeleteAttachment(attachmentId, true);
		}

		if (result.changes[0].new_val.attachmentId) {
			let attachment = null;
			try {
				const res = await attachmentModel.getById(result.changes[0].new_val.attachmentId);
				attachment = res;
			} catch (err) {
				throw new Error("Error retrieving attachment when updating floorplan");
			}
			if (attachment.length) {
				result.changes[0].new_val.handle = attachment[0].handle;
			}
		}
		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"updateFloorplan",
			"Error updating floor plan",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};
/**
 * Reorder all floorplans on a facility
 * @param {string} userId
 * @param {string} orgId
 * @param {string} facilityId
 */
FacilitiesModel.prototype.deleteFloorPlanFile = async function (userId, orgId, facilityId, attachmentId) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}
		// If an attachment needs to be deleted, permanently delete it
		if (attachmentId) {
			await attachmentModel.hardDeleteAttachment(attachmentId, true);
		}
	} catch (error) {
		logger.error(
			"deleteFloorPlanFile",
			"Error deleting floor plan file",
			{ err: { message: error.message, code: error.code, stack: "/models/facilitiesModel.js" } }
		);
		throw error;
	}
};
/**
 * Reorder all floorplans on a facility
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {array} floorplans -- [{id: '123', order: 1}, {id: '234, order: 2}]
 */
FacilitiesModel.prototype.updateFloorplanOrders = async function (userId, orgId, facilityId, floorplans, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}

		// Array of promises - Update the order of each floor plan
		const promises = floorplans.map(async plan => {
			return await r.table(FLOORPLAN_TABLE)
				.get(plan.id)
				.update({
					order: plan.order
				})
				.run();
		});

		// Await all promises
		const promiseResults = await Promise.all(promises);

		const facility = await r.table(FACILITY_TABLE).get(facilityId).run();
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				facility.id,
				facility.entityData.properties.name
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.updatedFloorPlan} ${activity.object.name}.`;
		activityModel.queueActivity(activity);

		return { success: true, result: promiseResults };
	}
	catch (ex) {
		logger.error(
			"updateFloorplanOrders",
			"Error update floor plan orders",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Delete a floorplan permanently, adjust all other floorplan orders to ensure there are no gaps, 
 * and delete any associated attachments
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 */
FacilitiesModel.prototype.deleteFloorplan = async function (userId, orgId, facilityId, floorplanId, translations) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility", userPolicyCache.feedPermissionTypes.manage);
		if (!authorizedFacility) {
			throw { message: "User is not authorized to edit facility", code: 403 };
		}

		const attachmentId = await r.table(FLOORPLAN_TABLE)
			.get(floorplanId)("attachmentId")
			.default(null)
			.run();

		const floorplan = await r.table(FLOORPLAN_TABLE)
			.get(floorplanId)
			.run();

		const result = await r.table(FLOORPLAN_TABLE)
			.get(floorplanId)
			.delete()
			.run();

		// Adjust floorplan orders of all floorplans higher than deleted floorplan
		await this.adjustFloorplanOrders(facilityId, floorplan.order);
		await cameraModel.removeCamerasFromDisplayTarget(floorplanId);

		// If floorplan had a file attached, permanently delete it from minio and sys_attachment
		if (attachmentId) {
			await attachmentModel.hardDeleteAttachment(attachmentId, true);
		}

		const facility = await r.table(FACILITY_TABLE).get(facilityId).run();
		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"facility",
				facility.id,
				facility.entityData.properties.name
			),
			to: []
		};

		activity.summary = `${activity.actor.name} ${translations.summary.removedFloorPlan} ${floorplan.name} ${translations.summary.fromFaclitiy} ${activity.object.name}.`;
		activityModel.queueActivity(activity);

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"deleteFloorplan",
			"Error deleting floorplan",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Add a camera to a floor plan
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 * @param {string} cameraId 
 * @param {object} geo -- { coordinates: [], type: ""}
 */
FacilitiesModel.prototype.addCameraToFloorplan = async function (userId, orgId, facilityId, floorplanId, cameraId, geo, translations) {
	try {
		// contribute
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to contribute to facility", code: 403 };
		}

		const update = {
			geometry: {
				...geo.geometry
			},
			displayType: "facility",
			displayTargetId: floorplanId
		};
		const result = await cameraModel.update(userId, cameraId, update, translations);
		await cameraModel.deleteFOV(userId, cameraId);
		await cameraModel.deleteSpotlight(userId, cameraId);
		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"addCameraToFloorplan",
			"Error adding camera to floor plan.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Add an accessPoint to a floor plan
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 * @param {string} accessPointId 
 * @param {object} geo -- { coordinates: [], type: ""}
 */
FacilitiesModel.prototype.addAccessPointToFloorplan = async function (userId, orgId, facilityId, floorplanId, accessPointId, geo) {
	try {
		// contribute
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to contribute to facility", code: 403 };
		}

		const update = {
			geometry: {
				...geo.geometry
			},
			displayType: "facility",
			displayTargetId: floorplanId
		};
		const result = await accessPointModel.update(userId, accessPointId, update);
		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"addAccessPointToFloorplan",
			"Error adding accessPoint to floor plan.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Return all cameras a user should have access to for placing on a facility's floor plan
 * @param {string} userId 
 */
FacilitiesModel.prototype.getCamerasForPlacing = async function (userId, orgId) {
	try {

		const facilityFeedId = `${orgId}_facilities`;
		if (!userPolicyCache.authorizeFeedAccess(userId, facilityFeedId)) {
			throw { message: "Access Denied", code: 403 };
		}

		const cameras = await cameraModel.getAll(userId, userPolicyCache.feedPermissionTypes.manage);

		const result = cameras.map(cam => {
			const { entityData } = cam;
			const { displayType, displayTargetId, properties } = entityData;

			return {
				id: cam.id,
				name: properties.name,
				displayType: displayType || null,
				displayTargetId: displayTargetId || null
			};
		});

		return { success: true, result: result };
	} catch (ex) {
		logger.error(
			"getCamerasForPlacing",
			"Error retrieving cameras available to be placed on a floor plan.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Return all accessPoints a user should have access to for placing on a facility's floor plan
 * @param {string} userId 
 */
FacilitiesModel.prototype.getAccessPointsForPlacing = async function (userId, orgId) {
	try {

		const accessPoints = await accessPointModel.getAll(userId);

		const result = accessPoints.map(accessPoint => {
			const { entityData } = accessPoint;
			const { displayType, displayTargetId, properties } = entityData;

			return {
				id: accessPoint.id,
				name: properties.name,
				displayType: displayType || null,
				displayTargetId: displayTargetId || null
			};
		});

		return { success: true, result: result };
	} catch (ex) {
		logger.error(
			"getAccessPointForPlacing",
			"Error retrieving accessPoints available to be placed on a floor plan.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Delete all floorplans (and attachments) associated with a facility. Not exposed via API.
 * Utilized by FacilitiesModel.delete
 * @param {string} facilityId 
 */
FacilitiesModel.prototype.deleteFloorplansByFacility = async function (facilityId) {
	try {
		const floorplans = await r.table(FLOORPLAN_TABLE)
			.filter({ facilityId: facilityId })
			.run();

		// Array of promises
		// If floorplan had a file attached, permanently delete it from minio and sys_attachment
		const promises = floorplans.map(async plan => {
			let result = null;
			if (plan.attachmentId) {
				result = await attachmentModel.hardDeleteAttachment(plan.attachmentId, true);
			}
			return result;
		});

		// Await all promises
		await Promise.all(promises);

		// Delete floorplans
		const result = await r.table(FLOORPLAN_TABLE)
			.filter({ facilityId: facilityId })
			.delete();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"deleteFloorplansByFacility",
			"Error deleting floor plan associated with facility",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get all facilities user has access to
 * @param {string} userId 
 * @param {string} orgId 
 */
FacilitiesModel.prototype.getAll = async function (userId) {
	try {
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "facility", true, null, true);
		return result;
	} catch (ex) {
		logger.error(
			"getAll",
			"An error occurred while getting allfacilities", {
				err: {
					message: ex.message,
					code: ex.code,
					stack: "/models/facilitiesModel.js"
				}
			}
		);
		throw ex;
	}
};

/**
 * Stream all cameras a user has access to that have been placed on a specific facility floor plan
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 * @param {function} handler 
 */
FacilitiesModel.prototype.streamCamerasByFloorplan = async function (userId, orgId, facilityId, floorplanId, handler) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to view facility", code: 403 };
		}

		const cancelFn = await cameraModel.streamCameraByDisplayEntity(userId, orgId, "facility", floorplanId, handler);
		return cancelFn;
	}
	catch (ex) {
		logger.error(
			"streamCamerasByFloorplan",
			"An error occurred while streaming floor plan cameras",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * Stream all accessPoints a user has access to that have been placed on a specific facility floor plan
 * @param {string} userId 
 * @param {string} orgId 
 * @param {string} facilityId 
 * @param {string} floorplanId 
 * @param {function} handler 
 */
FacilitiesModel.prototype.streamAccessPointsByFloorplan = async function (userId, orgId, facilityId, floorplanId, handler) {
	try {
		const authorizedFacility = await feedModel.getEntityWithAuthorization(userId, facilityId, "facility");
		if (!authorizedFacility) {
			throw { message: "User is not authorized to view facility", code: 403 };
		}

		const cancelFn = await accessPointModel.streamAccessPointsByDisplayEntity(userId, "facility", floorplanId, handler);
		return cancelFn;
	}
	catch (ex) {
		logger.error(
			"streamAccessPointsByFloorplan",
			"An error occurred while streaming floor plan accessPoints",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};


/**
 * Lower the order of all floorplans higher than the deleted floorplan to ensure there are no floor gaps.
 * This method is used automatically when a floorplan is deleted to re-order the remaining floorplans and
 * should not be used on the front end or exposed via an API route.
 * @param {string} facilityId 
 * @param {number} deletedFloorOrder - integer
 */
FacilitiesModel.prototype.adjustFloorplanOrders = async (facilityId, deletedFloorOrder) => {
	try {
		const floorplanOrders = await r.table(FLOORPLAN_TABLE)
			.filter({ facilityId: facilityId })
			.map((fp) => {
				return {
					order: fp("order"),
					id: fp("id")
				};
			})
			.run();

		const updatedFloors = floorplanOrders
			.filter(fp => fp.order > deletedFloorOrder)
			.map(fp => {
				fp.order--;
				return fp;
			});

		// Array of promises
		const promises = updatedFloors.map(async (fpUpdate) => {
			const result = await r.table(FLOORPLAN_TABLE)
				.get(fpUpdate.id)
				.update({ order: fpUpdate.order })
				.run();

			return result;
		});

		// Await all promises
		const result = await Promise.all(promises);

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"adjustFloorplanOrders",
			"An error occurred while adjusting floorplan orders",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};

/**
 * getSnapshot - get all available facilities to include in replay snapshot
 * @param
 */
// INETERNAL USE ONLY
FacilitiesModel.prototype.getSnapshot = async function () {
	try {
		const result = await r
			.table(FACILITY_TABLE)
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

/**
 * Get all floorplans with facility feedId
 */
FacilitiesModel.prototype.getAllFloorplansWithFacilityFeedId = async function () {
	try {

		const floorPlans = await r.table(FLOORPLAN_TABLE).run();
		const facilities = await r.table(FACILITY_TABLE).run();
		floorPlans.forEach((floorPlan) => {
			facilities.forEach((facility) => {
				if (floorPlan.facilityId === facility.id) {
					floorPlan.facilityFeedId = facility.feedId;
				}
			});
		});
		const facilityAttachments = floorPlans
			.map(facility => {
				const { attachmentId } = facility;
				return attachmentId || null;
			})
			.filter(id => id !== null);

		const attachments = await attachmentModel.getByIds(facilityAttachments);

		const result = floorPlans.map(fp => {
			let handle = null;

			if (fp.attachmentId) {
				const attachment = attachments.find(attachment => attachment.id === fp.attachmentId);
				handle = attachment.handle;
			}

			return {
				...fp,
				handle: handle
			};
		});

		return { success: true, floorPlans: result };
	}
	catch (ex) {
		logger.error(
			"getAllFloorplansWithFacilityFeedId",
			"Error getting floor plans",
			{ err: { message: ex.message, code: ex.code, stack: "/models/facilitiesModel.js" } }
		);
		throw ex;
	}
};