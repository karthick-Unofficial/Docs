const shapeModel = require("../../models/shapeModel")();
const shapeMiddleware = new (require("../../logic/shape"));
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/_internal/shapes", async function (req, res) {
		try {
			const result = await shapeMiddleware.getAllShapes();
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/shapes/singleSegmentLines", async function (req, res) {
		try {
			const result = await shapeMiddleware.getSingleSegmentLines(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/shapes/by-geo-type/:type", async function (req, res) {
		try {
			const result = await shapeMiddleware.getShapesByGeoType(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	// -- new route for getById
	restServer.get("/shapes/:shapeId", async function (req, res) {
		try {
			const result = await shapeModel.getById(req.identity.userId, req.routeVars.shapeId);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}

	});

	restServer.get("/shapes/multiple/:shapeIds", async function (req, res) {
		try {
			const shapeIds = req.routeVars.shapeIds.split(",");
			const result = await shapeModel.getMultipleById(req.identity.userId, shapeIds);
			res.send(result);

		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/shapes", async function (req, res) {
		try {
			const result = await shapeMiddleware.getAllShapesForUser(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.post("/shapes", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { activities } = translations.ecosystem;
			const result =
				await shapeModel.create(
					req.identity.userId,
					req.identity.orgId,
					req.body.entityData,
					req.body.parentEntity,
					req.body.hasOwnProperty("inScope") ? req.body.inScope : true, activities.shapeModel.create);

			res.send(result);

		}
		catch (err) {
			console.log("create shape error:", err);
			res.err({ err: { "message": err.message, "code": 500 } });
		}
	});

	restServer.put("/shapes/:shapeId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { activities } = translations.ecosystem;

			const result = await shapeModel.update(
				req.identity.userId,
				req.routeVars.shapeId,
				req.body.entityData,
				req.body.parentEntity,
				req.body.inScope, activities.shapeModel.update);

			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.delete("/shapes/:shapeId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { activities } = translations.ecosystem;
			const result = await shapeModel.delete(req.identity.userId, req.routeVars.shapeId, activities.shapeModel.delete);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.put("/entities/:entityId/restore", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { activities } = translations.ecosystem;
			const result = await shapeModel.restore(req.identity.userId, req.routeVars.entityId, activities.shapeModel.restore);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

};
