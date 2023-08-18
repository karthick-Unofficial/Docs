const systemNotificationModel = require("../../models/systemNotificationModel")({});

module.exports = function (app) {

	const restServer = app.rest;

	restServer.get("/systemNotifications/:notificationId/acknowledge", async function (req, res) {
		try {
			if (req.routeVars.notificationId) {
				const result = await systemNotificationModel.acknowledgeNotificationForUser(req.identity.userId, req.routeVars.notificationId);
				res.send(result);
			}
			else {
				res.err("notificationId not provided in request", {});
			}
		}
		catch(err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/systemNotifications/unacked", async function (req, res) {
		try {
			const result = await systemNotificationModel.getAllUnacked();
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err);
		}
	});
};