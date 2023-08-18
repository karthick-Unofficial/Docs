const model = require("../../models/mapStylesModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/mapStyles.js");


module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/mapStyles", async function (req, res) {
		try {
			logger.info("mapStyles orgId", req);
			const result = await model.getAll(req.identity.orgId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});
};
