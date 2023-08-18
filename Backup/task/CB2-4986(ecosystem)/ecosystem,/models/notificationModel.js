"use strict";
const config = require("../config.json");
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/notificationModel.js");
const esProvider = require("../lib/es-provider");
const esClient = esProvider.get();
const moment = require("moment");
const _global = require("../app-global.js");
const uuidv4 = require("uuid/v4");

const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/notification.json"));
const notificationQueue = require("node-app-core").jobQueue("ecosystem", "notification");
const activityModel = require("./activityModel")({});
const feedModel = require("../models/feedModel")();
const systemNotificationModel = require("../models/systemNotificationModel")({});

module.exports = NotificationModel;

function NotificationModel(options) {
	if (!(this instanceof NotificationModel)) return new NotificationModel(options);
	const self = this;
	self.options = options;
}

// { "to": ["organization:the_mariner_group", "user:shuey@themarinergroup.net"], "activityId": "1", "summary": "blah" }
NotificationModel.prototype.queueNotification = async function (notification) {
	const job = notificationQueue.createJob();
	job.notification = notification;
	try {
		await notificationQueue.addJob(job);
		return { "result": "Job Added: " + job.jobId };
	}
	catch (ex) {
		throw ex;
	}
};

//var notification = {
//    activityId: "",
//    userId: "",
//    createdDate: new Date(),
//    isViewed: false,
//    viewedDate: new Date(),
//    isClosed: false
//    viewedDate: new Date(),
//}

/**
 * bulkInsert
 * @param notifications - array of notification objects to insert
 */
NotificationModel.prototype.bulkInsert = async function (notifications) {
	try {

		// Validate each item in the notifications array against the notification schema for individual items
		for (const notification of notifications) {
			if (!validate(notification)) {
				return validate.errors;
			}
		}		

		for (const notification of notifications) {
			notification["id"] = uuidv4();
			notification["history"] = [
				{ 
					"closed": false, 
					timestamp: notification.lastModifiedDate.toISOString() 
				}
			];
			const createdDate = moment(notification.createdDate);
			const indexName = `notification-stream-${createdDate.utc().format("YYYY.MM")}`;
			const result = await esClient.index({
				refresh: true,
				id: notification.id,
				index: indexName,
				body: notification
			});
			_global.globalChangefeed.publishNotification(notification);
		}

		return { success: true };

	}
	catch (err) {
		throw err;
	}
};

// we need to add auth to notifications - just that userId is userId of notification 
NotificationModel.prototype.getNotification = async function (notificationId) {

	const q = {
		"query": {
			"term": {
				"id": notificationId
			}
		}
	};

	const getNotificationResult = await esClient.search({
		index: "notification-stream-*",
		body: q
	});

	if (getNotificationResult.hits.total.value === 1) {
		return getNotificationResult.hits.hits[0]._source;
	}
	else {
		return null;
	}

};

NotificationModel.prototype.getNotifications = async function (notificationIds, size = 10) {

	const q = {
		"size": size,
		"from": 0,
		"query": {
			"terms": {
				"id": notificationIds
			}
		}
	};

	try {
		const getNotificationsResult = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		if (getNotificationsResult.hits.total.value === notificationIds.length) {
			return getNotificationsResult.hits.hits.map((item) => item._source);
		}
		else {
			logger.error("Notification not found or requester does not have access");
		}
	} 
	catch (e) {
		logger.error("getById", "There was an error while getting a notification by id", {
			err: { message: e.message, stack: e.stack }
		});
	}

};

NotificationModel.prototype.getNotificationsForDismissIds = async function (dismissIds) {

	const q = {
		"query": {
			"terms": {
				"dismissId": dismissIds
			}
		}
	};

	try {
		const getNotificationsResult = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		if (getNotificationsResult.hits.total.value >= dismissIds.length) {
			return getNotificationsResult.hits.hits.map((item) => item._source);
		}
		else {
			logger.error("Notifications not found or requester does not have access");
		}
	} 
	catch (e) {
		logger.error("getByDismissIds", "There was an error while getting notifications by dismiss ids", {
			err: { message: e.message, stack: e.stack }
		});
	}

};

/**
 * markClosed
 * @param notificationId - id of notification to close
 * @param isClosed - boolean value to update closed field to
 */
