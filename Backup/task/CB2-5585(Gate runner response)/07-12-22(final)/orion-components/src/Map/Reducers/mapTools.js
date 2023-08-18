const initialState = {
	type: null, // drawing, spotlight, distance
	mode: null, // simple_select, direct_select, draw_${type}, spotlight_mode
	feature: null
};

const mapTools = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_MAP_TOOLS": {
			const { type = null, mode = null, feature = null } = payload;
			return {
				type,
				mode,
				feature
			};
		}
		case "UPDATE_CURRENT_FEATURE": {
			const { feature } = payload;
			return {
				...state,
				feature
			};
		}
		default:
			return state;
	}
};

export default mapTools;
