"use strict";
const CAMERA_CONTEXT_TABLE = "sys_cameraContextMapping";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("./schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/cameraContext.json"));
const cameraContextCache = new (require("../lib/cameraContextCache"));
const {
	Logger
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/cameraContextModel.js");

module.exports = CameraContextModel;

function CameraContextModel(options) {
	if (!(this instanceof CameraContextModel)) return new CameraContextModel(options);
	const self = this;
	self.options = options;
}

/**
 * create  - create cameraContext
 * @param userId
 * @param cameraContext
 */
CameraContextModel.prototype.create = async function (cameraContext) {
	try {
		if (!validate(cameraContext)) {
			throw {
				"message": "Validation Error",
				"err": validate.errors
			};
		}
		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.insert(cameraContext, {
				returnChanges: true
			})
			.run();

		// todo -- remove lastModified and createdDate
		const created = result.changes[0].new_val;

		return created;
	} catch (error) {
		logger.error("create", "There was an error while creating the camera context", {
			err: error
		});
		throw error;
	}
};

/**
 * upsert - upsert cameraContext
 * @param cameraContext
 */
CameraContextModel.prototype.upsert = async function (cameraContext) {
	try {
		if (!validate(cameraContext)) {
			throw {
				"message": "Validation Error",
				"err": validate.errors
			};
		}

		//Check for existing record
		const existing = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.and(
					r.row("cameraId").eq(cameraContext.cameraId),
					r.row("entityId").eq(cameraContext.entityId)
				)
			)
			.run();

		let created;
		if (!existing || existing.length == 0) {
			const result = await r
				.table(CAMERA_CONTEXT_TABLE)
				.insert(cameraContext, {
					returnChanges: true
				})
				.run();

			created = result.changes[0].new_val;
		}
		else {
			created = existing[0];
		}

		return created;
	} catch (error) {
		logger.error("upsert", "There was an error while upserting the camera context", {
			err: error
		});
		throw error;
	}
};

/**
 * upsertBulkCameraAssociations - upsert bulk cameraContext
 * @param cameraId camera id to associate to entities)
 * @param associatedEntityIds - array of entity ids to associate to camera
 */
CameraContextModel.prototype.upsertBulkCameraAssociations = async function (cameraId, associatedEntityIds) {
	try {

		const bulkRecords = associatedEntityIds.map((id) => {
			return { 
				id: `${cameraId}_${id}`,
				cameraId: cameraId,
				entityId: id
			 };
		});

		return await this.upsertBulk(bulkRecords);

	} catch (err) {
		logger.error("upsertBulkCameraAssociations", "Unxexpected error", {
			err: {
				message: err.message,
				stack: err.stack
			}
		});
		throw err;
	}
};


/**
 * insertBulk - upsert bulk cameraContext
 * @param cameraIds - array of camera ids to associate to entity
 * @param associatedEntityId - entity id to associate to camera(s)
 */
CameraContextModel.prototype.upsertBulkEntityAssociations = async function (cameraIds, associatedEntityId) {
	try {

		const bulkRecords = cameraIds.map((id) => {
			return { 
				id: `${id}_${associatedEntityId}`,
				cameraId: id,
				entityId: associatedEntityId
			 };
		});

		return await this.upsertBulk(bulkRecords);

	} catch (err) {
		logger.error("upsertBulkEntityAssociations", "Unxexpected error", {
			err: {
				message: err.message,
				stack: err.stack
			}
		});
		throw err;
	}
};


/**
 * upsertBulk - upsert bulk records to cameraContext table
 * @param bulkRecords - array of records to upsert
 */
CameraContextModel.prototype.upsertBulk = async function (bulkRecords) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.insert(bulkRecords, {
				conflict: "replace"
			})
			.run();
		
		return result;

	} catch (err) {
		logger.error("bulkUpsert", "Unxexpected error", {
			err: {
				message: err.message,
				stack: err.stack
			}
		});
		throw err;
	}
};


/**
 * remove  - remove cameraContext
 * @param userId
 * @param contextId
 */
