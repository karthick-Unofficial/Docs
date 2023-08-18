const model = require("../../models/sharingConnectionModel")();
const SharingConnection = require("../../logic/sharingConnection");
const sharingConnection = new SharingConnection();

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/sharingConnection/status", async function (req, res) {
		try {
			const result = await model.sharingTokensEnabled();
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}

	});

	restServer.get("/_internal/sharingConnections/:connectionId", async function (req, res) {
		try {
			const result = await model.getById(req.routeVars.connectionId);
			res.send(result);
		}
		catch (err) {
			res.err({ message: err.message, stack: err.stack }, { code: 500 });
		}
	});


	restServer.get("/_internal/sharingConnections/ecosystem/:ecoId", async function (req, res) {
		try {
			const result = await model.getByEco(req.routeVars.ecoId);
			res.send(result);
		}
		catch (err) {
			res.err({ message: err.message, stack: err.stack }, { code: 500 });
		}
	});

	restServer.put("/_internal/sharingConnections/:connectionId/establish", async function (req, res) {
		try {
			const result = await model.establishConnection(
				req.routeVars.connectionId,
				req.body.userId,
				req.body.orgId,
				req.body.orgName,
				req.body.ecoId
			);

			console.log("establish ReST", result);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});


};
