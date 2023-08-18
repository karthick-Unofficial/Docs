"use strict";
const USER_DEVICE_TABLE = "sys_userDevice";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/userDevice.json"));

module.exports = userDeviceModel;

function userDeviceModel(options) {
	if (!(this instanceof userDeviceModel)) return new userDeviceModel(options);
	const self = this;
	self.options = options;
}

/**
 *  getByDeviceId:
 * @param deviceId
 */
userDeviceModel.prototype.getByDeviceId = async function (deviceId) {
	try {
		const result = await r.table(USER_DEVICE_TABLE)
			.filter({ "deviceId": deviceId })
			.run();
		if (result.length > 0) {
			return result[0];
		}
		else {
			return { "result": "not found" };
		}

	} catch (err) {
		return err;
	}
};


/**
 *  create:
 * @param userDevice
 */
userDeviceModel.prototype.create = async function (userDevice) {

	userDevice.createdDate = new Date();
	userDevice.lastModifiedDate = new Date();

	if (!validate(userDevice)) {
		throw { "message": "Validation Error", "err": validate.errors };
	}

	try {
		const result = await r.table(USER_DEVICE_TABLE).insert(userDevice, { returnChanges: true }).run();
		return result.changes[0].new_val;
	} catch (err) {
		return { "message": err, "err": err };
	}

};

/**
 *  update:
 * @param deviceId
 * @param userDeviceChanges
 */
userDeviceModel.prototype.update = async function (deviceId, userDeviceChanges) {
	userDeviceChanges.lastModifiedDate = new Date();
	try {
		const result = await r.table(USER_DEVICE_TABLE)
			.filter({ "deviceId": deviceId })
			.update(userDeviceChanges, { returnChanges: true })
			.run();
		return result.changes[0].new_val;
	} catch (err) {
		return err;
	}
};

/**
 *  delete:
 * @param deviceId
 */
userDeviceModel.prototype.delete = async function (deviceId) {
	try {
		const result = await r.table(USER_DEVICE_TABLE)
			.filter({ "deviceId": deviceId })
			.delete()
			.run();
		return result;
	} catch (err) {
		return err;
	}

};

/**
 * streamAll
 * @param handler
 */
userDeviceModel.prototype.streamAll = async function (handler) {
	try {
		const feed = await r
			.table(USER_DEVICE_TABLE)
			.filter({ deleted: false }, { default: true })
			.changes({ includeInitial: true, includeTypes: true })
			.run();

		feed.each(function (err, change) {
			if (err) {
				handler(err, null);
			} else {
				handler(null, change);
			}
		});

		return feed;
	} catch (err) {
		console.log("error:", err);
		return err;
	}
};