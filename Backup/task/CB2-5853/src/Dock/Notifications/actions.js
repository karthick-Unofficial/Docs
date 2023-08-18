import { notificationService } from "client-app-core";
import * as t from "./actionTypes.js";
export { removeDockedCameraAndState } from "orion-components/Dock/Actions/index.js";

// import { newNotificationAlert } from "../actions";

export function startNotificationStream() {
	return function (dispatch) {
		notificationService.streamMyActiveNotifications(function (err, response) {
			if (err) {
				console.log(err);
			} else {
				switch (response.type) {
					case "initial-batch": {
						const notifications = response.changes.map((item) => item.new_val);
						dispatch(initialNotificationsReceived(notifications));
						break;
					}
					case "change-batch": {
						const notifications = response.changes.map((item) => item.new_val);
						dispatch(notificationBatchReceived(notifications));
						break;
					}
					default:
				}
			}
		});
	};
}

export const initialNotificationsReceived = (notifications) => {
	return {
		notifications,
		type: t.INITIAL_NOTIFICATIONS_RECEIVED
	};
};

export const notificationBatchReceived = (notifications) => {
	return {
		notifications,
		type: t.NOTIFICATION_BATCH_RECEIVED
	};
};

export const getArchiveSuccess = (notifications) => {
	return {
		notifications,
		type: t.GET_ARCHIVE_SUCCESS
	};
};

export const getArchiveFailed = () => {
	return {
		type: t.GET_ARCHIVE_FAILED
	};
};

export const queryArchive = (page) => {
	return (dispatch) => {
		notificationService.getArchivedByPage(page, (err, response) => {
			if (err) {
				dispatch(getArchiveFailed());
				console.log(err);
			} else {
				dispatch(getArchiveSuccess(response));
			}
		});
	};
};

export const dumpArchive = () => {
	return {
		type: t.DUMP_ARCHIVE
	};
};

export const closeNotification = (notificationId) => {
	return {
		notificationId,
		type: t.CLOSE_NOTIFICATION
	};
};

export const closeBulkNotifications = (notificationIds) => {
	return {
		notificationIds,
		type: t.CLOSE_NOTIFICATIONS
	};
};

export const reopenNotification = (notification) => {
	return {
		notification,
		notificationId: notification.id,
		type: t.REOPEN_NOTIFICATION
	};
};

export const reopenBulkNotifications = (notifications) => {
	return {
		notifications,
		notificationIds: notifications.map((a) => a.id),
		type: t.REOPEN_NOTIFICATIONS
	};
};
