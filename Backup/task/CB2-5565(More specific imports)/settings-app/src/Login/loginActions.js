import { authService, applicationService } from "client-app-core";

import * as t from "../actionTypes";

import {
	routes as r
} from "../routes.js";
// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const loginRequestMetric = new Metric("LOGIN_REQUEST_METRIC");
const loginSuccessMetric = new Metric("LOGIN_SUCCESS_METRIC");
const resetRequestMetric = new Metric("RESET_REQUEST_METRIC");

function requestLogin(creds) {
	loginRequestMetric.end();
	logMetric(loginRequestMetric);
	return {
		type: t.LOGIN_REQUEST,
		isFetching: true,
		isAuthenticated: false
	};
}

function receiveLogin(tokenResult) {
	loginSuccessMetric.end();
	logMetric(loginSuccessMetric);
	return {
		type: t.LOGIN_SUCCESS,
		isFetching: false,
		isAuthenticated: true
	};
}

function loginError(errorMessage) {
	return {
		type: t.LOGIN_FAILURE,
		isFetching: false,
		isAuthenticated: false,
		errorMessage
	};
}

export const resetError = () => {
	return {
		type: t.RESET_ERROR
	};
};

export function loginUser(creds) {
	return dispatch => {
		loginRequestMetric.start();
		loginSuccessMetric.start();

		dispatch(requestLogin(creds));
		authService.login(creds.username, creds.password, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { success, reason } = response;
				if (success === false) {
					const { message } = reason;
					dispatch(loginError(message));
					return;
				}
				
				if (document.referrer && document.referrer.includes(window.location.hostname)) {
					window.location = document.referrer;
				} else {
					window.location = r.MY_ACCOUNT;
				}
			}
		});
	};
}

export function requestReset(username, navigate) {
	return dispatch => {
		resetRequestMetric.start();
		authService.requestReset(username, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { err } = response;
				if (err) {
					const { message } = err;
					dispatch(loginError(message));
					return;
				}
				navigate("/login/sent");
				resetRequestMetric.end();
				logMetric(resetRequestMetric);
			}
		});
	};
}

export function fetchVersionSuccess(version) {
	return {
		type: t.FETCH_VERSION_SUCCESS,
		version
	};
}

export function fetchAppVersion(app) {
	return dispatch => {
		applicationService.getApplicationVersion("ecosystem", (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(fetchVersionSuccess(response));
			}
		});
	};
}
