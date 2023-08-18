const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/feed.js");
const feedModel = require("../models/feedModel")({});
const userModel = require("../models/userModel")({});
const eventModel = require("../models/eventModel")({});
const uuidv4 = require("uuid/v4");

class Feed {
	constructor() {
		this._ecoLinkManager = null;
	} 
	
	ecoLinkManager() {
		if(!this._ecoLinkManager) {
			const global = require("../app-global.js");
			this._ecoLinkManager = global.ecoLinkManager;
		}
		return this._ecoLinkManager;
	}

	async streamEntity(sub) {
		if(sub.args.entityId.includes("@@")) {
		// -- this is for remote eco should I include local as well? probably
			this.proxyEntity(sub);
			return;
		}

		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "initial-by-entity": {
				try {
					const result = await feedModel.streamEntityWithAuthorization(
						sub.identity.userId,
						sub.args.entityId,
						sub.args.entityType,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch(err) {
					sub.pub(err);
				}
				break;
			}
			case "by-property": {
				try {
					const result = await feedModel.streamEntityByPropertyWithAuthorization(
						sub.identity.userId, 
						sub.args.property,
						sub.args.value,
						sub.args.entityType,
						function(err, record) {
							if (err) {
								console.log(err);
							}
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
			}
			default:
				sub.pub({"msg": "invalid action: " + filterType.toLowerCase()});
		}
	}

	async streamFeedEntities(sub) {
		const filterType = sub.args.filterType;
		const sessionId = uuidv4();
		let cancelFn = null;
		if(sub.args.feedId && sub.args.feedId.includes("@@")) {
			// -- this is for remote eco should I include local as well? probably
			this.subscribeFeedEnts(sub);
			return;
		}

		switch(filterType.toLowerCase()) {
			case "external": // filtered feeds
				// should be able to get from req	
				try {
					const result = await feedModel.streamFeed(
						sub.args.feedId,
						sub.identity.userId,
						sub.identity.orgId,
						sub.args.inclusionGeo || null,
						sub.args.expandRefs || false,
						sub.args.ignoreBatches,
						sessionId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					cancelFn = result;
					sub.events.on("disconnect", () => {
						console.log("Cancelling feed for due to disconnect", sub.identity.userId, sub.args.feedId);
						cancelFn();
					});
				} catch (reason) {
					sub.pub(reason);
				}
				break;
			case "event":
				cancelFn = await this.eventFeed(
					sub.identity.userId,
					sub.args.eventId,
					sessionId,
					function(err, record) {
						if (err) {
							console.log(err);
						}
						sub.pub(record);
					});
				sub.events.on("disconnect", () => {
					cancelFn();
				});
				break;
			case "system": // filtered cameras and shapes
				try {
					const result = await feedModel.streamUserIntegration(
						sub.args.feedId,
						sub.identity.userId,
						sub.identity.orgId,
						sub.args.inclusionGeo || null,
						sub.args.expandRefs || false,
						sub.args.ignoreBatches,
						sub.args.excludeEntities,
						sessionId,
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (reason) {
					sub.pub(reason);
				}
				break;
			case "global": { // Any feed using the system-based global changefeed
				// Unique id needed for global feed subscription
				// const sessionId = uuidv4();
				try {
					const result = await feedModel.streamGlobalFeed(
						sub.args.feedId,
						sub.identity.userId,
						sub.identity.orgId,
						sessionId, // sessionId
						sub.args.additionalFilters || null, // additional filters actually all these last args should be wrapped in this
						null, // TODO: ENT_AUTH inclusionGeo - replace streamFeed and streamUserIntegration on client to call this
						null, // expandRefs
						null, // TODO: ENT_AUTH ignoreBatches - replace streamFeed and streamUserIntegration on client to call this
						null, // excludeEntities
						function(err, record) {
							if (err) {
								console.log(err);
							}
							sub.pub(record);
						});
					const unsubUser = result;
					sub.events.on("disconnect", () => {
						console.log("Cancelling feed due to disconnect", sub.identity.userId, sub.args.feedId);
						unsubUser();
					});
				} catch (reason) {
					sub.pub(reason);
				}
				break;
			}
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	}
	
	/**
	 * eventFeed - for the given user and event provides a changefeed for all entities pinned to the event
	 *  
	 * @param userId 
	 * @param eventId
	 * @param sessionId
	 * @param handler 
	*/
	async eventFeed(userId, eventId, sessionId, handler) {
		const event = await feedModel.getEntityWithAuthorization(userId, eventId, "event");
		if (!event) {
			throw { message: "User is not authorized to access this event", code: 403 };
		}

		const userProfile = await userModel.getProfile(userId);
		const feedIds = userProfile.user.integrations.map(function (feed) {
			return feed.feedId;
		});

		// TODO - cancel functions not working
		const cancelFunctions = await Promise.all(
			feedIds.map(async (feedId) => {
				logger.info("eventFeed", `Subscribing to feed ${feedId}`, { feedId: feedId });
				if(feedId.includes("@@")) {
					logger.info("eventFeed", "Feed is remote, subscribe to remote eco", { remoteEcoId: eventId.split("@@")[1] });
					// create sub and call remote eco
					// TODO: Something nicer for handling remote events here
					const sub = {
						app: "ecosystem",
						args: {
							feedId: feedId,
							filterType: "global",
							expandRefs: null,
							excludeEntities: null,
							inclusionGeo: null,
							additionalFilters: { eventId: eventId.split("@@")[0] }
						},
						identity: {
							userId: userId,
							orgId: userProfile.user.orgId
						},
						method: "subscribe",
						route: "/feedEntities", 
						pub(record) {
							logger.info("eventFeed", "Publish change from remote", { change: record });
							handler(null, record);
						}
					};
					try {
						return this.subscribeFeedEnts(sub);
					}
					catch(err) {
						logger.error("eventFeed", " Remote feed subscription error", { errMessage: err.message, errStack: err.stack });
					}
				}
				else {
					logger.info("eventFeed", "Subscribe local feed", { feedId: feedId });
					try {
						return feedModel.streamGlobalFeed(
							feedId,
							userId,
							userProfile.user.orgId,
							sessionId,
							{ eventId: eventId },
							null,
							false,
							false,
							null,
							function(err, record) {
								if (err) {
									logger.error("eventFeed", "Publish change local unexpected error", { errMessage: err.message, errStack: err.stack });
								}
								logger.info("eventFeed", "Publish change local", { change: record });
								handler(null, record);
							});
					}
					catch(err) {
						logger.error("eventFeed", "Local feed unexpected error", { errMessage: err.message, errStack: err.stack });
					}
				}
			})
		);

		const cancelAll = function() {
			for(const cancelFunc of cancelFunctions) {
				try {
					cancelFunc();
				}
				catch(err) {
					console.log("Error cancelling subscriptions", err.message, err.stack);
					console.log(typeof(cancelfunc), cancelFunc);
				}
			}
			cancelFunctions.splice(0, cancelFunctions.length);
		};

		return cancelAll;

	}


	async subscribeFeedEnts(proxySub) {
		let idParts = null;
		if(proxySub.args.filterType === "event") {
			idParts = proxySub.args.eventId.split("@@");
			proxySub.args.eventId = idParts[0];
		}
		else {
			idParts = proxySub.args.feedId.split("@@");
			proxySub.args.feedId = idParts[0];
		}
		//  Considering passing remote and letting existing methods handle changing Id but I don't want that code integrated so not sure I like this
		const proxy = this.ecoLinkManager().getProxy(idParts[1]);
		const unsub = await proxy.realtimeSubscription(proxySub, function(err, res) {
			if(err) {
				logger.error("subscribeFeedEnts", " Remote pubsub error", { errMessage: err.message, errStack: err.stack });
			}
			if(res.changes) {
				for(const change of res.changes) {
					const ent = change.new_val ? change.new_val : change.old_val;
					if(ent.id) ent.id = `${ent.id}@@${idParts[1]}`;
					// -- this one may not even matter but it might to client (regardles it shouldn't be necessary)
					if(ent.entityData && ent.entityData.properties) ent.entityData.properties["id"] = ent.id;
					if(ent.feedId) ent.feedId = `${ent.feedId}@@${idParts[1]}`;
				}
				proxySub.pub(res);
			}
		});
		return unsub;
	}

	// REALTIME ONLY DIFF IS WHAT PROPERTY IS SPLIT- GENERIC MIDDLEWARE COULD HANDLE THE SPLIT AND MODIFY THE CORRECT ARG FOR THE CALL
	// THEN JUST A SINGLE PROXY METHOD FOR REALTIME CALLS - NEED TO TAKE INTO ACCOUNT OF TRANSFORM OF RESULTS
	async proxyEntity(proxySub) {
		const entityIdParts = proxySub.args.entityId.split("@@");
		if(entityIdParts.length === 2) {
			proxySub.args.entityId = entityIdParts[0];
			//  Considering passing remote and letting existing methods handle changing Id but I don't want that code integrated so not sure I like this
			const proxy = this.ecoLinkManager().getProxy(entityIdParts[1]);
			const unsub = await proxy.realtimeSubscription(proxySub, function(err, res) {
				if(err) {
					console.log("REMOTE PUBSUB ERROR proxyEntity", err.message, err.stack);
				}
				if(res.new_val) {
					res.new_val.id = `${res.new_val.id}@@${entityIdParts[1]}`;
					if(res.new_val.entityData && res.new_val.entityData.properties) res.new_val.entityData.properties.id = res.new_val.id;
					res.new_val.feedId = `${res.new_val.feedId}@@${entityIdParts[1]}`;
					if(res.new_val.notes) res.new_val.notes = `${res.new_val.notes}@@${entityIdParts[1]}`;
				}
				proxySub.pub(res);
			});
		}
	}

	async getEntityWithAuthorization(userId, entityId, entityType, permission = "view") {
		const idParts = entityId.split("@@");
		if(idParts.length === 2) {
			const remoteEntityId = idParts[0];
			const remoteEco = idParts[1];
			const proxy = this.ecoLinkManager().getProxy(remoteEco);
			return await proxy.getEntityWithAuthorization(userId, remoteEntityId, entityType, permission);
		}
		else {
		// log error
			return null;
		}
	}


	async getEntityWithAuthorizationUseFeedId(userId, entityId, feedId) {
		const idParts = entityId.split("@@");
		const feedIdParts = feedId.split("@@");
		if(idParts.length === 2) {
			const remoteEntityId = idParts[0];
			const remoteFeedId = feedIdParts[0];
			const remoteEco = idParts[1];
			const proxy = this.ecoLinkManager().getProxy(remoteEco);
			return await proxy.getEntityWithAuthorizationUseFeedId(userId, remoteEntityId, remoteFeedId);
		}
		else {
		// log error
			return null;
		}
	}

	async getEntity(entityId, entityType) {
		const idParts = entityId.split("@@");
		if(idParts.length === 2) {
			const remoteEntityId = idParts[0];
			const remoteEco = idParts[1];
			const proxy = this.ecoLinkManager().getProxy(remoteEco);
			return await proxy.getEntity(remoteEntityId, entityType);
		}
		else {
		// log error
			return null;
		}
	}

	async getEntitiesByTypeWithAuthorization(req, entityType = null, includeDetails = false, transformIds = false) {
		let results = [];
		if(this.ecoLinkManager().isActive()) {
			// Any issue with remotes should not fail the call so at least local is returned. Log errors for later resolution
			try {
				if(!req.query["@@remote"] && this.ecoLinkManager().isActive()) {
					req.query = req.query ? req.query : {};
					if(entityType !== null) req.routeVars["entityType"] = "camera";
					req.query["includeDetails"] = includeDetails;
					req.query["@@remote"] = true;

					try {
						results = await this.ecoLinkManager().execReqAll("GET", `/feedEntities/byType/${req.routeVars.entityType}`, req, "ecosystem", transformIds);
						if(!Array.isArray(results)) {
							logger.error("getEntitiesByTypeWithAuthorization", "Remote call failed, did not return expected array", { result: results });						
							results = [];
						}
					}
					catch(err) {
						logger.error("getEntitiesByTypeWithAuthorization", "Unexpected error fetching from remotes", { errMessage: err.message, errStack: err.stack });
					}
				}
			}
			catch(err){
				logger.error("getEntitiesByTypeWithAuthorization", "Unexpected error", { errMessage: err.message, errStack: err.stack });
			}
		}
		return results;
	}


	async queryUserFeedEntities(req, idsOnly) {
		let results = [];
		if(this.ecoLinkManager().isActive()) {
			if(!req.query["@@remote"] && this.ecoLinkManager().isActive()) {
				req.query = req.query ? req.query : {};
				req.query["@@remote"] = true;
				const proxies = this.ecoLinkManager().getAllProxies();
				for(const proxy of proxies) {
					let result = await proxy.execReq("GET", "/feedEntities", req);
					if (idsOnly) {
						result = result.map(entId => `${entId}@@${proxy.targetEcoId}`);
					} else {
						for(const item of result) {
							item.id = `${item.id}@@${proxy.targetEcoId}`;
							item.feedId = `${item.feedId}@@${proxy.targetEcoId}`;
						}
					}
					results = [...results, ...result];
				}
			}
		}
		// return [...localResult, ...results];
		return results;
	}

}

module.exports = Feed;