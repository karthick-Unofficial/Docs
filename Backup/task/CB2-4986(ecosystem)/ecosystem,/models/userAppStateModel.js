"use strict";
const USER_APP_STATE_TABLE = "sys_userAppState";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db

module.exports = UserAppStateModel;

function UserAppStateModel(options) {
	if (!(this instanceof UserAppStateModel)) return new UserAppStateModel(options);
	const self = this;
	self.options = options;
}

UserAppStateModel.prototype.setAppState = async function (userId, appId, state) {
	const self = this;
	try {

		const qr = await r.table(USER_APP_STATE_TABLE).filter({ "user": userId, "appId": appId }).pluck("id");
		const existingKey = qr.length > 0 ? qr[0].id : undefined;
		const upsertId = existingKey != undefined ? existingKey : r.uuid();

		const result = await r.table(USER_APP_STATE_TABLE)
			.insert({
				"id": upsertId,
				"user": userId,
				"appId": appId,
				"state": state
			}, { conflict: "update" }) // -- use "replace" if you want to replace entirely
			.run();
		return result;
	}
	catch (err) {
		return err;
	}
};

UserAppStateModel.prototype.getAppState = async function (userId, appId) {
	const self = this;
	try {

		const stateResult = await r.table(USER_APP_STATE_TABLE).filter({ "user": userId, "appId": appId });
		if (stateResult.length > 0) {
			return stateResult[0];
		}
		else {
			return {};
		}
	} catch (err) {
		return err;
	}
};

//UserAppStateModel.prototype.setAppStateForKey = function(userEmail, appId, key, value, callback){
//    var self = this;
//    bluebird.coroutine(function*() {
//        try {
//
//            let qr = yield r.table(USER_APP_STATE_TABLE).filter({ "user": userEmail, "appId": appId, "key": key }).pluck("id");
//            let existingKey = qr.length > 0 ? qr[0].id : undefined;
//            let upsertId = existingKey != undefined ? existingKey : r.uuid();
//
//            let result = yield r.table(USER_APP_STATE_TABLE)
//                .insert({
//                    "id": upsertId,
//                    "user": userEmail,
//                    "appId": appId,
//                    "key": key,
//                    "value": value
//                }, { conflict: 'replace' }) // -- use "update" if only want to replace partial
//                .run()
//                .then( function (result) {
//                    if (callback) callback(null, result);
//                })
//                .error(function (err) {
//                    if (callback) callback(err, null);
//                })
//        } catch (err) {
//            if (callback) callback(err, null);
//        }
//    })();
//}
