"use strict";
const SYSTEM_NOTIFICATION_TABLE = "sys_systemNotification";
const USER_SYSTEM_NOTIFICATION_TABLE = "sys_userSystemNotification";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const ajv = require("./schema/additionalKeywords");
const validate = ajv.compile(require("./schema/systemNotification.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/systemNotificationModel.js");
const userModel = require("./userModel")();

module.exports = SystemNotificationModel;

function SystemNotificationModel(options) {
	if (!(this instanceof SystemNotificationModel)) return new SystemNotificationModel(options);
	const self = this;
	self.options = options;
}

SystemNotificationModel.prototype.getAllUnacked = async () => {
	try {
		logger.info("getAllUnacked", "Entering function", {});

		const result = await r.table(SYSTEM_NOTIFICATION_TABLE).filter(notification => {
			return r.table(USER_SYSTEM_NOTIFICATION_TABLE).filter(userNotification => {
				return userNotification("systemNotificationId").eq(notification("id")).default(false);
			}).count().eq(0);
		});

		logger.info("getAllUnacked", "Retrieved all unacknowledged systemNotifications.", { result });

		return result;
	} catch (err) {
		logger.error("getAllUnacked", "There was an error getting all unacknowledged systemNotifications", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

SystemNotificationModel.prototype.getByType = async (userId, type) => {
	try {
		logger.info("getByType", "Entering function", { userId, type });

		const user = await userModel.getByUserId(userId);

		logger.debug("getByType", "user profile retrieved", { result: user });

		// -- build filters
		const userIncluded = r.or(
			r.row("notify")("users").default([]).isEmpty().and(r.row("notify")("orgs").default([]).isEmpty()),	// users and orgs lists both empty or not there
			r.row("notify")("users").default([]).contains(userId),	// user in user list
			r.row("notify")("orgs").default([]).contains(user.orgId)	// org in org list
		);
		const notificationNotExpired = r.and(
			r.row.hasFields("exp"),
			r.row("exp").gt(r.now())
		);
		const matchingType = r.row("type").default(null).eq(type);
		const filters = r.and(userIncluded, notificationNotExpired, matchingType);

		const result = await r.table(SYSTEM_NOTIFICATION_TABLE).filter(filters)(0).default(null);

		logger.info("getByType", "systemNotifications retrieved by type.", { result });

		return result;
	} catch (err) {
		logger.error("getByType", "There was an error getting systemNotification by type", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

SystemNotificationModel.prototype.create = async (systemNotification) => {
	try {
		logger.info("create", "Entering function", { systemNotification });

		// -- validate
		if (!validate(systemNotification)) {
			logger.error("create", "Validation Error.", {
				err: { "message": "Validation Error ", "err": validate.errors }
			});
			return { "message": "Validation Error ", "err": validate.errors };
		}

		// -- insert systemNotification
		const result = await r.table(SYSTEM_NOTIFICATION_TABLE).insert(systemNotification);
		if (result.inserted != 1) {
			logger.error("create", "SystemNotification insert failed", { result });
			throw {"message": "SystemNotification insert failed", code: 500};
		}

		logger.info("create", "SystemNotification insert succeeded.", { result });

		return result;
	} catch (err) {
		logger.error("create", "There was an error creating systemNotification", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

SystemNotificationModel.prototype.update = async (id, update) => {
	try {
		logger.info("update", "Entering function", { id, update });

		const result = await r.table(SYSTEM_NOTIFICATION_TABLE).get(id).update(update, { returnChanges: true });

		logger.info("update", "systemNotification updated.", { result });

		return result;
	} catch (err) {
		logger.error("update", "There was an error updating systemNotification", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * acknowledgeNotificationForUser
 * @param userId
 * @param notificationId
 */
SystemNotificationModel.prototype.acknowledgeNotificationForUser = async function (userId, notificationId) {
	try {
		logger.info("acknowledgeNotificationForUser", "Entering function", { userId, notificationId });

		// -- check if userSystemNotification already exists (shouldn't occur, but just a safety precaution) - CD
		const existingUserSysNotification = await r.table(USER_SYSTEM_NOTIFICATION_TABLE)
			.filter(r.row("systemNotificationId").eq(notificationId).and(r.row("userId").eq(userId)))(0)
			.default(null);

		if (!existingUserSysNotification) {
			const userSystemNotification = {
				systemNotificationId: notificationId,
				userId
			};

			const result = await r
				.table(USER_SYSTEM_NOTIFICATION_TABLE)
				.insert(userSystemNotification, {
					returnChanges: true
				});

			logger.info("acknowledgeNotificationForUser", "userSystemNotification acknowledged.", { result: result.changes[0].new_val });

			return result.changes[0].new_val;
		}
		else {
			logger.info("acknowledgeNotificationForUser", "userSystemNotification already acknowledged.", { result: existingUserSysNotification });

			return existingUserSysNotification;
		}
	}
	catch (err) {
		logger.error("acknowledgeNotificationForUser", "There was an error creating a userSystemNotification acknowledgement", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};

/**
 * streamByUser
 * @param userId
 * @param handler
 */
SystemNotificationModel.prototype.streamByUser = async function (userId, handler) {
	try {
		logger.info("streamByUser", "Entering function", { userId });

		const user = await userModel.getByUserId(userId);

		logger.debug("streamByUser", "user profile retrieved", { result: user });

		// -- build filters
		const userIncluded = r.or(
			r.row("notify")("users").default([]).isEmpty().and(r.row("notify")("orgs").default([]).isEmpty()),	// users and orgs lists both empty or not there
			r.row("notify")("users").default([]).contains(userId),	// user in user list
			r.row("notify")("orgs").default([]).contains(user.orgId)	// org in org list
		);
		const notificationNotExpired = r.or(
			r.row.hasFields("exp").not(),
			r.row("exp").gt(r.now())
		);
		const filters = r.and(userIncluded, notificationNotExpired);

		const changesQuery = r
			.table(SYSTEM_NOTIFICATION_TABLE)
			.filter(filters)
			.without("exp", "notify")
			.changes({ includeInitial: true, includeTypes: true, includeStates: true });

		let initializing = false;
		const initialBatch = [];
		const onFeedItem = async function (change) {
			if (change.type === "state") {
				if (change.state === "initializing") {
					logger.debug("streamByUser", "retrieving systemNotification initial batch", {});

					initializing = true;
				}
				else if (change.state === "ready") {
					// -- stop initializing and send initial batch
					initializing = false;

					const existingUserSysNotifications = await r.table(USER_SYSTEM_NOTIFICATION_TABLE)
						.filter(r.row("userId").eq(userId));

					// -- check if notification has already been acknowledged by user
					const filteredBatch = initialBatch.filter(change => {
						return !existingUserSysNotifications.some(userNotification => userNotification.systemNotificationId === change.id);
					});

					logger.debug("streamByUser", "systemNotification initial batch complete", { result: filteredBatch });

					handler(null, {batch: filteredBatch, type: "initial"});
				}
			}
			else {
				if (initializing) {
					// -- store in batch for a single initial batch update
					initialBatch.push(change.new_val);
				}
				else {
					// -- check if notification has already been acknowledged by user
					const existingUserSysNotification = await r.table(USER_SYSTEM_NOTIFICATION_TABLE)
						.filter(r.row("systemNotificationId").eq(change.new_val.id).and(r.row("userId").eq(userId)))(0)
						.default(null);

					if (!existingUserSysNotification) {
						logger.debug("streamByUser", "publishing new systemNotification", { result: change });

						handler(null, change);
					}
				}
			}
		};

		const onError = function (err) {
			logger.error("streamByUser", "There was an error streaming systemNotifications", {
				err: { message: err.message, stack: err.stack }
			});

			handler(err);
		};

		const cancelFn = provider.processChangefeed("SystemNotificationModel.streamByUser", changesQuery, onFeedItem, onError);
		return cancelFn;
	} catch (err) {
		logger.error("streamByUser", "There was an error streaming systemNotifications", {
			err: { message: err.message, stack: err.stack }
		});
		throw err;
	}
};