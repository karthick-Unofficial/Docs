"use strict";
const EXTERNAL_SYSTEM_TABLE = "sys_externalSystem";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/externalSystem.json"));
const orgExternalSystemModel = require("../models/orgExternalSystemModel")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/externalSystemModel.js");

module.exports = ExternalSystemModel;

function ExternalSystemModel(options) {
	if (!(this instanceof ExternalSystemModel)) return new ExternalSystemModel(options);
	this.options = options;
}

/**
 * Create an externalSystem
 * @param externalSystem
 */
ExternalSystemModel.prototype.create = async (userId, externalSystem) => {
	try {
		if (!validate(externalSystem)) {
			await validate.errors;
			console.log("Validation Errors below ", validate.errors);
			return {
				"message": "Validation Error ",
				"err": validate.errors
			};
		}

		const result = await r.table(EXTERNAL_SYSTEM_TABLE)
			.insert(externalSystem, {
				returnChanges: true
			})
			.run();

		if (result.changes) {
			orgExternalSystemModel.create(userId, externalSystem.externalSystemId);
		}

		return result;
	} catch (error) {
		console.log(error);
		return error;
	}

};

/**
 * getAll - Get all externalSystems an org has access to
 * @param orgId
 */
ExternalSystemModel.prototype.getAll = async (orgId) => {
	try {
		const availableExternalSystems = await orgExternalSystemModel.getAll(orgId);
		logger.info("getAll", `Available external systems for org ${orgId}`, availableExternalSystems);

		const extSysIdArr = availableExternalSystems.map(extSys => { return extSys.externalSystemId; });
		const result = await r.table(EXTERNAL_SYSTEM_TABLE).filter(extSys => {
			return r.expr(extSysIdArr).contains(extSys("externalSystemId"));
		}).without(["edge", "transform"]); // Excluding edge & transform due to their sensitive nature

		return result;
	} catch (error) {
		logger.error("getAll", `There was an error fetching external systems for org ${orgId}`, error);
		throw(error);
	}
};

/**
 * getAllInternal - Get all externalSystems [INTERNAL ONLY]
 */
ExternalSystemModel.prototype.getAllInternal = async () => {
	try {
		const result = await r.table(EXTERNAL_SYSTEM_TABLE).run();
		return result;
	}
	catch (ex) {
		throw ex;
	}
};


/**
 * getByIdUnauth - Get externalSystem by its ID, SHOULD NOT be exposed via rest api, internal use only
 * @param externalSystemId
 */
ExternalSystemModel.prototype.getByIdUnauth = async (externalSystemId) => {
	try {
		const result = await r.table(EXTERNAL_SYSTEM_TABLE)
			.filter(
				r.row("externalSystemId").eq(externalSystemId)
			)
			.run();

		if (result && result[0]) {
			return result[0];
		} else {
			throw ({
				err: {
					"message": "External System not found",
					"code": 404
				}
			});
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

/**
 * getByID - Get externalSystem by its ID
 * @param externalSystemId
 */
// shuey - why using callback with async method???
ExternalSystemModel.prototype.getById = async (userId, externalSystemId) => {
	try {
		// Check user access
		const availableExternalSystems = await orgExternalSystemModel.getBySystemId(userId, externalSystemId);
		if (!availableExternalSystems || availableExternalSystems.length === 0) {
			throw {
				err: {
					"message": "External System not found or requester does not have access",
					"code": 404
				}
			};
		}

		const result = await r.table(EXTERNAL_SYSTEM_TABLE)
			.filter(
				r.row("externalSystemId").eq(externalSystemId)
			)
			.run();

		if (result && result[0]) {
			return result[0];
		} else {
			throw {
				err: {
					"message": "External System not found or requester does not have access",
					"code": 404
				}
			};
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * getByID - Get externalSystem's configuration by its ID
 * @param externalSystemId
 */
ExternalSystemModel.prototype.getConfigurationById = async (userId, externalSystemId) => {
	try {
		// Check user access
		const availableExternalSystems = await orgExternalSystemModel.getBySystemId(userId, externalSystemId);
		if (!availableExternalSystems || availableExternalSystems.length === 0) {
			throw {
				err: {
					"message": "External System not found or requester does not have access",
					"code": 404
				}
			};
		}

		const result = await r.table(EXTERNAL_SYSTEM_TABLE)
			.filter(
				r.row("externalSystemId").eq(externalSystemId)
			)
			.run();

		if (result && result[0]) {
			return result[0].config;
		} else {
			throw {
				err: {
					"message": "External System not found or requester does not have access",
					"code": 404
				}
			};
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

/**
 * update  - update externalSystem
 * @param externalSystemId
 * @param update
 */
ExternalSystemModel.prototype.update = async (userId, externalSystemId, update) => {
	try {
		const permittedProps = ["name", "config"];
		const op = {};
		for (const property in update) {
			if (permittedProps.includes(property)) {
				op[property] = update[property];
			}
		}

		//Check user access
		const availableExternalSystems = await orgExternalSystemModel.getBySystemId(userId, externalSystemId);
		if (!availableExternalSystems || availableExternalSystems.length === 0) {
			throw {
				err: {
					"message": "External System not found or requester does not have access",
					"code": 404
				}
			};
		}

		const result = await r.table(EXTERNAL_SYSTEM_TABLE)
			.filter({
				"externalSystemId": externalSystemId
			})
			.update(op, {
				returnChanges: true
			})
			.run();

		const updated = result.changes[0].new_val;

		return updated;

	} catch (err) {
		console.log(err);
		return {
			err: {
				"message": err,
				"code": 500
			}
		};
	}
};