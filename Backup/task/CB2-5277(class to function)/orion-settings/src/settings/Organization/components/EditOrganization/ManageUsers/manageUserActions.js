import * as t from "../../../../actionTypes";

import { browserHistory } from "react-router";
import { routes as r } from "../../../../routes.js";
import { userService } from "client-app-core";
import { setLoading } from "orion-components/AppState/Actions";
// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const createUserSuccessMetric = new Metric("CREATE_USER_SUCCESS_METRIC");

export const createUserSuccess = user => {
	createUserSuccessMetric.end();
	logMetric(createUserSuccessMetric);
	return {
		user,
		type: t.CREATE_USER_SUCCESS
	};
};

export const createUserError = message => {
	return {
		message,
		type: t.CREATE_USER_ERROR
	};
};

export const createNewUser = (user, initial = false) => {
	return dispatch => {
		createUserSuccessMetric.start();
		dispatch(setLoading("newUser", true));

		userService.createUser(user, (err, response) => {
			err = response.err ? response.err : "";
			if (err) {
				console.log(err);
				dispatch(createUserError(err.message));
			} else {
				// Tell state we're done and to redirect to the new user's profile
				user.id = response.newId;
				dispatch(createUserSuccess(user));
			}
		});
		dispatch(setLoading("newUser", false));
	};
};

// Associated call for this is in optimisticSwitchboard
export function updateUserActive(userId, update) {
	return {
		update,
		userId,
		type: t.UPDATE_USER_ACTIVE
	};
}

// Associated call for this is in optimisticSwitchboard
export function updateUserPermissions(update, id) {
	return {
		update,
		id,
		type: t.UPDATE_USER_PERMISSIONS
	};
}