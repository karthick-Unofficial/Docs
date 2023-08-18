import keyBy from "lodash/keyBy";

const initialFloorPlanState = {};

const floorPlan = (state = initialFloorPlanState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "GET_ALL_FLOORPLANS": {
			const floorPlans = keyBy(payload, "id");
			return {
				...state,
				floorPlans
			};
		}

		default:
			return state;
	}
};

export default floorPlan;
