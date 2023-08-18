const model = require("../../models/organizationModel")({});

module.exports = function (app) {

	const restServer = app.rest;

	restServer.post("/organizations", async function (req, res) {
		const org = req.body.organization;
		const user = req.body.user;
		try {
			const result = await model.create(org, user);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	restServer.put("/organizations/:orgId", async function (req, res) {
		try {
			const org = req.body.organization;
			const result = await model.update(req.routeVars.orgId, org);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}


	});

	restServer.delete("/organizations/:orgId", async function (req, res) {
		try {
			const result = await model.delete(req.routeVars.orgId);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/organizations", async function (req, res) {
		try {
			const result = await model.getAll(req.query.remote);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/organizations/:orgId/integrations", async function (req, res) {
		try {
			const result = await model._getOrgIntegrations(req.routeVars.orgId, req.query.remote);
			res.send(result);
		}
		catch (err) {
			console.log(err.message, err.stack);
			res.err(err.message, err);
		}
	});

	restServer.get("/organizationsForSharing", async function (req, res) {
		try {
			const { orgId } = req.identity;
			const result = await model.getAllOrgsForSharing(orgId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.get("/organizations/:orgId", async function (req, res) {
		const orgId = req.routeVars.orgId;
		try {
			const result = await model.getById(orgId, req.query.remote);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/organizations/:orgId/users", async function (req, res) {
		// -- todo: passing identity here is ultimately a bad idea because we would have auth rules all over the place
		// -- rather we will need to validate whether user has access to a route or not which could even include arguments in some cases
		// -- i.e. user would need to be org admin of org data is requested for so in validating access to the route we would
		// -- need to confirm both those are true based on contents of auth token.
		//model.getOrgUsers(req.routeVars.orgId, req.identity)
		try {
			const result = await model.getOrgUsers(req.routeVars.orgId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.post("/organizations/:orgId/applications/:appId", async function (req, res) {
		try {
			const result = await model.upsertApplication(
				req.routeVars.orgId,
				req.routeVars.appId,
				req.body.config
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.put("/organizations/:orgId/applications/:appId", async function (req, res) {
		try {
			const result = await model.upsertApplication(
				req.routeVars.orgId,
				req.routeVars.appId,
				req.body.config
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.delete("/organizations/:orgId/applications/:appId", async function (req, res) {
		try {
			const result = await model.removeApplication(
				req.routeVars.orgId,
				req.routeVars.appId
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.post("/organizations/:orgId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.upsertIntegration(
				req.identity.userId,
				req.routeVars.orgId,
				req.routeVars.intId,
				req.body.policy);
			res.send(result);
		}
		catch (err) {
			res.send({ err: { message: err.message, stack: err.stack } });
		}
	});

	restServer.put("/_internal/linkedEco/syncIntegration", async function (req, res) {
		try {
			const result = await model.syncOrgIntegration(req.body);
			res.send(result);
		}
		catch (err) {
			res.send({ err: { message: err.message, stack: err.stack } });
		}
	});

	restServer.put("/organizations/:orgId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.upsertIntegration(
				req.identity.userId,
				req.routeVars.orgId,
				req.routeVars.intId,
				req.body.policy
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.delete("/organizations/:orgId/integrations/:intId", async function (req, res) {
		try {
			const result = await model.removeIntegration(
				req.identity.userId,
				req.routeVars.orgId,
				req.routeVars.intId
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.post("/organizations/:ownerOrg/integrations/:intId/share", async function (req, res) {
		try {
			const result = await model.shareIntegration(
				req.routeVars.ownerOrg,
				req.routeVars.intId,
				req.body.orgs
			);
			res.send(result);
		} catch (err) {
			res.send(err);
		}

	});

	restServer.post("/organizations/:orgId/applications", async function (req, res) {
		try {
			const result = await model.assignApps(
				req.routeVars.orgId,
				req.body.apps
			);
			res.send(result);
		} catch (err) {
			res.send(err);
		}

	});

	restServer.post("/organizations/:orgId/integrations", async function (req, res) {
		try {
			const result = await model.assignIntegrations(
				req.routeVars.orgId,
				req.body.integrations

			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.post("/organizations/:orgId/image", async function (req, res) {
		try {
			const orgId = req.routeVars.orgId;
			const fileHandle = req.body.fileHandle;

			const result = await model.setOrgProfileImage(orgId, fileHandle);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/orgApplications", async function (req, res) {
		try {
			const result = await model.getAllOrgApps();
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}

	});

	restServer.post("/organizations/sharingConnection", async function (req, res) {
		try {
			const result = await model.createSharingConnection(
				req.identity.userId,
				req.identity.orgId
			);
			res.send(result);
		} catch (err) {
			res.err(err);
		}

	});

	restServer.put("/organizations/sharingConnection/:connectionId", async function (req, res) {
		try {
			const result = await model.establishSharingConnection(
				req.routeVars.connectionId,
				req.identity.userId,
				req.identity.orgId
			);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/organizations/sharingConnection/:connectionId", async function (req, res) {
		try {
			const result = await model.disconnectSharingConnection(
				req.routeVars.connectionId);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}

	});
};