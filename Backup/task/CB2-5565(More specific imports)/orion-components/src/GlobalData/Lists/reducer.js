const initialState = {};

const lookupData = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {

		case "LOOKUP_DATA_RECEIVED": {
			const { values, lookupType } = payload;
			return {
				...state,
				[lookupType]: values
			};
		}

		default:
			return state;
	}
};

export default lookupData;
