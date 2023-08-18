import _ from "lodash";
const initialState = {};

const floorPlans = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "FLOOR_PLANS_SET": {
			const { floorPlans } = payload;
			const newFloorPlans = floorPlans.reduce((floorPlans = {}, floor) => {
				floorPlans[floor.id] = floor;
				return floorPlans;
			}, {});
			return newFloorPlans;
		}
		case "FLOOR_PLAN_ADD":
		case "FLOOR_PLAN_EDIT": {
			const { floorPlan } = payload;
			return {
				...state,
				[floorPlan.id]: floorPlan
			};
		}
		case "FLOOR_PLAN_REMOVE": {
			const { floorPlanId } = payload;
			const floorPlansClone = _.cloneDeep(state);
			if (floorPlansClone[floorPlanId]) {
				delete floorPlansClone[floorPlanId];
			}
			return floorPlansClone;
		}
		default:
			return state;
	}
};

export default floorPlans;
