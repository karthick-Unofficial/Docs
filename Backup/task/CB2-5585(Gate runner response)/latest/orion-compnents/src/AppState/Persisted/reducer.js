const initialPersistedState = {};

const persisted = (state = initialPersistedState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "APP_STATE_RECEIVED": {
			const { appState } = payload;
			return {
				...state,
				...appState
			};
		}

		case "SET_LOCAL_APP_STATE": {
			const { key, value } = payload;
			return {
				...state,
				[key]: value
			};
		}

		default:
			return state;
	}
};

export default persisted;
