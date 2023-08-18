import { browserHistory } from "react-router";
import { routes as r } from "../routes.js";
import { setLoading } from "orion-components/AppState/Actions";
import { userService } from "client-app-core";

import * as t from "../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const passwordChangeMetric = new Metric("PASSWORD_CHANGE_METRIC");

export function isSubmittingPassword() {
	return dispatch => {
		dispatch(setLoading("changePassword", true));
	};
}

export function passwordChangeSuccess() {
	passwordChangeMetric.end();
	logMetric(passwordChangeMetric);
	return {
		type: t.PASSWORD_CHANGE_SUCCESS
	};
}

export function passwordChangeError(message) {
	return {
		message,
		type: t.PASSWORD_CHANGE_ERROR
	};
}

export function clearPasswordState() {
	return {
		type: t.CLEAR_PASSWORD_STATE
	};
}

export function changePassword(userId, currentPassword, newPassword) {
	return dispatch => {
		passwordChangeMetric.start();

		dispatch(isSubmittingPassword());
		userService.changePassword(
			userId,
			currentPassword,
			newPassword,
			false,	// adminChange
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
					if (err.response.status === 401) {
						const message = "The current password provided is incorrect.";
						dispatch(passwordChangeError(message));
					}
					return;
				}
				const { success, reason } = response;
				if (success === false) {
					let errorMessage = "Failed to change password";
					if (reason) {
						const { message } = reason;
						errorMessage = message;
					}
					dispatch(passwordChangeError(errorMessage));
					return;
				}
				dispatch(passwordChangeSuccess());
				browserHistory.push(r.MY_ACCOUNT);
			}
		);
		dispatch(setLoading("changePassword", false));
	};
}
