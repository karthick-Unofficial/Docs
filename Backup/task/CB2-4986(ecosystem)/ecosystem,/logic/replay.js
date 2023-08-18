const { isArray } = require("lodash");
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/replay.js");
const replayModel = require("../models/replayModel")({});
const userModel = require("../models/userModel")({});
const userPolicyCache = new (require("../lib/userPolicyCache"));

class Replay {
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

	async getPortableExport(identity, replayId) {
		try {
			const resultObj = {
				metadata: {
					name: "",
					query: null,
					userFeeds: null,
					profile: null,
					currentMedia: null,
					startDate: null,
					endDate: null
				},
				snapshot: null,
				transactions: null, 
				timelineAlerts: null,
				alertTransactions: null
			}; 

			const savedReplay = await replayModel.getById(replayId);
			logger.info("getPortableExport", "Fetched saved replay", { replay: savedReplay });
		
			// get metadata
			resultObj.metadata.name = savedReplay.name;
			const coordString = `${savedReplay.coordinates[0][0]},${savedReplay.coordinates[0][1]},${savedReplay.coordinates[1][0]},${savedReplay.coordinates[1][1]}`;
			resultObj.metadata.query = `type=map&coordinates=${coordString}&startDate=${savedReplay.startDate}&endDate=${savedReplay.endDate}`;
			resultObj.metadata.userFeeds = userPolicyCache.getUserIntegrations(identity.userId).map((int) => {
				return {
					feedId: int.feedId,
					name: int.name,
					canView: int.config.canView,
					source: int.source,
					entityType: int.entityType,
					ownerOrg: int.ownerOrg,
					mapIconTemplate: int.mapIconTemplate,
					profileIconTemplate: int.profileIconTemplate,
					renderSilhouette: int.renderSilhouette
				};
			}); 
			resultObj.metadata.profile = await userModel.getProfile(identity.userId); 
			resultObj.metadata.currentMedia = savedReplay.currentMedia || null; 
			resultObj.metadata.startDate = savedReplay.startDate;
			resultObj.metadata.endDate = savedReplay.endDate;
			logger.info("getPortableExport", "Fetched Metadata", { metadata: resultObj.metadata });
 
			const replayFilter = {
				type: "bbox", // currently bbox only supported
				coordinates: savedReplay.coordinates
			};
		 
			const snapReq = {
				method: "POST",
				identity: identity,
				query: {},
				body: {
					at: savedReplay.startDate,
					filter: replayFilter
				}
			};
			logger.info("getPortableExport", "Fetching snapshot", { snapReq: snapReq });
			resultObj.snapshot = await this.getSnapshot(snapReq);

			const txnReq = {
				method: "POST",
				identity: identity,
				query: {},
				body: {
					from: savedReplay.startDate,
					to: savedReplay.endDate,
					filter: replayFilter,
				 pageSize: -1 // all, no paging
				},
				scrollId: null
			};
			logger.info("getPortableExport", "Fetching transactions", { txnReq: txnReq });
			const txnResult = await this.getTransactions(txnReq);
			resultObj.transactions = txnResult;

			resultObj.timelineAlerts = await replayModel.getNotificationTimeline(identity.userId, savedReplay.startDate, savedReplay.endDate, replayFilter);
			logger.info("getPortableExport", "Fetched timeline alerts", { timelineAlerts: resultObj.timelineAlerts });
			resultObj.alertTransactions = await replayModel.getNotificationTransactions(identity.userId, savedReplay.startDate, savedReplay.endDate, replayFilter);
			logger.info("getPortableExport", "Fetched alert transactions", { alertTransactions: resultObj.alertTransactions });

			return resultObj; 
		}
		catch(err) {
			logger.error("getPortableExport", "Unexpected error", { message: err.message, stack: err.stack });
			throw { message: "Unexpected error building export", stack: err.stack, code: 500 };
		}
	}

	// alerts and whatnot will only be local
	// matching up ids probably need to add @@ecoId to all remote data - no bueno

