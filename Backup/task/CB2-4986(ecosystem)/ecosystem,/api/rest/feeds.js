const model = require("../../models/feedModel")();
const userPolicyCache = new (require("../../lib/userPolicyCache"));
const feedMiddleware = new (require("../../logic/feed")); 

module.exports = function(app) {

	const restServer = app.rest;

	//POST /feeds/:feedType/entities - Entry point for data coming from integration server
	//GET /feeds/:feedType/entities - Get All Feed Entity
	//PUBSUB /feeds/:feedType/entities - Stream Feed Entities
	//POST /feeds - Create feed type
	//PUT /feeds/:feedId - Update feed type
	//DELETE /feeds/:feedId - Delete feed type
	//GET /feeds - GET feed types
	//GET /feeds/:feedId - GET single feed type
	//PUBSUB /feeds - Stream Feed Types

	restServer.get("/_internal/userPolicyCache", function (req, res) {
		res.send(userPolicyCache.getAllCachedData());
	});

	restServer.get("/_internal/users/:userId/integrations", function (req, res) {
		res.send(userPolicyCache.getUserIntegrations(req.routeVars.userId));
	});


	restServer.get("/_temp/userIntegrations/:userId", function (req, res) {
		res.send(userPolicyCache.getUserIntegrations(req.routeVars.userId));
	});

	restServer.get("/_temp/userPolicyCache", function (req, res) {
		res.send(userPolicyCache.getAllCachedData());
	});

	restServer.get("/_temp/remotePolicyCaches", function (req, res) {
		res.send(userPolicyCache.getAllRemoteCaches());
	});


	restServer.get("/feeds/:feedId/entities/:entityId", async function (req, res) {
		try {
			const ent = await model.getEntityWithAuthorizationUseFeedId(req.identity.userId, req.routeVars.entityId, req.routeVars.feedId);
			res.send(ent);
		}
		catch(err) {
			res.err({ message: err.message, code: 500 }, err);
		}
	});

	/// Create a new feed
	restServer.post("/feeds", async function (req, res) {
		const feed = req.body.feed;
		try {
			const result = model.create(feed);
			res.send(result);
		} catch(err) {
			res.err(err.message, err.err);
		}
	});

	/// Push a feed entity
	restServer.post("/feeds/:feedId/entities", async function (req, res) {
		const span = app.tracer.startSpan("post-feed-entity");
		let result = null;
		try {
			result = await model.upsertEntity(req.routeVars.feedId, null, req.body);
		}
		catch(ex) {
			span.log({ 
				event: "error", 
				reason: ex.message
			});
		}
		span.finish();
		res.send(result);
	});

	restServer.get("/feeds/:feedId", async function (req, res) {
		try {
			const result = await model.getFeedProfile(req.routeVars.feedId);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feeds/:feedId/orgProfile/:orgId", async function (req, res) {
		try {
			const result = await model.getFeedOrgProfile(req.routeVars.feedId, req.routeVars.orgId);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feeds", async function (req, res) {
		try {
			const result = await model.getAll(req.identity.orgId);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feeds/authorize/:entityIds", async function (req, res) {
		const entityIds = req.routeVars.entityIds.split(",");
		try {
			const result = await model.getFeedEntitiesWithAuthorizationById(req.identity.userId, entityIds);
			res.send(result);
		}
		catch(ex) {
			res.err(ex);
		}
	});

	restServer.get("/feeds/authorize/:entityId/:entityType", async function (req, res) {
		try {
			const result = await model.getEntityWithAuthorization(req.identity.userId, req.routeVars.entityId, req.routeVars.entityType, req.query.permission);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feeds/search-by-type/:type", async function (req, res) {
		// todo: shape and shapes both worked before, now just shapes based on entityType on feed id. Eliminate shapes across the board
		try {
			const result = await model.getEntitiesByTypeWithAuthorization(req.identity.userId, req.routeVars.type, true);
			res.send(result);
		}
		catch(err) {
			res.err(err);
		}
	});

	restServer.get("/feeds/:type/geojson", async function (req, res) {
		try {
			const result = await model.getUserFeedEntitiesGeoJSON(req.identity.userId, req.routeVars.type);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feeds/:feedId/shareProfile", async function (req, res) {
		try {
			const result = await model.getShareProfile(req.routeVars.feedId);
			res.send(result);
		}
		catch(reason) {
			res.send(reason);
		}
	});

	restServer.get("/feedEntities/byType/:entityType", async function (req, res) {
		try {
			const remoteEnts = await feedMiddleware.getEntitiesByTypeWithAuthorization(req);
			const localResult = await model.getEntitiesByTypeWithAuthorization(
				req.identity.userId, 
				req.routeVars.entityType, 
				true, 
				null, 
				req.query.includeDetails || false);
			res.send([...localResult, ...remoteEnts]);
		}
		catch(err) {
			res.err(err);
		}
	}); 

	restServer.get("/feedEntities", async function (req, res) {
		// /feedEntites?q=query
		let substringMatch = "", idsOnly = false;
		if (req.query) {
			substringMatch = req.query.q;
			idsOnly = req.query.idsOnly === "true";
		}
		try {
			const remoteEnts = await feedMiddleware.queryUserFeedEntities(req, idsOnly);
			const result = await model.queryUserFeedEntities(substringMatch, idsOnly, req.identity.userId);
			res.send([...result, ...remoteEnts]);
		}
		catch(err) {
			res.send({ message: "Unexpected error querying user feed entities.", code: 500 });
		}
	});


};
