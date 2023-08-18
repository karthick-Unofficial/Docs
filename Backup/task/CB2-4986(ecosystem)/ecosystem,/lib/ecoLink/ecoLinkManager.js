const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/lib/ecoLink/ecoLinkManager.js");
const ecoLinkModel = require("../../models/ecoLinkModel")({});
const EcoLinkClient = require("./ecoLinkClient");
const EventEmitter = require("events");
let _instance = null;

class EcoLinkManager {
	constructor(app, options) {
		if (!_instance) {
			this._options = options || {};
			this._app = app;
			this._loadbalance = this._options.loadbalance || false;
			// this._gcf = gcf;
			this._linkedEcos = {};
			this.events = new EventEmitter();
			_instance = this;
		}
		return _instance;
	}
	
	async init() {

		// it's connecting even if service isn't available as far as I can tell
		// and does not get or expect the initial response in that case. Need to quit and
		// keep trying to reconnect until we get that initial response

		const result = await ecoLinkModel.getAllActive();
		console.log("Active Eco Links", JSON.stringify(result, null, 4));

		if(result.length > 0) {
		// -- Init Client Connections
			for (const le of result) {
				const ecoLinkClient = new EcoLinkClient(
					this._app,
					{
						linkId: le.id,
						sourceEcoId: le.sourceEcoId,
						targetEcoId: le.targetEcoId,
						targetEcoName: le.targetEcoName,
						nats: le.natsClientConfig,
						loadbalance: this._loadbalance
					});

				this._linkedEcos[ecoLinkClient.targetEcoId] = { client: ecoLinkClient };

				// todo - refactor linkedEcos to just the client
				ecoLinkClient.events.on("ready", function(ecoLinkClient) {
					this._linkedEcos[ecoLinkClient.targetEcoId]["isReady"] = true;
					logger.info("init", `${ecoLinkClient.targetEcoId} Ready`);
					const notReady = Object.keys(this._linkedEcos).filter(function(linkedEcoId) {
						return !this._linkedEcos[linkedEcoId].isReady;
					}.bind(this));
					if(notReady.length === 0) {
						logger.info("init", "EcoLinkManager Ready");
						this.events.emit("ready");
					}
				}.bind(this));

				// TODO: If/When a link fails that needs to be communicated to client and then what???? Will need health at a minimum
				// ecoLinkClient.events.on("error", function(ecoLinkClient) {
				// 	// TODO: refactor so this points directly to the ecoLinkClient
				// 	this._linkedEcos[ecoLinkClient.targetEcoId].status = "disabled";
				// }.bind(this));

				ecoLinkClient.init();

				// Forward changes from all connected clients
				ecoLinkClient.events.on("change", function(change) {
				 this.events.emit("change", change);
				}.bind(this));
			// establish connection
			// subscribe to feeds that will be piped into GCF local - think we will have some side effects we will need to deal with if data not local (handled in ecoLink)
			}
		}
		else {
			logger.info("init", "EcoLinkManager Ready no clients");
			this.events.emit("ready");
		}

	}

	getHealth() {
		const checks = Object.keys(this._linkedEcos).map(function(linkedEcoId) {
			return this._linkedEcos[linkedEcoId].client.getHealth();
		}.bind(this));
		return checks;
	}

	isActive() {
		// -- Todo: this seems not relevant for multiple remote eco support
		// -- rather should be handled in each method to only iterate/query connected clients
		const connectedRemoteEcos = Object.keys(this._linkedEcos).filter(function(linkedEcoId) {
			return this._linkedEcos[linkedEcoId].client.isConnected();
		}.bind(this));
		return connectedRemoteEcos.length > 0;
	}

	// -- sourceEcoId needs to be part of config I think
	getSourceEcoId() {
		const keys = Object.keys(this._linkedEcos);
		return keys.length > 0 ? this._linkedEcos[keys[0]].client.sourceEcoId : null;
	}

	getLinkedEco(targetEcoId) {
		return this._linkedEcos[targetEcoId] ? this._linkedEcos[targetEcoId].client : null;
	}

