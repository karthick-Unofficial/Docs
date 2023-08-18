import * as t from "./actionTypes";
import { clearFloorPlan } from "../../DrawingPanel/FloorPlanForm/floorPlanFormActions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";

export { startAttachmentStream } from "orion-components/ContextualData/Actions";

export const selectFloorPlan = (floorPlan) => {
	return {
		type: t.FLOOR_PLAN_SELECT,
		payload: { floorPlan }
	};
};

export const setFloorPlans = (floorPlans) => {
	return {
		type: t.FLOOR_PLANS_SET,
		payload: { floorPlans }
	};
};

export const ignoreFacility = (facility, appData) => {
	return (dispatch) => {
		dispatch(ignoreEntity(facility.id, "facility", facility.feedId, appData));
		dispatch(clearFloorPlan());
	};
};
