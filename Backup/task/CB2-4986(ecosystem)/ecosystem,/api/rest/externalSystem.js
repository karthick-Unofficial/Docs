const model = require("../../models/externalSystemModel")({});

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/externalSystem", async function (req, res) {
		try {
			const result = await model.getAll(req.identity.orgId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/externalSystem/:externalSystemId", async function (req, res) {
		try {
			const response = await model.getById(req.identity.userId, req.routeVars.externalSystemId);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/externalSystem/:externalSystemId/configuration", async function (req, res) {
		try {
			const response = await model.getConfigurationById(req.identity.userId, req.routeVars.externalSystemId);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.post("/externalSystem", async function (req, res) {
		try {
			const response = await model.upsert(null, null, req.body.externalSystem);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/externalSystem/:externalSystemId", async function (req, res) {
		try {
			const response = await model.upsert(req.routeVars.externalSystemId, null, req.body.externalSystem);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	// -- Internal use only - route starts with _internal
	// -- add method to node-app-core to register ineternal routes
	// -- return not found for any internal routes attempt to be accessed via app-gateway (external client)
	restServer.get("/_internal/externalSystems", async function (req, res) {
		try {
			const extSys = await model.getAllInternal(); 
			res.send(extSys);
		}
		catch (ex) {
			res.err(ex);
		}
	});

};