"use strict";
const APPLICATION_TABLE = "sys_application";
const USER_APPLICATION_TABLE = "sys_userApplication";
const USER_TABLE = "sys_user";
const LOCALES_TABLE = "sys_locales";
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/application.json"));
const { Logger } = require("node-app-core/dist/logger");
const { rstrip } = require("underscore");
const logger = new Logger("ecosystem", "/models/application.js");

module.exports = ApplicationModel;

function ApplicationModel(options) {
	if (!(this instanceof ApplicationModel)) return new ApplicationModel(options);
	const self = this;
	self.options = options;
}

ApplicationModel.prototype.create = async function (app) {
	const self = this;

	if (!validate(app)) {
		throw { message: "Validation Error", code: 403, "err": validate.errors };
	}

	try {
		const dbResult = await r.table(APPLICATION_TABLE).insert(app).run();
		if (dbResult.inserted == 1) {
			return dbResult;
		} else {
			return { "result": "Internal error. Application not created." };
		}
	} catch (err) {
		return { "message": err, "err": err };
	}
};


/**
 *  getAll:
 */
ApplicationModel.prototype.getAll = async function () {
	const self = this;
	try {
		const result = await r.table(APPLICATION_TABLE).run();
		return result;
	} catch (err) {
		return err;
	}
};

/**
 * getApplicationProfile
 * Maybe not necessary as can be retrieved from entity however may refactor shares into mapping table
 * @param appId
 */
ApplicationModel.prototype.getApplicationProfile = async function (appId) {

	try {
		const result = await r.table(APPLICATION_TABLE)
			.filter({ "appId": appId })
			.limit(1)
			.merge((app) => {
				return {
					users: r.table(USER_APPLICATION_TABLE)
						.filter({ appId: app("appId") })
						.eqJoin("userId", r.table(USER_TABLE))
						.without([{ left: ["id", "appId", "lastModifiedDate", "userId"] },
							{ right: ["id", "contact", "password", "lastModifiedDate"] }])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			.run();
		return result;
	} catch (err) {
		return err;
	}

};

ApplicationModel.prototype.getApplicationProfile = async function (appId) {
	try {
		const result = await r.table(APPLICATION_TABLE)
			.filter({ "appId": appId })
			.limit(1)
			.without(["id", "permissionOptions"])
			.run();

		return result && result.length > 0 ? result[0] : null;
	}
	catch (err) {
		logger.error("getApplicationProfile", `Error getting application profile for app ${appId}`, { err: { message: err.message, stack: err.stack } });
		throw err;
	}
};

/**
 * getApplicationOrgProfile
 * @param appId
 * @param orgId
 */
ApplicationModel.prototype.getApplicationOrgProfile = async function (appId, orgId) {

	try {
		const result = await r.table(APPLICATION_TABLE)
			.filter({ "appId": appId })
			.limit(1)
			.merge((app) => {
				return {
					users: r.table(USER_APPLICATION_TABLE)
						.filter({ appId: app("appId") })
						.eqJoin("userId", r.table(USER_TABLE))
						.filter({ "right": { "orgId": orgId } })
						.without([{ left: ["id", "appId", "lastModifiedDate", "userId"] },
							{ right: ["contact", "password", "lastModifiedDate"] }])
						.zip()
						.coerceTo("ARRAY")
				};
			})
			.run();
		return result;
	} catch (err) {
		return err;
	}

};


ApplicationModel.prototype.getTranslations = async function (appId) {
	try {
		if (appId === "global") {
			const result = await r
				.table(LOCALES_TABLE).
				filter(
					r.or(
						r.row("appId").eq(appId)
					)
				)
				.run();
			return result[0];
		}
		else {
			const result = await r
				.table(LOCALES_TABLE).
				filter(
					r.or(
						r.or(r.row("appId").eq("global"), r.row("appId").eq(appId))
					)
				)
				.run();
			const getGlobalTranslation = (element) => element.appId === "global";
			const getGlobalIndex = result.findIndex(getGlobalTranslation);
			const getCurrentAppIndex = (element) => element.appId === appId;

			result.map((row, index) => {
				if (row.appId === appId) {
					result[index].translations.en.global = result[getGlobalIndex].translations.en["orion-components"];
					result[index].translations.ar.global = result[getGlobalIndex].translations.ar["orion-components"];
					return true;
				}
			});
			return result[result.findIndex(getCurrentAppIndex)];

		}

	}
	catch (err) {
		throw err;
	}
};

