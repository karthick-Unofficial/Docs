const model = require("../../models/listModel")({});
const listMiddleware = new (require("../../logic/list"));

module.exports = function(app) {

	const restServer = app.rest;
	const timezone = app._config.timezone ? app._config.timezone : "America/New_York";
	// Get all original lists. Used for pinning to event.
	restServer.get("/list", async function (req, res) {
		try {
			const result = await listMiddleware.getUserLists(req);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Get any list by id
	restServer.get("/list/:id", async function (req, res) {
		try {
			const result = await model.getById(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.id);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Create original list
	restServer.post("/list", async function (req, res) {
		try {
			const result = await model.create(
				req.identity.userId,
				req.identity.orgId,
				req.body.list);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Delete list by id
	restServer.delete("/list/:listId", async function (req, res) {
		try {
			const result = await model.delete(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.listId);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Update list by id
	restServer.put("/list/:listId", async function(req, res) {
		try {
			const result = await listMiddleware.updateList(req, timezone);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Create list copies on event via array of original list ids
	restServer.post("/list/template", async function (req, res) {
		try {
			const result = await model.createByTemplate(
				req.body.listIds,
				req.body.type,
				req.body.eventId,
				req.identity.userId,
				req.identity.orgId);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	// Create a copy of an original list
	restServer.post("/list/:listId/clone", async function (req, res) {
		try {
			const result = await model.cloneList(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.listId,
				req.body.update);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

};

