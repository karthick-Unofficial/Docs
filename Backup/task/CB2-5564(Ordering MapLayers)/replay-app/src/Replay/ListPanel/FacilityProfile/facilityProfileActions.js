import * as t from "../../../actionTypes.js";
export { startAttachmentStream } from "orion-components/ContextualData/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";


export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";

export const _selectFloorPlan = floorPlan => {
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

export const clearFloorPlan = floorPlan => {
	return dispatch => {
		dispatch(updatePersistedState("map-app", "selectedFloors", {
			[floorPlan.facilityId]: null
		}));
		dispatch(_clearFloorPlan());
	};
};

export const selectFloorPlan = (floorPlan, feedId) => {
	return dispatch => {
		if (floorPlan) {
			dispatch(updatePersistedState("map-app", "selectedFloors", {
				[floorPlan.facilityId]: { ...floorPlan, feedId: feedId }
			}));
			dispatch(_selectFloorPlan({ ...floorPlan, feedId: feedId }));
		}
	};
};
export const setFloorPlans = floorPlans => {
	return {
		type: t.FLOOR_PLANS_SET,
		payload: { floorPlans }
	};
};

export const _selectWidget = widget => {
	return {
		type: t.SELECT_WIDGET,
		payload: widget
	};
};

export const ignoreFacility = (facility, appData) => {
	return dispatch => {
		dispatch(ignoreEntity(facility.id, "facility", facility.feedId, appData));
		dispatch(updatePersistedState("map-app", "selectedFloors", {
			[facility.id]: null
		}));
		dispatch(_clearFloorPlan());
	};

};


export const selectWidget = widget => {
	return (dispatch, getState) => {
		dispatch(_selectWidget(widget));
	};
};


