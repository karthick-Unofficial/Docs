const model = require("../../models/listCategoryModel")({});
const listMiddleware = new (require("../../logic/list")); 

module.exports = function(app) {

	const restServer = app.rest;

	restServer.get("/listCategories", async function(req, res) {
		try {
			const result = await model.getAll(req.identity.userId, req.identity.orgId);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	restServer.get("/listCategories/:categoryId", async function (req, res) {
		try {
			const listCat = await listMiddleware.getListCategorybyId(req.identity.userId, req.routeVars.categoryId, req.query.remote);
			res.send(listCat);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	restServer.post("/listCategories", async function(req, res) {
		try {
			const result = await model.create(
				req.identity.userId,
				req.identity.orgId,
				req.body.name);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	restServer.put("/listCategories/:categoryId", async function (req, res) {
		try {
			const result = await model.update(
				req.identity.userId,
				req.routeVars.categoryId,
				req.body.name);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});

	restServer.delete("/listCategories/:categoryId", async function (req, res) {
		try {
			const result = await model.delete(
				req.identity.userId,
				req.routeVars.categoryId);
			res.send(result);
		}
		catch(err) {
			res.err(err.message, err.err);
		}
	});
};

