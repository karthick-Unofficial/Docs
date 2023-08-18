const FEED_TYPES_TABLE = "sys_feedTypes";
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userPolicyCache = new (require("../lib/userPolicyCache"));
const entityTypeCache = require("../lib/entityTypeCache");
const global = require("../app-global.js");
const _ = require("lodash");
const { logger } = require("handlebars");

// ---------------------------- Helpers -------------------------------

/**
 *  Helper function to select nested object properties by string, properties separated by underscore
 * @param: obj -- the object you'd like to grab properties from
 * @param: path -- the path you'd like to follow, a string with properties separated by underscores ("entityData_properties_callsign")
 */
const getNestedPropertyByPath = (obj, path) => {
	// Array of property names
	const array = path.split("_");
	// While array has length and obj is not null, 
	// set object equal to property that matches first item in array then remove first item
	while (array.length && obj && (obj = obj[array.shift()]));
	return obj;
};

/**
 *  Helper function to create nested properties in an object
 * @param: obj -- the object you'd like to add a nested property to
 * @param: path -- the path you'd like to create, a string with properties separated by underscores ("entityData_properties_callsign")
 * @param: value -- the value you'd like to set to the last property in the path param
 */
const assignPropertyByPath = (obj, path, value) => {
	const keys = path.split("_");
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj); 

	lastObj[lastKey] = value;
};

/**
 *  Helper function to compare specific properties from new_val and old_val on a change, and return if those specific properties changed
 *  @param: change -- rethinkDB changefeed response. ({type: "change", new_val: {...}, old_val: {...}})
 *  @param: propertiesArray -- an array of strings. Each string is a property path separated by underscores. ("entityData_properties_callsign")
 */
const compareProps = (change, propertiesArray) => {
	let update = false;

	propertiesArray.forEach(path => {
		// If an update has not been found already, check for updates
		if (!update) {
			const newVal = getNestedPropertyByPath(change.new_val, path);
			const oldVal = getNestedPropertyByPath(change.old_val, path);

			// If comparing arrays or objects, use deep equals
			// Otherwise, use default equality checks
			update = Array.isArray(newVal) || typeof newVal === "object" 
				? !_.isEqual(newVal, oldVal) 
				: newVal !== oldVal;
		}
	});

	return update;
};

/**
 *  Helper function to create a response based on an object and an array of property paths
 *  @param: obj -- the object you'd like to grab values from
 *  @param: propertiesArray -- an array of strings. Each string is a property path separated by underscores. ("entityData_properties_callsign")
 */
const createResponse = (obj, propertiesArray) => {
	const object = {};

	propertiesArray.forEach(path => {
		assignPropertyByPath(object, path, getNestedPropertyByPath(obj, path));
	});

	// These properties, if they exist, are required for streaming to work, so we force them
	// "owner" is only needed if the key exists, so that one is less important but still nice to add
	obj.hasOwnProperty("id") ? object.id = obj.id : null;
	obj.hasOwnProperty("isPublic") ? object.isPublic = obj.isPublic : null;
	obj.hasOwnProperty("feedId") ? object.feedId = obj.feedId : null;
	obj.hasOwnProperty("owner") ? object.owner = obj.owner : null;
	obj.hasOwnProperty("ownerOrg") ? object.ownerOrg = obj.ownerOrg : null;

	return object;
};


// ------------------------------ Class -----------------------------------------------

let instance = null;

class feedStream {
	constructor() {
		if (!instance) {
			this._global = null;
			// Feeds by ID with cancelFn and feed reference
			this._feeds = {};
			// Feed properties by ID with streamProperties and batching info
			this._feedProperties = {};
			// Batches by feedId, with batch types
			this._batches = {};
			// The next batches that will be sent across as changes
			this._nextBatches = {};
			// FeedId property with UserId array who need changes queued while waiting for initial
			this._queueChanges = {};
			// Queue'd changes by feedId {feedId: {userId: {batch1: [], batch2: []}}}
			this._batchQueue = {};
			// Change batch process, stored to clearInterval
			this._changesProcessor = {};

			// Initialize
			this._init();

			// Create singleton
			instance = this;
		}
		return instance;
	}

