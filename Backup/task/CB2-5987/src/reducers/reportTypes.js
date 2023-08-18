export const initialState = {};

const reportTypes = (state = initialState, action) => {
	switch (action.type) {
		case "REPORT_TYPES_RECEIVED": {
			return {
				...state,
				...action.payload
			};
		}

		default:
			return state;
	}
};

export default reportTypes;
