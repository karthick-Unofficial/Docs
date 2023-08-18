const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("shape-activity-generator", "/process/activityGenerator.js");
const util = require("../lib/utility");
const proc = require("node-app-core").process("shape-activity-generator", {});
const EcoLinkManager = require("../lib/ecoLink/ecoLinkManager");

const shapeMiddleware = new (require("../logic/shape"));
const activityModel = require("../models/activityModel")();
const feedModel = require("../models/feedModel")();
// -- required references in imported classes - will be going away by adding app/process to global namespace in node-app-core
const global = require("../app-global.js");
global.globalChangefeed = proc.globalChangefeed;
global.logger = proc.logger;
global.appRequest = proc.appRequest;

const turf = require("@turf/turf");
const shapes = {};
const counters = {
	evaluations: 0,
	activities: 0,
	tracksReceived: 0,
	tracksProcessed: 0,
	nonRealtime: 0
};

proc.initialize = async function (args) {
	try {
		const ecoLinkMgr = new EcoLinkManager("shape-activity-generator-eco-link", { loadbalance: true });
		ecoLinkMgr.events.on("ready", initListeners);
		await ecoLinkMgr.init();
		global.ecoLinkManager = ecoLinkMgr;
	}
	catch (e) {
		logger.error("initialize", "Unexpected error during initialization.", { err: JSON.stringify(e) });
		proc.fail("unhandled exception", e);
	}
	proc.initSuccess();
};

proc.shutdown = function () {
	proc.shutdownSuccess();
};

proc.getHealth = function () {
	// -- status should probably be more about performance or could be related to acceptable errors but want to be aware. 
	// -- Maybe I can come up with a metric that would generically help measure performance
	// -- like a ping and measure response time for starters
	// -- actually the ping could be built into health fetch I think
	const health = {
		status: 1,
		metrics: {
			eval_counter: counters.evaluations,
			activities_generated: counters.activities,
			tracks_received: counters.tracksReceived,
			tracks_processed: counters.tracksProcessed,
			non_realtime: counters.nonRealtime,
			shapeCount: Object.keys(shapes).length
		}
	};
	//console.dir(health);
	return health;
};

async function initListeners() {
	const shapes = await shapeMiddleware.getAllShapes();
	for (const shape of shapes) {
		shapeSyncHandler({ type: "initial", new_val: shape });
	}
	if (global.ecoLinkManager.isActive()) {
		const remoteShapes = await global.ecoLinkManager.execReqAll(
			"GET",
			"/_internal/shapes",
			{},
			"ecosystem",
			true
		);
		for (const shape of remoteShapes) {
			shapeSyncHandler({ type: "initial", new_val: shape });
		}
	}
	proc.globalChangefeed.subscribePersistent("track", globalChangefeedHandler);
	proc.globalChangefeed.subscribe({ entityType: "shapes" }, null, shapeSyncHandler);
	if (global.ecoLinkManager.isActive()) {
		global.ecoLinkManager.events.on("change", ecoLinkGlobalChangefeedHandler);
		global.ecoLinkManager.subscribeAllGCF({ entityType: "shapes" }, null, (change, key) => {
			const shape = change.new_val || change.old_val;
			shape.id = `${change.new_val.id}@@${key}`;
			shape.feedId = `${change.new_val.feedId}@@${key}`;
			shapeSyncHandler(change);
		});
	}
}

function shapeSyncHandler(change) {
	// -- cache shapes locally and keep updated
	try {
		let isAdding = false;
		switch (change.type) {
			case "initial":
			case "add":
			case "update":
			case "change":
				// -- no processing on Point types for now
				if (["POINT"].indexOf(change.new_val.entityData.properties.type.toUpperCase()) === -1) {
					isAdding = true;
					shapes[change.new_val.id] = change.new_val;
				}
				logger.info("shapeSyncHandler", isAdding ? "adding" : "ignoring" + change.new_val.entityData.properties.type, change.new_val.id, { change: change });
				break;
			case "remove":
				logger.info("shapeSyncHandler", "Removing shape", { change: change });
				delete shapes[change.old_val.id];
				break;
			default:
				logger.error("shapeSyncHandler", "Invalid or unrecognized change type", { change: change });
				break;
		}
	}
	catch (err) {
		logger.error("shapeSyncHandler", "Unexpected error in shape synchronization.", { errMessage: err.message, errStack: err.Stack });
		proc.fail("Unexpected error in shape synchronization.", err);
	}
}

function ecoLinkGlobalChangefeedHandler(change) {
	const entityType = change.new_val ? change.new_val.entityType : change.old_val.entityType;
	if (entityType && entityType === "track")
		globalChangefeedHandler(change);
}

// -- subscribe to globalfeed as this scales well and evaluate entities against shapes and generate activities
// -- use queues to load balance across processes
function globalChangefeedHandler(change, subject) {
	const span = proc.tracer.startSpan("activity-generator");
	if (!change.rt) counters.nonRealtime++;
	counters.tracksReceived++;
	analyzeTrack(change, span).then(() => {
		span.finish();
		counters.tracksProcessed++;
	});
}

