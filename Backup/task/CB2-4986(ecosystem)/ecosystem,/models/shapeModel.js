"use strict";
const SHAPE_TABLE = "sys_shape";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userPolicyCache = new (require("../lib/userPolicyCache"));
const activityModel = require("../models/activityModel")();
const feedModel = require("../models/feedModel")();
const _global = require("../app-global.js");
const diff = require("deep-diff").diff;
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/shape.json"));
const {
	removeAssociations
} = require("../lib/entityAssociations.js");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/shapeModel.js");
const {
	authExclusionCheck
} = require("../lib/authExclusionFilter.js");

module.exports = ShapeModel;


function ShapeModel(options) {
	if (!(this instanceof ShapeModel)) return new ShapeModel(options);
	const self = this;
	self.options = options;
}

ShapeModel.prototype.getById = async function (userId, shapeId) {
	try {
		// Test that user has not excluded shape
		await authExclusionCheck(userId, shapeId, {
			"message": "Requester does not have access to shape",
			"code": 406
		});

		// -- todo: ENTITY_AUTH should we let auth exclusion check be handled in getEntityCall - Yes with a flag to include exclusions or not
		const entity = await feedModel.getEntityWithAuthorization(userId, shapeId, "shape");

		if (entity) {
			return entity;
		} else {
			return {
				"message": "Shape not found or requester does not have access",
				"code": 403
			};
		}
	} catch (err) {
		logger.error(
			"getById",
			"An error occurred while attempting to query a shape by id",
			{ err: err }
		);
		throw err;
	}
};

ShapeModel.prototype.getMultipleById = async function (userId, shapeIds) {
	try {
		const shapes = await feedModel.getEntitiesWithAuthorization(userId, shapeIds, "shape");
		return shapes;
	}
	catch (err) {
		logger.error(
			"getMultipleById",
			"An error occurred while attempting to query multiple shapes by id",
			{ err: err }
		);
		throw err;
	}
};

ShapeModel.prototype.getMultipleByIdInternal = async function (shapeIds) {
	try {
		const shapes = await r.table(SHAPE_TABLE).getAll(...shapeIds);
		return shapes;
	} catch (err) {
		logger.error(
			"getMultipleByIdInternal",
			"An error occurred while attempting to query multiple shapes by id",
			{ err: err }
		);
		throw err;
	}
};

/**
 * get all regardless of auth - for shape activity generator - internal use only
 */
ShapeModel.prototype.getAllInternal = async function () {
	try {
		const shapes = await r.table(SHAPE_TABLE)
			.filter(r.row("isDeleted").eq(false).default(true));
		return shapes;
	} catch (err) {
		logger.error(
			"getAllInternal",
			"An unexpected error occurred",
			{ errMessage: err.message, errStack: err.stack }
		);
		throw err;
	}
};

