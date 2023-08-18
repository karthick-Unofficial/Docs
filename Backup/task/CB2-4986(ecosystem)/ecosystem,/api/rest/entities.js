const model = require("../../models/entityModel")();
const feedModel = require("../../models/feedModel")();
const userPolicyCache = new (require("../../lib/userPolicyCache"));

module.exports = function (app) {
	const restServer = app.rest;

	restServer.get("/entities/:type/:id/authorize/:permission", async function (req, res) {
		try {
			if (!Object.keys(userPolicyCache.feedPermissionTypes).includes(req.routeVars.permission)) {
				res.err({ message: `${req.routeVars.permission} is not a valid feed permission type`, code: 500 });
			}
			const entity = await feedModel.getEntityWithAuthorization(req.identity.userId, req.routeVars.id, req.routeVars.type, userPolicyCache.feedPermissionTypes[req.routeVars.permission]);
			const includeEnt = req.query.includeEnt ? req.query.includeEnt.toLowerCase() === "true" : false;
			const result = { entityId: req.routeVars.id, permission: req.routeVars.permission, isAuth: entity !== null };
			if (includeEnt) result["entity"] = entity;
			res.send(result);
		}
		catch (err) {
			res.err({ message: `unexpected error: ${err.message}`, code: 500 });
		}
	});

	restServer.get("/entities/:entityId/linkable?entityType=:entityType&query=:query&pageSize=:pageSize", async function (req, res) {
		try {
			// if  query, use the query and pagesize from there
			const query = req.query ? req.query.query : null;
			const pageSize = req.query ? req.query.pageSize : 5;
			const entityType = req.query ? req.query.entityType : "";
			const { userId } = req.identity;
			const { entityId } = req.routeVars;

			try {
				const response = await model.queryLinkable(
					userId,
					entityId,
					entityType,
					query,
					pageSize);
				res.send(response);
			} catch (err) {
				res.err(err);
			}
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	// -- Internal use only - route starts with _internal
	// Filters for published Events containing a given target entity
	restServer.get("/_internal/publishedEntityMappings/:entityType/:entityId", async function (req, res) {
		try {
			const { entityType, entityId } = req.routeVars;
			const ents = await model.getExternalPublishedEntityMappings(entityId, entityType);
			res.send(ents);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	// -- Internal use only - route starts with _internal
	// -- Activity creation object/target for example
	restServer.get("/_internal/entities/:entityType/:entityId", async function (req, res) {
		try {
			const { entityId, entityType } = req.routeVars;
			const ent = await feedModel.getEntity(entityId, entityType);
			res.send(ent);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

};

