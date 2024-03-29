const model = require("../../models/entityCollectionModel")({});
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {
	const restServer = app.rest;

	// -- entity type plays a strong role in groups ad should probably be reflected in the api routes
	// -- well technically it is just in a weird way. When "entities" is replaced in autogenerated api
	// -- you have something like /things/groups which is groups for things which makes sense. The problem
	// -- is from the generic side /entityCollections would mean groups for all entities which doesn't fit the model
	// -- if we delegate this service to solely be used via app-core and autogenerated entity apis I can
	// -- possibly live with it. So "entities" in that case is just a placeholder.

	restServer.get("/entityCollections?id=:id", async function (req, res) {
		try {
			const result = await model.getById(
				req.identity.userId,
				req.query.id);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.get("/entityCollections", async function (req, res) {
		try {
			const result = await model.getAll(req.identity.userId);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/entityCollections/containingEntity?entity=:entityId", async function (req, res) {
		try {
			const result = await model.containsEntity(req.identity.userId, req.routeVars.entityId);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.post("/entityCollections", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { entityCollectionModel } = translations.ecosystem.activities;
		try {
			const result = await model.create(
				req.identity.userId,
				req.identity.orgId,
				req.body.name,
				req.body.entities,
				entityCollectionModel.create);
			res.send(result);
		} catch (err) {
			res.err(err.message, err.err);
		}
	});

	restServer.put("/entityCollections/addRemoveMemberToMulti", async function (
		req,
		res
	) {
		const promises = [];
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { entityCollectionModel } = translations.ecosystem.activities;
		const entityData =
			(req.body.entityName && req.body.entityType && req.body.feedId)
				? {
					id: req.body.entityId,
					name: req.body.entityName,
					entityType: req.body.entityType,
					feedId: req.body.feedId
				}
				: null;

		for (let i = 0; i < req.body.added.length; i++) {
			try {
				promises.push(
					await model.addMembers(
						req.identity.userId,
						req.body.added[i],
						[req.body.entityId],
						entityData,
						entityCollectionModel.addMembers
					)
				);
			} catch (err) {
				throw err;
			}
		}
		for (let j = 0; j < req.body.removed.length; j++) {
			try {
				promises.push(
					await model.removeMembers(
						req.identity.userId,
						req.body.removed[j],
						[req.body.entityId],
						entityCollectionModel.removeMembers
					)
				);
			} catch (err) {
				throw err;
			}
		}

		Promise.all(promises).then((results) => {
			res.send(results);
		}, function (err) {
			res.send(err);
		});
	});

	restServer.put("/entityCollections/:collectionId", async function (req, res) {
		try {
			const result = await model.update(req.identity.userId, req.identity.orgId, req.routeVars.collectionId, req.body.name);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.put("/entityCollections/:collectionId/restore", async function (
		req,
		res
	) {
		try {
			const result = await model.restore(req.identity.userId, req.routeVars.collectionId, req.body.isDeleted);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.get(
		"/entityCollections/hasMember/:collectionId?entityId=:entityId",
		async function (req, res) {
			try {
				const result = await model.hasMember(req.routeVars.collectionId, req.routeVars.entityId);
				res.send({ hasMember: result });
			} catch (err) {
				res.send(err);
			}
		}
	);

	restServer.put("/entityCollections/:collectionId/addMembers", async function (
		req,
		res
	) {
		try {
			const result = await model.addMembers(req.identity.userId, req.routeVars.collectionId, req.body.entityIds, null);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.put("/entityCollections/:collectionId/removeMembers", async function (
		req,
		res
	) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { entityCollectionModel } = translations.ecosystem.activities;
		try {
			const result = await model.removeMembers(req.identity.userId, req.routeVars.collectionId, req.body.entityIds, entityCollectionModel.removeMembers);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.delete("/entityCollections/:collectionId", async function (req, res) {
		try {
			const result = await model.delete(req.identity.userId, req.routeVars.collectionId);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});

	restServer.get("/entityCollections/forPinningEntity/:entityId", async function (req, res) {
		try {
			const result = await model.getAllForPinning(req.identity.userId, req.identity.orgId, req.routeVars.entityId);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	});
};