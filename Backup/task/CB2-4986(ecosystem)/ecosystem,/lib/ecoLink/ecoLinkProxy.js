const nac = require("node-app-core");

class EcoLinkProxy {
	constructor(natsClient, options) {
		// if (!(this instanceof EcoLinkProxy)) return new EcoLinkProxy(natsClient, options);
		this._natsClient = natsClient;
		this.targetEcoId = options.targetEcoId;
		this.sourceEcoId = options.sourceEcoId;
		this._appRequest = nac.appRequest(null, "ecosystem-remote", natsClient, {});
	}

	async execReq(method, route, req, app = "ecosystem", transformIds = false) {
		try {
			const result = await this._appRequest.request(
				app,
				method,
				route,
				req.query || null,
				req.body || null,
				req.identity || {}
			);
			if(transformIds && method.toLowerCase() === "get") {
				for(const item of result) {
					if(item.id) item.id = `${item.id}@@${this.targetEcoId}`;
					if(item.feedId) item.feedId = `${item.feedId}@@${this.targetEcoId}`;
				}
			}
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}


	/**
	 * ping - query target eco version endpoint to ensure remote eco is listening for requests
	 * @param
	 */
	async ping() {
		try {
			const route = "/_appVersion";
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				null,
				null,
				{},
				5000
			);
			return result.app && result.app.name === "ecosystem";
		}
		catch (err) {
			return false; 
		}
	}

