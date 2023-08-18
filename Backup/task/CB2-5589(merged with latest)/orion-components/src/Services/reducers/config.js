const initialState = {};

const config = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "CLIENT_CONFIG_RECEIVED": {
			return payload;
		}
		default:
			return state;
	}
};

export default config;