/** 
 * streamAll - changefeed for all shapes used by activityGenerator in shapes-app to sync local shape cache for generating shape activities
*/
ShapeModel.prototype.streamAll = async function (handler) {
	try {
		const q = r
			.table(SHAPE_TABLE)
			.filter(r.row("isDeleted").eq(false))
			.changes({ includeInitial: true, includeTypes: true });


		const onFeedItem = (change) => {
			handler(null, change);
		};

		const onError = (err) => {
			console.log("ShapeModel.streamAll changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("ShapeModel.streamAll", q, onFeedItem, onError);
		return cancelFn;
	} catch (err) {
		throw err;
	}
};


ShapeModel.prototype.create = async function (
	userId,
	orgId,
	shape,
	parentEntity,
	inScope = true,
	translations
) {

	const shapeFeedId = `${orgId}_shapes`;
	if (!userPolicyCache.authorizeFeedAccess(userId, shapeFeedId, userPolicyCache.feedPermissionTypes.manage)) {
		throw { message: "Access Denied", code: 403 };
	}

	const opTime = new Date();
	const op = {
		owner: userId,
		ownerOrg: orgId,
		entityData: shape,
		entityType: "shapes",
		feedId: shapeFeedId,
		isDeleted: false,
		isPublic: true, // pass as arg if want ability to make public at creation
		inScope: inScope,
		createdDate: opTime,
		lastModifiedDate: opTime
	};

	if (parentEntity !== undefined) {
		op["parentEntity"] = parentEntity;
	}

	try {
		// -- geometry is reserved property, should always be geojson format
		// -- TODO: By making this explicitly a geometry type in reql could change format returned. Confirm if this is case
		// if(op.entityData.geometry) {
		// 	op.entityData.geometry = r.geojson(op.entityData.geometry);
		// }

		// -- Validate data against schema
		if (!validate(op)) {
			logger.error(
				"Invalid shape schema:",
				"Received invalid shape schema",
				{ err: { message: validate.errors, code: 403 } }
			);
			throw { message: "Validation Error", code: 403, "err": validate.errors };
		}

		const insertResult = await r
			.table(SHAPE_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (insertResult.changes && insertResult.changes[0]) {
				const change = {
					type: "add",
					new_val: insertResult.changes[0].new_val,
					old_val: insertResult.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const shapeId = insertResult.generated_keys[0];
		if (!parentEntity) {
			// -- create activity
			const activity = {
				summary: "",
				type: "created",
				actor: activityModel.generateObject("user", userId),
				object: activityModel.generateObject(
					"shape",
					shapeId,
					shape.properties.name,
					`${orgId}_shapes` // -- feed id -  TODO: is no longer passed, need to define in enum or derive from sys_feedTypes
				),
				to: [
					{
						token: `user:${userId}`,
						system: false,
						email: false,
						pushNotification: false
					}
				]
			};
			//activity.summary = `${activity.actor.name} created ${activity.object.name} in ${activity.target.name}`;
			activity.summary = `${activity.actor.name} ${translations.summary.created} ${activity.object.name}`;
			activityModel.queueActivity(activity);
		}

		return insertResult;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

ShapeModel.prototype.update = async function (
	userId,
	shapeId,
	shape,
	parentEntity,
	inScope,
	translations
) {
	try {

		if (!await feedModel.getEntityWithAuthorization(userId, shapeId, "shape", userPolicyCache.feedPermissionTypes.manage)) {
			throw new Error("error: User does not have access to edit the shape");
		}

		const opTime = new Date();

		const op = {
			entityData: shape,
			lastModifiedBy: userId,
			lastModifiedDate: opTime
		};

		if (parentEntity !== undefined) {
			op[parentEntity] = parentEntity;
		}

		if (inScope !== undefined) {
			op.inScope = inScope;
		}

		const updateResult = await r
			.table(SHAPE_TABLE)
			.get(shapeId)
			.update(op, { returnChanges: true })
			.run();

		const entityDiff = diff(
			updateResult.changes[0].old_val.entityData,
			updateResult.changes[0].new_val.entityData
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
							lhs: updateResult.changes[0].old_val.entityData.geometry,
							rhs: updateResult.changes[0].new_val.entityData.geometry
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
			if (updateResult.changes && updateResult.changes[0]) {
				const change = {
					type: "change",
					new_val: updateResult.changes[0].new_val,
					old_val: updateResult.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "updated",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"shape", // -- entityType
				shapeId,
				shape.properties.name,
				`${updateResult.changes[0].new_val.ownerOrg}_shapes` // -- feedId
			),
			detail: {
				changes: entityChanges
			},
			//"target": activityModel.generateObject("collection", "my-items"),
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

		return updateResult;
		// -- error handling
	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

ShapeModel.prototype.delete = async function (userId, shapeId, translations) {

	const opTime = new Date();
	const op = {
		isDeleted: true,
		lastModifiedDate: opTime
	};

	try {

		const shape = await feedModel.getEntityWithAuthorization(userId, shapeId, "shape", userPolicyCache.feedPermissionTypes.manage);
		if (!shape) {
			throw new Error("error: User does not have access to delete the shape");
		}

		const associations = await removeAssociations(shapeId);

		if (associations.hasAssociations) {
			throw new Error("Shape has active associations and cannot be deleted.");
		}

		const deleteResult = await r
			.table(SHAPE_TABLE)
			.get(shapeId)
			.update(op, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (deleteResult.changes && deleteResult.changes[0]) {
				const change = {
					type: "remove",
					new_val: deleteResult.changes[0].new_val,
					old_val: deleteResult.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "deleted",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"shape", // -- entityType
				shapeId,
				shape.entityData.properties.name,
				shape.feedId
			),
			to: [
				{
					token: `user:${userId}`,
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		activity.summary = `${activity.actor.name} ${translations.summary.deleted} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		return deleteResult;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

ShapeModel.prototype.restore = async function (userId, shapeId, translations) {
	const opTime = new Date();
	const op = {
		isDeleted: false,
		lastModifiedDate: opTime
	};

	try {

		const shape = await feedModel.getEntityWithAuthorization(userId, shapeId, "shape", userPolicyCache.feedPermissionTypes.manage);
		if (!shape) {
			throw new Error("error: User does not have access to restore the shape");
		}

		const updateResult = await r
			.table(SHAPE_TABLE)
			.get(shapeId)
			.update(op, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (updateResult.changes && updateResult.changes[0]) {
				const change = {
					type: "add",
					new_val: updateResult.changes[0].new_val,
					old_val: updateResult.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}

		const activity = {
			summary: "",
			type: "restored",
			actor: activityModel.generateObject("user", userId),
			object: activityModel.generateObject(
				"shape", // -- entityType
				shapeId,
				shape.entityData.properties.name,
				shape.feedId
			),
			to: [
				{
					token: `user:${userId}`,
					system: true,
					email: false,
					pushNotification: false
				}
			]
		};

		activity.summary = `${activity.actor.name} ${translations.summary.restored} ${activity.object.name}`;
		activityModel.queueActivity(activity);

		return updateResult;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

ShapeModel.prototype.setScope = async function (shapeId, inScope) {
	try {
		const shapeChangeResult = await r.table(SHAPE_TABLE)
			.get(shapeId)
			.update({ "inScope": inScope }, { returnChanges: true })
			.run();

		if (_global.globalChangefeed && shapeChangeResult && shapeChangeResult.changes[0]) {
			// If we are setting inScope as true, we want to treat this shape as a new object
			const shapeChange = {
				new_val: shapeChangeResult.changes[0].new_val,
				rt: true
			};
			if (!inScope) {
				shapeChange["old_val"] = shapeChangeResult.changes[0].old_val;
			}
			_global.globalChangefeed.publish(shapeChange);
		}
	} catch (err) {
		console.log("error when setting scope for shape:", err);
		throw err;
	}
};

ShapeModel.prototype.getSingleSegmentLines = async function (userId) {
	try {
		const linestringFilter = r.row("entityData")("geometry")("type")
			.eq("LineString")
			.and(
				r.row("entityData")("geometry")("coordinates")
					.count()
					.eq(2)
			);
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "shapes", true, null, true, linestringFilter);
		return result;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

/**
 * Get all shapes a user has access to, with included FOVs if needed - shuey: nothing was using this to include fovs so eliminated
 * @param {string} userId 
 * @param {boolean} includeFovs 
 */
ShapeModel.prototype.getAll = async function (userId, permission = null) {
	try {
		const resultForShape = await feedModel.getEntitiesByTypeWithAuthorization(userId, "shape", true, permission, true);
		// todo: remove shapes
		const resultForShapes = await feedModel.getEntitiesByTypeWithAuthorization(userId, "shapes", true, permission, true);
		return [...resultForShape, ...resultForShapes];
	}
	catch (err) {
		logger.error(
			"getAll",
			"An error occurred while getting all shapes",
			{ err: { message: err.message, code: err.code } }
		);
		throw err;
	}
};

ShapeModel.prototype.getByGeometryType = async function (userId, type, query) {
	try {
		let filter = r.row("entityData")("geometry")("type").eq(type);
		if (query) {
			// Do not include FOVs
			if (query.excludeFOV) {
				filter = r.and(filter, r.row("entityData")("properties")("type").ne("FOV"));
				delete query.excludeFOV;
			}
			// Only show public shapes
			if (query.onlyPublic) {
				filter = r.and(filter, r.row("isPublic").eq(true));
				delete query.onlyPublic;
			}
		}
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "shapes", true, null, true, filter);
		return result;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};

/**
 * Delete any shapes based on the parents id
 * @param {string} parentId
 */
ShapeModel.prototype.deleteByParent = async function (parentId) {
	try {
		const update = await r
			.table(SHAPE_TABLE)
			.filter(shape => {
				return r.and(
					shape.hasFields("parentEntity"),
					shape("parentEntity").eq(parentId)
				);
			})
			.update({ isDeleted: true }, { returnChanges: true })
			.run();

		if (_global.globalChangefeed) {
			if (update.changes && update.changes[0]) {
				const change = {
					type: "remove",
					new_val: update.changes[0].new_val,
					old_val: update.changes[0].old_val,
					rt: true
				};
				_global.globalChangefeed.publish(change);
			}
		}
	} catch (error) {
		logger.error(
			"shapeModel",
			"An error occurred while attempting to delete a shape by the parent's ID",
			{ err: error }
		);
		throw error;
	}
};

/**
 * Get all shapes by shape type. Only for use with processes.
 * @param {string} type
 */
ShapeModel.prototype.getAllByType = async function (type) {
	try {
		const result = await r
			.table(SHAPE_TABLE)
			.filter(
				r.and(
					r.row("isDeleted").default(false).eq(false),
					r.row("entityData")("properties")("type").match(`(?i)${type}`)
				)
			)
			.run();

		return result;

	} catch (err) {
		console.log("error:", err);
		throw err;
	}
};


/**
 * getSnapshot - get all available shapes to include in replay snapshot
 * @param
 */
// INETERNAL USE ONLY
ShapeModel.prototype.getSnapshot = async function () {
	try {
		const result = await r
			.table(SHAPE_TABLE)
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
