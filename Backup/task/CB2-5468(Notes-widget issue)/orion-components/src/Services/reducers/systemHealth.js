const initialState = {
	health: {},
	hasHealthError: false,
	hasApiError: false
};

const systemHealth = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SYSTEM_HEALTH_RECEIVED": {
			const hasError = Object.keys(payload).find(key => {
				const data = payload[key];
				return data.error === true;
			});
			return {
				...state,
				health: payload,
				hasHealthError: !!hasError,
				hasApiError: false
			};
		}

		case "SYSTEM_HEALTH_ERROR": {
			return {
				...state,
				hasApiError: true
			};
		}
        
		default:
			return state;
	}
};

export default systemHealth;