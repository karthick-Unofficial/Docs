import _ from "lodash";

const initialMapState = {
	visible: false,
	entities: {},
	mapObject: null,
	distanceToolActive: false,
	offset: 0,
	inEditGeo: null
};

const mapRef = (state = initialMapState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "TOGGLE_MAP_VISIBLE": {
			return {
				...state,
				visible: !state.visible
			};
		}

		case "TOGGLE_DISTANCE_TOOL": {
			return {
				...state,
				distanceToolActive: !state.distanceToolActive
			};
		}

		case "SET_MAP_REFERENCE": {
			const { map } = payload;
			return {
				...state,
				mapObject: map
			};
		}

		case "SET_MAP_ENTITIES": {
			const { update } = payload;
			return {
				...state,
				entities: { ...state.entities, ...update }
			};
		}

		case "CLEAR_MAP_REFERENCE": {
			return {
				...state,
				visible: false,
				entities: {},
				mapObject: null,
				distanceToolActive: false,
				offset: 0,
				inEditGeo: null
			};
		}

		case "SET_MAP_OFFSET": {
			const { offset } = payload;

			return {
				...state,
				offset: state.offset + offset
			};
		}

		case "SET_IN_EDIT_GEO": {
			const { geo } = payload;

			return {
				...state,
				inEditGeo: geo
			};
		}

		default:
			return state;
	}
};

export default mapRef;
