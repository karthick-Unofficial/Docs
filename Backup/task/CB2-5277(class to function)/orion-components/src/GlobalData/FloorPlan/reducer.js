import _ from "lodash";

const initialFloorPlanState = {};

const floorPlan = (state = initialFloorPlanState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "GET_ALL_FLOORPLANS": {

			const floorPlans = _.keyBy(payload, "id");
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
