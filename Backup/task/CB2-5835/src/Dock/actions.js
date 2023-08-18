import * as t from "./actionTypes.js";

import { userService } from "client-app-core";

import { startNotificationStream } from "./Notifications/actions";
import { getAllCameras } from "./Cameras/actions";
export { logOut, confirmFirstUse } from "../Session/Actions";

// userAppState methods for camera dock. May be used for more in the future.
export const appStateReceived = (userAppState) => {
	return {
		type: t.DOCK_APP_STATE_RECEIVED,
		payload: userAppState
	};
};

export const getAppState = () => {
	return (dispatch) => {
		const app = "alert-sidebar";
		return new Promise((resolve) => {
			userService.getAppState(app, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(appStateReceived(result.state));
					resolve();
				}
			});
		});
	};
};

export const setAppState = (keyVal) => {
	return () => {
		const app = "alert-sidebar";
		userService.setAppState(app, keyVal, (err, result) => {
			if (err) {
				console.log(err, result);
			}
		});
	};
};

export function setTab(tab) {
	return {
		type: t.SET_ALERTS_TAB,
		tab
	};
}

export function toggleWavCam() {
	return {
		type: t.TOGGLE_WAV_CAM
	};
}

export function toggleOpen() {
	return {
		type: t.TOGGLE_OPEN
	};
}

//TODO:
export const newNotificationAlert = (notification) => {
	return {
		type: t.SHOW_ALERT,
		notification: notification
	};
};

export const clearNotification = (notificationId) => {
	return {
		type: t.HIDE_ALERT,
		notificationId
	};
};

export function subscribeAll() {
	return (dispatch) => {
		dispatch(startNotificationStream());
		dispatch(getAllCameras());
	};
}

// Generate user feedback notifications
export function createUserFeedback(message, undoFunc) {
	return function (dispatch) {
		const payload = {
			id: message,
			feedback: true,
			summary: message,
			createdDate: new Date(),
			undoFunc
		};

		dispatch(newNotificationAlert(payload));
	};
}
