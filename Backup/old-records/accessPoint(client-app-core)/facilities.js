const model = require("../../models/facilitiesModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/facilities.js");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");


module.exports = function (app) {
	const restServer = app.rest;
	const realtimeServer = app.realtime;

	restServer.post("/facilities", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facility } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.create(userId, orgId, facility, facilitiesModel.create);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/facilities/:facilityId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;
			const { update } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.update(userId, orgId, facilityId, update, facilitiesModel.update);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.delete("/facilities/:facilityId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.delete(userId, orgId, facilityId, facilitiesModel.delete);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/facilities/:facilityId/floorplan", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;

			const result = await model.getFacilityFloorplans(userId, orgId, facilityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.post("/facilities/:facilityId/floorplan", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;
			const { floorplan } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.createFloorplan(userId, orgId, facilityId, floorplan, facilitiesModel.createFloorplan);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/facilities/:facilityId/floorplan/:floorplanId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId, floorplanId } = req.routeVars;
			const { update } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.updateFloorplan(userId, orgId, facilityId, floorplanId, update, facilitiesModel.updateFloorplan);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/facilities/:facilityId/floorplan/:floorplanId/camera/:cameraId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId, floorplanId, cameraId } = req.routeVars;
			const { geo } = req.body;

			const result = await model.addCameraToFloorplan(userId, orgId, facilityId, floorplanId, cameraId, geo);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/facilities/:facilityId/reorderFloorplan", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;
			const { floorplans } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.updateFloorplanOrders(userId, orgId, facilityId, floorplans, facilitiesModel.updateFloorplanOrders);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.delete("/facilities/:facilityId/floorplan/:floorplanId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { facilityId, floorplanId } = req.routeVars;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { facilitiesModel } = translations.ecosystem.activities;

			const result = await model.deleteFloorplan(userId, orgId, facilityId, floorplanId, facilitiesModel.deleteFloorplan);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/facilities/floorplanCameras", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;

			const result = await model.getCamerasForPlacing(userId, orgId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/facilities/floorplanAccessPoints", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;

			const result = await model.getAccessPointsForPlacing(userId, orgId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});


	restServer.get("/facilities/floorPlan/:floorPlanId", async function (req, res) {
		try {

			const { userId, orgId } = req.identity;
			const { floorPlanId } = req.routeVars;
			const result = await model.getFloorPlanById(userId, orgId, floorPlanId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/facilities/facility/:facilityId", async function (req, res) {
		try {

			const { userId, orgId } = req.identity;
			const { facilityId } = req.routeVars;
			const result = await model.getFacilityById(userId, orgId, facilityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	// -- Internal use only - route starts with _internal
	restServer.get("/_internal/facilities/:facilityId", async function (req, res) {
		try {
			const { facilityId } = req.routeVars;
			const result = await model._internalGetById(facilityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	restServer.delete("/facilities/:facilityId/deleteFloorPlanAttachment/:attachmentId", async function (req, res) {
		try {

			const { userId, orgId } = req.identity;
			const { facilityId, attachmentId } = req.routeVars;
			const result = await model.deleteFloorPlanFile(userId, orgId, facilityId, attachmentId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	realtimeServer.pubsub("/facilities", function (sub) {
		model.streamFacilities(
			sub.identity.userId,
			sub.identity.orgId,
			function (err, record) {
				if (err) {
					logger.error(
						"streamFacilities",
						"Unhandled error occurred while streaming facilities",
						{ err: { message: err.message, code: err.code } }
					);
				}
				sub.pub(record);
			})
			.then(function (result) {
				const cancelFn = result;
				sub.events.on("disconnect", () => {
					cancelFn();
				});
			})
			.catch(function (reason) {
				sub.pub(reason);
			});
	});

	realtimeServer.pubsub("/floorplanCameras", function (sub) {
		model.streamCamerasByFloorplan(
			sub.identity.userId,
			sub.identity.orgId,
			sub.args.facilityId,
			sub.args.floorplanId,
			function (err, record) {
				if (err) {
					logger.error(
						"streamCamerasByFloorplan",
						"Unhandled error occurred while streaming floorplan cameras",
						{ err: { message: err.message, code: err.code } }
					);
				}
				sub.pub(record);
			})
			.then(function (result) {
				const cancelFn = result;
				sub.events.on("disconnect", () => {
					cancelFn();
				});
			})
			.catch(function (reason) {
				sub.pub(reason);
			});
	});
};