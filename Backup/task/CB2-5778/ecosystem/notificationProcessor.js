// cSpell:ignore queuepush
const config = require("../config");
const notificationModel = require("../models/notificationModel")();
const activityModel = require("../models/activityModel")();
const orgModel = require("../models/organizationModel")();
const userModel = require("../models/userModel")();
const userDeviceCache = require("../lib/userDeviceCache");
const userCache = require("../lib/userCache");
const emailProvider = require("../lib/emailProvider")();
const pushNotificationProvider = require("../lib/pushNotificationProvider.js")();
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/process/notificationProcessor.js");
const notificationQueue = require("node-app-core").jobQueue("ecosystem", "notification");
const EcoLinkManager = require("../lib/ecoLink/ecoLinkManager");
const JWT = require("jsonwebtoken");

const _global = require("node-app-core/dist/app-global.js");
const proc = require("node-app-core").process("notification-processor", {
	appGlobal: _global
});

const _health = {
	status: 1,
	metrics: {
		totalProcessed: 0,
		successCount: 0,
		errorCount: 0,
		generated: {
			system: 0,
			email: 0,
			push: 0
		}
	}
};

proc.initialize = async function (args) {
	try {
		const ecoLinkMgr = new EcoLinkManager("shape-activity-generator-eco-link");
		await ecoLinkMgr.init();
		_global.ecoLinkManager = ecoLinkMgr;
		startQueueMonitor();
		proc.status("Monitoring notification queue");
	} catch (e) {
		proc.fail("unhandled exception", e);
	}
	proc.initSuccess();
};

proc.shutdown = function () {
	proc.shutdownSuccess();
};

proc.getHealth = function () {
	return _health;
};

