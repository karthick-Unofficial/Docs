import { systemNotificationService } from "client-app-core";
import * as t from "./actionTypes";

const systemNotificationsReceived = (data) => {
	return {
		type: t.SYSTEM_NOTIFICATIONS_RECEIVED,
		payload: data
	};
};

const systemNotificationAcknowledged = (notificationId) => {
	return {
		type: t.SYSTEM_NOTIFICATION_ACKNOWLEDGED,
		payload: {
			notificationId
		}
	};
};

const systemNotificationsCleared = () => {
	return {
		type: t.SYSTEM_NOTIFICATIONS_CLEARED
	};
};

let initialBatchRecieved = false;
export const subscribeToSystemNotifications = (userId) => {
	return dispatch => {
		systemNotificationService.subscribeByUser(userId, (err, res) => {
			if (err) console.log(err);
			if (!res) return;

			switch (res.type) {
				case "initial": {
					const notificationBatch = res.batch;

					if (!initialBatchRecieved) {
						initialBatchRecieved = true;

						// -- send through everything, including "interrupt = false"
						dispatch(systemNotificationsReceived(notificationBatch));
					}
					else {
						notificationBatch.forEach(notification => {
							// -- only send through "interrupt = true"
							if (notification.interrupt) {
								dispatch(systemNotificationsReceived([notification]));
							}
						});
					}
					break;
				}
				case "add": {
					const notification = res.new_val;

					// -- only send through "interrupt = true"
					if (notification.interrupt) {
						dispatch(systemNotificationsReceived([notification]));
					}
					break;
				}
				// -- I dont think change or remove will ever occur in our current setup - CD
				case "change":
				case "remove":
				default:
					console.log(`subscribeToSystemNotifications - Invalid type: ${res.type}`);
			}
		});
	};
};

export const acknowledgeSystemNotification = (notificationId) => {
	return dispatch => {
		systemNotificationService.acknowledgeSystemNotification(notificationId, (err, res) => {
			if (err) return console.log("acknowledgeSystemNotification - Error:", err);
			if (!res) return console.log(`acknowledgeSystemNotification - Error - No respsonse returned for notificationId: ${notificationId}`);
			if (res.success === false) return console.log(`acknowledgeSystemNotification - Unsuccessful: ${res.message}`);

			if (res.systemNotificationId) {
				dispatch(systemNotificationAcknowledged(res.systemNotificationId));
			}
			else {
				console.log("acknowledgeSystemNotification - Error: notificationId not found in response");
			}
		});
	};
};

// -- Remove all local systemNotifications (systemNotifications should already be ack'ed on the backend)
export const clearSystemNotifications = () => {
	return dispatch => {
		dispatch(systemNotificationsCleared());
	};
};