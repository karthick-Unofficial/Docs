export const initialState = {
	enabled: false
};

const sharingTokens = (state = initialState, action) => {
	switch (action.type) {
		case "SHARING_TOKEN_STATUS_RECEIVED":
			return {
				...state,
				enabled: action.payload
			};
		default:
			return state;
	}
};

export default sharingTokens;