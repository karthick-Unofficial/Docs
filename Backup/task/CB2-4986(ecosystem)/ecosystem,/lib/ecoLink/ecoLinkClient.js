const nats = require("nats");
const EcoLinkProxy = require("./ecoLinkProxy");
const GlobalChangefeed = require("node-app-core/dist/global-changefeed");
const EventEmitter = require("events");
const sleep = ms => new Promise(res => setTimeout(res, ms));

const natsDefaultConfig = {
	// url: "nats://phoenix-nats:4222", // remove default url
	reconnect: true,
	maxReconnectAttempts: -1,
	reconnectTimeWait: 250
};

const clientStatus = {
	connected: "connected",
	disconnected: "disconnected"
};

class EcoLinkClient {
	constructor(app, options) {
		options = options || {};
		this._app = app;
		this._systemId = options.linkId;
		this.sourceEcoId = options.sourceEcoId;
		this.targetEcoId = options.targetEcoId;
		this._loadbalance = options.loadbalance || false;
		this.targetEcoName = options.targetEcoName;
		this._natsClient = null;
		this._natsConfig = { ...natsDefaultConfig, ...options.nats, ...{ name: this._app } };
		this.connected = false;
		this.ecoLinkProxy = null;
		this.userPolicyCache = null;
		this._upcUnsub = null;
		this._gcfSid = null;
		this.globalChangefeed = null;
		this.events = new EventEmitter();
		this._status = clientStatus.disconnected;
		this._init = false;
		if (!(this._natsConfig.servers || this._natsConfig.url)) {
			throw ({ message: "NATS configuration requires a url or servers specified to connect to" });
		}
	}

	// we need to keep trying to connect until available so need to see error
	// probably shouldn't have init block
	async subscribeUserPolicyCache() {
		try {
			const sub = {
				app: "ecosystem",
				args: {},
				identity: {
					userId: this.sourceEcoId
				},
				method: "subscribe",
				route: "/userPolicyCache"
			};

			this._upcUnsub = await this.ecoLinkProxy.realtimeSubscription(sub, function (err, res) {
				if (err) {
					console.log("subscribeUserPolicyCache error", err.message, err.stack);
				}
				this.syncUserPolicyCache(res);
			}.bind(this));
			return true;
		}
		catch (err) {
			throw err;
		}
	}

	async syncUserPolicyCache(change) {
		// TRANSFORM ROLE INTEGRATION REMOVING @@ECO
		if(change && change.type === "initial") {
			this.userPolicyCache = change.change;
			for(const roleIntKey in this.userPolicyCache.roleIntegrations) {
				const transformedInts= {};
				const roleInt = this.userPolicyCache.roleIntegrations[roleIntKey];
				for(const intKey in roleInt) {
					if(intKey.includes("@@")) {
					// -- get the key back to the local integration id if the feed lives here
						const intKeyParts = intKey.split("@@");
						if(intKeyParts[1] === this.sourceEcoId) {
							transformedInts[intKeyParts[0]] = { ...this.userPolicyCache.roleIntegrations[roleIntKey][intKey] };
						}
					}
					else {
						transformedInts[`${intKey}@@${this.targetEcoId}`] = { ...this.userPolicyCache.roleIntegrations[roleIntKey][intKey] };
					}
				}
				this.userPolicyCache.roleIntegrations[roleIntKey] = transformedInts;
			}


			const renameProp = function(obj, oldName, newName) {
			// Do nothing if the names are the same
				if (oldName === newName) {
					return this;
				}
				// Check for the old property name to avoid a ReferenceError in strict mode.
				if (obj.hasOwnProperty(oldName)) {
					obj[newName] = obj[oldName];
					delete obj[oldName];
				}
			};

			// -- Localize remote eco Id's as should only be az own ents
			const replaceEventEntKeys = Object.keys(this.userPolicyCache.eventEntities)
				.filter(key => key.includes("@@"));
			for(const key of replaceEventEntKeys) {
				renameProp(this.userPolicyCache.eventEntities, key, key.split("@@")[0]);
			}
		}
		else if(change) {
			const upcChange = change.change;
			switch(change.type) {
				case "eventFeed":
					if (upcChange && upcChange.new_val) {
						const entityId = upcChange.new_val.entityId.includes("@@") ? upcChange.new_val.entityId.split("@@")[0] : upcChange.new_val.entityId;
						const eventId = upcChange.new_val.eventId;
						if(!this.userPolicyCache.eventEntities[entityId]) this.userPolicyCache.eventEntities[entityId] = {};
						this.userPolicyCache.eventEntities[entityId][eventId] = upcChange.new_val;
					}
					// Remove
					if (upcChange && !upcChange.new_val && upcChange.old_val) {
						const entityId = upcChange.old_val.entityId.includes("@@") ? upcChange.old_val.entityId.split("@@")[0] : upcChange.old_val.entityId;
						const eventId = upcChange.old_val.eventId;
						if (this.userPolicyCache.eventEntities[entityId] && this.userPolicyCache.eventEntities[entityId][eventId]) {
							delete this.userPolicyCache.eventEntities[entityId][eventId];
						}
					}
					break;
				case "roleIntegration": 
					if (upcChange && upcChange.new_val) {
						const roleId = upcChange.new_val.roleId;
						const intId = upcChange.new_val.intId;
						if(!this.userPolicyCache.roleIntegrations[roleId]) this.userPolicyCache.roleIntegrations[roleId] = {};
						if(intId.includes("@@")) {
							// -- get the key back to the local integration id if the feed lives here
							const intKeyParts = intId.split("@@");
							if(intKeyParts[1] === this.sourceEcoId) {
								this.userPolicyCache.roleIntegrations[roleId][intKeyParts[0]] = { ...upcChange.new_val };
							}
						}
						else {
							this.userPolicyCache.roleIntegrations[roleId][intId] = upcChange.new_val;
						}
	
					}
					else if (upcChange && !upcChange.new_val && upcChange.old_val) {
						const roleId = upcChange.old_val.roleId;
						const intKeyParts = upcChange.old_val.intId.split("@@");
						const intId = intKeyParts.length === 2 && (intKeyParts[1] === this.sourceEcoId) ? intKeyParts[0] : upcChange.old_val.intId;
						if (this.userPolicyCache.roleIntegrations[roleId] && this.userPolicyCache.roleIntegrations[roleId][intId]) {
							delete this.userPolicyCache.roleIntegrations[roleId][intId];
						}
					}
					break;
			}
		}
	}

