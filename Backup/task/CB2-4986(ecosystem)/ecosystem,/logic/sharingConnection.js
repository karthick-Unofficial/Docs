const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/logic/sharingConnection.js");
const sharingConnectionModel = require("../models/sharingConnectionModel")({});
const global = require("../app-global.js");

class SharingConnection {
	constructor() {}

	async establishSharingConnection (connectionId, userId, orgId, orgName) {
		try {
			const cxn = await sharingConnectionModel.getById(connectionId, true);
            
			if (!cxn) {
				const searchResult = await global.ecoLinkManager.findOrgSharingConnection(connectionId);
				const result = await searchResult.linkedEco.client.ecoLinkProxy.establishSharingConnection(connectionId, userId, orgId, orgName, searchResult.linkedEco.client.sourceEcoId);
				return result;
			}
			else {

				if(!cxn) {
					return {success: false, message: "An unused connection does not exist with that connection ID"};
				}

				if (cxn.sourceOrg === orgId) {
					return {success: false, message: "Connection source org is same as org attempting to establish connection."};
				}

				// Check for previous connections to org to disallow duplicates
				const hasPriorConnectionToOrg = await sharingConnectionModel.connectionExists(cxn.sourceOrg, orgId);
				if (hasPriorConnectionToOrg) {
					return {success: false, message: "A connection already exists between your organizations"};
				}

				return sharingConnectionModel.establishConnection(connectionId, userId, orgId, orgName);
			}
            

		}
		catch (err) {
			logger.error("establishSharingConnection", "An error occurred when establishing a sharing connection", { err: { message: err.message, stack: err.stack } });
			throw err;
		}
	}
    
	async getAllSharingConnections() {
		let remoteSharingConnections = [];
		if(global.ecoLinkManager.isActive()) {
			remoteSharingConnections = await global.ecoLinkManager.getRemoteSharingConnections();
		}
		const localSharingConnections = await sharingConnectionModel.getAll();
		const result = [...localSharingConnections, ...remoteSharingConnections];
		return result;
	}
    
}

module.exports = SharingConnection;