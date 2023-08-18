const model = require("../../models/activityModel")({});
const entityModel = require("../../models/entityModel")();
const activityMiddleware = new (require("../../logic/activity"));
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");


module.exports = function (app) {

	const restServer = app.rest;

	restServer.get("/activities?entityid=:entityid&page=:page&pagesize=:pagesize", async function (req, res) {
		try {
			const result = await activityMiddleware.getEntityActivityPage(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/activities?eventid=:eventid&fromDate=:fromdate&pagesize=:pagesize", async function (req, res) {
		try {
			const result = await activityMiddleware.getEntityActivityPage(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.post("/activities", async function (req, res) {
		try {
			const result = await model.queueActivity(req.body.activity, req.body.app);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/activities?entityType=:entityType&entityId=:entityId&fromDate=:fromDate&pagesize=:pagesize", async function (req, res) {
		try {
			const result = await activityMiddleware.getEntityActivityPage(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	// -- shuey - not a sensible rest endpoint as entityId does not refer to an activity (necessarily)
	restServer.post("/activities/:entityId/comment", async function (req, res) {

		if (req.body.entityType && req.body.entityType !== "activity") {
			try {
				const locale = config.environment.locale;
				const translations = await geti18n(app.appRequest, locale);
				const { activities } = translations.ecosystem;
				const result = await entityModel.addComment(
					req.identity.userId,
					req.identity.orgId,
					req.routeVars.entityId,
					req.body.entityType,
					req.body.comment,
					activities.entityModel.addComment
				);
				res.send(result);
			} catch (ex) {
				res.err(ex.message, ex);
			}
		}
		else {
			// -- activities weren't entities until alerts enhancement, now they behave like an entity in some way but structure is different so diff method
			try {
				const locale = config.environment.locale;
				const translations = await geti18n(app.appRequest, locale);
				const { activityModel } = translations.ecosystem.activities;
				const result = await model.addComment(
					req.identity.userId,
					req.routeVars.entityId,
					req.body.comment,
					activityModel.addComment
				);
				res.send(result);
			}
			catch (ex) {
				console.log(ex.message);
				res.err(ex);
			}
		}
	});

	restServer.get("/activities/:activityId", async function (req, res) {
		try {
			const result = await model.getActivityDetail(req.identity.userId, req.routeVars.activityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	restServer.get("/activities/:activityId/authUsers", async function (req, res) {
		try {
			const result = await model.getActivityAuthorizedUsers(req.routeVars.activityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	restServer.get("/activities/:activityId/contextEntities", async function (req, res) {
		try {
			const result = await model.getActivityContextEntities(req.identity.userId, req.routeVars.activityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});

	restServer.get("/activities/:activityId/attachments", async function (req, res) {
		try {
			const result = await model.getActivityAttachments(req.identity.userId, req.routeVars.activityId);
			res.send(result);
		}
		catch (ex) {
			res.err(ex);
		}
	});
};