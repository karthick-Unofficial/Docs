const initialState = {};

const ssrRadarTiles = (state = initialState, action) => {
	const {
		type,
		payload
	} = action;
	switch (type) {
		case "ADD_TILE": {
			const { data } = payload;
			return {
				...state,
				[data.tileId]: data
			};
		}
		case "CLEAR_TILES": {
			return {};
		}
		default:
			return state;
	}
};

export default ssrRadarTiles;