	// Initialization methods

	_init() {
		this._initializeFeedProperties();
		//this._initGlobalChangefeedListener();
	}

	async _initializeFeedProperties() {
		const feedTypes = await r.table(FEED_TYPES_TABLE)
			.run();
        
		feedTypes.forEach((ft) => {
			const feedId = ft.feedId;

			// Set key if nonexistant
			if (!this._feedProperties[feedId]) {
				this._feedProperties[feedId] = {
					ownerOrg: ft.ownerOrg,
					labels: ft.labels, // used for display name
					streamProperties: ft.streamProperties
				};
			}

			if (!this._nextBatches[feedId]) {
				this._nextBatches[feedId] = {};
			}
		});
	}

	_gcfHandler(change) {
		const entityType = change.new_val ? change.new_val.entityType || "UNKNOWN" : change.old_val ? change.old_val.entityType : "";
		// -- do not process tracks from a recovery. rt property indicates whether realtime or not so we can differentiate
		// -- TODO: consider future publishing non rt on diff topic
		if(entityType === "track" && !change.rt) return;
		if(entityTypeCache[entityType] && (entityType !== "event")) { // TODO: ENT_AUTH likely more than just event, lists? camera group? What is being published as an entity???
			if(!change["type"]) {
				change["type"] = !change.old_val ? "add" : (
					change.new_val.deleted ||
					change.new_val.isDeleted ||
					change.new_val.isActive === false ||
					(change.new_val.hasOwnProperty("inScope") && !change.new_val.inScope)
				) ? "remove" : "change";
			}
			if (change["type"] === "add" && change.new_val.hasOwnProperty("inScope") && !change.new_val.inScope) {
				return;
			}
			
			// Make sure entities have their ID in entityData.properties. This is so the ID is available in the map
			// icons when opening profiles and such.
			if (change.new_val && change.new_val.entityData && change.new_val.entityData.properties) {
				change.new_val.entityData.properties.id = change.new_val.id;
			}
			
			this._onFeedItem(change);	
		}
		else if(entityType === "event") { //special case for event filtered feeds pin/unpin
			if(change.new_val.pinChanges) {
				if(change.new_val.pinChanges.pinned) {
					for(const pinnedEnt of change.new_val.pinChanges.pinned) {
					// -- strips eco from id when coming via GCF
						const targetEcoId = pinnedEnt.feedId.includes("@@") ? pinnedEnt.feedId.split("@@")[1] : global.ecoLinkManager.getSourceEcoId();
						if(targetEcoId === global.ecoLinkManager.getSourceEcoId()) {
							if(pinnedEnt.id && pinnedEnt.id.includes("@@")) pinnedEnt.id = pinnedEnt.id.split("@@")[0];
							if(pinnedEnt.feedId && pinnedEnt.feedId.includes("@@")) pinnedEnt.feedId = pinnedEnt.feedId.split("@@")[0];
							this._onFeedItem({
								type: "pin",
								eventId: change.new_val.id,
								new_val: pinnedEnt
							});
						}
					}	
				}
				if(change.new_val.pinChanges.unpinned) {
					for(const unpinnedEnt of change.new_val.pinChanges.unpinned) {
					// -- strips eco from id when coming via GCF
						const targetEcoId = unpinnedEnt.feedId.includes("@@") ? unpinnedEnt.feedId.split("@@")[1] : global.ecoLinkManager.getSourceEcoId();
						if(targetEcoId === global.ecoLinkManager.getSourceEcoId()) {
							if(unpinnedEnt.id && unpinnedEnt.id.includes("@@")) unpinnedEnt.id = unpinnedEnt.id.split("@@")[0];
							if(unpinnedEnt.feedId && unpinnedEnt.feedId.includes("@@")) unpinnedEnt.feedId = unpinnedEnt.feedId.split("@@")[0];
							this._onFeedItem({
								type: "unpin",
								eventId: change.new_val.id,
								old_val: unpinnedEnt
							});
						}	
					}
				}
			}
		}
	}


