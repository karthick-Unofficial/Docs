const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/list.js");
const listModel = require("../models/listModel")({});
const listCategoryModel = require("../models/listCategoryModel")({});
const eventModel = require("../models/eventModel")({});

class List {
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

	async updateList(req, timezone) {

		const remote = this.ecoLinkManager().getRemoteFromId(req.routeVars.listId);

		let result = null;
		if (!remote) {
			result = await listModel.update(
				req.identity.userId,
				req.identity.orgId,
				req.routeVars.listId,
				req.body.list,
				timezone);
		}
		else if (remote.proxy) {
			req.routeVars.listId = remote.id;
			result = await remote.proxy.execReq(
				req.method,
				req.route.replace(`@@${remote.remoteEcoId}`, ""),
				req,
				"ecosystem"
			);
		}
		else {
			throw { message: "Remote ecosystem does not exist or is not available", code: 500 };
		}
		return result;
	}


	async streamLists(sub) {

		this.streamRemoteLists(sub);

		const filterType = sub.args.filterType;

		switch (filterType.toLowerCase()) {
			case "initial-by-event": {
				try {
					const result = await eventModel.streamLists(
						sub.args.eventId,
						sub.identity.userId,
						sub.args.expandRefs || false,
						function (err, record) {
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
					// -- need standard method for publishing errors
					sub.pub(err);
				}
				break;
			}
		}
	}

	async streamListCategories(sub) {

		this.streamRemoteListCategories(sub);

		const filterType = sub.args.filterType;

		switch (filterType.toLowerCase()) {
			case "all": {
				try {
					const result = await listCategoryModel.streamCategories(
						sub.identity.userId,
						sub.identity.orgId,
						function (err, record) {
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
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			}
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	}

	// Except for id source this method could be generic. REFACTOR fr all that will use this, pass id or id prop as a seperate arg
	// -- maybe we just code it to consider every possibility of @@ecoId by iterating over and identitfying affected properties
	async streamRemoteLists(proxySub) {
		logger.info("streamRemoteLists", "Entering function", { proxySubArgs: proxySub.args });
		const pub = proxySub.pub;
		const subEvents = proxySub.events;
		proxySub = JSON.parse(JSON.stringify(proxySub));

		const idParts = proxySub.args.eventId.split("@@");
		let proxies = this.ecoLinkManager().getAllProxies();
		if (proxySub["_ecosystem"]) {
			proxies = proxies.filter((prox) => prox.targetEcoId !== proxySub["_ecosystem"]);
		}

		const unsubs = await Promise.all(
			proxies.map((proxy) => {
				proxySub.args.eventId = proxy.targetEcoId === idParts[1] ? idParts[0] : `${idParts[0]}@@${proxy.sourceEcoId}`;
				logger.info("streamRemoteLists", "Subscribing to remote.", { remoteEcoId: proxy.targetEcoId, args: proxySub.args });
				return proxy.realtimeSubscription(proxySub, function (err, res) {
					if (err) {
						logger.error("streamRemoteLists", "Unexpected exception attempting to stream remote lists", { args: proxySub.args });
					}
					if (res.new_val && res.new_val.targetType === "Event") {
						res.new_val.id = `${res.new_val.id}@@${proxy.targetEcoId}`;
					}
					logger.info("streamRemoteLists", "Publishing response", { response: res });
					pub(res);
				});

			})
		);

		subEvents.on("disconnect", () => {
			for (const unsub of unsubs) {
				try {
					unsub();
				}
				catch (err) {
					logger.error("streamRemoteLists", "Unexpected exception attempting unsub remote lists feed", { errMessage: err.message, errStack: err.stack });
				}
			}
		});

	}

	async streamRemoteListCategories(proxySub) {
		const pub = proxySub.pub;
		proxySub = JSON.parse(JSON.stringify(proxySub));

		let proxies = this.ecoLinkManager().getAllProxies();
		if (proxySub["_ecosystem"]) {
			proxies = proxies.filter((prox) => prox.targetEcoId !== proxySub["_ecosystem"]);
		}

		const unsubs = await Promise.all(
			proxies.map((proxy) => {
				return proxy.realtimeSubscription(proxySub, function (err, res) {
					if (err) {
						logger.error("streamRemoteCategories", "Unexpected exception attempting to stream remote list categories", { args: proxySub.args });
					}
					pub(res);
				});

			})
		);
	}

	async getListCategorybyId(userId, categoryId, remote = false) {
		let listCat = await listCategoryModel.getById(userId, categoryId, remote);
		if (!remote && !listCat) {
			listCat = await this.getRemoteListCategoryById(userId, categoryId);
		}
		return listCat;
	}

	async getRemoteListCategoryById(userId, categoryId) {
		const proxies = this.ecoLinkManager().getAllProxies();
		let listCat = null;
		for (const proxy of proxies) {
			listCat = await proxy.getListCategoryById(userId, categoryId);
			if (listCat) {
				break;
			}
		}
		return listCat;
	}


	async getUserLists(req) {
		try {
			return await listModel.getAllOriginal(req.identity.userId, req.identity.orgId);
			// -- temp remove
			// Creation of pinned remote shared list needs to be implemented before this can be re-enabled
			// let remoteResult = [];
			// const localResult = await listModel.getAllOriginal(req.identity.userId);
			// if(!req.query.remote && this.ecoLinkManager().isActive()) {
			// 	req.query["remote"] = true;
			// 	remoteResult = await this.ecoLinkManager().execReqAll(
			// 		req.method,
			// 		req.route,
			// 		req,
			// 		"ecosystem",
			// 		true
			// 	);
			// }
			// return localResult.concat(remoteResult);
		}
		catch (err) {
			throw { message: err.message, code: 500 };
		}
	}

}

module.exports = List;

