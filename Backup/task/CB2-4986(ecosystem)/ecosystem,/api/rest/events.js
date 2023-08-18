const model = require("../../models/eventModel")({});
const EventsLogic = require("../../logic/events");
const logic = new EventsLogic();
const global = require("../../app-global.js");
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {
	const restServer = app.rest;
	const realtimeServer = app.realtime;
	const timezone = app._config.timezone ? app._config.timezone : "America/New_York";

	restServer.get("/events", async function (req, res) {
		try {
			const result = await logic.getAllUserEvents(req);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/events/templates/all", async function (req, res) {
		try {
			const result = await logic.getAllUserTemplates(req);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/events/eventType/:eventType", async function (req, res) {
		try {
			const result = await logic.getByEventType(req);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/events/forPinningEntity/:entityId", async function (req, res) {
		try {
			const result = await logic.getAllForPinning(req);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	restServer.get("/events/:eventId", async function (req, res) {
		try {
			const response = await model.getById(req.identity.userId, req.routeVars.eventId);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/events/:eventId/associated/:eventId", async function (req, res) {
		try {
			const result = await logic.getEventByIdWithAllData(req);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	// cb2-notes-attachment
	restServer.get("/events/notes/:handle", async function (req, res) {
		try {
			const result = await logic.getNotesFile(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.put("/events/notes/upload", async function (req, res) {
		try {
			const result = await logic.putNotesFile(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});


	restServer.get("/events/externalSourceId/:sourceId", async function (
		req,
		res
	) {
		try {
			res.send(
				await model.getByExternalSourceId(
					req.identity.userId,
					req.routeVars.sourceId
				)
			);
		} catch (error) {
			res.err(error);
		}
	});

	restServer.post("/events", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		try {
			const response = await model.create(req.identity.userId, req.identity.orgId, req.body.event, eventsModel.create);
			res.send(response);

		} catch (error) {
			res.err(error);
		}
	});

	restServer.post("/events/escalate", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		try {
			const response = await model.escalateEvent(req.identity.userId, req.body.id, eventsModel);
			
			res.send(response);
		} catch (error) {
			res.err(error);
		}
	});

	restServer.get("/events/:eventId/enable", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		try {
			const response = await model.enableEvent(req.identity.userId, req.routeVars.eventId, eventsModel.enableEvent);
			res.send(response);
		} catch (error) {
			res.err(error);
		}
	});

	restServer.put("/events/updateEvent/updatePinnedEntities", async function (req, res) {
		const promises = [];
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		for (let i = 0; i < req.body.added.length; i++) {
			try {
				promises.push(
					await model.pinEntities(
						req.identity.userId,
						req.body.added[i],
						[{ id: req.body.entityId, feedId: req.body.feedId }],
						eventsModel.pinEntities
					)
				);
			} catch (err) {
				throw err;
			}
		}
		for (let j = 0; j < req.body.removed.length; j++) {
			try {
				promises.push(
					await model.unpinEntity(
						req.identity.userId,
						req.body.removed[j],
						req.body.entityId,
						req.body.entityType,
						eventsModel.unpinEntity
					)
				);
			} catch (err) {
				throw err;
			}
		}

		Promise.all(promises).then(
			results => {
				res.send(results);
			},
			err => {
				res.send(err);
			}
		);
	});

	restServer.put("/events/:eventId", async function (req, res) {
		const event = req.body.event;
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;

		try {
			const response = await model.update(
				req.identity.userId,
				req.routeVars.eventId,
				event,
				eventsModel.update);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.put("/events/:eventId/mock", async function (req, res) {
		try {
			const response = await model.mockUpdate(
				req.identity.userId,
				req.routeVars.eventId,
				"manage"
			);
			res.send(response);
		} catch (err) {
			res.err(err);
		}

	});
	restServer.put("/events/:entityId/:eventId/mock", async function (req, res) {
		const { identity, routeVars } = req;
		const { eventId, entityId } = routeVars;
		try {
			const response = await model.mockUpdatePinnedItem(
				identity.userId,
				eventId,
				entityId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/events/:eventId", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { shapeModel } = translations.ecosystem.activities;
		try {
			const response = await model.delete(
				req.identity.userId,
				req.routeVars.eventId,
				shapeModel.delete);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	// Delete list on an event by id
	restServer.delete("/events/:eventId/:listId", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		try {
			const result = await model.deleteList(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.eventId,
				req.routeVars.listId,
				eventsModel.deleteList);
			res.send(result);
		} catch (err) {
			res.err(err.message, err.err);
		}
	});

	// Update list by id
	restServer.put("/events/:eventId/updatePinnedList/:listId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			const result = await logic.updatePinnedList(req, timezone, eventsModel.updatePinnedList);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	// Create list copies on event via array of original list ids
	restServer.post("/events/pinList/template", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { eventsModel } = translations.ecosystem.activities;
		try {
			const result = await model.pinList(
				req.identity.userId,
				req.identity.orgId,
				req.body.eventId,
				req.body.listIds,
				req.body.type,
				eventsModel.pinList);
			res.send(result);
		} catch (err) {
			res.err(err.message, err.err);
		}
	});

	// restServer.put("/events/:eventId/entities/:entityId", function (req, res) {
	// 	model.pinEntity(req.identity.userId, req.routeVars.eventId, req.routeVars.entityId, (err, response) => {
	// 		if (err) {
	// 			res.err(err);
	// 		}
	// 		else {
	// 			res.send(response);
	// 		}
	// 	});
	// });

	restServer.put("/events/:eventId/entities", async function (req, res) {
		if (req.routeVars.eventId.includes("@@")) {
			try {
				const idParts = req.routeVars.eventId.split("@@");
				const remoteEventId = idParts[0];
				const targetEcoId = idParts[1];
				// When these pinned items are fetched will need to strip the local @@ecoId
				for (const entity of req.body.entities) {
					if (!entity.id.includes("@@")) entity.id = `${entity.id}@@${global.ecoLinkManager.getSourceEcoId()}`;
					if (!entity.feedId.includes("@@")) entity.feedId = `${entity.feedId}@@${global.ecoLinkManager.getSourceEcoId()}`;
				}
				const result = await global.ecoLinkManager.execReq(
					targetEcoId,
					"PUT",
					`/events/${remoteEventId}/entities`,
					req);
				res.send(result);
			}
			catch (err) {
				res.err(err);
			}
		}
		else {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			try {
				const response = await model.pinEntities(
					req.identity.userId,
					req.routeVars.eventId,
					req.body.entities,
					eventsModel.pinEntities);
				res.send(response);
			}
			catch (err) {
				res.err(err);
			}
		}
	});

	restServer.delete("/events/:eventId/entities/:entityType/:entityId", async function (
		req,
		res
	) {
		if (req.routeVars.eventId.includes("@@")) {
			try {
				const idParts = req.routeVars.eventId.split("@@");
				const remoteEventId = idParts[0];
				const targetEcoId = idParts[1];
				// Since this is a remote event need to add @@localEcoId if entity is local because stored at remote that way
				// TODO: NOT POSITIVE THIS WILL ALWAYS BE THE CASE SO TEST
				const entityIdToUnpin = !req.routeVars.entityId.includes("@@") ? `${req.routeVars.entityId}@@${global.ecoLinkManager.getSourceEcoId()}` : req.routeVars.entityId;
				req.routeVars.entityId = entityIdToUnpin;
				const result = await global.ecoLinkManager.execReq(
					targetEcoId,
					"DELETE",
					`/events/${remoteEventId}/entities/${req.routeVars.entityType}/${entityIdToUnpin}`,
					req);
				res.send(result);
			}
			catch (err) {
				res.err(err);
			}
		}
		else {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			try {
				const response = await model.unpinEntity(
					req.identity.userId,
					req.routeVars.eventId,
					req.routeVars.entityId,
					req.routeVars.entityType,
					eventsModel.unpinEntity);
				res.send(response);
			}
			catch (err) {
				res.err(err);
			}
		}
	});

	restServer.put("/events/:eventId/public", async function (req, res) {
		try {
			const response = await model.makePublic(req.identity.userId, req.routeVars.eventId);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/events/:eventId/share", async function (req, res) {
		try {
			const response = await model.shareEvent(
				req.identity.userId,
				req.routeVars.eventId,
				req.body.orgIds);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.post("/events/:eventId/comment", async function (req, res) {
		const locale = config.environment.locale;
		const translations = await geti18n(app.appRequest, locale);
		const { activities } = translations.ecosystem;
		try {
			const response = await model.addComment(
				req.identity.userId,
				req.routeVars.eventId,
				req.body.message,
				activities.eventsModel.addComment);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get(
		"/events/:eventId/pinnable?query=:query&pageSize=:pageSize",
		async function (req, res) {
			// if  query, use the query and pagesize from there
			const query = req.query ? req.query.query : null;
			const pageSize = req.query ? req.query.pageSize : 5;

			try {
				const response = await model.queryPinnable(
					req.identity.userId,
					req.routeVars.eventId,
					query,
					pageSize);
				res.send(response);
			}
			catch (err) {
				res.err(err);
			}

		}
	);

	restServer.get("/events/:eventId/stats", async function (req, res) {
		try {
			const response = await model.getEventActivityStatistics(
				req.identity.userId,
				req.routeVars.eventId
			);
			res.send(response);
		} catch (e) {
			res.err(e);
		}
	});

	restServer.put("/events/:eventId/addProximity", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			const result = logic.addProximity(req, eventsModel.addProximity);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.put("/events/:eventId/updateProximity/:proximityId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			const result = logic.updateProximity(req, eventsModel.updateProximity);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/events/:eventId/deleteProximity/:proximityId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { eventsModel } = translations.ecosystem.activities;
			const result = logic.deleteProximity(req, eventsModel.deleteProximity);
			res.send(result);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.delete("/deleteNotes/:eventId", async function (req, res) {
		try {
			const response = await model.deleteEventNotes(
				req.identity.userId,
				req.routeVars.eventId);
			res.send(response);
		} catch (err) {
			res.err(err);
		}
	});

	realtimeServer.pubsub("/pinnedItems", async (sub) => {
		try {
			logic.streamPinnedItems(sub);
		}
		catch (err) {
			sub.pub({ message: err.message, code: 500 });
		}
	});

	realtimeServer.pubsub("/proximityEntities", async (sub) => {
		try {
			logic.streamProximityEntities(sub);
		}
		catch (err) {
			sub.pub({ message: err.message, code: 500 });
		}
	});

	restServer.get("/events/inFov/:cameraId", async function (req, res) {
		try {
			const result = await model.getEventsInFov(req.identity.userId, req.routeVars.cameraId);
			res.send(result);
		}
		catch (reason) {
			res.err(reason);
		}
	});

	// -- Internal use only - route starts with _internal
	// -- add method to node-app-core to register ineternal routes
	// -- return not found for any internal routes attempt to be accessed via app-gateway (external client)
	restServer.get("/_internal/eventFeedCacheEntities", async function (req, res) {
		try {
			const eventIds = req.query.eventIds ? req.query.eventIds.split(",") : null;
			const ents = await model.getEventFeedCacheEntities(eventIds);
			res.send(ents);
		}
		catch (err) {
			console.log(err.message, err.stack);
			res.err(err);
		}
	});


	restServer.get("/_internal/events/activeWithData", async function (req, res) {
		try {
			const includePinned = req.query.includePinned === "true";
			const response = await model.activeWithData(includePinned);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

	restServer.get("/wth/events/activeWithData", async function (req, res) {
		try {
			const includePinned = req.query.includePinned === "true";
			const response = await model.activeWithData(includePinned);
			res.send(response);
		}
		catch (err) {
			res.err(err);
		}
	});

};
