const initialState = {
	image: null,
	coordinates: null,
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
			const coordinates =
				floorPlan && floorPlan.geometry && floorPlan.geometry.coordinates
					? floorPlan.geometry.coordinates[0]
					: [];
			return {
				...state,
				coordinates: [...coordinates],
				selectedFloor: floorPlan
			};
		}
		case "FLOORPLAN_REMOVE": {
			const { floorPlanId } = payload;
			if (floorPlanId === state.selectedFloor.id) {
				return {
					image: null,
					coordinates: null,
					selectedFloor: null
				};
			}
			return state;
		}
		default:
			return state;
	}
};

export default floorPlan;
