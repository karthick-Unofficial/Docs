
const global = require("../../app-global.js");

module.exports = function (app) {

	const restServer = app.rest;

	// proxy for getting track history
	restServer.post("/ecolink/track-history", async function (req, res) {
		try {
			const targetEntityId = req.body.fields.entities[0].id;
			const idParts = targetEntityId.split("@@");
			const remoteEcoId = idParts.length === 2 ? idParts[1] : null;
			req.body.fields.entities[0].id = idParts[0]; 

			let result = null;
			if(remoteEcoId) { // proxy to remote eco
				result = await global.ecoLinkManager.execReq(
					remoteEcoId,
					"POST",
					"/reports-app/api/vessel-position/generate",
					req,
					"reports-app"
				);
			}
			else {
				result = await app.appRequest.request(
					"reports-app",
					"POST",
					"/reports-app/api/vessel-position/generate",
					req.query || null,
					req.body || null,
					req.identity || {},
					null,
					req.headers
				);
			}
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

};