	// ENT_AUTH There is more to be considered before we can use this
	// -- feed items that are removed need to publish on the feed
	// -- Need to filter to only entities I'm interested in since I'm subscribed for all
	_initGlobalChangefeedListener() {
		// -- receive all entity changes and distribute accordingly. 
		// -- First arg is queue name for load balancing in this case we want all going to each instance as subscriptions for a user will be locked to a single instance
		global.globalChangefeed.subscribe({ entityType: "*" }, null, this._gcfHandler.bind(this));
		if(global.ecoLinkManager.isActive()) {
			global.ecoLinkManager.subscribeAllGCF({ entityType: "*" }, null, this._gcfHandler.bind(this));
		}
	}

	// Public methods
	// ENT-AUTH-REFACTOR use just for initial batch now. So not changefeed
	streamFeed(feedId, sourceTable, source) {
		if(!this._global) {
			this._global = require("../app-global.js");
			this._initGlobalChangefeedListener();
		}
		// Bail if already streaming this feed
		if (this._feeds[feedId]) return;


		this._feeds[feedId] = {
			feed: null,
			systemFeed: source === "app", // probably doesn't matter anymore
			cancelFn: () => {}
		};

		this._beginBatchProcessing(feedId);
	}

	// -- So could filter by eventId here for pinned items
	// -- When an item pinned or unpinned need to send appropiate update is the trick
	addUserToChangesQueue(userId, feedId, pipFilter, ignoreBatches, additionalFilters) {
		// If queue doesn't exist, create it
		if (!this._queueChanges[feedId]) this._queueChanges[feedId] = [];
		// Add user
		const qc = { userId: userId };
		if(pipFilter) qc["pipFilter"] = pipFilter;
		if(ignoreBatches) qc["ignoreBatches"] = ignoreBatches;
		if(additionalFilters && additionalFilters.eventId) { 
			qc["eventId"] = additionalFilters.eventId;
		}
		this._queueChanges[feedId].push(qc);
	}

	removeUserFromChangesQueue(userId, feedId) {
		// If no queue, bail
		if (!this._queueChanges[feedId]) return;
		// Remove user from queue
		this._queueChanges[feedId] = this._queueChanges[feedId].filter(qc => qc.userId !== userId);
		// If queue empty, delete it and batches
		if (this._queueChanges[feedId].length < 1) {
			delete this._queueChanges[feedId];
			if (this._batchQueue[feedId]) delete this._batchQueue[feedId];
		}
	}

	getQueuedChanges(userId, feedId, batchType) {
		if (this._batchQueue[feedId] && this._batchQueue[feedId][userId] && this._batchQueue[feedId][userId][batchType]) {
			return this._batchQueue[feedId][userId][batchType];
		}

		return [];
	}

	// Private methods

