let nextTransactionId = 1;
const logger = (store) => (next) => (action) => {
	// Adding a serializable transactionId to every action so optimist can keep track of where it needs to commit/revert
	// This needs to be included in every optimist middleware for redundancy, only the first in the middleware chain will take effect
	if (!action.transactionId && !action.optimist) {
		action = Object.assign({}, action, {
			transactionId: nextTransactionId++
		});
	}

	console.log(
		"                                ACTION",
		action.transactionId,
		action.type
	);
	console.log("                                                 ", action);
	const result = next(action);
	console.log(
		"                                      next state:",
		store.getState()
	);
	console.log("");
	return result;
};

export default logger;