CameraContextModel.prototype.remove = async function (contextId) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("id").eq(contextId)
			)
			.delete()
			.run();


		return result;
	} catch (error) {
		logger.error("remove", "There was an error while deleting the camera context mapping", {
			err: error
		});
		throw error;
	}
};

/**
 * removeByIds  - remove cameraContext by entity and camera ids
 * @param userId
 * @param entityId
 * @param cameraId
 */
CameraContextModel.prototype.removeByIds = async function (entityId, cameraId) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("entityId").eq(entityId)
					.and(r.row("cameraId").eq(cameraId))
			)
			.delete()
			.run();


		return result;
	} catch (error) {
		logger.error("removeByIds", "There was an error while deleting the camera context mapping", {
			err: error
		});
		throw error;
	}
};

/**
 * removeByEntityId  - remove cameraContext by entityId
 * @param userId
 * @param entityId
 */
CameraContextModel.prototype.removeByEntityId = async function (entityId) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("entityId").eq(entityId)
			)
			.delete()
			.run();


		return result;
	} catch (error) {
		logger.error("removeByEntityId", "There was an error while deleting the camera context mapping", {
			err: error
		});
		throw error;
	}
};

/**
 * removeByEntityId  - remove cameraContext by cameraId
 * @param userId
 * @param cameraId
 */
CameraContextModel.prototype.removeByCameraId = async function (cameraId) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("cameraId").eq(cameraId)
			)
			.delete()
			.run();


		return result;
	} catch (error) {
		logger.error("removeByCameraId", "There was an error while deleting the camera context mapping", {
			err: error
		});
		throw error;
	}
};

/**
 * removeMatching  - remove cameraContexts matching cameraId AND entityId
 * @param cameraId
 * @param entityId
 */
CameraContextModel.prototype.removeMatching = async function (cameraId, entityId) {
	try {

		const result = await r
			.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.and(
					r.row("cameraId").eq(cameraId),
					r.row("entityId").eq(entityId)
				)
			)
			.delete()
			.run();

		return result;
	} catch (error) {
		logger.error("removeMatching", "There was an error while deleting the camera context mapping", {
			err: error
		});
		throw error;
	}
};

/**
 * getByIds
 * @param entityId
 * @param cameraId
 */
CameraContextModel.prototype.getByIds = async (entityId, cameraId) => {
	try {
		const result = await r.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("cameraId").eq(cameraId)
					.and(r.row("entityId").eq(entityId))
			)
			.run();
		return result;
	} catch (err) {
		logger.error("getByIds", "There was an error while retrieving the camera context mapping", {
			err: err
		});
		throw err;
	}
};

/**
 * getAll
 */
CameraContextModel.prototype.getAll = async () => {
	try {
		const result = await r.table(CAMERA_CONTEXT_TABLE)
			.run();
		return result;
	} catch (err) {
		logger.error("getAll", "There was an error while retrieving all camera contexts", {
			err: err
		});
		throw err;
	}
};
/**
 * getByEntityId
 * @param entityId
 */
CameraContextModel.prototype.getByEntityId = async (entityId) => {
	try {
		const result = await r.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("entityId").eq(entityId)
			)
			.run();
		return result;
	} catch (err) {
		logger.error("getByEntityId", "There was an error while retrieving the camera context mapping", {
			err: err
		});
		throw err;
	}
};

/**
 * getByCameraId
 * @param cameraId
 */
CameraContextModel.prototype.getByCameraId = async (cameraId) => {
	try {
		const result = await r.table(CAMERA_CONTEXT_TABLE)
			.filter(
				r.row("cameraId").eq(cameraId)
			)
			.run();
		return result;
	} catch (err) {
		logger.error("getByCameraId", "There was an error while retrieving the camera context mapping", {
			err: err
		});
		throw err;
	}
};

/**
 *	Stream:
 *	@param userId: User's ID from identity on request
 *	@param handler: handler from stream
 */
CameraContextModel.prototype.streamCameraContexts = async (
	userId,
	orgId,
	entityId,
	type,
	handler
) => {
	cameraContextCache.streamCameraContexts(userId, orgId, entityId, type, handler);
};