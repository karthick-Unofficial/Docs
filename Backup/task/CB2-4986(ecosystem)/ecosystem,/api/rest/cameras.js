const model = require("../../models/cameraModel")();
const feedModel = require("../../models/feedModel")();
const entityModel = require("../../models/entityModel")();
const cameraMiddleware = new (require("../../logic/camera"));
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");



module.exports = function (app) {
	const restServer = app.rest;
	const realtimeServer = app.realtime;

	// -- realtime
	realtimeServer.pubsub("/camerasInRange", async function (sub) {
		try {
			const result = await model.streamCamerasInRange(
				sub.identity.userId,
				sub.args.entityId,
				sub.args.entityType,
				function (err, record) {
					if (err) {
						console.log(err);
					}
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (reason) {
			sub.pub(reason);
		}
	});

	realtimeServer.pubsub("/fovs", async (sub) => {
		try {
			const result = await model.getMultipleFovs(
				sub.identity.userId,
				sub.args.cameraIds,
				function (err, record) {
					if (err) console.log(err);
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (err) {
			sub.pub(err);
		}

	});

	restServer.get("/cameras/inRangeOfEntity/:entityType/:entityId", async function (req, res) {
		try {
			const { entityType, entityId } = req.routeVars;
			const result = await model.getCamerasInRangeOfEntity(entityId, entityType);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.post("/cameras/inRangeOfGeo", async function (req, res) {
		try {
			const { geometry } = req.body;
			const result = await model.getCamerasInRange(geometry);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/cameraSystems", async function (req, res) {
		try {
			const result = await model.getCameraSystems(req.identity.userId);
			res.send(result);
		} catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/cameraSystems/:cameraSystemId", async function (req, res) {
		try {
			const result = await model.getCameraSystemById(req.identity.userId, req.routeVars.cameraSystemId);
			res.send(result);
		} catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/cameras", async function (req, res) {
		try {
			const cams = await cameraMiddleware.getCameras(req);
			res.send(cams);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/cameras/all-for-user", async function (req, res) {
		try {
			const result = await model.getAll(req.identity.userId);
			res.send(result);
		}
		catch (err) {
			res.err({ "message": err.message, code: 500 });
		}
	});

	restServer.get("/cameras/:cameraId", async function (req, res) {
		try {
			const result = await feedModel.getEntityWithAuthorization(req.identity.userId, req.routeVars.cameraId, "camera");
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	// -- Internal use only - route starts with _internal
	// -- add method to node-app-core to register ineternal routes
	// -- return not found for any internal routes attempt to be accessed via app-gateway (external client)
	restServer.post("/_internal/cameras/search", async function (req, res) {
		try {
			const result = await model._internalSearchCameras(req.body);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	// restServer.post("/cameras", function (req, res) {
	// 	model.create(req.identity.userId, req.identity.orgId, req.body.camera, (err, response) => {
	// 		if (err) {
	// 			res.err(err);
	// 		}
	// 		else {
	// 			res.send(response);
	// 		}
	// 	});
	// });

	restServer.put("/cameras/:cameraId", async function (req, res) {
		try {
			const camera = req.body.camera;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { cameraModel } = translations.ecosystem.activities;
			const result = await model.update(req.identity.userId, req.routeVars.cameraId, camera, cameraModel.update);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/cameras/:cameraId/displayTarget/:displayTargetId", async function (req, res) {
		try {
			const result = await model.removeCameraByIdFromDisplayTarget(req.identity.userId, req.routeVars.cameraId, req.routeVars.displayTargetId);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.get("/cameras/getCamerasForLinking/:entityId/linkable?entityType=:entityType&query=:query&pageSize=:pageSize", async function (req, res) {
		try {
			// if  query, use the query and pagesize from there
			const query = req.query ? req.query.query : null;
			const pageSize = req.query ? req.query.pageSize : 5;
			const entityType = req.query ? req.query.entityType : "";
			const { userId } = req.identity;
			const { entityId } = req.routeVars;

			const result = await model.getCamerasForLinking(userId, entityId, entityType, query, pageSize);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/cameras/getByDisplayTargetId/:displayTargetId", async function (req, res) {
		try {
			const result = await model.getByDisplayTargetId(req.routeVars.displayTargetId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/cameras/:cameraId/setSlewLock", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { cameraModel } = translations.ecosystem.activities;
			const result = await model.setSlewLock(req.identity.userId, req.routeVars.cameraId, req.body, cameraModel.setSlewLock);
			res.send({ success: true });
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.put("/cameras/:cameraId/releaseSlewLock", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { cameraModel } = translations.ecosystem.activities;
			const result = await model.releaseSlewLock(req.identity.userId, req.routeVars.cameraId, cameraModel.releaseSlewLock);
			res.send({ success: true });
		}
		catch (reason) {
			res.err(reason);
		}
	});

	// -- not allowed at moment
	// restServer.delete("/cameras/:cameraId", function (req, res) {
	// 	model.delete(req.identity.userId, req.routeVars.cameraId)
	// 		.then((result) => {
	// 			res.send(result);
	// 		})
	// 		.catch((reason) => {
	// 			res.err(reason);
	// 		});
	// });

	restServer.get("/cameras/:cameraId/fov", async function (req, res) {
		try {
			const result = await model.getFOV(req.identity.userId, req.routeVars.cameraId);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.put("/cameras/:cameraId/fov/:shapeId", async function (req, res) {
		try {
			const result = await model.updateFOV(req.identity.userId, req.routeVars.cameraId, req.routeVars.shapeId);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.delete("/cameras/:cameraId/fov", async function (req, res) {
		try {
			const result = await model.deleteFOV(req.identity.userId, req.routeVars.cameraId);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.post("/cameras/:cameraId/fov", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { shapeModel } = translations.ecosystem.activities;
			const result = await model.createFOV(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.cameraId,
				req.body.entityData,
				shapeModel.create
			);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	restServer.post("/cameras/:cameraId/comment", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { activities } = translations.ecosystem;
			const result = await entityModel.addComment(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.cameraId,
				"camera",
				req.body.comment,
				activities.entityModel.addComment
			);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	realtimeServer.pubsub("/cameras/slewLockCameras", async (sub) => {
		try {
			const result = await model.getCamerasWithSlewLock(
				function (err, record) {
					if (err) console.log(err);
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (err) {
			console.log("error", err);
			sub.pub(err);
		}
	});

	restServer.put("/cameras/:cameraId/spotlight", async function (req, res) {
		try {
			const data = req.body.data;
			const cameraId = req.routeVars.cameraId;
			const userId = req.identity.userId;

			const result = await model.upsertSpotlight(userId, cameraId, data);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.delete("/cameras/:cameraId/spotlight", async function (req, res) {
		try {
			const cameraId = req.routeVars.cameraId;
			const userId = req.identity.userId;

			const result = await model.deleteSpotlight(userId, cameraId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
};