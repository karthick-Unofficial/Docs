const model = require("../../models/cameraGroupModel")({});
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = async function (app) {
	const restServer = app.rest;

	restServer.get("/cameraGroups", async function (req, res) {
		try {
			const response = await model.getAll(req.identity.userId, req.identity.orgId);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/cameraGroups/:groupId", async function (req, res) {
		try {
			const response = await model.getById(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.groupId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.get("/cameraGroups/searchPinnable/:name", async function (req, res) {
		try {
			const response = await model.searchForPinning(
				req.identity.userId,
				req.routeVars.name);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.post("/cameraGroups", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { cameraGroupModel } = translations.ecosystem.activities;
		try {
			const response = await model.create(
				req.identity.userId,
				req.identity.orgId,
				req.body,
				cameraGroupModel.create);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/cameraGroups/:groupId", async function (req, res) {
		try {
			const response = await model.delete(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.groupId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.put("/cameraGroups/:groupId", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { cameraGroupModel } = translations.ecosystem.activities;
		try {
			const response = await model.update(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.groupId,
				req.body,
				cameraGroupModel.update);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});
};