	_beginBatchProcessing(feedId) {
		const processor = setInterval(() => {
			// Always/Owner users
			const fullUsers = userPolicyCache.getFullHandlerArray(feedId);
			// Event users
			const eventUsers = userPolicyCache.getFilteredHandlerArray(feedId);

			const isSystemFeed = this._feeds[feedId].systemFeed;

			// Set batch to send, clear nextBatch to await more changes
			this._batches[feedId] = this._nextBatches[feedId];
			this._nextBatches[feedId] = {};

			// Always/Owner policy users
			fullUsers.forEach((usr) => {

				Object.keys(this._batches[feedId]).forEach((key) => {
					const batch = this._batches[feedId][key];
					let filteredBatch = [];

					// If feed is internal, it needs additional filtering
					if (isSystemFeed) {
						filteredBatch = batch.filter((ent) => {
							const entity = ent.new_val ? ent.new_val : ent.old_val;
							const isRemoving = !ent.new_val && ent.old_val;
							return !isRemoving &&
							usr.options.eventId ? userPolicyCache.isPinnedToEvent(usr.options.eventId, entity.id) : true &&
							usr.options.pipFilter ? usr.options.pipFilter.filter(ent) : true &&
							userPolicyCache.authorizeEntity(usr.userId, entity);
						});
					}
					// If feed is external, it only need exclusion filtering
					else {
						filteredBatch = batch.filter((ent) => {
							const entity = ent.new_val ? ent.new_val : ent.old_val;
							const isRemoving = !ent.new_val && ent.old_val;
							return !isRemoving &&
							usr.options.eventId ? userPolicyCache.isPinnedToEvent(usr.options.eventId, entity.id) : true &&
							usr.options.pipFilter ? usr.options.pipFilter.filter(ent) : true &&
							!userPolicyCache.hasExclusions(usr.userId, entity.id);
						});
					}

					// If there are changes left after filtering, send them
					if (filteredBatch.length) {
						usr.callback(null, {"batch": key, "changes": filteredBatch});
					}
				});
			});

			// Event policy users
			eventUsers.forEach((usr) => {
				Object.keys(this._batches[feedId]).forEach((key) => {
					const filteredBatch = this._batches[feedId][key].filter((ent) => {
						const entity = ent.new_val ? ent.new_val : ent.old_val;
						const isRemoving = !ent.new_val && ent.old_val;
						return !isRemoving &&
						usr.options.eventId ? userPolicyCache.isPinnedToEvent(usr.options.eventId, entity.id) : true &&
						usr.options.pipFilter ? usr.options.pipFilter.filter(ent) : true &&
						userPolicyCache.authorizeEntity(usr.userId, entity);
					});


					// If there are changes left after event filter, send them
					if(filteredBatch.length) {
						usr.callback(null, {"batch": key, "changes": filteredBatch});
					}
				});
			});

			if(userPolicyCache.shouldEndStream(feedId)) {
				// Stop changefeed
				this._feeds[feedId].cancelFn();
				// Stop batching interval
				this._endBatchProcessing(feedId);

			}
		}, 500);

		this._changesProcessor[feedId] = processor;
	}

	_endBatchProcessing(feedId) {
		// End changes 
		clearInterval(this._changesProcessor[feedId]);
		// Remove feed
		delete this._feeds[feedId];
	}

