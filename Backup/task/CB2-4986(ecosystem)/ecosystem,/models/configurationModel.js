"use strict";
const CONFIGURATION_TABLE = "sys_configuration";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/configuration.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/configurationModel.js");

module.exports = ConfigurationModel;

function ConfigurationModel(options) {
	if (!(this instanceof ConfigurationModel)) return new ConfigurationModel(options);
	const self = this;
	self.options = options;
}

ConfigurationModel.prototype.create = async function (config) {
	if(!validate(config)) {
		logger.error("create", "There was an error creating the configuration", {
			err: { message: "Validation Errors below " + JSON.stringify(validate.errors) }
		});
		throw { message: "Validation Error", "err": validate.errors, code: 500 };
	}

	const alreadyExists = await r
		.table(CONFIGURATION_TABLE)
		.filter(r.row("appId").eq(config.appId))
		.run();

	if (alreadyExists) {
		throw { message: `Config for ${config.appId} already exists`, code: 500 };
	}

	const result = await r
		.table(CONFIGURATION_TABLE)
		.insert(config, {
			returnChanges: true
		})
		.run();

	return result.changes[0].new_val;
};

ConfigurationModel.prototype.update = async function (config) {
	if(!validate(config)) {
		logger.error("update", "There was an error updating the configuration", {
			err: { message: "Validation Errors below " + JSON.stringify(validate.errors) }
		});
		throw { message: "Validation Error", "err": validate.errors, code: 500 };
	}

	const alreadyExists = await r
		.table(CONFIGURATION_TABLE)
		.filter(r.row("appId").eq(config.appId))
		.run();

	if (!alreadyExists) {
		throw { message: `Config for ${config.appId} doesn't exist exist`, code: 500 };
	}

	const result = await r
		.table(CONFIGURATION_TABLE)
		.get(alreadyExists.id)
		.update(config, {
			returnChanges: true
		})
		.run();

	return result.changes[0].new_val;
};


/**
 * getByAppId:
 * @param appId
 */
ConfigurationModel.prototype.getByAppId = async function (appId) {
	const result = await r
		.table(CONFIGURATION_TABLE)
		.filter(r.row("appId").eq(appId))
		.run();

	return result[0];
};