NotificationModel.prototype.updateClosed = async function (notificationId, isClosed) {
	try {
		const notification = await this.getNotification(notificationId);
		const queryTerm = {};
		if (notification.dismissId && notification.dismissId !== "")
			queryTerm["dismissId"] = notification.dismissId; // We dismiss all notifications for the dismiss id
		else
			queryTerm["id"] = notificationId;

		const q = {
			"script": {
				"source": `if (ctx._source.history == null) { ctx._source.history=[] } ctx._source.history.add(params.change); ctx._source.closed=${isClosed};`,
				"lang": "painless",
				"params": {
					"change": {
						"closed": isClosed,
						"timestamp": new Date().toISOString()
					}
				}
			},
			"query": {
				"term": queryTerm
			}
		};

		const result = await esClient.updateByQuery({
			refresh: true,
			// version_type: false,
			index: "notification-stream-*",
			body: q
		});

		if (result.updated > 0) {
			const notificationsToPublish = [];
			if (notification.dismissId) {
				const updatedNotifications = await this.getNotificationsForDismissIds([notification.dismissId]);
				notificationsToPublish.push(...updatedNotifications);
			} else {
				const updatedNotification = await this.getNotification(notificationId);
				notificationsToPublish.push(updatedNotification);
			}
			for(const note of notificationsToPublish) {
				// -- todo: ENT_AUTH may want to publish with action type similar to rethink
				_global.globalChangefeed.publishNotification(note);
			}
		}
		else {
			throw { code: 500, message: "Update notification failed" };
		}
	} 
	catch (err) {
		throw (err);
	}
};

/**
 * markClosed
 * @param notificationId - id of notification to close
 */
NotificationModel.prototype.markClosed = async function (notificationId) {
	return await this.updateClosed(notificationId, true);
};

NotificationModel.prototype.updateClosedBulk = async function(notificationIds, isClosed) {
	try {
		const notifications = await this.getNotifications(notificationIds, 10000);
		const notificationDismissIds = [];
		const individualNotificationIds = [];

		for (const notification of notifications) {
			if (notification.dismissId && notification.dismissId !== "")
				notificationDismissIds.push(notification.dismissId);
			else
				individualNotificationIds.push(notification.id);
		}

		const q = {
			"script": {
				"source": `if (ctx._source.history == null) { ctx._source.history=[] } ctx._source.history.add(params.change); ctx._source.closed=${isClosed};`,
				"lang": "painless",
				"params": {
					"change": {
						"closed": isClosed,
						"timestamp": new Date().toISOString()
					}
				}
			},
			"query": {
				"bool": {
					"should": [
						{
							"terms": {
								"dismissId": notificationDismissIds
							}
						},
						{
							"terms": {
								"id": individualNotificationIds
							}
						}
					]
				}
			}
		};

		const result = await esClient.updateByQuery({
			refresh: true,
			index: "notification-stream-*",
			body: q
		});

		if (result.updated >= notificationIds.length) {
			const notificationsToPublish = [];
			if (notificationDismissIds.length > 0) {
				const orgNotifications = await this.getNotificationsForDismissIds(notificationDismissIds);
				notificationsToPublish.push(...orgNotifications);
			}
			if (individualNotificationIds.length > 0) {
				const individualNotifications = await this.getNotifications(individualNotificationIds);
				notificationsToPublish.push(...individualNotifications);
			}
			for(const notificationToPublish of notificationsToPublish) {
				// -- todo: ENT_AUTH may want to publish with action type similar to rethink
				_global.globalChangefeed.publishNotification(notificationToPublish);
			}
		}
		else {
			throw { code: 500, message: "Update notification to close failed" };
		}
	} 
	catch (err) {
		throw (err);
	}

};

/**
 * markClosedBulk
 * @param notificationIds - ids of notifications to close
 */
NotificationModel.prototype.markClosedBulk = async function(notificationIds) {
	return await this.updateClosedBulk(notificationIds, true);
};

/**
 * markClosed
 * @param notificationId - id of notification to open
 */
NotificationModel.prototype.markOpen = async function (notificationId) {
	return await this.updateClosed(notificationId, false);
};

/**
 * markOpenBulk
 * @param notificationIds - ids of notifications to close
 */