	// TODO: Figure out how to call this._queueChangeBatches() in this method when passed to processChangefeed to make code DRY
	_onFeedItem(change) {
		const feedId = change.new_val ? change.new_val.feedId : change.old_val.feedId;
		
		// no subscriptions to items on this feed
		if(!this._feeds[feedId]) {
			return;
		}

		let shouldQueue = false;

		if(this._queueChanges[feedId]) {
			shouldQueue = true;
			if(!this._batchQueue[feedId]) this._batchQueue[feedId] = {};

			// Create key for each user who needs changes if it doesn't exist
			this._queueChanges[feedId].forEach(qc => {
				if (!this._batchQueue[feedId][qc.userId]) this._batchQueue[feedId][qc.userId] = {};
			});
		}

		// TODO: Do we still need to worry about this? Iterating over every new change just for a name
		// doesn't seem like a good thing to do. Can we not just add this property in the first place?
		
		// const labels = this._feedProperties[feedId].labels;

		// if (change.new_val) {
		// 	// Assign displayName value based on feedType fallback properties
		// 	change.new_val.entityData.properties.name = feedModel.getDisplayName(change.new_val, {labels: labels});
		// }
		
		this._feedProperties[feedId].streamProperties.forEach(streamProp => {
			const batchType = streamProp.batch;

			if (!this._nextBatches[feedId][batchType]) this._nextBatches[feedId][batchType] = [];

			if (change.type === "add") {
				const obj = {
					type: change.type,
					new_val: createResponse(change.new_val, streamProp.properties.initial)
				};

				this._nextBatches[feedId][batchType].push(obj);
				
				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					this._queueChanges[feedId].forEach(qc => {
						const includeChange = 
							(qc.pipFilter ? qc.pipFilter.filter(change) : true) &&
							(qc.eventId ? userPolicyCache.isPinnedToEvent(qc.eventId, change.new_val.id) : true);
						if(includeChange) {
							if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
							this._batchQueue[feedId][qc.userId][batchType].push(change);
						}
					});
				}
			}
			else if (change.type === "remove") {
				const obj = {
					type: change.type,
					old_val: createResponse(change.old_val, ["id"])
				};

				// Push change to correct batch
				this._nextBatches[feedId][batchType].push(obj);

				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					this._queueChanges[feedId].forEach(qc => {
						const includeChange = 
							(qc.pipFilter ? qc.pipFilter.filter(change) : true) &&
							(qc.eventId ? userPolicyCache.isPinnedToEvent(qc.eventId, change.new_val.id) : true);
						if(includeChange) {
							if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
							this._batchQueue[feedId][qc.userId][batchType].push(change);
						}
					});
				}
			}
			else if (change.type === "unpin") {

				// const obj = {
				// 	type: "remove",
				// 	old_val: createResponse(change.old_val, ["id"])
				// };

				// // Push change to correct batch
				// this._nextBatches[feedId][batchType].push(obj);
				
				change.type = "remove";

				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					const eventFeedQueues = this._queueChanges[feedId].filter(qc => qc.eventId && qc.eventId === change.old_val.id);
					eventFeedQueues.forEach(qc => {
						if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
						this._batchQueue[feedId][qc.userId][batchType].push(change);
					});
				}
			}
			else if (change.type === "pin") {
				
				// const obj = {
				// 	type: "add",
				// 	new_val: createResponse(change.new_val, ["id"])
				// };

				// // Push change to correct batch
				// this._nextBatches[feedId][batchType].push(obj);

				change.type = "add";

				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					const eventFeedQueues = this._queueChanges[feedId].filter(qc => qc.eventId && qc.eventId === change.new_val.id);
					eventFeedQueues.forEach(qc => {
						if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
						this._batchQueue[feedId][qc.userId][batchType].push(change);
					});
				}
			}
			else if (streamProp.alwaysSend) {
				const obj = {
					type: change.type,
					new_val: change.new_val ? createResponse(change.new_val, streamProp.properties.update) : null,
					old_val: change.old_val ? createResponse(change.old_val, streamProp.properties.update) : null
				};

				// Push change to correct batch
				this._nextBatches[feedId][batchType].push(obj);

				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					this._queueChanges[feedId].forEach(qc => {
						const includeChange = 
							(qc.pipFilter ? qc.pipFilter.filter(change) : true) &&
							(qc.eventId ? userPolicyCache.isPinnedToEvent(qc.eventId, change.new_val.id) : true);
						if(includeChange) {
							if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
							this._batchQueue[feedId][qc.userId][batchType].push(change);
						}
					});
				}
			}
			else if (compareProps(change, streamProp.properties.compare)) {
				const obj = {
					type: change.type,
					new_val: change.new_val ? createResponse(change.new_val, streamProp.properties.update) : null,
					old_val: change.old_val ? createResponse(change.old_val, streamProp.properties.update) : null
				};

				// Push change to correct batch
				this._nextBatches[feedId][batchType].push(obj);

				// Queue changes for users if needed
				if(shouldQueue) {
					// this._queueChangeBatches(obj, batchType, feedId);

					// For each subscriber who needs changes queued, create a key for each batch and push changes
					this._queueChanges[feedId].forEach(qc => {
						const includeChange = 
							(qc.pipFilter ? qc.pipFilter.filter(change) : true) &&
							(qc.eventId ? userPolicyCache.isPinnedToEvent(qc.eventId, change.new_val.id) : true);
						if(includeChange) {
							if (!this._batchQueue[feedId][qc.userId][batchType]) this._batchQueue[feedId][qc.userId][batchType] = [];
							this._batchQueue[feedId][qc.userId][batchType].push(change);
						}
					});
				}
			}			
		});
	}

	// TODO: Figure out how to call this correctly in above method to make code more DRY
	// _queueChangeBatches(change, batchType, feedId) {
	// 	// For each subscriber who needs changes queued, create a key for each batch and push changes
	// 	this._queueChanges[feedId].forEach(userId => {
	// 		if (!this._batchQueue[feedId][userId][batchType]) this._batchQueue[feedId][userId][batchType] = [];

	// 		this._batchQueue[feedId][userId][batchType].push(change);
	// 	});
	// }

	_onError(err) {
		console.log("feedStream changefeed error: ", err);
	}
	
}

module.exports = feedStream;