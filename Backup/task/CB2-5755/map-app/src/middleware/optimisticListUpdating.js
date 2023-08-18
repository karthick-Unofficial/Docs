// Redux middleware allowing optimistic switchboard (permission toggler) actions

import { BEGIN, COMMIT, REVERT } from "redux-optimist";
import { listService } from "client-app-core";

let nextTransactionId = 1;
const optimisticListUpdating = (store) => (next) => (action) => {
	// Adding a serializable transactionId to every action so optimist can keep track of where it needs to commit/revert
	// This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect
	if (!action.transactionId && !action.optimist) {
		action = Object.assign({}, action, {
			transactionId: nextTransactionId++
		});
	}

	if (action.type === "UPDATE_LIST_CHECKBOX") {
		next({
			...action,
			optimist: { type: BEGIN, id: action.transactionId }
		});

		listService.updateList(
			action.payload.listId,
			action.payload.list,
			(err, response) => {
				if (err) {
					console.log(err);
					next({
						type: "UPDATE_LIST_CHECKBOX_FAILED",
						error: err,
						optimist: { type: REVERT, id: action.transactionId }
					});
				} else {
					next({
						type: "UPDATE_LIST_CHECKBOX_COMPLETE",
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

export default optimisticListUpdating;
