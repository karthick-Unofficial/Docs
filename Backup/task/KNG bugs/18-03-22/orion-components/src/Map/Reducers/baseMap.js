const initialState = {
	mapRef: null,
	visible: false
};

const baseMap = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "TOGGLE_MAP_VISIBLE":
			return {
				...state,
				visible: !state.visible
			};
		case "SET_MAP_REFERENCE": {
			const { map } = payload;
			return {
				...state,
				mapRef: map
			};
		}
		case "CLEAR_MAP_REFERENCE": {
			return {
				...state,
				visible: false,
				mapRef: null
			};
		}
		default:
			return state;
	}
};

export default baseMap;
