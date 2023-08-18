const initialState = [];

const results = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "SEARCH_RESULTS_RECEIVED":
			return payload.results;
		case "SEARCH_FORM_RESET":
		case "SAVED_SEARCH_CLEARED":
			return initialState;
		default:
			return state;
	}
};

export default results;
