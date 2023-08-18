const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("camera-context-generator", "/process/cameraContextGenerator.js");
const proc = require("node-app-core").process("camera-context-generator", {
	"nats": {
		"url": "nats://phoenix-nats:4222"
	}
});
const cameraContextModel = require("../models/cameraContextModel")();
const cameraModel = require("../models/cameraModel")();

const healthMetrics = {
	totalEvals: 0,
	fovEvals: 0,
	enterEvals: 0,
	contextsCreated: 0,
	exitEvals: 0,
	contextsRemoved: 0,
	errors: 0,
	lastError: null
};

proc.initialize = async function (args) {
	try {
		//Subscribe to activities
		proc.globalChangefeed.subscribePersistent("activity", globalChangefeedHandler);
		proc.globalChangefeed.subscribePersistent("shapes", entityChangeHandler);
		proc.globalChangefeed.subscribePersistent("event", entityChangeHandler);
		proc.globalChangefeed.subscribePersistent("facility", entityChangeHandler);
		proc.status("subscribed to global changefeed");
	} catch (e) {
		logger.error("initialize", "Unexpected error during initialization.", {
			err: JSON.stringify(e)
		});
		proc.fail("unhandled exception", e);
	}
	proc.initSuccess();
};

proc.shutdown = function () {
	proc.shutdownSuccess();
};

proc.getHealth = function () {
	const health = {
		status: 1,
		metrics: healthMetrics
	};
	return health;
};

async function entityChangeHandler(change) {
	try {
		logger.info("entityChangeHandler", "change received", { change: change });
		let changeType = change.type;
		// event does not have change type
		if(!changeType) {
			changeType = change.new_val && !change.old_val ? "add"
				: change.new_val && change.old_val ? "change"
					: !change.new_val && change.old_val ? "remove" : null;
		}
		logger.info("entityChangeHandler", "change type", { changeType: changeType });
		const changeEnt = change.type === "remove" ? change.old_val : change.new_val;
		if(changeEnt.entityData.properties.type && changeEnt.entityData.properties.type.toUpperCase() === "FOV") {
		// do fov actions
			switch(changeType) {
				case "add": 
					await upsertBulkCamAssociations(changeEnt.parentEntity);
					break;
				case "change": 
					await cameraContextModel.removeByCameraId(changeEnt.parentEntity);
					await upsertBulkCamAssociations(changeEnt.parentEntity);
					break;
				case "remove": 
					await cameraContextModel.removeByCameraId(changeEnt.parentEntity);
					break;
			}
		}
		else {
		// do entity actions
			switch(changeType) {
				case "add": 
					await upsertBulkEntityAssociations(changeEnt.id, changeEnt.entityType);
					break;
				case "change": 
					await cameraContextModel.removeByEntityId(changeEnt.id);
					await upsertBulkEntityAssociations(changeEnt.id, changeEnt.entityType);
					break;
				case "remove": 
					await cameraContextModel.removeByEntityId(changeEnt.id);
					break;
			}
		}
	}
	catch(err) {
		healthMetrics.errors++;
		const errObj = { message: err.message, stack: err.stack };
		healthMetrics.lastError = errObj;
		logger.error("entityChangeHandler", "Unexpected error", { err: errObj });
	}
}

async function globalChangefeedHandler(activity) {
	healthMetrics.totalEvals++;

	try {
		//Null checking and only care about FOV's
		if (activity.target && activity.target.entity && activity.target.entity.entityData && activity.target.entity.entityData.properties && activity.target.entity.entityData.properties.type === "FOV") {
			healthMetrics.fovEvals++;
			if (activity.type === "enter") {
				//Process enters
				healthMetrics.enterEvals++;
				await upsertCameraContext(activity);
				healthMetrics.contextsCreated++;
			} else if (activity.type === "exit") {
				//Process exits
				healthMetrics.exitEvals++;
				await removeCameraContext(activity);
				healthMetrics.contextsRemoved++;
			}
			else {
				if (healthMetrics[`${activity.type}NotProcessed`] == undefined) {
					healthMetrics[`${activity.type}NotProcessed`] = 1;
				}
				else {
					healthMetrics[`${activity.type}NotProcessed`]++;
				}
			}
		}
	} catch (err) {
		healthMetrics.errors++;
		const errObj = { message: err.message, stack: err.stack };
		healthMetrics.lastError = errObj;
		logger.error("globalChangefeedHandler", "Unexpected error during analysis", { err: errObj });
	}
}

async function upsertCameraContext(activity) {
	const cameraContext = {
		cameraId: activity.target.entity.parentEntity,
		entityId: activity.object.id
	};
	return await cameraContextModel.upsert(cameraContext);
}

async function upsertBulkCamAssociations(cameraId) {
	const entIdsInFov = await cameraModel.getEntitiesInRangeOfCamera(cameraId);
	await cameraContextModel.upsertBulkCameraAssociations(cameraId, entIdsInFov);
}

async function upsertBulkEntityAssociations(entityId, entityType) {
	const camsContainingEnt = await cameraModel.getCamerasInRangeOfEntity(entityId, entityType);
	const cameraIds = camsContainingEnt.map((cam) => cam.id);
	await cameraContextModel.upsertBulkEntityAssociations(cameraIds, entityId);
}

async function removeCameraContext(activity) {
	return await cameraContextModel.removeMatching(activity.target.entity.parentEntity, activity.object.id);
}
