const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/activity.js");
const activityModel = require("../models/activityModel")({});

class Activity {
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


	async getEntityActivityPage(req) {
		try {
			const pageSize = req.query.pagesize || "5";
			let entityId = req.query.entityid || req.query.entityId || req.query.eventid;
			entityId = entityId.includes("@@") ? entityId.split("@@")[0] : entityId;
			const fromDate = req.query.fromDate || req.query.fromdate || null;
			let result = await activityModel.getEntityActivityPage(
				req.identity.userId,
				req.identity.orgId,
				entityId,
				fromDate,
				parseInt(pageSize)
			);
			if((!req.query.remote) && this.ecoLinkManager().isActive()) {
				req.query["remote"] = true;
				let remoteResult = [];
				try {
					remoteResult = await this.ecoLinkManager().execReqAll(
						req.method,
						req.route,
						req,
						"ecosystem",
						true
					);
					if(!Array.isArray(remoteResult)) {
						logger.error("getEntityActivityPage",  "Remote eco did not return expected array", { result: remoteResult });
						remoteResult = [];
					}
				}
				catch(err) {
					logger.error("getEntityActivityPage",  "Unexpected error getting activities from remote eco", { errMessage: err.message, errStack: err.stack });
				}
				result = [...result, ...remoteResult];
			}
		
			// sort results descending
			result = result.sort(function(a, b) {
				return (a.published > b.published) ? -1 : ((a.published < b.published) ? 1 : 0);
			});

			// -- If more the page size then truncate array
			if(result.length > pageSize) {
				result = result.splice(0, pageSize);
			}

			return result;
		}
		catch(err) {
			logger.error("getEntityActivityPage",  "Unexpected error", { errMessage: err.message, errStack: err.stack });
		}
	}



	async streamActivities(sub) {
		this.streamRemoteActivities(sub);
		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "by-target":
			case "by-event":
				try {
					const result = await activityModel.streamEntityActivities(
						sub.identity.userId,
						sub.identity.orgId,
						sub.args.targetId,
						sub.args.targetType,
						sub.args.initialPageSize || parseInt(5),
						function (err, record) {
							if (err) {
								logger.error("streamActivities",  "Unexpected error streaming activities", { errMessage: err.message, errStack: err.stack });
							}
							sub.pub(record);
						});
					const cancelFn = result;
					sub.events.on("disconnect", () => {
						cancelFn();
					});
				} catch (reason) {
					logger.error("streamActivities",  "Unexpected error streaming activities", { reason: reason });
					sub.pub(reason);
				}				
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}

	}

	async streamRemoteActivities(proxySub) {
		const pub = proxySub.pub;
		proxySub = JSON.parse(JSON.stringify(proxySub));

		const idParts = proxySub.args.targetId.split("@@");
		let proxies = this.ecoLinkManager().getAllProxies();
		if(proxySub["_ecosystem"]) {
			proxies = proxies.filter((prox) => prox.targetEcoId !== proxySub["_ecosystem"]);
		}

		const thisEcoId = this.ecoLinkManager().getSourceEcoId();

		const unsubs = await Promise.all(
			proxies.map((proxy) => {
				// remote will store activities with remote Id if applicable (@@ecoId)
				// So request needs to include @@ecoId if request is made to non-owning eco
				const ownerEco = idParts[1] || thisEcoId;
				proxySub.args.targetId = proxy.targetEcoId === ownerEco ? idParts[0] : `${idParts[0]}@@${ownerEco}`;
				return proxy.realtimeSubscription(proxySub, function(err, res) {
					if(err) {
						logger.error("streamRemoteActivities", "Unexpected exception attempting to stream remote activities", { args: proxySub.args });
					}
					pub(res);
				});
		
			})
		);
	}


}

module.exports = Activity;