const initialGlobalState = {
	tts: {
		enabled: false,
		type: null
	},
	trackHistory: {
		duration: 30
	},
	unitsOfMeasurement: {
		coordinateSystem: "decimal-degrees",
		landUnitSystem: "imperial"
	}
};

const global = (state = initialGlobalState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "APP_SETTINGS_STATE_RECEIVED": {
			return {
				...state,
				...payload
			};
		}
		case "LOCAL_APP_SETTINGS_UPDATED": {
			return {
				...state,
				...payload
			};
		}
		default:
			return state;
	}
};

export default global;
