const model = require("../../models/notificationModel")({});
const { isAdminUser } = require("../../lib/authorize");

module.exports = function(app) {

	const restServer = app.rest;

	restServer.post("/notifications", async function (req, res) {
		try {
			const result = await model.queueNotification(req.body);
			res.send(result);
		} catch(reason) {
			res.send({ "success": false, "reason": reason });
		}
	});

	restServer.post("/notifications", async function (req, res) {
		try {
			if (await isAdminUser(req, res)) {
				switch (req.query.action) {
					case "close": {
						const result = await model.closeAllBefore(req.query.before, req.query.olderThan);
						if (result.success) {
							res.send({ success: true, closed: result.closed });
						}
						else {
							res.err({ success: false });
						}
						break;
					}
					default:
						res.err({ err: { message: "Notification action missing or not supported.", code: 500 } });
						break;
				}
			}
			else {
				res.err({ err: { message: "User is not authorized to perform action.", code: 401 } });
			}
		}
		catch (err) {
			res.err({ err: { message: "Unexpected error performing request.", code: 500 } });
		}
	});

	restServer.put("/notifications/:notificationId/close", async function (req, res) {
		try {
			const result = await model.markClosed(req.routeVars.notificationId);
			res.send({ "success": true });
		} catch(reason) {
			res.send({ "success": false, "reason": reason });
		}
	});

	restServer.put("/notifications/closebulk", async function (req, res) {
		try {
			const result = await model.markClosedBulk(req.body.ids);
			res.send({ "success": true });
		} catch(reason) {
			res.send({ "success": false, "reason": reason });
		}
	});

	restServer.put("/notifications/:notificationId/reopen", async function (req, res) {
		try {
			const result = await model.markOpen(req.routeVars.notificationId);
			res.send({ "success": true });
		} catch(reason) {
			res.send({ "success": false, "reason": reason });
		}
	});

	restServer.put("/notifications/reopenbulk", async function (req, res) {
		try {
			const result = await model.markOpenBulk(req.body.ids);
			res.send({ "success": true });
		} catch(reason) {
			res.send({ "success": false, "reason": reason });
		}
	});

	restServer.get("/notifications", async function (req, res) {
		try {
			const result = await model.getActiveByUser(req.identity.userId);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}
	});

	restServer.get("/notifications?since=:since", async function (req, res) {
		try {
			const result = await model.getActiveByUser(req.identity.userId, req.routeVars.since);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}
	});

	restServer.get("/notifications/archive/:page", async function (req, res) {
		try {
			const page = req.routeVars.page;
			const result = await model.getArchived(req.identity.userId, page);
			res.send(result);
		}
		catch(err) {
			res.send(err);
		}
	});

	restServer.get("/notifications/cleanup", async function (req, res) {
		try {
			const daysOld = req.query.daysOld ? parseInt(req.query.daysOld) : 14;
			const result = await model.cleanup(daysOld);
			res.send(result);
		}
		catch(err) {
			res.send(err);
		}
	});

};