const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/camera.js");
const feedModel = require("../models/feedModel")({});
const feedMiddleware = new (require("../logic/feed")); 

class Camera {
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

	async getCameras(req) {
		try {
			let remoteEnts = [];
			if(this.ecoLinkManager().isActive()) {
				remoteEnts = await feedMiddleware.getEntitiesByTypeWithAuthorization(req, "camera", true, true);
			}
			const localResult = await feedModel.getEntitiesByTypeWithAuthorization(req.identity.userId, "camera", true, null, true);
			return [...localResult, ...remoteEnts];
		}
		catch(err) {
			logger.error("getCameras", "Unexpected error", { errMessage: err.message, errStack: err.stack });
			throw { message: err.message, code: 500 };
		}
	}	
}

module.exports = Camera;