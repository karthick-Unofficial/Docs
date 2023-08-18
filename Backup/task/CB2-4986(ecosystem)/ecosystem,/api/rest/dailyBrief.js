const model = require("../../models/dailyBriefModel")({});
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {

	const restServer = app.rest;

	restServer.post("/dailybrief", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { dailyBriefModel } = translations.ecosystem.activities;
			const result = await model.create(
				req.identity.userId,
				req.identity.orgId,
				req.body.post,
				dailyBriefModel.create);
			res.send(result);
		} catch (err) {
			res.err(err.message, err.err);
		}
	});

	restServer.delete("/dailybrief/:id", async function (req, res) {
		try {
			const result = await model.delete(req.routeVars.id);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.put("/dailybrief/:id", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { dailyBriefModel } = translations.ecosystem.activities;
			const result = await model.update(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.id,
				req.body.post,
				dailyBriefModel.update);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});
};
