const model = require("../../models/eventTypesModel")({});


module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/eventTypes", async function (req, res) {
		try {
			const response = await model.getAll(req.identity.userId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.get("/eventTypes/:eventTypeId", async function (req, res) {
		try {
			const response = await model.getById(req.identity.userId, req.routeVars.eventTypeId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.post("/eventTypes", async function (req, res) {
		try {
			const response = await model.create(req.identity.userId, req.body.eventType);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.put("/eventTypes/:eventTypeId", async function (req, res) {
		const eventType = req.body.eventType;
		try {
			const response = await model.update(req.identity.userId, req.routeVars.eventTypeId, eventType);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});
};