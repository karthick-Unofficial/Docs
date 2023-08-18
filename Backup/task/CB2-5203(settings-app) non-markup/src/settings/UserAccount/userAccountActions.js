import { browserHistory } from "react-router";
import { routes as r } from "../routes.js";

import { userService } from "client-app-core";
import { setLoading, openDialog, closeDialog } from "orion-components/AppState/Actions";
export { updateGlobalUserAppSettings } from "orion-components/AppState/Actions";
export { setLocaleWithFallback } from "orion-components/i18n/Actions";
import * as t from "../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = (metric) => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const fetchProfileMetric = new Metric("FETCH_PROFILE_METRIC");
const deleteUserMetric = new Metric("DELETE_USER_METRIC");


// Also used in OrgProfile
export const openConfirmDialog = () => {
	return dispatch => {
		dispatch(openDialog("confirmDialog"));
	};
};

// Also used in OrgProfile
export const closeConfirmDialog = () => {
	return dispatch => {
		dispatch(closeDialog("confirmDialog"));
	};
};

export const fetchProfileSuccess = (user) => {
	fetchProfileMetric.end();
	logMetric(fetchProfileMetric);
	return {
		type: t.FETCH_PROFILE_SUCCESS,
		user
	};
};

export const fetchUserProfile = (username) => {

	return dispatch => {
		fetchProfileMetric.start();
		dispatch(setLoading("userProfile", true));
		userService.getProfile(username, (err, response) => {
			if (err) {
				// dispatch error action
				console.log(err);
				// Once handleError dispatches an action, uncomment
				// dispatch(handleError(err));
			}
			else {
				const user = Object.assign({}, response.user, { org: response.org });
				dispatch(fetchProfileSuccess(user));
			}
		});
		dispatch(setLoading("userProfile", false));
	};
};

export const deleteUserSuccess = () => {
	deleteUserMetric.end();
	logMetric(deleteUserMetric);
	return {
		type: t.DELETE_USER_SUCCESS
	};
};

export const deleteUserProfile = (id) => {
	return dispatch => {
		deleteUserMetric.start();
		userService.deleteUser(id, (err, response) => {
			if (err) {
				// dispatch error action
				console.log(err);
				// Once handleError dispatches an action, uncomment
				// dispatch(handleError(err));
			}
			else {
				dispatch(deleteUserSuccess());
				dispatch(closeDialog("confirmDialog"));
				browserHistory.replace(r.SETTINGS + "my-organization");
			}
		});
	};
};