NotificationModel.prototype.markOpenBulk = async function(notificationIds) {
	return await this.updateClosedBulk(notificationIds, false);
};

NotificationModel.prototype.streamActiveByUser = async function (
	userId,
	handler) {

	const batchDuration = 500;
	let batchNotifications = [];

	const sendBatch = () => {
		handler(null, { "type": "change-batch", "changes": batchNotifications });
		batchNotifications = [];
	};

	setInterval(() => {
		if (batchNotifications.length > 0)
			sendBatch();
	}, batchDuration);

	try {

		const userNotifications = await this.getActiveByUser(userId);
		const initialBatch = userNotifications.map((notification) => {
			return { new_val: notification, type: "initial" };
		});
		handler(null, { "type": "initial-batch", "changes": initialBatch });

		// add, change, remove
		// if close send as remove, need to indicate on publish if add
		_global.globalChangefeed.subscribeNotification(userId, null, async function (notification) {
			// handler(null, notification);
			let notificationActivity = null;
			try {
				notificationActivity = await activityModel.getActivity(userId, notification.activityId);
			}
			catch(err) {
				logger.error("streamActiveByUser", "There was an error fetching activity", {
					err: { message: err.message, stack: err.stack, notification: notification }
				});			
			}
			if(notificationActivity) {
				const mergedNotification = { ...notificationActivity, ...notification };

				// -- merge in disabled property if relevant
				if (mergedNotification.object && mergedNotification.object.type && mergedNotification.object.entity) {
					try {
						switch (mergedNotification.object.type) {
							case "event": {
								const entity = await feedModel.getEntityWithAuthorization(userId, mergedNotification.object.id, "event");
								mergedNotification.object.entity.disabled = entity.disabled;
								break;
							}
						}
					}
					catch (err) {
						logger.error("getMergedNotificationList", "There was an error fetching latest entity data.", {
							err: { message: err.message, stack: err.stack, notification: mergedNotification }
						});
					}
				}
				if (notification.closed) {
					batchNotifications.push({ "old_val": mergedNotification, type: "remove" });
				}
				else {
					batchNotifications.push({ "new_val": mergedNotification, type: "add" });
				}
			}
		});


	}
	catch (err) {
		return err;
	}

};

/**
 * getNotificationsByUser
 * @param userId
 * @param since - (Optional) date epoch for notifications since specified date/time
 */
NotificationModel.prototype.getNotificationsByUser = async function (userId, isClosed, size, since) {

	try {

		// -- if they have more than 10000 then we have problems
		const q = {
			"from": 0,
			"size": size,
			"sort": [
				{
					"createdDate": {
						"order": "desc"
					}
				}
			],
			"query": {
				"bool": {
					"must": [
						{
							"term": {
								"userId": userId
							}
						},
						{
							"term": {
								"closed": isClosed
							}
						}
					]
				}
			}
		};

		if (since) {
			q.query.bool.must.push(
				{
					"range": {
						"createdDate": {
							"gte": new Date(parseFloat(since)).toISOString()
						}
					}
				}
			);
		}

		const result = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		const getMergedNotificationList = async function (esNotifications) {
			const pArray = esNotifications.map(async (hit) => {
				const notification = hit._source;
				let notificationActivity = null;
				try {
					notificationActivity = await activityModel.getActivity(userId, notification.activityId);
				}
				catch(err) {
					logger.error("getNotificationsByUser", "There was an error fetching activity", {
						err: { message: err.message, stack: err.stack, notification: notification }
					});			
				}
				if(notificationActivity) {
					const mergedNotification = { ...notificationActivity, ...notification };

					// -- merge in disabled property if relevant
					if (mergedNotification.object && mergedNotification.object.type && mergedNotification.object.entity) {
						try {
							switch (mergedNotification.object.type) {
								case "event": {
									const entity = await feedModel.getEntityWithAuthorization(userId, mergedNotification.object.id, "event");
									mergedNotification.object.entity.disabled = entity.disabled;
									break;
								}
							}
						}
						catch (err) {
							logger.error("getMergedNotificationList", "There was an error fetching latest entity data.", {
								err: { message: err.message, stack: err.stack, notification: mergedNotification }
							});
						}
					}
					return mergedNotification;
				}
				else {
					return null;
				}
			});
			const notificationList = await Promise.all(pArray);
			return notificationList;
		};

		const mergedNotifications = getMergedNotificationList(result.hits.hits);
		const filteredNotifications = (await mergedNotifications).filter((notification) => notification !== null);
		return filteredNotifications;
	}
	catch (err) {
		logger.error("getNotificationsByUser", `Unexpected exception attempting to get notifications for user ${userId}`, { errMessage: err.message, errStack: err.stack }, SYSTEM_CODES.ELASTICSEARCH);
		throw (err);
	}
	
};

