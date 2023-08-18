const initialState = {};

const facilities = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "FACILITY_ADD": {
			const { facility } = payload;
			return { ...state, [facility.id]: facility };
		}

		default:
			return state;
	}
};

export default facilities;
