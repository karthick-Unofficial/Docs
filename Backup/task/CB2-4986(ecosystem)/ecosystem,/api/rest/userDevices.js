const model = require("../../models/userDeviceModel")({});

module.exports = function(app) {

	const restServer = app.rest;

	restServer.get("/userDevices/:deviceId", async function (req, res) {
		try {
			const result = await model.getByDeviceId(req.routeVars.deviceId);
			res.send(result);
		} catch(reason) {
			res.send(reason);
		}
	});

	restServer.post("/userDevices", async function (req, res) {
		try {
			const result = await model.create(req.body);
			res.send(result);
		} catch(reason) {
			res.err(reason.message, reason.err);
		}
	});

	restServer.put("/userDevices/:deviceId", async function (req, res) {
		try {
			const result = await model.update(req.routeVars.deviceId, req.body);
			res.send(result);
		} catch(reason) {
			res.send(reason);
		}
	});

	restServer.delete("/userDevices/:deviceId", async function (req, res) {
		try {
			const result = await model.delete(req.routeVars.deviceId);
			res.send(result);
		} catch(reason) {
			res.send(reason);
		}
	});

};