const initialState = [];

const baseMaps = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "BASE_MAP_CONFIG_RECEIVED": {
			return payload;
		}
		default:
			return state;
	}
};

export default baseMaps;