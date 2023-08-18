const { entityAssociations } = require("../../lib/entityAssociations.js");

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/associations/:entityId", async function (req, res) {
		try {
			const entityId = req.routeVars.entityId;
			const associations = await entityAssociations(entityId, req.identity);
            
			res.send(associations);
		}
		catch (err) {
			res.err(err);
		}
	});
};