	async init() {
		try {
			let attemptCount = 0;
			console.log(`NATS connecting to remote ecosystem ${this._systemId} ${this._natsConfig.url}`);
			while(!this.connected) {
				attemptCount++;
				try {
					console.log(`NATS connection attempt ${attemptCount}`);
					this._natsClient = new nats.connect(this._natsConfig);
					this.connected = true;
					console.log(`NATS connection Successful from app ${this._app}`);
				}
				catch(err) {
					console.log("NATS connect to remote ecosystem failed.", err.message);
				}
				await sleep(1000);
			}

			console.log(`Initializing eco link proxy for target eco ${this.targetEcoId} from app ${this._app}`);
			this.ecoLinkProxy = new EcoLinkProxy(
				this._natsClient, 
				{ 
					targetEcoId: this.targetEcoId,
					sourceEcoId: this.sourceEcoId
				});
				
			console.log(`Initializing globalchangefeed for target eco ${this.targetEcoId} from app ${this._app}`);
			this.globalChangefeed = new GlobalChangefeed(`ecoLinkClient_${this._app}_${this.targetEcoId}`, this._natsClient, {});
			const queuename = this._loadbalance ? `${this.sourceEcoId}_${this._app}` : null;
			this._gcfSid = this.globalChangefeed.subscribe({ entityType: "*" }, queuename, function(change, subject) {
				if(change) {
					if(change.new_val) {
						change.new_val.id += `@@${this.targetEcoId}`;
						change.new_val.feedId += `@@${this.targetEcoId}`;
					}
					if(change.old_val) {
						change.old_val.id += `@@${this.targetEcoId}`;
						change.old_val.feedId += `@@${this.targetEcoId}`;
					}
					this.events.emit("change", change);
				}
			}.bind(this));
	

			// start initial ping to know ecosystem is available
			// continue pinging and if becomes unavailable reinit
			setInterval(async function() {
				let pingResult = false;
				try {
					pingResult = await this.ecoLinkProxy.ping();
				}
				catch(err) {
					console.log(`Ping target eco ${this.targetEcoName} failed`);
				}
				const currentStatus = pingResult ? clientStatus.connected : clientStatus.disconnected;
				if(this._status === clientStatus.disconnected && currentStatus === clientStatus.connected) {
					console.log(`Remote Eco ${this.targetEcoName} connected`);
					this.events.emit("connected", this);
					this._initPostConnect();
				}
				else if(this._status === clientStatus.connected && currentStatus === clientStatus.disconnected) {
					console.log(`Remote Eco ${this.targetEcoName} disconnected`);
					this.events.emit("disconnected", this);
					this._cleanup();
				}
				this._status = currentStatus;
			}.bind(this), 5000);


		}
		catch(err) {
			console.log("Unexpected error in init", err.message, err.stack);
			this.events.emit("error", err);
		}
        
		this._natsClient.on("close", function () {
			console.log("close NATS");
		});

		this._natsClient.on("disconnect", function () {
			console.log("disconnect NATS");
		});

		this._natsClient.on("reconnecting", function () {
			console.log("reconnecting NATS");
		});

		this._natsClient.on("error", function (err) {
			console.log(err);
			this.events.emit("error", err);
		}.bind(this));

	}

	async _initPostConnect() {
		try {
			console.log(`Setting userPolicyCache for target eco ${this.targetEcoId} from app ${this._app}`);
			this.subscribeUserPolicyCache();				
			if(!this._init) {
				this._init = true;
				this.events.emit("ready", this);
			}
		}
		catch(err) {
			console.log("Unexpected error in init", err.message, err.stack);
			this.events.emit("error", err);
		}
	}

	_cleanup() {
		console.log(`cleanup target eco connection ${this.targetEcoId}`);
		this._upcUnsub();
		this._upcUnsub = null;
		this.userPolicyCache = null;
		this.globalChangefeed = null;
	}

	getHealth() {
		let status = { "ok": true };
		if(this._status === clientStatus.disconnected) {
			status = {
				"ok": false,
				"message": `unable to connect to remote ecosystem ${this.targetEcoName}`
			};
		}
		const check = {
			"id": `remote-ecosystem-connection-status-${this.targetEcoId}`,
			"name": `Remote Ecosystem ${this.targetEcoName} Connection Status`,
			"desc": "Indicates whether remote ecosystem is connected or not",
			"value": this._status,
			"status": status,
			"lastUpdated": new Date().toISOString(),
			"essential": false
		};

		return check;
	}

	isConnected() {
		return this._status === clientStatus.connected;
	}
	
}

module.exports = EcoLinkClient;

