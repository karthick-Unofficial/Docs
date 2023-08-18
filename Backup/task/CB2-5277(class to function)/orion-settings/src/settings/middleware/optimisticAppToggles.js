// Redux middleware allowing optimistic switchboard (permission toggler) actions

import { BEGIN, COMMIT, REVERT } from "redux-optimist";
import { userService, organizationService } from "client-app-core";

let nextTransactionId = 1;

const optimisticAppToggles = store => next => action => {
	// Adding a serialisable transactionId to every action so optimist can keep track of where it needs to commit/revert
	// This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect
	if (!action.transactionId && !action.optimist) {
		action = Object.assign({}, action, {
			transactionId: nextTransactionId++
		});
	}
	// if (action.type === 'UPDATE_APP') {
	//     next({
	//         ...action,
	//         optimist: {type: BEGIN, id: action.transactionId}
	//     });

	//     userService.updateApplication(action.userId, action.app.appId, action.app.config, (err, response) => {
	//         if (err) {
	//             console.log(err);
	//             next({
	//                 type: 'UPDATE_APP_FAILED',
	//                 id: action.notificationId,
	//                 error: err,
	//                 optimist: {type: REVERT, id: action.transactionId}
	//             });
	//         }
	//         else {
	//             next({
	//                 type: 'UPDATE_APP_COMPLETE',
	//                 id: action.notificationId,
	//                 response: response,
	//                 optimist: {type: COMMIT, id: action.transactionId}
	//             })
	//         }
	//     })
	// } else if (action.type === 'UPDATE_INTEGRATION') {
	//     next({
	//         ...action,
	//         optimist: {type: BEGIN, id: action.transactionId}
	//     });

	//     userService.updateIntegration(action.userId, action.integration.feedId, action.integration.config, (err, response) => {
	//         if (err) {
	//             console.log(err);
	//             next({
	//                 type: 'UPDATE_INTEGRATION_FAILED',
	//                 id: action.notificationId,
	//                 error: err,
	//                 optimist: {type: REVERT, id: action.transactionId}
	//             });
	//         }
	//         else {
	//             next({
	//                 type: 'UPDATE_INTEGRATION_COMPLETE',
	//                 id: action.notificationId,
	//                 response: response,
	//                 optimist: {type: COMMIT, id: action.transactionId}
	//             })
	//         }
	//     })
	if (action.type === "ADD_APPLICATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		userService.addApplication(
			action.userId,
			action.appId,
			action.config,
			(err, result) => {
				if (err) {
					console.log(err);
					next({
						type: "ADD_APPLICATION_FAILED",
						id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "ADD_APPLICATION_COMPLETE",
						id: action.notificationId,
						response: result,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else if (action.type === "UPDATE_INTEGRATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});
		userService.updateIntegration(
			action.userId,
			action.feedId,
			action.config,
			action.orgIntId,
			(err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "UPDATE_INTEGRATION_FAILED",
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "UPDATE_INTEGRATION_COMPLETE",
						response: response,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else if (action.type === "REMOVE_APPLICATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		userService.removeApplication(
			action.userId,
			action.appId,
			(err, result) => {
				if (err) {
					console.log(err);
					next({
						type: "REMOVE_APPLICATION_FAILED",
						id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "REMOVE_APPLICATION_COMPLETE",
						id: action.notificationId,
						response: result,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
		// change on of these to update
	} else if (action.type === "ADD_INTEGRATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});
		// call update in client-app-core userSerivce
		userService.addIntegration(
			action.userId,
			action.integration.feedId,
			action.config,
			(err, result) => {
				if (err) {
					console.log(err);
					next({
						type: "ADD_INTEGRATION_FAILED",
						// id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "ADD_INTEGRATION_COMPLETE",
						// id: action.notificationId,
						response: result,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else if (action.type === "REMOVE_INTEGRATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		userService.removeIntegration(
			action.userId,
			action.feedId,
			(err, result) => {
				if (err) {
					console.log(err);
					next({
						type: "REMOVE_INTEGRATION_FAILED",
						id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					console.log("REMOVE INTEGRATION COMPLETE");
					next({
						type: "REMOVE_INTEGRATION_COMPLETE",
						id: action.notificationId,
						response: result,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else if (action.type === "ASSIGN_APP") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		organizationService.assignApps(
			action.orgId,
			[action.app],
			(err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "ASSIGN_APP_FAILED",
						id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "ASSIGN_APP_COMPLETE",
						id: action.notificationId,
						response: response,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else if (action.type === "ASSIGN_INTEGRATION") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		organizationService.assignIntegrations(
			action.orgId,
			[action.integration],
			(err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "ASSIGN_INTEGRATION_FAILED",
						id: action.notificationId,
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "ASSIGN_INTEGRATION_COMPLETE",
						id: action.notificationId,
						response: response,
						optimist: { type: COMMIT, id: action.transactionId }
					});
				}
			}
		);
	} else {
		return next(action);
	}
};

export default optimisticAppToggles;
