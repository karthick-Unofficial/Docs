const model = require("../../models/applicationModel")({});

const userPolicyCache = new (require("../../lib/userPolicyCache"));

module.exports = function (app) {

	const restServer = app.rest;

	restServer.post("/applications", async function (req, res) {
		try {
			const app = req.body.application;
			const result = await model.create(app);
			res.send(result);
		} catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/applications", async function (req, res) {
		try {
			const result = await model.getAll();
			res.send(result);
		} catch (ex) {
			res.send(ex);
		}
	});

	restServer.get("/applications/:appId/authorize/:permission", async function (req, res) {
		try {
			if (!Object.keys(userPolicyCache.appPermissionTypes).includes(req.routeVars.permission)) {
				res.err({ message: `${req.routeVars.permission} is not a valid application permission type`, code: 500 });
			}
			const isAuth = userPolicyCache.authorizeApplication(req.identity.userId, req.routeVars.appId, userPolicyCache.appPermissionTypes[req.routeVars.permission]);
			res.send({ appId: req.routeVars.appId, permission: req.routeVars.permission, isAuth: isAuth });
		}
		catch (err) {
			res.err({ message: `unexpected error: ${err.message}`, code: 500 });
		}
	});

	restServer.get("/applications/:appId", async function (req, res) {
		try {
			const result = await model.getApplicationProfile(req.routeVars.appId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/applications/:appId/orgProfile/:orgId", async function (req, res) {
		try {
			const result = await model.getApplicationOrgProfile(req.routeVars.appId, req.routeVars.orgId);
			res.send(result);
		}
		catch (reason) {
			res.send(reason);
		}
	});

	restServer.get("/applications/:appId/translations", async function (req, res) {
		try {
			const appId = req.routeVars.appId;
			const result = await model.getTranslations(appId);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	restServer.get("/applications/:appId/translations/:culturecode", async function (req, res) {
		try {
			const appId = req.routeVars.appId;
			const cultureCode = req.routeVars.culturecode;
			const result = await model.getTranslations(appId);
			result.translations = result.translations[cultureCode];
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

};
