const initialState = {
	image: null,
	coordinates: null,
	creating: false,
	preLoaded: false,
	selectedFloor: null
};

const floorPlan = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_PRELOADED": {
			return {
				...state,
				preLoaded: true
			};
		}
		case "CREATING_FLOORPLAN": {
			return {
				...state,
				coordinates: null,
				creating: !state.creating
			};
		}
		case "IMAGE_ADD": {
			const { image } = payload;
			return {
				...state,
				image
			};
		}
		case "FLOOR_PLAN_CLEAR":
		case "FLOOR_PLAN_REMOVE":
			return {
				...state,
				image: null,
				coordinates: null,
				selectedFloor: null
			};
		case "COORDINATES_SET": {
			const { coordinates } = payload;
			return {
				...state,
				coordinates: coordinates.length < 5
					? [...coordinates, coordinates[0]]
					: [...coordinates]
			};
		}
		case "CLEAR_IMAGE": {
			return {
				...state,
				image: null
			};
		}
		case "FLOOR_PLAN_SELECT": {
			const { floorPlan } = payload;
			const coordinates = floorPlan && floorPlan.geometry && floorPlan.geometry.coordinates ?
				floorPlan.geometry.coordinates[0] : [];
			return {
				...state,
				coordinates: coordinates.length < 5
					? [...coordinates, coordinates[0]]
					: [...coordinates],
				selectedFloor: floorPlan
			};
		}
		default:
			return state;
	}
};

export default floorPlan;