	async getSnapshot(req) {
		try {
			// -- query local getSnapshot (ints are included I think so maybe don't need step 2)
			const localSnapshot = await replayModel.getSnapshot(
				req.identity.userId, 
				req.body.at, 
				req.body.filter);
        
			// -- get userInts
			const userInts = userPolicyCache.getUserIntegrations(req.identity.userId);
			// -- derive remoteEcos with user assigned ints
			// -- todo: refactor getting remoteEcoId into ecoManager
			const remoteEcoIds = userInts.filter((int) => {
				return int.intId.includes("@@");
			})
				.map((int) => {
					return int.intId.split("@@")[1];
				})
				.filter((value, index, self) => {
					return self.indexOf(value) === index;
				});

			// -- query remote ecos for snapshot
			let remoteSnapshots = null;
			if(!req.query["@@remote"] && remoteEcoIds.length > 0) {
				req.query["@@remote"] = true;
				remoteSnapshots = await Promise.all(
					remoteEcoIds.map(async (remoteEcoId) => {
						return await this.ecoLinkManager().execReq(
							remoteEcoId,
							"POST",
							"/replay/getSnapshot",
							req
						);
					})
				);
			}
        
			// -- merge
			const mergedResult = {
				count: localSnapshot.count,
				integrations: localSnapshot.integrations,
				items: localSnapshot.items
			};

			if(remoteSnapshots && Array.isArray(remoteSnapshots)) {
				let remoteEcoIndex = 0;
				for(const snapshot of remoteSnapshots) {
					for(const item of snapshot.items) {
						item.id = `${item.id}@@${remoteEcoIds[remoteEcoIndex]}`; 
						item.feedId = `${item.feedId}@@${remoteEcoIds[remoteEcoIndex]}`; 
						if(item.entityData.properties.id) item.entityData.properties.id = `${item.entityData.properties.id}@@${remoteEcoIds[remoteEcoIndex]}`; 
					}
					remoteEcoIndex++;
					mergedResult.count += snapshot.count;
					mergedResult.items = [...mergedResult.items, ...snapshot.items];
				}
			}

			return mergedResult;
		}
		catch(err) {
			logger.error("getSnapshot", "unexpected error getting snapshot", { message: err.message, stack: err.stack });
			throw err;
		}
	}
    

	async getTransactions(req) {
		try {

			let scrollIdIndex = 0;
			let scrollIds = [];
			if(req.body.scrollId) {
				scrollIds = req.body.scrollId.split("|");
			}
			// -- query local getTransactions
			const localTransactions = await replayModel.getTransactions(
				req.identity.userId, 
				req.body.from, 
				req.body.to, 
				req.body.filter,
				!scrollIds[scrollIdIndex] || scrollIds[scrollIdIndex] === "undefined" ? undefined : scrollIds[scrollIdIndex],
				req.body.pageSize,
				req.body.format || "native"
			);
        
			// -- get userInts
			const userInts = userPolicyCache.getUserIntegrations(req.identity.userId);
			// -- derive remoteEcos with user assigned ints
			// -- todo: refactor getting remoteEcoId into ecoManager
			const remoteEcoIds = userInts.filter((int) => {
				return int.intId.includes("@@");
			})
				.map((int) => {
					return int.intId.split("@@")[1];
				})
				.filter((value, index, self) => {
					return self.indexOf(value) === index;
				});

			// -- query remote ecos for transactions
			let remoteTransactions = null;
			if(!req.query["@@remote"] && remoteEcoIds.length > 0) {
				req.query["@@remote"] = true;
				scrollIdIndex++;
				remoteTransactions = await Promise.all(
					remoteEcoIds.map(async (remoteEcoId) => {
						req.body.scrollId = !scrollIds[scrollIdIndex] || scrollIds[scrollIdIndex] === "undefined" ? undefined : scrollIds[scrollIdIndex];
						return await this.ecoLinkManager().execReq(
							remoteEcoId,
							"POST",
							"/replay/getTransactions",
							req
						);
					})
				);
			}
        
			// -- merge
			const mergedResult = {
				scrollId: localTransactions.scrollId,
				count: localTransactions.count,
				total: localTransactions.total,
				// integrations: localTransactions.integrations,
				items: localTransactions.items
			};

			// requesting subsequent pages is a problem because we won't have scrollId's except for local
			// might be able to address by concating scroll ids or adding a field with remote scroll ids
			if(remoteTransactions && Array.isArray(remoteTransactions)) {
				let remoteEcoIndex = 0;
				for(const txns of remoteTransactions) {
					const timestampKeys = Object.keys(txns.items);
					for(const tsKey of timestampKeys) {
						const items = txns.items[tsKey];
						for(const item of items) {
							item.id = `${item.id}@@${remoteEcoIds[remoteEcoIndex]}`; 
							item.feedId = `${item.feedId}@@${remoteEcoIds[remoteEcoIndex]}`; 
							if(item.entityData.properties.id) item.entityData.properties.id = `${item.entityData.properties.id}@@${remoteEcoIds[remoteEcoIndex]}`; 
						}
						if(!mergedResult.items[tsKey]) mergedResult.items[tsKey] = [];
						mergedResult.items[tsKey] = [...mergedResult.items[tsKey], ...items];  
					}
					remoteEcoIndex++;
					mergedResult.scrollId += "|" + txns.scrollId;
					mergedResult.count += txns.count;
					mergedResult.total += txns.total;
				}
			}

			return mergedResult;
		}
		catch(err) {
			logger.error("getTransactions", "unexpected error getting transactions", { message: err.message, stack: err.stack });
			throw err;
		}
	}
}

module.exports = Replay;