"use strict";
const SHARING_CONNECTION_TABLE = "sys_orgSharingConnections";

const config = require("../config.json");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/sharingConnectionModel.js");
const os = require("os");

module.exports = SharingConnectionModel;


function SharingConnectionModel() {
	if (!(this instanceof SharingConnectionModel)) return new SharingConnectionModel();
}

/**
 * Create a connection. Generates an ID to send to another org to establish a sharing connection.
 * @param {string} userId 
 * @param {string} orgId  
 */
SharingConnectionModel.prototype.createConnection = async function (userId, orgId, orgName, maxConnections) {
	try {
		const currentConnections = await r.table(SHARING_CONNECTION_TABLE)
			.filter({
				sourceOrg: orgId
			})
			.count()
			.run();

		// Do not allow user to exceed maximum set number of connections
		if (currentConnections >= maxConnections) {
			throw {
				"message": "Cannot create a new connection as you have reached the maximum number of allowed connections",
				"stack": "/models/sharingConnectionModel.js"
			};
		}

		const result = await r.table(SHARING_CONNECTION_TABLE)
			.insert({
				sourceOrg: orgId,
				sourceOrgName: orgName,
				createdBy: userId,
				targetOrg: null,
				targetOrgName: null,
				importedBy: null
			})
			.run();

		// Return ID
		return { connectionId: result.generated_keys[0] };
	}
	catch (ex) {
		logger.error("createConnection", "An error occurred when creating a sharing connection", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * Complete a connection. Sets the targetOrg property to allow sharing policies between two orgs. 
 * @param {string} connectionId 
 * @param {string} userId 
 * @param {string} orgId 
 */
SharingConnectionModel.prototype.establishConnection = async function (connectionId, userId, orgId, orgName, ecoId) {
	try {

		const result = await r.table(SHARING_CONNECTION_TABLE)
			.get(connectionId)
			.update({
				targetOrg: orgId,
				targetOrgName: orgName,
				importedBy: userId,
				ecoId: ecoId || null
			})
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error("establishConnection", "An error occurred when establishing a sharing connection", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * Disconnect a connection and remove all orgIntegrations and userIntegrations shared from 
 * the sourceOrg to the targetOrg of the sharing connection
 * @param {string} connectionId 
 */
SharingConnectionModel.prototype.disconnectConnection = async function (connectionId) {
	try {
		const connection = await r.table(SHARING_CONNECTION_TABLE)
			.get(connectionId)
			.run();

		const result = await r.table(SHARING_CONNECTION_TABLE)
			.get(connectionId)
			.delete()
			.run();

		// If delete was successful, remove user and org integrations for targetOrg users from sourceOrg's feeds
		if (result.deleted) {
			const { sourceOrg, targetOrg } = connection;
			return {
				sourceOrg: sourceOrg,
				targetOrg: targetOrg
			};
		}
		else {
			throw {
				"message": "There was a problem deleting the sharing connection",
				"stack": "/models/sharingConnectionModel.js"
			};
		}
	}
	catch (ex) {
		logger.error("breakConnection", "An error occurred when disconnecting sharing connection", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * Query all sharing connections
 */
SharingConnectionModel.prototype.getAll = async function () {
	try {
		const result = await r.table(SHARING_CONNECTION_TABLE).run();

		return result;
	}
	catch (ex) {
		logger.error("getAll", "An error occurred when getting all sharing connections", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * Query all sharing connections
 */
SharingConnectionModel.prototype.getByEco = async function (ecoId) {
	try {
		const result = await r.table(SHARING_CONNECTION_TABLE)
			.filter(r.row("ecoId").eq(ecoId))
			.run();

		console.log("getByEco", JSON.stringify(result, null, 4));

		return result;
	}
	catch (ex) {
		logger.error("getByEco", "Unexpected error", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

/**
 * connectionExists
 * @param {string} sourceOrgId 
 * @param {string} targetOrgId 
 */
SharingConnectionModel.prototype.connectionExists = async function (sourceOrgId, targetOrgId) {
	try {

		const hasPriorConnectionToOrg = await r.table(SHARING_CONNECTION_TABLE)
			.filter((connection) => {
				return r.and(
					connection("sourceOrg").eq(sourceOrgId),
					connection("targetOrg").eq(targetOrgId)
				);
			})(0)
			.default(null)
			.run();

		return hasPriorConnectionToOrg;

	}
	catch (err) {
		logger.error(
			"connectionExists",
			"An unexpected error occurred",
			{ err: { message: err.message, code: err.code, stack: "/models/sharingConnectionModel.js" } }
		);
		throw err;
	}
};


/**
 * getByID
 * @param {string} connectionId 
 */
SharingConnectionModel.prototype.getById = async function (connectionId, checkAvailability = false) {
	try {

		// Ensure connection exists. Filter out connections created by your org as you cannot connect to yourself.
		const shareCxn = await r.table(SHARING_CONNECTION_TABLE)
			.get(connectionId)
			.run();

		console.log("shareCxn", os.hostname, connectionId, shareCxn);

		if (shareCxn) {
			if (checkAvailability && shareCxn.targetOrg !== null) {
				return null;
			}
		}

		return shareCxn;

	}
	catch (err) {
		logger.error(
			"getById",
			"An error occurred while attempting to fetch a shaing connection by id",
			{ err: { message: err.message, code: err.code, stack: "/models/sharingConnectionModel.js" } }
		);
		throw err;
	}
};


/**
 * Get all other organizations a particular organization has shared tokens with
 * @param {string} sourceOrgId 
 */
SharingConnectionModel.prototype.getBySource = async function (sourceOrgId) {
	try {
		const result = await r.table(SHARING_CONNECTION_TABLE)
			.filter(
				r.row.hasFields("targetOrg")
					.and(r.row("sourceOrg").eq(sourceOrgId))
			)
			.run();

		return result;
	}
	catch (ex) {
		logger.error(
			"getBySource",
			"An error occurred while getting organizations for sharing by source.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/sharingConnectionModel.js" } }
		);
	}
};

SharingConnectionModel.prototype.sharingTokensEnabled = async function () {
	try {
		const sharingTokensEnabled = !!config.useSharingTokens;
		return { success: true, enabled: sharingTokensEnabled };
	}
	catch (ex) {
		logger.error("sharingTokensEnabled", "An error occurred when checking sharing token config", { err: { message: ex.message, stack: ex.stack } });
		throw ex;
	}
};

// Queries

/**
 * Return a ReQL query to remove all sharing connections from an organization
 * @param {string} orgId 
 */
SharingConnectionModel.prototype.removeConnectionsByOrgQuery = function (orgId) {
	return r.table(SHARING_CONNECTION_TABLE)
		.filter((connection) => {
			return r.or(
				connection("sourceOrg").eq(orgId),
				connection("targetOrg").eq(orgId)
			);
		})
		.delete();
};
