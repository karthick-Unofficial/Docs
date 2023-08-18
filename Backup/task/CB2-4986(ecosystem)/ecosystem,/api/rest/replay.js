const snapshot = require("../../lib/snapshot")();
const replayModel = require("../../models/replayModel")();
const ReplayLogic = require("../../logic/replay");
const logic = new ReplayLogic();

module.exports = function (app) {

	const restServer = app.rest;

	restServer.get("/replay", async function (req, res) {
		try {
			const result = await replayModel.getAll(
				req.identity.userId,
				req.identity.orgId,
			);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/replay/export/:replayId", async function (req, res) {
		try {
			const result = await logic.getPortableExport(req.identity, req.routeVars.replayId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.post("/replay/saveReplay", async function (req, res) {
		try {
			const result = await replayModel.create(
				req.identity.userId,
				req.identity.orgId,
				req.body.replay
			);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/replay/deleteReplays", async function (req, res) {
		try {
			const result = await replayModel.delete(
				req.identity.userId,
				req.body.replayIds,
			);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/replay/updateReplay/:replayId", async function (req, res) {
		try {
			const result = await replayModel.update(
				req.identity.userId,
				req.routeVars.replayId,
				req.body.replay
			);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	// -- will make internal and have a scheduled task execute
	restServer.get("/replay/createSnapshot", async function (req, res) {
		try {
			const result = await snapshot.generate();
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	// Consider: maybe a call to get the snapshot also returns info about the transactions, count, scrollId
	restServer.post("/replay/getSnapshot", async function (req, res) {
		try {
			const result = await logic.getSnapshot(req);
			res.send(result);
		}
		catch (err) {
			res.err({ message: err.message, code: 500 }, err);
		}
	});

	restServer.post("/replay/getTransactions", async function (req, res) {
		try {
			const result = await logic.getTransactions(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});


	restServer.post("/replay/getTimelineAlerts", async function (req, res) {
		try {
			const result = await replayModel.getNotificationTimeline(
				req.identity.userId,
				req.body.from,
				req.body.to,
				req.body.filter);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.post("/replay/getAlertTransactions", async function (req, res) {
		try {
			const result = await replayModel.getNotificationTransactions(
				req.identity.userId,
				req.body.from,
				req.body.to,
				req.body.filter);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/replay/getBuffer", async function (req, res) {
		try {
			const result = await replayModel.getReplayBuffer(
				req.identity.userId,
				req.query.entityId,
				req.query.from,
				req.query.to,
				req.query.distance);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

};