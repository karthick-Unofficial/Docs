const initialState = {
	image: null,
	coordinates: null,
	selectedFloors: {},
	selectedFloor: null
};

const floorPlan = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "IMAGE_ADD": {
			const { image } = payload;
			return {
				...state,
				image
			};
		}
		case "FLOOR_PLAN_CLEAR":
			return {
				image: null,
				coordinates: null,
				selectedFloor: null
			};
		case "COORDINATES_SET": {
			const { coordinates } = payload;
			return {
				...state,
				coordinates: [...coordinates]
			};
		}
		case "FLOOR_PLAN_SELECT": {
			const { floorPlan } = payload;
			return {
				...state,
				selectedFloor: floorPlan
			};
		}
		default:
			return state;
	}
};

export default floorPlan;