function analyzeTrack(change, span) {
	return new Promise(async (resolve, reject) => {
		try {
			const oldEnt = change.old_val ? change.old_val : null;
			const ent = change.new_val;

			// -- At momemnt there could be an oldEnt (or even new I suppose) without geometry if AIS type 5 message is only message reported (no type 1,2,3)
			// -- ultimately I think best to re-engineer the feed to make that case not possible
			const oldGeo = oldEnt && oldEnt.entityData.geometry ? oldEnt.entityData.geometry.coordinates : null;
			const newGeo = ent && ent.entityData.geometry ? ent.entityData.geometry.coordinates : null;
			if (!newGeo && !oldGeo) {
				span.log({
					event: "error",
					reason: "Can't evaluate feed entity without geometry",
					entityId: ent ? ent.id : oldEnt.id
				});
				resolve();
			}
			else {
				const oldPt = oldGeo ? turf.point(oldGeo) : null;
				const pt = newGeo ? turf.point(newGeo) : null;
				const shapeKeys = Object.keys(shapes);
				for (let i = 0; i < shapeKeys.length; i++) {
					const shape = shapes[shapeKeys[i]];
					try {
						if (shape.entityData.geometry.type.toLowerCase() === "polygon") {
							counters.evaluations++;
							const poly = turf.polygon(shape.entityData.geometry.coordinates);
							const oldPtInPolygon = oldPt ? turf.inside(oldPt, poly) : false;
							const newPtInPolygon = pt ? turf.inside(pt, poly) : false;
							span.log({ event: "pip-test" });
							if (oldPtInPolygon !== newPtInPolygon) {
								const activityType = oldPtInPolygon ? "exit" : "enter";
								logger.info("analyzeTrack", "Activity generated", { changeReport: change });
								const activity = await generateActivity(activityType, shape, (ent || oldEnt));
								if (!proc._testMode) {
									try {
										const result = await activityModel.queueActivity(activity, "shape-activity-generator");
										logger.info("analyzeTrack", "Successfully queued polygon activity", { result: result, activity: activity });
										if (proc._config.mapbox.mapThumbnailsEnabled && oldEnt) {
											const features = [shape.entityData.geometry];
											if (ent) {
												features.unshift(ent.entityData.geometry);
											}
											if (oldEnt) {
												features.unshift(oldEnt.entityData.geometry);
											}
											util.attachMapThumbnail(
												proc,
												result.activityId,
												newGeo || oldGeo,
												12, //zoom - how best to determine?
												features
											);
										}
										span.log({ event: `publish-${activityType}-activity-success` });
										counters.activities++;
									} catch (reason) {
										span.log({ event: `publish-${activityType}-activity-failed` });
										logger.error("analyzeTrack", "Error queuing polygon activity", { err: JSON.stringify(reason), activity: activity });
									}
								}
							}
						}
						else if (shape.entityData.geometry.type.toLowerCase() === "linestring" && shape.entityData.geometry.coordinates.length === 2 && newGeo && oldGeo) {
							counters.evaluations++;

							const line = turf.lineString(shape.entityData.geometry.coordinates);
							const entLine = turf.lineString([oldGeo, newGeo]);
							const intersectColl = turf.lineIntersect(line, entLine);
							if (intersectColl.features.length > 0) {
								const activity = await generateActivity("cross", shape, (ent || oldEnt));
								//activity.target["intersectPoint"] = intersectColl.features[0];
								if (!proc._testMode) {
									try {
										const result = await activityModel.queueActivity(activity, "shape-activity-generator");
										logger.info("analyzeTrack", "Successfully queued linestring activity", { result: result, activity: activity });
										counters.activities++;
									} catch (reason) {
										logger.error("analyzeTrack", "Error queuing linestring activity", { err: JSON.stringify(reason), activity: activity });
									}
								}
							}
						}
					}
					catch (err) {
						logger.error("analyzeTrack", "Unexpected error during analysis", { errMessage: err.message, errStack: err.stack, shape: shape, change: change });
						reject(err);
					}
				}
				resolve();
			}
		}
		catch (err) {
			logger.error("analyzeTrack", "Unexpected error during analysis", { errMessage: err.message, errStack: err.stack, change: change });
			reject(err);
		}
	});
}

async function generateActivity(activityType, target, object) {
	// todo need the domain for the system to generate proper urls
	const displayName = await feedModel.getDisplayNameByEntity(object);
	const activity = {
		"summary": `${displayName} ${activityType}ed ${target.entityData.properties.name}`,
		"type": activityType,
		"activityDate": object.acquisitionTime || new Date(),
		"authAppId": "map-app", // -- TODO: technically should never change but may let this be configurable because it also technically could. POssible in this case coild be rules-app. We could also use * in cases where we know it would be handled by ent auth
		"actor": {
			"type": "application",
			"id": "shape-activity-generator",
			"name": "Shape Activity Generator Process",
			"url": "https://localhost/ecosystem/api/_processes"
		},
		"object": {
			"id": object.id,
			"type": object.entityType,
			"name": displayName,
			// "name": object.entityData.properties.name,
			"url": `http://ecosystem/api/feedEntities/${object.id}`,
			"feedId": object.feedId,
			"entity": object
		},
		"target": {
			"id": target.id,
			"name": target.entityData.properties.name,
			"type": target.entityType,
			"url": `http://ecosystem/api/entities/${target.id}`,
			"feedId": target.feedId,
			"entity": target
		},
		// -- todo: lookup other objects in the area, cameras in particular but if there were patrol vehicles or ?
		// -- the context of an activity being generated might determine what is looked up and could vary by system so may need to be done centrally - perhaps when activity is processed		
		"contextEntities": [
			{ "id": object.id, "type": object.entityType },
			{ "id": target.id, "type": target.entityType }
		],
		"geometry": object.entityData.geometry
	};
	return activity;
}