/**
 * getActiveByUser
 * @param userId
 * @param since - (Optional) date epoch for notifications since specified date/time
 */
NotificationModel.prototype.getActiveByUser = async function (userId, since) {
	return await this.getNotificationsByUser(userId, false, 10000, since);
};

// Returns every archived notification up to a certain number of pages
NotificationModel.prototype.getArchived = async function(userId, page) {
	const endItem = page * config.notifications.archiveQuerySize;
	const archivedNotifications = await this.getNotificationsByUser(userId, true, endItem);
	return archivedNotifications;
};

/**
 * getActiveByUser
 * @param userId
 * @param from 
 * @param to 
 */
NotificationModel.prototype.getUserNotificationsCreatedInDateRange = async function (userId, from, to) {

	try {

		// -- if they have more than 10000 then we have problems
		const q = {
			"from": 0,
			"size": 10000,
			"sort": [
				{
					"createdDate": {
						"order": "asc"
					}
				}
			],
			"query": {
				"bool": {
					"must": [
						{
							"term": {
								"userId": userId
							}
						},
						{
							"term": {
								"isPriority": true
							}
						},
						{
							"range": {
								"createdDate": {
									"gte": from,
									"lte": to
								}
							}
						}
					]
				}
			}
		};

		const result = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		const notifications = result.hits.hits.map((hit) => hit._source);
		return notifications;

	}
	catch (err) {
		logger.error("getUserNotificationsCreatedInDateRange", `Unexpected exception attempting to get notifications for user ${userId}`, 
			{ 
				userId: userId,
				to: to,
				from: from,
				errMessage: err.message, 
				errStack: err.stack 
			}, 
			SYSTEM_CODES.ELASTICSEARCH);
		throw (err);
	}
	
};

/**
 * getActiveByUser
 * @param userId
 * @param from 
 * @param to 
 */
NotificationModel.prototype.getUserNotificationHistory = async function (userId, from, to) {

	try {

		const q = {
			"from": 0,
			"size": 10000,
			"_source": {
				"includes": ["*"],
				"excludes": ["history"]
			},
			"sort": [{
				"history.timestamp": {
					"order": "desc",
					"nested": {
						"path": "history",
						"filter": {
							"bool": {
								"must": [{
									"range": {
										"history.timestamp": {
											"gte": from,
											"lte": to
										}
									}
								}]
							}
		
						}
					}
				}
			}],
			"query": {
				"bool": {
					"must": [{
						"term": {
							"userId": userId
						}
					},
					{
						"nested": {
							"ignore_unmapped": true,
							"path": "history",
							"inner_hits": {},
							"query": {
								"bool": {
									"must": [{
										"range": {
											"history.timestamp": {
												"gte": from,
												"lte": to
											}
										}
									}]
								}
							}
						}
					}
					]
				}
			}
		};

		const result = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		const notificationHits = result.hits.hits.map((hit) => hit);

		const historicalNotifications = [];

		// iterate over notification hits and create a separate record for each historical change
		for(const notificationHit of notificationHits) {
			const notification = notificationHit._source;
			const changes = notificationHit.inner_hits.history.hits.hits.map((hit) => hit._source);
			for(const change of changes) {
				const notificationChange = { ...notification };
				notificationChange["closed"] = change.closed;
				notificationChange["lastModifiedDate"] = change.timestamp;
				historicalNotifications.push(notificationChange);
			}
		}

		return historicalNotifications;

	}
	catch (err) {
		logger.error("getUserNotificationHistory", `Unexpected exception attempting to get notifications for user ${userId}`, 
			{ 
				userId: userId,
				to: to,
				from: from,
				errMessage: err.message, 
				errStack: err.stack 
			}, 
			SYSTEM_CODES.ELASTICSEARCH);
		throw (err);
	}
	
};

