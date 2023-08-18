export const initialState = {};

const fieldData = (state = initialState, action) => {
	switch (action.type) {
		case "FIELD_DATA_RECEIVED": {
			const data = {
				[action.payload.name]: action.payload.data
			};

			return {
				...state,
				...data
			};
		}

		case "WIPE_FIELD_DATA": {
			return {
				...state,
				[action.payload.name]: []
			};
		}

		default:
			return state;
	}
};

export default fieldData;
