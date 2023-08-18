import _ from "lodash";

const initialMapState = {
	visible: false,
	entities: {},
	mapObject: null,
	offset: 0
};

const replayMapRef = (state = initialMapState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "TOGGLE_REPLAY_MAP_VISIBLE": {
			return {
				...state,
				visible: !state.visible
			};
		}

		case "SET_REPLAY_MAP_REFERENCE": {
			const { map } = payload;
			return {
				...state,
				mapObject: map
			};
		}

		case "SET_REPLAY_MAP_ENTITIES": {
			const { update } = payload;
			return {
				...state,
				entities: { ...state.entities, ...update }
			};
		}

		case "SET_REPLAY_MAP_OFFSET": {
			const { offset } = payload;

			return {
				...state,
				offset: state.offset + offset
			};
		}

		default:
			return state;
	}
};

export default replayMapRef;
