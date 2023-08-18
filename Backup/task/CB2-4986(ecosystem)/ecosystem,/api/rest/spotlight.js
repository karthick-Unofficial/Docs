const model = require("../../models/spotlightModel")();

module.exports = function (app) {
	const restServer = app.rest;

	restServer.post("/spotlight", async function(req, res) {
		try {
			const spotlight = req.body.spotlight;
			const userId = req.identity.userId;

			const result = await model.create(userId, spotlight);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
    
	restServer.put("/spotlight/:spotlightId", async function(req, res) {
		try {
			const spotlight = req.body.spotlight;
			const spotlightId = req.routeVars.spotlightId;
			const userId = req.identity.userId;

			const result = await model.update(userId, spotlightId, spotlight);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
    
	restServer.delete("/spotlight/:spotlightId", async function(req, res) {
		try {
			const spotlightId = req.routeVars.spotlightId;
			const userId = req.identity.userId;

			const result = await model.delete(userId, spotlightId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/spotlight", async function(req, res) {
		try {
			const userId = req.identity.userId;

			const result = await model.getAllActive(userId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
};