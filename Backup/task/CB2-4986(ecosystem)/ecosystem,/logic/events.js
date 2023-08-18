const { result } = require("lodash");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/events.js");
const eventModel = require("../models/eventModel")({});
const feedModel = require("../models/feedModel")({});
const cameraModel = require("../models/cameraModel")({});
const feedMiddleware = new (require("../logic/feed"));
const fileStorage = require("node-app-core").fileStorage();

class Events {
	constructor() {
		this._ecoLinkManager = null;
	}

	ecoLinkManager() {
		if (!this._ecoLinkManager) {
			const global = require("../app-global.js");
			this._ecoLinkManager = global.ecoLinkManager;
		}
		return this._ecoLinkManager;
	}

	async streamEvents(sub) {
		const { userId } = sub.identity;
		const { filterType, format, status, type, inclusionGeo } = sub.args;

		// -- only remote calls if this is a local request to aggregate results from all linked ecosystems
		let unsubs = null;
		if (!sub.args.remote) {
			unsubs = this.proxyEvents(sub);
		}

		switch (filterType.toLowerCase()) {
			case "user-events":
				try {
					const result = await eventModel.streamEvents(
						userId,
						format,
						status,
						type,
						false, // template flag
						inclusionGeo,
						function (err, record) {
							if (err) console.log(err);
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						// unsubs remote connections - this needs to be conditional on whether remote ecos available or not (maybe)
						// Not really any negative effects so maybe just let it roll
						// for(const unsub of unsubs) {
						// 	unsub();
						// }
						cancelFn();
					});
				} catch (err) {
					sub.pub(err);
				}
				break;
			case "user-templates":
				try {
					const result = await eventModel.streamEvents(
						userId,
						format,
						status,
						type,
						true, // template flag
						inclusionGeo,
						function (err, record) {
							if (err) console.log(err);
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					sub.pub(err);
				}
				break;
			case "all-statistics":
				eventModel.streamAllStatistics(
					userId,
					function (err, record) {
						if (err) {
							console.log(err);
						}
						sub.pub(record);
					},
					function (err, result) {
						if (err) {
							sub.pub(err);
						}
						else {
							// const cancelFn = result;
							sub.events.on("disconnect", () => {
								// cancelFn();
							});
						}
					}
				);
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	}

	// -- this will target all connected ecos
	// -- also attachments, activities,etc... will need to come from all participanting ecosystems
	async proxyEvents(proxySub) {
		const proxies = this.ecoLinkManager().getAllProxies();
		// MAY NEED TO DO THIS WITH PROMISE.ALL
		const unsubs = proxies.map(async (proxy) => {
			proxySub.args["remote"] = true;
			const unsub = await proxy.realtimeSubscription(proxySub, function (err, res) {
				if (err) {
					console.log("proxyEvents ERROR", err.message, err.stack);
				}
				for (const evt of res) {
					evt.new_val.id = `${evt.new_val.id}@@${proxy.targetEcoId}`;
					evt.new_val.notes = evt.new_val.notes ? `${evt.new_val.notes}@@${proxy.targetEcoId}` : evt.new_val.notes;
					if (evt.new_val.entityData.properties)
						evt.new_val.entityData.properties["id"] = evt.new_val.id;
					// for intermediate format transform pinned items from remote to reference correctly from source eco
					if (proxySub.args.format === "intermediate" && evt.new_val.pinnedItems) {
						const newPinnedItems = [];
						for (const pinnedItem of evt.new_val.pinnedItems) {
							newPinnedItems.push(
								pinnedItem.includes("@@") ?
									pinnedItem.split("@@")[1] !== proxy.sourceEcoId ? pinnedItem : pinnedItem.split("@@")[0] :
									`${pinnedItem}@@${proxy.targetEcoId}`);
						}
						evt.new_val.pinnedItems = newPinnedItems;
					}

				}
				proxySub.pub(res);
			});
			return unsub;
		});
		return unsubs;
	}


	async streamEventEntities(sub) {
		if (sub.args.eventId.includes("@@")) {
			// -- this is for remote eco should I include local as well? probably
			this.streamRemoteEventEntities(sub);
		}

		const { userId } = sub.identity;
		const { filterType, eventId } = sub.args;

		switch (filterType.toLowerCase()) {
			case "cameras": {
				try {
					const result = await this.streamEventCameras(
						userId,
						eventId,
						function (err, record) {
							if (err) {
								logger.error(
									"streamEventCameras",
									"An error was occurred while streaming event cameras",
									{ err: { message: err.message, code: err.code } }
								);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (err) {
					logger.error(
						"streamEventCameras",
						"An error was caught while streaming event cameras",
						{ err: { message: err.message, code: err.code } }
					);
					// TODO: Do we need to pub an error?
					// sub.pub(err);
				}
				break;
			}
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	}

	async streamRemoteEventEntities(proxySub) {
		const pub = proxySub.pub;
		proxySub = JSON.parse(JSON.stringify(proxySub));
		const remote = this.ecoLinkManager().getRemoteFromId(proxySub.args.eventId);

		proxySub.args.eventId = remote.id;
		const unsub = await remote.proxy.realtimeSubscription(proxySub, function (err, res) {
			if (err) {
				logger.error("streamRemoteEventEntities", "Unexpected exception attempting to stream remote event entities", { args: proxySub.args });
			}
			for (const change of res.changes) {
				const ent = change.new_val || change.old_val;
				if (ent) {
					if (ent.id && !ent.id.includes("@@"))
						ent.id = `${ent.id}@@${remote.remoteEcoId}`;
					if (ent.entityData && ent.entityData.properties) ent.entityData.properties.id = ent.id;
					if (ent.feedId && !ent.feedId.includes("@@"))
						ent.feedId = `${ent.feedId}@@${remote.remoteEcoId}`;
					if (ent.notes && !ent.notes.includes("@@"))
						ent.notes = `${ent.notes}@@${remote.remoteEcoId}`;
				}

				// remove @@ecoId if ent is local
				// case where a feed shared to remote is then pinned to an event at remote and event shared back
				const idParts = ent.id.split("@@");
				if (idParts[1] === this.ecoLinkManager().getSourceEcoId()) {
					ent.id = idParts[0];
					if (ent.entityData && ent.entityData.properties) ent.entityData.properties.id = idParts[0];
					ent.feedId = ent.feedId.split("@@")[0];
				}

			}
			pub(res);
		}.bind(this));
	}


	/**
		 * Stream cameras associated with an event. This includes:
		 * 	- Cameras in range of the event (event in camera FOV)
		 * 	- Cameras pinned to the event
		 * @param {string} userId 
		 * @param {string} eventId 
		 * @param {function} handler 
	 */
	async streamEventCameras(userId, eventId, handler) {
		try {

			// -- shuey: added event auth as was missing and assume needed here todo: CONFIRM
			const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
			if (!event) {
				throw { message: "User is not authorized to access this event", code: 403 };
			}

			const data = {
				pinnedCamIds: [],
				inRangeCamIds: []
			};

			const batchDuration = 1000;
			let batch = [];

			const sendBatch = function () {
				handler(null, { "type": "change-batch", "changes": batch });
				batch = [];
			};

			setInterval(() => {
				if (batch.length) {
					sendBatch();
				}
			}, batchDuration);

			const handleChange = (prefix, change) => {

				// Bail out if not a camera change
				if (
					(change.new_val && change.new_val.entityType !== "camera")
					|| (change.old_val && change.old_val.entityType !== "camera")
				) {
					return;
				}

				switch (change.type) {
					case "initial": {

						// Add ID to appropriate cache
						data[`${prefix}Ids`].push(change.new_val.id);

						const isDuplicate = batch.some(c => c.new_val.id === change.new_val.id);
						if (!isDuplicate) {
							batch.push(change);
						}
						break;
					}
					case "add": {

						// Check to see if we should send this update. If the ID exists in either
						// cache of IDs, we don't need to send it as it's already been sent. 
						const shouldSend =
							!(data.inRangeCamIds.some(id => id === change.new_val.id))
							&& !(data.pinnedCamIds.some(id => id === change.new_val.id));

						// Add ID to appropriate cache
						data[`${prefix}Ids`].push(change.new_val.id);

						if (shouldSend) {
							batch.push(change);
						}
						break;
					}
					case "change": {
						batch.push(change);
						break;
					}
					case "remove": {

						// Remove ID from appropriate cache
						data[`${prefix}Ids`] = data[`${prefix}Ids`].filter(id => id !== change.old_val.id);

						// If ID does not exist in any cache, send update
						const shouldSend = [...data.pinnedCamIds, ...data.inRangeCamIds].indexOf(change.old_val.id) === -1;

						if (shouldSend) {
							batch.push(change);
						}
						break;
					}
					default:
						break;
				}
			};

			// Pinned item handler
			const handlePinned = (err, changeBatch) => {
				if (err) {
					logger.error("handlePinned", "An error occurred while streaming pinned cameras", { err: { message: err.message, stack: err.stack } });
				}
				else {
					const { changes } = changeBatch;

					changes.forEach(change => {
						handleChange("pinnedCam", change);
					});
				}
			};

			// In-range camera handler
			const handleInRange = (err, change) => {
				if (err) {
					logger.error("handleInRange", "An error occurred while streaming in-range cameras", { err: { message: err.message, stack: err.stack } });
				}
				else {

					// Format returned change correctly as a rethink change object
					Object.keys(change).forEach(key => {
						switch (key) {
							case "add": {
								change[key].forEach(cam => {
									handleChange("inRangeCam", { type: "add", new_val: cam });
								});
								break;
							}
							case "update": {
								handleChange("inRangeCam", { type: "change", new_val: change[key] });
								break;
							}
							case "remove": {
								change[key].forEach(cam => {
									handleChange("inRangeCam", { type: "remove", new_val: null, old_val: cam });
								});
								break;
							}
							default:
								break;
						}
					});
				}
			};

			const pinnedCancelFn = await eventModel.streamPinnedItems(
				userId,
				eventId,
				function (err, changes) {
					if (err) console.log(err);
					handlePinned(err, changes);
				}
			);

			const cameraCancelFn = await cameraModel.streamCamerasInRange(userId, eventId, "event", handleInRange);

			return () => {
				pinnedCancelFn();
				cameraCancelFn();
			};
		}
		catch (err) {
			throw err;
		}
	}

	async getAllUserEvents(req) {
		let aggEvents = [];
		const localEvents = await eventModel.getAll(req.identity.userId, req.identity.orgId);
		aggEvents = [...aggEvents, ...localEvents];
		if (!req.query["@@remote"] && this.ecoLinkManager().isActive()) {
			req.query["@@remote"] = true;
			for (const key in this.ecoLinkManager()._linkedEcos) {
				const events = await this.ecoLinkManager().execReq(key, "GET", "/events", req);
				for (const evt of events) {
					evt.id = `${evt.id}@@${key}`;
					evt.notes = evt.notes ? `${evt.notes}@@${key}` : evt.notes;
				}
				aggEvents = [...aggEvents, ...events];
			}
		}
		return aggEvents;
	}

	async getAllUserTemplates(req) {
		let aggTemplates = [];
		const localTemplates = await eventModel.getTemplates(req.identity.userId, req.identity.orgId);
		aggTemplates = [...aggTemplates, ...localTemplates];
		if (!req.query["@@remote"] && this.ecoLinkManager().isActive()) {
			req.query["@@remote"] = true;
			for (const key in this.ecoLinkManager()._linkedEcos) {
				const remoteTemplates = await this.ecoLinkManager().execReq(key, "GET", "/events/templates/all", req);
				for (const template of remoteTemplates) {
					template.id = `${template.id}@@${key}`;
					template.notes = template.notes ? `${template.notes}@@${key}` : template.notes;
				}
				aggTemplates = [...aggTemplates, ...remoteTemplates];
			}
		}
		return aggTemplates;
	}

	async getByEventType(req) {
		let result = await eventModel.getByEventType(req.identity.userId, req.routeVars.eventType, req.query ? req.query.subtype : null);
		if (!req.query.remote && this.ecoLinkManager().isActive()) {
			req.query["remote"] = true;
			const remoteResult = await this.ecoLinkManager().execReqAll(
				req.method,
				req.route,
				req,
				"ecosystem",
				true
			);
			result = [...result, ...remoteResult];
		}
		return result;
	}

	async getAllForPinning(req) {
		// Setup aggregated events array
		let aggEvents = [];

		// Get local events for pinning and add to aggregated events array
		const localEvents = await eventModel.getAllForPinning(req.identity.userId, req.identity.orgId, req.routeVars.entityId);
		aggEvents = [...aggEvents, ...localEvents];

		// If we need to reach out to other ecosystems
		if (!req.query["@@remote"] && this.ecoLinkManager().isActive()) {
			req.query["@@remote"] = true;

			// Append source ecosystem ID to entity ID
			// Other ecosystems will know this entity as this appended version of the ID
			const sourceEcoId = this.ecoLinkManager().getSourceEcoId();
			const targetEntityId = `${req.routeVars.entityId}@@${sourceEcoId}`;

			// For each linked ecosystem, get events for pinning and add to aggregated events array
			const remoteEvents = await this.ecoLinkManager().execReqAll("GET", `/events/forPinningEntity/${targetEntityId}`, req, "ecosystem", true);
			aggEvents = [...aggEvents, ...remoteEvents];
		}
		return aggEvents;
	}

	async getEventByIdWithAllData(req) {
		let event = null;
		if (req.routeVars.eventId.includes("@@")) {
			const idParts = req.routeVars.eventId.split("@@");
			req.routeVars.eventId = idParts[0];
			event = await this.ecoLinkManager().execReq(idParts[1], "GET", `/events/${idParts[0]}/associated/${idParts[0]}`, req);
		}
		else {
			event = await eventModel.getByIdWithAllData(req.identity.userId, req.routeVars.eventId);
		}
		return event;
	}

	// if handle has @@ get from remote???
	async getNotesFile(req) {
		try {
			const handle = req.routeVars.handle;
			const handleParts = handle.split("@@");
			const hdl = handleParts.length > 1 ? handleParts[0] : handle;
			const targetEcoId = handleParts.length > 1 ? handleParts[1] : null;

			if (targetEcoId) {
				return await this.ecoLinkManager().execReq(targetEcoId, "GET", `/events/notes/${hdl}`, req);
			}
			else {
				let file = await fileStorage.getFile(hdl, "cb2-notes-attachment");
				file = JSON.parse(file.toString());
				return file;
			}
		}
		catch (err) {
			throw err;
		}
	}

	async putNotesFile(req) {
		try {
			const event = await feedModel.getEntityWithAuthorization(req.identity.userId, req.body.eventId, "event");
			if (!event) throw { message: "user not authorized for event", code: 403 };

			const remote = this.ecoLinkManager().getRemoteFromId(event.id);

			if (remote) {
				req.body.eventId = remote.id;
				return await remote.proxy.execReq("PUT", "/events/notes/upload", req);
			}
			else {
				// apprently can't replace a file which would be preferable
				if (event.notes) await fileStorage.deleteFile(event.notes, false, "cb2-notes-attachment");
				const result = await fileStorage.insertFile(`${event.id}_notes`, req.body.mimeType, req.body.file, "cb2-notes-attachment");
				event.notes = result.handle;
				const updateEventResult = await eventModel.update(
					req.identity.userId,
					req.body.eventId,
					event);
				logger.info("putNotesFile", "Event update result", { result: updateEventResult });
				return { success: true };
			}
		}
		catch (err) {
			logger.error("putNotesFile", "Unexpected error", { req: req });
			throw err;
		}
	}

	async updatePinnedList(req, timezone, translations) {
		const remote = this.ecoLinkManager().getRemoteFromId(req.routeVars.listId);

		let result = null;
		if (!remote) {
			result = await eventModel.updateList(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.eventId,
				req.routeVars.listId,
				req.body.list,
				timezone,
				translations
			);
		}
		else {
			result = remote.proxy.execReq(
				"PUT",
				`/events/${req.routeVars.eventId}/updatePinnedList/${remote.id}`,
				req,
				"ecosystem"
			);
		}
		return result;
	}


	async addProximity(req, translations) {
		const remote = this.ecoLinkManager().getRemoteFromId(req.routeVars.eventId);
		let result = null;
		if (!remote) {
			result = await eventModel.addProximity(
				req.identity.userId,
				req.routeVars.eventId,
				req.body,
				translations);
		}
		else if (remote.proxy) {
			result = await remote.proxy.execReq(
				req.method,
				req.route.replace(`@@${remote.remoteEcoId}`, ""),
				req,
				"ecosystem"
			);
		}
		return result;
	}

	async updateProximity(req, translations) {
		const remote = this.ecoLinkManager().getRemoteFromId(req.routeVars.eventId);
		let result = null;
		if (!remote) {
			result = await eventModel.updateProximity(
				req.identity.userId,
				req.routeVars.eventId,
				req.routeVars.proximityId,
				req.body,
				translations);
		}
		else if (remote.proxy) {
			result = await remote.proxy.execReq(
				req.method,
				req.route.replace(`@@${remote.remoteEcoId}`, ""),
				req,
				"ecosystem"
			);
		}
		return result;
	}

	async deleteProximity(req, translations) {
		const remote = this.ecoLinkManager().getRemoteFromId(req.routeVars.eventId);
		let result = null;
		if (!remote) {
			eventModel.deleteProximity(
				result = await req.identity.userId,
				req.routeVars.eventId,
				req.routeVars.proximityId, translations);
		}
		else if (remote.proxy) {
			result = await remote.proxy.execReq(
				req.method,
				req.route.replace(`@@${remote.remoteEcoId}`, ""),
				req,
				"ecosystem"
			);
		}
		return result;
	}

	async streamPinnedItems(sub) {
		const remote = this.ecoLinkManager().getRemoteFromId(sub.args.eventId);
		let unsub = null;
		if (!remote) {
			unsub = await eventModel.streamPinnedItems(
				sub.identity.userId,
				sub.args.eventId,
				function (err, record) {
					if (err) console.log(err);
					sub.pub(record);
				}
			);
		}
		else if (remote.proxy) {
			sub.args.eventId = remote.id;
			unsub = await remote.proxy.realtimeSubscription(sub, function (err, res) {
				if (err) {
					logger.error("streamPinnedItems", "Unexpected exception attempting to stream remote pinned items", { args: sub.args });
				}
				else {
					for (const change of res.changes) {
						const ent = change.new_val || change.old_val;
						if (!ent.id.includes("@@")) {
							ent.id = `${ent.id}@@${remote.remoteEcoId}`;
							if (ent.entityData && ent.entityData.properties) ent.entityData.properties.id = ent.id;
							ent.feedId = `${ent.feedId}@@${remote.remoteEcoId}`;
						}
						else {
							const idParts = ent.id.split("@@");
							if (idParts[1] === this.ecoLinkManager().getSourceEcoId()) {
								ent.id = idParts[0];
								if (ent.entityData && ent.entityData.properties) ent.entityData.properties.id = idParts[0];
								ent.feedId = ent.feedId.split("@@")[0];
							}
						}
					}
				}
				sub.pub(res);
			}.bind(this));
		}
		else {
			throw { message: `No proxy available for eco ${remote.remoteEcoId}`, code: 500 };
		}
		sub.events.on("disconnect", () => {
			if (unsub) {
				unsub();
			}
		});
		return unsub;
	}




	async streamProximityEntities(sub) {
		const remote = this.ecoLinkManager().getRemoteFromId(sub.args.feedId);
		let unsub = null;
		if (!remote) {
			unsub = await eventModel.getEventProximityEntities(
				sub.identity.userId,
				sub.args.feedId,
				sub.args.geometry,
				sub.args.radiuses,
				function (err, record) {
					if (err) console.log(err);
					sub.pub(record);
				}
			);
		}
		else if (remote.proxy) {
			sub.args.feedId = remote.id;
			unsub = await remote.proxy.realtimeSubscription(sub, function (err, res) {
				if (err) {
					logger.error("streamProximityEntities", "Unexpected exception attempting to stream remote proximity entities", { args: sub.args });
				}
				if (res.new_val) {
					res.new_val.id = `${res.new_val.id}@@${remote.remoteEcoId}`;
					if (res.new_val.entityData && res.new_val.entityData.properties) res.new_val.entityData.properties.id = res.new_val.id;
					res.new_val.feedId = `${res.new_val.feedId}@@${remote.remoteEcoId}`;
				}
				else if (res.changes) {
					for (const ent of res.changes) {
						ent.id = `${ent.id}@@${remote.remoteEcoId}`;
						if (ent.entityData && ent.entityData.properties) ent.entityData.properties.id = ent.id;
						ent.feedId = `${ent.feedId}@@${remote.remoteEcoId}`;
					}
				}
				sub.pub(res);
			});
		}
		else {
			throw { message: `No proxy available for eco ${remote.remoteEcoId}`, code: 500 };
		}
		sub.events.on("disconnect", () => {
			unsub();
		});
	}
}

module.exports = Events;
