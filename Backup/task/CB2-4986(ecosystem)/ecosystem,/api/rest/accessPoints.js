const model = require("../../models/accessPointModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/accessPoint.js");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");


module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/accessPoints", async function (req, res) {
		try {
			const result = await model.getAll(req.identity.userId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/accessPoints/:id", async function (req, res) {
		try {
			const result = await model.getById(req.identity.userId, req.routeVars.id);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/accessPoints/externalSourceId/:sourceId", async function (req, res) {
		try {
			const result = await model.getBySourceId(req.identity.userId, req.routeVars.sourceId);
			res.send(result);
		} catch (error) {
			res.err(error);
		}
	});

	restServer.put("/accessPoints/:accessPointId", async function(req, res) {
		try {
			const { userId } = req.identity;
			const { accessPointId } = req.routeVars;
			const accessPoint = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { accessPointModel } = translations.ecosystem.activities;

			const result = await model.update(userId, accessPointId, accessPoint, accessPointModel.update);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/accessPoints/:accessPointId/displayTarget/:displayTargetId", async function(req, res) {
		try {
			const { userId } = req.identity;
			const { accessPointId, displayTargetId } = req.routeVars;

			const result = await model.removeAccessPointByIdFromDisplayTarget(userId, accessPointId, displayTargetId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.post("/accessPoints", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const result = await model.create(userId, orgId, req.body);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
};