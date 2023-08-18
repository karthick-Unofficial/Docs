const model = require("../../models/authExclusionModel")({});


module.exports = function (app) {
	const restServer = app.rest;

	restServer.post("/exclusion/create", async function (req, res) {
		try {
			const { entityId, entityType, feedId } = req.body;
			const userId = req.identity.userId;
			const response = await model.create(userId, entityId, entityType, feedId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/exclusion/:entityIds", async function (req, res) {
		try {
			const entityIds = req.routeVars.entityIds.split(",");
			const userId = req.identity.userId;
			const response = await model.delete(userId, entityIds);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});
};