NotificationModel.prototype.closeAllBefore = async function (before, olderThan = 14) {
	try {
		let lte;
		if (before) {
			lte = new Date(parseFloat(before)).toISOString();
		}
		else {
			lte = new Date();
			lte.setDate(lte.getDate() - olderThan);
			lte = lte.toISOString();
		}

		const q = {
			"from": 0,
			"size": 10000,
			"sort": [
				{
					"createdDate": {
						"order": "desc"
					}
				}
			],
			"query": {
				"bool": {
					"must": [
						{
							"term": {
								"closed": false
							}
						},
						{
							"range": {
								"createdDate": {
									"lte": lte
								}
							}
						}
					]
				}
			}
		};

		const oldNotifications = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		const oldNotificationIds = oldNotifications.hits.hits.map((hit) => hit._id);

		await this.markClosedBulk(oldNotificationIds);

		return { "success": true, "closed": oldNotificationIds };
	}
	catch (err) {
		logger.error("closeAllBefore", "Unexpected exception attempting to close old notifications", 
			{ 
				before,
				olderThan,
				errMessage: err.message, 
				errStack: err.stack 
			}, 
			SYSTEM_CODES.ELASTICSEARCH);
		throw(err);
	}
};

NotificationModel.prototype.cleanup = async function (daysOld = 14) {
	try {
		let lte = new Date();
		lte.setDate(lte.getDate() - daysOld);
		lte = lte.toISOString();

		const q = {
			"from": 0,
			"size": 10000,
			"sort": [
				{
					"createdDate": {
						"order": "desc"
					}
				}
			],
			"query": {
				"bool": {
					"must": [
						{
							"term": {
								"closed": false
							}
						},
						{
							"range": {
								"createdDate": {
									"lte": lte
								}
							}
						}
					]
				}
			},
			"aggs": {
				"users": {
					"terms": {
						"field": "userId"
					}
				}
			}
		};

		const oldNotifications = await esClient.search({
			index: "notification-stream-*",
			body: q
		});

		// -- keep notifications that have more than 2 history items (ie. they have been reopened)
		const oldNotificationIds = oldNotifications.hits.hits
			.filter((hit) => !hit._source.history || hit._source.history.length <= 2)
			.map((hit) => hit._id);

		if (oldNotificationIds.length) {
			await this.markClosedBulk(oldNotificationIds);

			const sysNotificationType = "notification-cleanup";

			// -- loop through users and send systemNotification when appropriate
			const userIds = oldNotifications.aggregations.users.buckets.map(bucket => bucket.key);
			for (const userId of userIds) {
				try {
					const existingSysNotification = await systemNotificationModel.getByType(userId, sysNotificationType);

					// -- update expiration if existing, otherwise create new systemNotification
					const expDate = new Date();
					expDate.setDate(expDate.getDate() + 14);
					if (existingSysNotification) {
						const result = await systemNotificationModel.update(existingSysNotification.id, {exp: expDate});
						logger.info("cleanup", "SystemNotification updated", { result });
					}
					else {
						const sysNotification = {
							title: "Closed Old Notifications",
							content: `Some of your old notifications have been closed.\n\nNotifications older than ${daysOld} days ` +
								"are automatically closed, but are still available in your archived notifications.",
							exp: expDate,
							interrupt: false,
							notify: {
								users: [userId]
							},
							type: sysNotificationType,
							timestamp: new Date()
						};

						const result = await systemNotificationModel.create(sysNotification);
						logger.info("cleanup", "SystemNotification created", { result });
					}
				}
				catch (err) {
					logger.error("cleanup", "Unexpected exception attempting to send systemNotification",
						{
							daysOld,
							userId,
							errMessage: err.message,
							errStack: err.stack
						},
						SYSTEM_CODES.UNSPECIFIED);
				}
			}
		}

		logger.info("cleanup", "Notifications closed", { closedNotificationIds: oldNotificationIds });

		return { "success": true, "closed": oldNotificationIds };
	}
	catch (err) {
		logger.error("cleanup", "Unexpected exception attempting to cleanup old notifications",
			{
				daysOld,
				errMessage: err.message,
				errStack: err.stack
			},
			SYSTEM_CODES.ELASTICSEARCH);
		throw(err);
	}
};