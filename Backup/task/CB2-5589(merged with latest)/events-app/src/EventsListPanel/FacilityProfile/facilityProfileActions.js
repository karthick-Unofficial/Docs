import * as t from "./actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";

export { startAttachmentStream } from "orion-components/ContextualData/Actions";

export const _selectFloorPlan = (floorPlan) => {
	return {
		type: t.FLOOR_PLAN_SELECT,
		payload: { floorPlan }
	};
};

export const _clearFloorPlan = () => {
	return {
		type: t.FLOOR_PLAN_CLEAR
	};
};

export const clearFloorPlan = (floorPlan) => {
	return (dispatch) => {
		dispatch(
			updatePersistedState("events-app", "selectedFloors", {
				[floorPlan.facilityId]: null
			})
		);
		dispatch(_clearFloorPlan());
	};
};

export const selectFloorPlan = (floorPlan) => {
	return (dispatch) => {
		if (floorPlan) {
			dispatch(
				updatePersistedState("events-app", "selectedFloors", {
					[floorPlan.facilityId]: floorPlan
				})
			);
			dispatch(_selectFloorPlan(floorPlan));
		}
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
