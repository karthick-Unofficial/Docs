const model = require("../../models/roleModel")({});

module.exports = function(app) {

	const restServer = app.rest;

	restServer.post("/roles", async function (req, res) {
		try {
			const{ role } = req.body;
			const result = await model.create(req.identity.userId, req.identity.orgId, role);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}
	});

	restServer.put("/roles/:id", async function (req, res) {
		try {
			const orgRoleId = req.routeVars.id;
			const { role } = req.body;
			const result = await model.update(req.identity.userId, req.identity.orgId, orgRoleId, role);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}
	});

	restServer.delete("/roles/:id", async function (req, res) {
		try {
			const id = req.routeVars.id;
			const result = await model.delete(req.identity.userId, req.identity.orgId, id);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}

	});

	restServer.get("/roles/:orgId", async function (req, res) {
		try {
			const result = await model.getByOrg(req.routeVars.orgId);
			res.send(result);
		}
		catch(err) {
			res.send(err);
		}
	});


};
