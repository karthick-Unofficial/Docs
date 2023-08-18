const model = require("../../models/configurationModel")({});

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/_internal/configuration/:appId", async function (req, res) {
		try {
			const config = await model.getByAppId(req.routeVars.appId);
			res.send(config);
		}
		catch (err) {
			console.log(err.message, err.stack);
			res.err(err);
		}
	});

	restServer.post("/_internal/configuration", async function (req, res) {
		try {
			const result = await model.create(req.body.config);
			res.send(result);
		}
		catch (err) {
			console.log(err.message, err.stack);
			res.err(err);
		}
	});

	restServer.put("/_internal/configuration", async function (req, res) {
		try {
			const result = await model.update(req.body.config);
			res.send(result);
		}
		catch (err) {
			console.log(err.message, err.stack);
			res.err(err);
		}
	});
};
