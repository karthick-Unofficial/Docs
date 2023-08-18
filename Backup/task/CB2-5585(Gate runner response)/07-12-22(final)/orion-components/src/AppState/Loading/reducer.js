const initialLoadingState = {};

const loading = (state = initialLoadingState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "TOGGLE_LOADING": {
			const { component } = payload;
			return {
				...state,
				[`${component}Loading`]: !state[`${component}Loading`]
			};
		}

		case "SET_LOADING": {
			const { component, loading } = payload;
			return {
				...state,
				[`${component}Loading`]: loading
			};
		}
		default:
			return state;
	}
};

export default loading;
