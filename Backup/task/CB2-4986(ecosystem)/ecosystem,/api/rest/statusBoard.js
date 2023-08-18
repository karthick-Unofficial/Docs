const model = require("../../models/statusBoardModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/api/rest/facilities.js");


module.exports = function (app) {
	const restServer = app.rest;
	const realtimeServer = app.realtime;

	restServer.get("/statusBoard/statusCard", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;

			const result = await model.getLibrary(userId, orgId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.post("/statusBoard/statusCard", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { statusCard } = req.body;

			const result = await model.create(userId, orgId, statusCard);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/statusBoard/statusCard/:statusCardId", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { statusCardId } = req.routeVars;
			const { update } = req.body;

			const result = await model.update(userId, orgId, statusCardId, update);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/statusBoard/statusCard/:statusCardId/updateSelected", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { statusCardId } = req.routeVars;
			const { dataIndex, selectedIndex } = req.body;

			const result = await model.updateSelectedIndex(userId, orgId, statusCardId, dataIndex, selectedIndex);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.delete("/statusBoard/statusCard/:statusCardId", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { statusCardId } = req.routeVars;

			const result = await model.delete(userId, orgId, statusCardId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/statusBoard/statusCard/:statusCardId/share", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { statusCardId } = req.routeVars;
			const { orgs } = req.body;

			const result = await model.updateSharedWithOrgs(userId, orgId, statusCardId, orgs);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.post("/statusBoard/statusCard/:templateId/create", async function(req, res) {
		try {
			const { userId, orgId } = req.identity;
			const { templateId } = req.routeVars;

			const result = await model.createFromTemplate(userId, orgId, templateId);
			res.send(result);
		} 
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	realtimeServer.pubsub("/statusBoard/statusCard", async function (sub) {
		try {
			const result = await model.streamStatusCards(
				sub.identity.userId,
				sub.identity.orgId,
				function (err, record) {
					if (err) {
						logger.error(
							"streamStatusCards",
							"Unhandled error occurred while streaming status cards",
							{ err: { message: err.message, code: err.code } }
						);
					}
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (reason) {
			sub.pub(reason);
		}
	});
};