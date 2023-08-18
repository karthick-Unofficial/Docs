// custom middleware for optimist redux

// NOTE: redux-optimist docs recommend a general 'status' reducer with a 'writing' flag and a error
// property to hold errors for failed actions. Not being used atm because I don't see the need.

import {BEGIN, COMMIT, REVERT} from "redux-optimist";
import { notificationService } from "client-app-core";

let nextTransactionID = 1;
const optimistMiddleware = store => next => action => {

// Adding a serialisable transactionId to every action so optimist can keep track of where it needs to commit/revert
// This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect

	if (!action) {
		console.error("optimistMiddleware received an action that was not defined. Action would have been assigned transaction ID: ", nextTransactionID);
	} else {
		if (!action.transactionId && !action.optimist) {
			action = Object.assign({}, action, {
				transactionId: nextTransactionID++
			});
		}
	

		if (action.type === "CLOSE_NOTIFICATION") {

			next({
				...action,
				optimist: {type: BEGIN, id: action.transactionId}
			});

			notificationService.closeNotification(action.notificationId, (err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "CLOSE_NOTIFICATION_FAILED",
						notificationId: action.notificationId,
						notification: action.notification,
						error: err,
						optimist: {type: REVERT, id: action.transactionId}
					});
				} else {
					next({
						type: "CLOSE_NOTIFICATION_COMPLETE",
						notificationId: action.notificationId,
						notification: action.notification,
						response: response,
						optimist: {type: COMMIT, id: action.transactionId}
					});
				}
			});
		} else if (action.type === "CLOSE_NOTIFICATIONS") {

			next({
				...action,
				optimist: {type: BEGIN, id: action.transactionId}
			});

			notificationService.closeBulkNotifications(action.notificationIds, (err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "CLOSE_NOTIFICATIONS_FAILED",
						notifications: action.notifications,
						notificationIds: action.notificationIds,
						error: err,
						optimist: {type: REVERT, id: action.transactionId}
					});
				} else {
					next({
						type: "CLOSE_NOTIFICATIONS_COMPLETE",
						notifications: action.notifications,
						notificationIds: action.notificationIds,
						response: response,
						optimist: {type: COMMIT, id: action.transactionId}
					});
				}
			});
		} else if (action.type === "REOPEN_NOTIFICATION") {

			next({
				...action,
				optimist: {type: BEGIN, id: action.transactionId}
			});

			notificationService.reopenNotification(action.notificationId, (err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "REOPEN_NOTIFICATION_FAILED",
						notificationId: action.notificationId,
						notification: action.notification,
						error: err,
						optimist: {type: REVERT, id: action.transactionId}
					});
				} else {
					next({
						type: "REOPEN_NOTIFICATION_COMPLETE",
						notificationId: action.notificationId,
						notification: action.notification,
						response: response,
						optimist: {type: COMMIT, id: action.transactionId}
					});
				}
			});
		} else if (action.type === "REOPEN_NOTIFICATIONS") {

			next({
				...action,
				optimist: {type: BEGIN, id: action.transactionId}
			});

			notificationService.reopenBulkNotifications(action.notificationIds, (err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "REOPEN_NOTIFICATIONS_FAILED",
						notifications: action.notifications,
						notificationIds: action.notificationIds,
						error: err,
						optimist: {type: REVERT, id: action.transactionId}
					});
				} else {
					next({
						type: "REOPEN_NOTIFICATIONS_COMPLETE",
						notifications: action.notifications,
						notificationIds: action.notificationIds,
						response: response,
						optimist: {type: COMMIT, id: action.transactionId}
					});
				}
			});
		} else {
			return next(action);
		}
	}
};


export default optimistMiddleware;