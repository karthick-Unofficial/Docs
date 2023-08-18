// const model = require("../../models/emailModel")();
const emailProvider = require("../../lib/emailProvider")();

module.exports = function (app) {

	const restServer = app.rest;

	restServer.post("/email", async function (req, res) {
		try {
			const message = req.body;
	
			const result = await emailProvider.queueEmail(message);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});


};