function startQueueMonitor() {
	notificationQueue.subscribe(async function (job) {
		try {
			const i18n = await _global.geti18n();
			const translations = i18n.ecosystem.email.systemNotification;
			_health.metrics.totalProcessed++;
			logger.info("subscribe-callback", `New job received: ${JSON.stringify(job)}`);
			//const activityResult = yield activityModel.create("ecosystem", job.activity);

			// -- refactor into own function
			let notifications = null;

			const to = job.notification.to;
			const actor = job.notification.actor;
			let processResult = {};
			console.log("***", job.notification)

			if (to && to.constructor === Array && to.length > 0) {
				// -- todo: get exclusions from UserModel stored in application mappings config key
				// -- parse to field extract individual organizations and/or users
				// -- queue notifications for all that haven't explicitly excluded
				// -- Prior to exclusions add an entityActivityStream entry for each user and relevant entity (object,target)
				// -- will also need to confirm authorized to related entities
				// -- This could be a problem with rules. The person creating a rule can assign recipients individually but
				// -- if a user doesn't have access to one of the items you cannot add them. So the list of potential users
				// -- needs to only include those with access to both or all object. See it gets even more complicated when
				// -- you consider that you can have multiples on each side.
				const activityAuthUsers = await activityModel.getActivityAuthorizedUsers(job.notification.activityId);
				logger.info(
					"subscribe-callback",
					`Authorized users for activity (${job.notification.activityId}): ${JSON.stringify(
						activityAuthUsers
					)}`
				);

				//logger.info("startQueueMonitor", "Authorized users for notification:", { users: activityAuthUsers });

				let recipients = [];
				let emailRecipients = [];
				let pushNotificationRecipients = [];
				const recipientPriority = {};
				for (let i = 0; i < to.length; i++) {
					const recipient = to[i];
					const recipientToken = recipient.token;
					const keyVal = recipientToken.split(":");
					switch (keyVal[0].toLowerCase()) {
						case "organization": {
							const orgUsers = await orgModel.getOrgUsers(keyVal[1]);
							const authOrgUsers = orgUsers.filter((user) => activityAuthUsers.includes(user.id));
							if (recipient.system) {
								recipients = recipients.concat(
									authOrgUsers.map(function (user) {
										recipientPriority[user.id] = recipient.isPriority || false;
										return user.id;
									})
								);
							}
							if (recipient.email) {
								emailRecipients = emailRecipients.concat(
									authOrgUsers.map(function (user) {
										return user.email;
									})
								);
							}
							if (recipient.pushNotification) {
								authOrgUsers.forEach((user) => {
									const deviceKeys = userDeviceCache[user.id]
										? Object.keys(userDeviceCache[user.id])
										: [];
									deviceKeys.forEach((key) => {
										if (userDeviceCache[user.id][key].token) {
											pushNotificationRecipients.push(userDeviceCache[user.id][key].token);
										}
									});
								});
							}
							break;
						}
						case "user":
							if (!activityAuthUsers.includes(keyVal[1])) {
								break;
							}
							if (recipient.system) {
								recipients.push(keyVal[1]);
								recipientPriority[keyVal[1]] = recipient.isPriority;
							}
							if (recipient.email) {
								const cachedUser = await userCache.get(keyVal[1]);
								if (cachedUser.email) {
									emailRecipients.push(cachedUser.email);
								}
							}

							if (recipient.push) {
								// We need each device belonging to given user
								const cachedDevices = userDeviceCache[keyVal[1]];
								if (cachedDevices) {
									const deviceIds = Object.keys(cachedDevices);
									deviceIds.forEach((id) => {
										pushNotificationRecipients.push(cachedDevices[id].token);
									});
								}
							}
							break;
					}
				}

				// remove any duplicate recipients
				recipients = recipients.filter(function (value, index, self) {
					return self.indexOf(value) === index;
				});

				emailRecipients = emailRecipients.filter(function (value, index, self) {
					return self.indexOf(value) === index;
				});

				pushNotificationRecipients = pushNotificationRecipients.filter(function (value, index, self) {
					return self.indexOf(value) === index;
				});

				// for non priority remove user if actor ( receive no notifications for things you do )
				if (actor.type === "user") {
					recipients = recipients.filter((id) => {
						return id !== actor.id ? true : recipientPriority[id];
					});

					emailRecipients = emailRecipients.filter((id) => {
						return id !== actor.id;
					});

					pushNotificationRecipients = pushNotificationRecipients.filter((id) => {
						const userTokens = userDeviceCache[actor.id] ? Object.keys(userDeviceCache[actor.id]) : [];
						return !userTokens.includes(id);
					});
				}

				// -- todo: process user notification exclusions

				// bulk insert notifications
				// -- include message so won't have to join on activity for stream
				notifications = recipients.map(function (userId) {
					return {
						userId: userId,
						activityId: job.notification.activityId,
						message: job.notification.summary,
						createdDate: new Date(),
						lastModifiedDate: new Date(),
						isPriority: recipientPriority[userId],
						viewed: false,
						closed: false,
						escalationEvent: job.notification.escalationEvent,
						audioSettings: job.notification.audioSettings,
						dismissId: job.notification.dismissId
					};
				});
				if (emailRecipients.length > 0) {
					const templateData = {
						message: job.notification.summary,
						// changed from notificationUrl -> generic url prop
						url: process.env.BASE_INSTALLATION_ADDRESS + "/login",
						translations: translations
					};
					emailRecipients.forEach(async (recipient) => {
						const user = await userModel.userExists(recipient);
						const userId = user.id;
						const ruleId = job.notification.dismissId.split("_")[0];

						if (userId && ruleId) {
							const token = JWT.sign({ userId, ruleId }, "un-subscribe");
							templateData["unsub"] = process.env.BASE_INSTALLATION_ADDRESS + `/rules-app/#/unsubscribe?token=${token}`;
						}

						logger.info(
							"subscribe-callback",
							`Queueing email to ${recipient} for notification: ${JSON.stringify(job.notification)}`
						);
						emailProvider.queueEmail(
							"systemNotification",
							config.environment.fromEmail,
							recipient,
							templateData
						);
						_health.metrics.generated.email++;
					});
					processResult["queueEmailNotifications"] = {
						to: emailRecipients,
						data: templateData
					};
				} else {
					processResult["queueEmailNotifications"] = "No email recipients for this notification";
				}

				if (pushNotificationRecipients.length > 0) {
					const payload = {
						notification: {
							title: job.system ? "Watch Rule Violation" : "System Notification",
							body: job.notification.summary
						}
					};
					logger.info(
						"subscribe-callback",
						`Queueing push notification to ${JSON.stringify(
							pushNotificationRecipients
						)} for notification: ${JSON.stringify(job.notification)}`
					);
					pushNotificationProvider.queuePushNotification(pushNotificationRecipients, payload);
					_health.metrics.generated.push += pushNotificationRecipients.length;
					processResult["queuepushNotificationNotifications"] = {
						to: pushNotificationRecipients,
						payload: payload
					};
				} else {
					processResult["queuepushNotificationNotifications"] =
						"No pushNotification recipients for this notification";
				}

				if (notifications.length > 0) {
					logger.info(
						"subscribe-callback",
						`Inserting system notifications: ${JSON.stringify(notifications)}`
					);
					_health.metrics.generated.system += notifications.length;
					processResult["insertSystemNotifications"] = await notificationModel.bulkInsert(notifications);
				} else {
					processResult["insertSystemNotifications"] = {
						result: "no intended recipients"
					};
				}
			} else {
				processResult = {
					result: "to field empty, no intended recipients"
				};
			}

			_health.metrics.successCount++;
			job.success(processResult);
		} catch (err) {
			_health.metrics.errorCount++;
			job.fail({ errMessage: err.message, errStack: err.stack });
			logger.error(
				"subscribe-callback",
				`Error processing notification job for activity (${job.notification.activityId}).`,
				{ err: { message: err.message, stack: err.stack } }
			);
		}
	});
}
