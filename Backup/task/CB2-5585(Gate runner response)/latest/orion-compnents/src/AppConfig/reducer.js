const initialState = {
	zoom: 3,
	bearing: 0,
	center: [-98.2015, 39.4346]
};

const appConfig = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "APP_CONFIG_RECEIVED": {
			const { config } = payload;
			return {
				...state,
				...config
			};
		}
		default:
			return state;
	}
};

export default appConfig;