	getProxy(targetEcoId) {
		const linkedEco = this.getLinkedEco(targetEcoId);
		return linkedEco ? linkedEco.ecoLinkProxy : null;
	}

	getAllProxies() {
		const proxies =[];
		for(const key in this._linkedEcos) {
			const proxy = this.getProxy(key);
			proxies.push(proxy);
		}
		return proxies;
	}

	getRemoteFromId(id) {
		const idParts = id.split("@@");
		if(idParts.length === 2) {
			const remoteId = idParts[0];
			const remoteEcoId = idParts[1];
			const proxy = this.getProxy(remoteEcoId);
			return {
				id: remoteId,
				remoteEcoId: remoteEcoId,
				proxy: proxy
			};
		}
		else {
			// log error
			return null;
		}
	}

	getAllUserPolicyCaches() {
		const result = {};
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			result[key] = linkedEco.client.userPolicyCache;
		}
		return result;
	}

	// TODO will need to add exclusions, perhaps more...events???
	// TODO: For more than one lined eco need to specifically target eco, these just return first found at moment which might work but seems there could be key issues

	getUserPolicyCacheUser(userId) {
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const user = linkedEco.client.userPolicyCache.users[userId];
			if(user)  {
				user["_ecosystem"] = key;
				return user;
			}
		}
		return null;
	}

	getUserPolicyFeedType(feedTypeId) {
		const feedTypeIdParts = feedTypeId.split("@@");
		const linkedEco = this.getLinkedEco(feedTypeIdParts[1]);
		return linkedEco.userPolicyCache.feedTypes[feedTypeIdParts[0]] || null;
		// for(const key in this._linkedEcos) {
		// 	const linkedEco = this._linkedEcos[key];
		// 	const feedType = linkedEco.client.userPolicyCache.feedTypes[feedTypeId];
		// 	if(feedType) return feedType;
		// }
		// return null;
	}

	getUserPolicyCacheRoleApps(userRoleId) {
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const roleApps = linkedEco.client.userPolicyCache.roleApplications[userRoleId];
			if(roleApps) return roleApps;
		}
		return null;
	}

	// I only need integrations for this ecosystem
	getUserPolicyCacheOrgInt(orgIntId) {
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const orgInt = linkedEco.client.userPolicyCache.orgIntegrations[orgIntId];
			if(orgInt) return orgInt;
		}
		return null;
	}


	// I only need integrations for this ecosystem
	getUserPolicyCacheRoleInts(userRoleId) {
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const roleInts = linkedEco.client.userPolicyCache.roleIntegrations[userRoleId];
			if(roleInts) return roleInts;
		}
		return null;
	}

	getUserPolicyCacheEvent(eventId) {
		eventId = eventId.split("@@")[0];
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const event = linkedEco.client.userPolicyCache.events[eventId];
			if(event) return event;
		}
		return null;
	}

	getUserPolicyCacheEventEntity(entityId) {
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			// TODO: STRIP @@ECO WHEN LOADING CACHE
			// const eventEntity = linkedEco.client.userPolicyCache.eventEntities[`${entityId}@@${linkedEco.client.targetEcoId}`];
			const eventEntity = linkedEco.client.userPolicyCache.eventEntities[entityId];
			if(eventEntity) return eventEntity;
		}
		return null;
	}

	// return client and connection (maybe just client)
	async findOrgSharingConnection(connectionId) {
		const result = {
			success: false,
			linkedEco: null,
			cxn: null
		};
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const cxn = await linkedEco.client.ecoLinkProxy.getSharingConnectionById(connectionId);
			if(cxn)  {
				result.success = true;
				result.linkedEco = linkedEco;
				result.cxn = cxn;
				break;
			}
		}
		return result;
	}

	// return client and connection (maybe just client)
	async getRemoteSharingConnections() {
		let result = [];
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const cxns = await linkedEco.client.ecoLinkProxy.getSharingConnectionsByEco(linkedEco.client.sourceEcoId);
			if(cxns && cxns.length > 0)  {
				result = [...result, ...cxns];
			}
		}
		return result;
	}

	async getOrganizations() {
		const result = [];
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const orgs = await linkedEco.client.ecoLinkProxy.getOrganizations();
			if(orgs && orgs.length > 0)  {
				for(const org of orgs) {
					// -- could let the client get this on intitial connect rather than storing in both ecos
					org._ecosystem = linkedEco.client.targetEcoId;
					result.push(org);
				}
			}
		}
		return result;
	}

	async getOrganizationById(orgId) {
		let result = null;
		for(const key in this._linkedEcos) {
			const linkedEco = this._linkedEcos[key];
			const org = await linkedEco.client.ecoLinkProxy.getOrganizationById(orgId);
			if(org)  {
				// -- could let the client get this on intitial connect rather than storing in both ecos
				org._ecosystem = linkedEco.client.targetEcoId;
				result = org;
				break;
			}
		}
		return result;
	}

	async getOrgIntegrations(orgId) {
		const result = [];
		// -- temp - need to tag org integrations as remote where that is the case and incorporate into query
		if(orgId !== "ares_security_corporation") {
			for(const key in this._linkedEcos) {
				const linkedEco = this._linkedEcos[key];
				const orgInts = await linkedEco.client.ecoLinkProxy.getOrgIntegrations(orgId);
				if(orgInts && orgInts.length > 0)  {
					for(const orgInt of orgInts) {
					// we should just check for sharing connection here or somewhere if there is no connection between orgs then shouldn't be returning results
						orgInt.feedId = `${orgInt.feedId}@@${linkedEco.client.targetEcoId}`;
						orgInt._ecosystem = linkedEco.client.targetEcoId;
						result.push(orgInt);
					}
				}
			}
		}
		return result;
	}

	async queryPinnable(remoteEcoIds, userId, eventId, query) {
		const result = [];
		for(const key in this._linkedEcos) {
			if(remoteEcoIds.includes(key)) {
				const linkedEco = this._linkedEcos[key];
				const pinnableItems = await linkedEco.client.ecoLinkProxy.queryPinnable(userId, eventId, query);
				if(pinnableItems && pinnableItems.length > 0)  {
					for(const pinnableItem of pinnableItems) {
						pinnableItem.id = `${pinnableItem.id}@@${linkedEco.client.targetEcoId}`;
						pinnableItem.feedId = `${pinnableItem.feedId}@@${linkedEco.client.targetEcoId}`;
						result.push(pinnableItem);
					}
				}
			}
		}
		return result;
	}

	// -- GCF NEEDS TO BE FILTER TO ONLY INCLUDE SHARED FEED DATA
	// -- THAT HAS TO TAKE INTO ACCOUNT ALWAYS AND EVENT POLICY
	// -- THIS MEANS THOSE FEEDS NEED TO COME THROUGH ECOSYSTEM WHERE THEY CAN BE AZ A "GCF FEED FORWARDER"
	// -- They could come through a realtime feed but that would be delayed...But that's really the only way...
	
	subscribeAllGCF(filter, queue, handler, callback) {
		// TODO - unsubscribe after dropped if not already handled
		for(const key in this._linkedEcos) {
			const linkedEcoClient = this._linkedEcos[key].client;
			linkedEcoClient.globalChangefeed.subscribe(filter, queue, (change) => handler(change, key), callback);
		}
	}

	subscribeAllPersistentGCF(entityType, handler) {
		// TODO - unsubscribe after dropped if not already handled
		for(const key in this._linkedEcos) {
			const linkedEcoClient = this._linkedEcos[key].client;
			linkedEcoClient.globalChangefeed.subscribePersistent(entityType, (change, subject) => handler(change, subject, key));
		}
	}

	async execReq(targetEcoId, method, route, req, app = "ecosystem") {
		const proxy = this.getProxy(targetEcoId);
		return proxy.execReq(method, route, req, app);
	}

	async execReqAll(method, route, req, app = "ecosystem", transformIds = false) {
		const results = await Promise.all(
			this.getAllProxies().map((proxy) => {
				return proxy.execReq(method, route, req, app, transformIds);
			})
		);
		const mergedResults = [].concat.apply([], results);
		return mergedResults;
	}	
}

module.exports = EcoLinkManager;