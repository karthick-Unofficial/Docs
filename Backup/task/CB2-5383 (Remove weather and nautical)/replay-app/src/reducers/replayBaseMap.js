const initialState = {
	mapRef: null,
	visible: false
};

const replayBaseMap = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "TOGGLE_REPLAY_MAP_VISIBLE":
			return {
				...state,
				visible: !state.visible
			};
		case "SET_REPLAY_MAP_REFERENCE": {
			const { map } = payload;
			return {
				...state,
				mapRef: map
			};
		}
		default:
			return state;
	}
};

export default replayBaseMap;