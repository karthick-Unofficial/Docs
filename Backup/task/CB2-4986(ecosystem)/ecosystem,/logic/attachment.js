const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/attachment.js");
const attachmentModel = require("../models/attachmentModel")({});
const fileStorage = require("node-app-core").fileStorage();

class Attachment {
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

	// if handle has @@ get from remote???
	async getAttachmentFile(req) {
		try {
			const handle = req.routeVars.handle;
			const handleParts = handle.split("@@");
			const hdl = handleParts.length > 1 ? handleParts[0] : handle;
			const targetEcoId = handleParts.length > 1 ? handleParts[1] : null;   

			if(targetEcoId) {
				return await this.ecoLinkManager().execReq(targetEcoId, "GET", `/attachments/${hdl}/object`, req);
			}
			else {
				const attachment = await attachmentModel.getByHandle(hdl);
				const file = await fileStorage.getFile(hdl);
				return { attachment: attachment, file: file };
			}
		}
		catch(err) {
			throw err;
		}
	}

	async streamAttachments(sub) {

		this.streamRemoteAttachments(sub);

		const filterType = sub.args.filterType;
		switch(filterType.toLowerCase()) {
			case "by-target":
				try {
					const result = await attachmentModel.streamAttachmentsByTarget(
						sub.args.targetId,
						sub.identity.userId,
						sub.identity.orgId,
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
					sub.pub(err); // -- need standard method for publishing errors
				}
				break;
			default:
				sub.pub({ "msg": "invalid action: " + filterType.toLowerCase() });
		}
	}

	async streamRemoteAttachments(proxySub) {
		const pub = proxySub.pub;
		proxySub = JSON.parse(JSON.stringify(proxySub));

		const idParts = proxySub.args.targetId.split("@@");
		let proxies = this.ecoLinkManager().getAllProxies();
		if(proxySub["_ecosystem"]) {
			proxies = proxies.filter((prox) => prox.targetEcoId !== proxySub["_ecosystem"]);
		}

		const unsubs = await Promise.all(
			proxies.map((proxy) => {
				proxySub.args.targetId = proxy.targetEcoId === idParts[1] ? idParts[0] : `${idParts[0]}@@${proxy.sourceEcoId}`;
				return proxy.realtimeSubscription(proxySub, function(err, res) {
					if(err) {
						logger.error("streamRemoteAttachments", "Unexpected exception attempting to stream remote attachments", { args: proxySub.args });
					}
					if(res.new_val) {
						// -- If no target eco id defined then include target eco id so we know which eco to get file from
						if(res.new_val.handle && !res.new_val.handle.includes("@@")) res.new_val.handle = `${res.new_val.handle}@@${proxy.targetEcoId}`;
					}
					pub(res);
				});
		
			})
		);
	}
}

module.exports = Attachment;
