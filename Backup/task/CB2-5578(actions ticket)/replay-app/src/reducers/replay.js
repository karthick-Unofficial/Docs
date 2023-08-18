const initialState = {
	allTransactions: [],
	timeTransactions: {},
	alerts: {},
	playBarAlerts: {},
	error:null
};

const replay = (state = initialState, action) => {
	const {
		type,
		payload
	} = action;
	switch (type) {
		case "TRANSACTIONS_RECEIVED": {
			const {
				allTransactions,
				timeTransactions
			} = payload;

			return {
				...state,
				allTransactions,
				timeTransactions
			};
		}
		case "ALERTS_RECEIVED": {
			const {
				alerts
			} = payload;

			return {
				...state,
				alerts
			};
		}
		case "PLAYBAR_ALERTS_RECEIVED": {
			const {
				playBarAlerts
			} = payload;

			return {
				...state,
				playBarAlerts
			};
		}
		case "TRANSACTION_ERROR": {
			const {
				error
			} = payload;			
			return {
				...state,
				error
			};
		}
		default:
			return state;
	}
};

export default replay;