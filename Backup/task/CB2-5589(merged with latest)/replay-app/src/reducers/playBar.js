const initialState = {
	playBarValue: 0,
	playing: false
};

const playBar = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_PLAYBAR_VALUE":
			return {
				...state,
				playBarValue: payload.playBarValue
			};
		case "CLEAR_PLAYBAR_VALUE":
			return {
				...state,
				playBarValue: 0
			};
		case "UPDATE_PLAYING":
			return {
				...state,
				playing: payload.playing
			};
		default:
			return state;
	}
};

export default playBar;