	async getUserPolicyCache() {
		try {
			const route = "/_internal/userPolicyCache";
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ remote: true },
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getListCategoryById(userId, categoryId) {
		try {
			const route = `/listCategories/${categoryId}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ remote: true },
				null,
				{ userId: userId }
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getEntityWithAuthorization(userId, entityId, entityType, permission = "view") {
		try {
			permission = !permission ? "view" : permission;
			const route = `/entities/${entityType}/${entityId}/authorize/${permission}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ includeEnt: "true" },
				null,
				{ userId: userId }
			);
			const ent = result.entity;
			if(ent) {
				if(ent.id) ent.id = `${ent.id}@@${this.targetEcoId}`;
				if(ent.feedId) ent.feedId = `${ent.feedId}@@${this.targetEcoId}`;
				if(ent.entityData && 
					ent.entityData.properties && 
					ent.entityData.properties.id) 
					ent.entityData.properties.id = `${ent.entityData.properties.id}@@${this.targetEcoId}`;
				return ent;
			}
			return null;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getEntityWithAuthorizationUseFeedId(userId, entityId, feedId) {
		try {

			const route = `/feeds/${feedId}/entities/${entityId}`;
		
			const ent = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				null,
				null,
				{ userId: userId }
			);
			if(ent) {
				if(ent.id) ent.id = `${ent.id}@@${this.targetEcoId}`;
				if(ent.feedId) ent.feedId = `${ent.feedId}@@${this.targetEcoId}`;
				if(ent.entityData && 
					ent.entityData.properties && 
					ent.entityData.properties.id) 
					ent.entityData.properties.id = `${ent.entityData.properties.id}@@${this.targetEcoId}`;
				return ent;
			}
			return null;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getEntity(entityId, entityType) {
		try {
			const route = `/_internal/entities/${entityType}/${entityId}`;
		
			const ent = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				null,
				null,
				{}
			);
			if(ent) {
				ent.id = `${ent.id}@@${this.targetEcoId}`;
				ent.feedId = `${ent.feedId}@@${this.targetEcoId}`;
				if(ent.entityData.properties.id) ent.entityData.properties.id = `${ent.entityData.properties.id}@@${this.targetEcoId}`;
				return ent;
			}
			return null;
		}
		catch (ex) {
			throw (ex);
		}
	}


	async getOrganizations() {
		try {
			const route = "/organizations";
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ remote: true },
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getOrganizationById(orgId) {
		try {
			const route = `/organizations/${orgId}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ remote: true },
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getOrgIntegrations(orgId) {
		try {
			const route = `/organizations/${orgId}/integrations`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{ remote: true },
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async getSharingConnectionById(connectionId) {
		try {
			const route = `/_internal/sharingConnections/${connectionId}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				null,
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}


	async getSharingConnectionsByEco(ecoId) {
		try {
			const route = `/_internal/sharingConnections/ecosystem/${ecoId}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				null,
				null,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}


	async establishSharingConnection(connectionId, userId, orgId, orgName, ecoId) {
		try {
			const route = `/_internal/sharingConnections/${connectionId}/establish`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"PUT",
				route,
				{},
				{
					userId: userId,
					orgId: orgId,
					orgName: orgName,
					ecoId: ecoId
				},
				{ userId: userId }
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async queryPinnable(userId, eventId, query, pageSize = 5) {
		try {
			const route = `/events/${eventId}/pinnable?query=${query}&pageSize=${pageSize}`;
		
			const result = await this._appRequest.request(
				"ecosystem",
				"GET",
				route,
				{},
				{
					query: query,
					pageSize: pageSize
				},
				{ userId: userId }
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async upsertIntegration(userId, orgId, intId, policy, sourceEcoId) {
		try {
			const route = `/organizations/${orgId}/integrations/${intId}`;
			
			const result = await this._appRequest.request(
				"ecosystem",
				"POST",
				route,
				{},
				{
					policy: policy,
					sourceEcoId: sourceEcoId
				},
				{ userId: userId }
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async syncOrgIntegration(syncInt) {
		try {
			const route = "/_internal/linkedEco/syncIntegration";
			
			const result = await this._appRequest.request(
				"ecosystem",
				"PUT",
				route,
				{},
				syncInt,
				{}
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	async updatePinnedEntities(identity, body) {
		try {
			const route = "/events/updateEvent/updatePinnedEntities";
			
			const result = await this._appRequest.request(
				"ecosystem",
				"PUT",
				route,
				{},
				body,
				identity
			);
			return result;
		}
		catch (ex) {
			throw (ex);
		}
	}

	/**
 * realtimeSubscription
 * @param  sub { app: "AppRequest", route: "/entities", args: { filterType: "", feedtype } }
**/
	_realtimeSubscription(sub, callback) {
		return new Promise(function(resolve, reject) {

		// -- route all requests to test-app
		// -- test-app won't explicitly handle everything so have a generic handler to log interaction
		// -- both here and in rest calls
		// -- since these would all be internal calls (I think) no need to register with
		// -- app-gateway to intercept calls
		// -- leave the serializedSubscription with original app name in tact
		// const topic = (this._testMode ?  "cb-load-tester" : sub.app) + "~pubsub." + sub.route;
			const topic = sub.app + "~pubsub." + sub.route;
			const serializedSubscription = JSON.stringify(sub);

			let keepAliveIntervalHandle = null;
			let ackResponse = false;
			let keepAliveTopic = null;
			const keepAliveHandler = function () { this._natsClient.publish(keepAliveTopic, ""); }.bind(this);

			const sid = this._natsClient.request(topic, serializedSubscription, {}, function(response) {
				try {
					const r = JSON.parse(response);
					if (r) {
						if (r.err) {
							// -- for requests originating from an app keep trying until available
							// -- not found may be temporary. Such is case with test app
							// -- problem is I need to reinitiate request on fail
							if (r.err.code === 404) {
								setTimeout(() => { resolve(null); }, 1000);
							}
							else {
								callback({ errCode: r.err.code, "message": r.err.message }, null);
							}
						}
						else {
							// -- first response is ack - contains keep alive topic to publish keep alive messages to
							if (!ackResponse) {
							//console.log(response);
								const ackResponseObj = JSON.parse(response);
								keepAliveTopic = ackResponseObj["keep-alive-topic"];
								if (keepAliveTopic) {
									keepAliveIntervalHandle = setInterval(keepAliveHandler, 15000);
								}
								const unsubscribe = function () {
									console.log("unsubscribing " + JSON.stringify(sub));
									if (keepAliveIntervalHandle) {
										clearInterval(keepAliveIntervalHandle);
									}
									if (sid) {
										this._natsClient.unsubscribe(sid);
									}
								}.bind(this);
								ackResponse = true;
								resolve(unsubscribe);
							}
							else {
								callback(null, r);
							}
						}
					}
					else {
						callback(null, null);
					}
				}
				catch(err) {
					console.log("_realtimeSubscription Error #####################################################################");
					console.log("\n_realtimeSubscription timeout", err.message, err.stack, " \n ");
					console.log("#################################################################################################");
					//callback({ message: `realtimeSusbscription error: ${err.message}`, stack: err.stack, code: 500 }, null);
				}
			}.bind(this));

			// this._natsClient.timeout(sid, 5000, 1, function () {
			// 	console.log("_realtimeSubscription timeout");
			// 	resolve(null);
			// //callback({ errCode: 500, "message": "request timeout" }, null);
			// });

		// const unsubscribe = function () {
		// 	console.log("unsubscribing " + JSON.stringify(sub));
		// 	if (keepAliveIntervalHandle)
		// 		clearInterval(keepAliveIntervalHandle);
		// 	if (sid)
		// 		this._natsClient.unsubscribe(sid);
		// };

		//return unsubscribe;
		}.bind(this));
	}

	async realtimeSubscription(sub, callback) {
		let unsub = null;
		sub["_ecosystem"] = this.sourceEcoId;
		while (unsub === null) {
			try {
				unsub = await this._realtimeSubscription(sub, callback);
			}
			catch (ex) {
				console.log("realtimeSubscription Error ######################################################################");
				console.log(ex.message, ex.stack);
				console.log("#################################################################################################");
			}
			if (!unsub) {
				console.log(`realtime subscription to ${sub.route} failed to connect, retrying`);
			}
		}
		return unsub;
	}
}

module.exports = EcoLinkProxy;
