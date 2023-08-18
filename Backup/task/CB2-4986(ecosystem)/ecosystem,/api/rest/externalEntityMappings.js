const model = require("../../models/externalEntityMappingModel")({});

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/externalEntityMappings/source/:sourceId", async function (req, res) {
		try {
			const response = await model.getBySourceId(req.routeVars.sourceId, req.query ? req.query.targetType : null);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.get("/externalEntityMappings/target/:targetId", async function (req, res) {
		try {
			const response = await model.getByTargetId(req.routeVars.targetId, req.query ? req.query.targetType : null);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.post("/externalEntityMappings", async function (req, res) {
		try {
			const response = await model.upsert(null, null, req.body.mapping);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.put("/externalEntityMappings/source/:sourceId", async function (req, res) {
		try {
			const response = await model.upsert(req.routeVars.sourceId, null, req.body.mapping);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.put("/externalEntityMappings/target/:targetId", async function (req, res) {
		try {
			const response = await model.upsert(null, req.routeVars.targetId, req.body.mapping);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});
};