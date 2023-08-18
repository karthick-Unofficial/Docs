const model = require("../../models/facilitiesModel")();
const { Logger } = require("node-app-core/dist/logger");
// const logger = new Logger("ecosystem", "/api/rest/facilities.js");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");


module.exports = function (app) {
	const restServer = app.rest;
	// const realtimeServer = app.realtime;

	restServer.post("/accessPoint", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { accessPoint } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { accessPointModel } = translations.ecosystem.activities;

			const result = await model.create(userId, orgId, accessPoint, accessPointModel.create);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/accessPoint/:accessPointId", async function (req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { accessPointId } = req.routeVars;
			const { update } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { accessPointModel } = translations.ecosystem.activities;

			const result = await model.update(userId, orgId, accessPointId, update, accessPointModel.update);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

};