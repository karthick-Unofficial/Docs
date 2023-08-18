const config = require("../config.json");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const appConfig = require("../app-config.json");
const { authExclusionChangefeedFilter } = require("../lib/authExclusionFilter");
const cameraModel = require("../models/cameraModel")();
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/cameraContextCache.js");

let instance = null;
const ENTITY_TYPE_MODELS = {
	track: require("../models/feedModel")(),
	shapes: require("../models/shapeModel")(),
	facility: require("../models/facilitiesModel")(),
	event: require("../models/eventModel")(),
	collection: require("../models/entityCollectionModel")()
};
class CameraContextCache {
	constructor(options) {
		if (!instance) {
			this._options = options;

			// Initial properties
			this._streamingCamerasByEntity = {};
			this._streamingCamerasProcessors = {};

			// Create singleton
			instance = this;
		}
		return instance;
	}

	async streamCameraContexts(userId, orgId, entityId, type, handler, callback) {
		let cancelFn = null;

		if (type === "event" || type === "collection") {
			const otherStreamHandler = (err, batch) => {
				if (err) {
					logger.error("streamCameraContexts", "There was an error streaming pinned items for an event or collection", {
						err: err
					});
				}
				else {
					handler(null, batch);
				}
			};

			// -- stream pinned items for events and collections
			const model = ENTITY_TYPE_MODELS[type];
			cancelFn = await model.streamPinnedItemsByType(userId, entityId, "camera", otherStreamHandler);
		}
		else if (type === "facility") {
			const cameraStreamHandler = (err, data) => {
				if (err) {
					logger.error("streamCameraContexts", "There was an error streaming associated cameras for a facility", {
						err: err
					});
				}
				else {
					// -- update camera cache
					const batch = [];
					Object.keys(data).forEach(key => {
						const entityIds = [];
						switch(key) {
							case "add":
								if (data[key] && data[key].length > 0) {
									data[key].forEach(entId => {
										entityIds.push(entId);
									});
									batch.push({
										type: "add",
										new_val: {
											entityId,
											["cameras"]: entityIds
										}
									});
								}
								break;
							case "update":
								break;
							case "remove":
								if (data[key] && data[key].length > 0) {
									data[key].forEach(entId => {
										entityIds.push(entId);
									});
									batch.push({
										type: "remove",
										old_val: {
											entityId,
											["cameras"]: entityIds
										}
									});
								}
								break;
							default:
								break;
						}
					});
					handler(null, batch);
				}
			};

			const floorplanCameraStreamHandler = (err, data) => {
				if (err) {
					logger.error("streamCameraContexts", "There was an error streaming floorplan cameras for a facility", {
						err: err
					});
				}
				else {
					const batch = [];
					if (data && data.length > 0) {
						data.forEach(update => {
							switch(update.type) {
								case "add":
								case "change":
								case "initial":
									if (update.new_val) {
										const cameraId = update.new_val.id;
										batch.push({
											type: "add",
											new_val: {
												entityId,
												["cameras"]: [cameraId]
											}
										});
									}
									break;
								case "remove":
									if (update.old_val) {
										const cameraId = update.old_val.id;
										batch.push({
											type: "remove",
											old_val: {
												entityId,
												["cameras"]: [cameraId]
											}
										});
									}
									break;
								default:
									break;
							}
						});
						
						handler(null, batch);

					}
				}
			};

			// -- stream associated cameras (in FOV)
			const cancelAssocFn = await cameraModel.streamAssociatedCameras(userId, entityId, type, cameraStreamHandler);

			// -- stream floorplan cameras
			const facilityModel = ENTITY_TYPE_MODELS[type];
			const floorplans = await facilityModel.getFacilityFloorplans(userId, null, entityId);
			const fpCanceFns = [];
			if (floorplans && floorplans.success) {
				this._asyncForEach(floorplans.result, async (floorplan) => {
					const cFn = await facilityModel.streamCamerasByFloorplan(userId, orgId, entityId, floorplan.id, floorplanCameraStreamHandler);
					fpCanceFns.push(cFn);
				});
			}

			cancelFn = function() {
				cancelAssocFn();
				for(const fn of fpCanceFns) fn();
			};

		}
		else { // track, shape
			const entityStreamHandler = (err, data) => {
				if (err) {
					logger.error("streamCameraContexts", "There was an error streaming associated cameras for a track or shape", {
						err: err
					});
				}
				else {
					// -- update camera cache
					const batch = [];
					Object.keys(data).forEach(key => {
						const entityIds = [];
						switch(key) {
							case "add":
								if (data[key] && data[key].length > 0) {
									data[key].forEach(entId => {
										entityIds.push(entId);
									});
									batch.push({
										type: "add",
										new_val: {
											entityId,
											["cameras"]: entityIds
										}
									});
								}
								break;
							case "update":
								break;
							case "remove":
								if (data[key] && data[key].length > 0) {
									data[key].forEach(entId => {
										entityIds.push(entId);
									});
									batch.push({
										type: "remove",
										old_val: {
											entityId,
											["cameras"]: entityIds
										}
									});
								}
								break;
							default:
								break;
						}
					});
					handler(null, batch);
				}
			};
			cancelFn = await cameraModel.streamAssociatedCameras(userId, entityId, type, entityStreamHandler);
		}
		if (callback) callback(null, cancelFn);
	}

	async _asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}
}

module.exports = CameraContextCache;
