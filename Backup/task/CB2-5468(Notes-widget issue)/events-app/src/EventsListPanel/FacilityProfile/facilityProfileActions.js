import * as t from "./actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { removeFeed } from "orion-components/ContextualData/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import { attachmentService } from "client-app-core";
export { setMapTools } from "orion-components/Map/Tools/Actions";
export { startFloorPlanCameraStream, startActivityStream, unsubscribeFromFeed, removeFeed, startAttachmentStream, startCamerasInRangeStream } from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export {
	createCollection,
	addRemoveFromCollections,
	addRemoveFromEvents
} from "../EntityProfile/entityProfileActions";
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
		dispatch(updatePersistedState("events-app", "selectedFloors", {
			[floorPlan.facilityId]: null
		}));
		dispatch(_clearFloorPlan());
	};
};

export const selectFloorPlan = floorPlan => {
	return dispatch => {
		if (floorPlan) {
			dispatch(updatePersistedState("events-app", "selectedFloors", {
				[floorPlan.facilityId]: floorPlan
			}));
			dispatch(_selectFloorPlan(floorPlan));
		}
	};
};

export const setFloorPlans = floorPlans => {
	return {
		type: t.FLOOR_PLANS_SET,
		payload: { floorPlans }
	};
};

export function removeFloorPlanCameraSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}

export function removeFloorPlanAccessPointsSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}

export const ignoreFacility = (facility, appData) => {
	return dispatch => {
		dispatch(ignoreEntity(facility.id, "facility", facility.feedId, appData));
		dispatch(clearFloorPlan());
	};

};

export function setWidgetOrder(profile, widgets) {
	return function (dispatch) {
		const keyVal = {
			[profile]: widgets
		};
		dispatch(updatePersistedState("events-app", "profileWidgetOrder", keyVal));
	};
}

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("events-app", "activityFilters", filters));
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