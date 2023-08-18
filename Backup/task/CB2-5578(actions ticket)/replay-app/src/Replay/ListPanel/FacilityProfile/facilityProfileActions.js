import * as t from "../../../actionTypes.js";
export { setMapTools } from "orion-components/Map/Tools/Actions";
export { startFloorPlanCameraStream, startActivityStream, startFloorPlanAccessPointsStream, unsubscribeFromFeed, removeFeed, startAttachmentStream, startCamerasInRangeStream } from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import { removeFeed } from "orion-components/ContextualData/Actions";
import { attachmentService } from "client-app-core";

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

export function removeFloorPlanCameraSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}
export const ignoreFacility = (facility, appData) => {
	return dispatch => {
		dispatch(ignoreEntity(facility.id, "facility", facility.feedId, appData));
		dispatch(updatePersistedState("map-app", "selectedFloors", {
			[facility.id]: null
		}));
		dispatch(_clearFloorPlan());
	};

};
export function setWidgetOrder(profile, widgets) {
	return function (dispatch) {
		const keyVal = {
			[profile]: widgets
		};
		dispatch(updatePersistedState("map-app", "profileWidgetOrder", keyVal));
	};
}

export const selectWidget = widget => {
	return (dispatch, getState) => {
		dispatch(_selectWidget(widget));
	};
};

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("map-app", "activityFilters", filters));
	};
};

export const attachFilesToFacility = (facilityId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(facilityId, "facility", files, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};


export function removeFloorPlanAccessPointsSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}