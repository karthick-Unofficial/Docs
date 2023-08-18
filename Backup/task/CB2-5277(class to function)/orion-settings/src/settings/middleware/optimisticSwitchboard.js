// Redux middleware allowing optimistic switchboard (permission toggler) actions

import {BEGIN, COMMIT, REVERT} from "redux-optimist";
import { userService } from "client-app-core";

let nextTransactionId = 1;
const optimisticSwitchboard = store => next => action => {

	// Adding a serialisable transactionId to every action so optimist can keep track of where it needs to commit/revert
	// This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect
	if (!action.transactionId && !action.optimist) {
		action = Object.assign({}, action, {
			transactionId: nextTransactionId++
		});
	}


	if (action.type === "UPDATE_USER_PERMISSIONS") {
		next({
			...action,
			optimist: {type: BEGIN, id: action.transactionId}
		});

		userService.updateRole(action.id, action.update, (err, response) => {
			if (err) {
				console.log(err);
				next({
					type: "UPDATE_USER_PERMISSIONS_FAILED",
					error: err,
					optimist: {type: REVERT, id: action.transactionId}
				});
			} else {
				next({
					type: "UPDATE_USER_PERMISSIONS_COMPLETE",
					response: response,
					optimist: {type: COMMIT, id: action.transactionId}
				});
			}
		});
	} else if (action.type === "UPDATE_USER_ACTIVE") {
		next({
			...action,
			optimist: {type: BEGIN, id: action.transactionId}
		});

		userService.updateUser(action.userId, action.update, (err, response) => {
			if (err) {
				console.log(err);
				next({
					type: "UPDATE_USER_ACTIVE_FAILED",
					error: err,
					optimist: {type: REVERT, id: action.transactionId}
				});
			} else {
				next({
					type: "UPDATE_USER_ACTIVE_COMPLETE",
					response: response,
					optimist: {type: COMMIT, id: action.transactionId}
				});
			}
		});
	} else {

		return next(action);

	}
};

export default optimisticSwitchboard;