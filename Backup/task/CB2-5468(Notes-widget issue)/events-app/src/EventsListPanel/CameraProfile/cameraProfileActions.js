import { attachmentService, cameraService } from "client-app-core";
import _ from "lodash";
import * as t from "../../actionTypes";
import {
	subscribeFOVs,
	unsubscribeFOVs
} from "orion-components/GlobalData/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";
export { linkEntities, unlinkEntities } from "../EntityProfile/entityProfileActions";

export {
	updateViewingHistory,
	createCollection,
	addRemoveFromCollections,
	addRemoveFromEvents
} from "../EntityProfile/entityProfileActions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	startLiveCameraStream,
	startCamerasLinkedItemsStream,
	startActivityStream,
	startAttachmentStream,
	startFOVItemStream,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";
// Need to retain index.js path here to prevent file/folder conflicts when importing
export { 
	addCameraToDockMode, 
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export {
	ignoreEntity
} from "orion-components/GlobalData/Actions";
export { selectWidget } from "../../appActions";

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("events-app", "activityFilters", filters));
	};
};

export function setWidgetOrder(profile, widgets) {
	return function(dispatch) {
		const keyVal = { [profile]: widgets };
		dispatch(updatePersistedState("events-app", "profileWidgetOrder", keyVal));
	};
}

export const attachFilesToCamera = (cameraId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(cameraId, "camera", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const updateCameraSuccess = (id, data) => {
	return {
		type: t.CAMERA_UPDATED,
		payload: { id: id, data: data }
	};
};

export const updateCamera = (cameraId, camera) => {
	return dispatch => {
		cameraService.update(cameraId, camera, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(updateCameraSuccess(cameraId, camera.camera));
			}
		});
	};
};

export const showFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [cameraId];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = [...cameraIds, ..._.keys(fovs.data)];

		dispatch(subscribeFOVs(cameraIds));
	};
};

export const hideFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = _.pull(_.keys(fovs.data), cameraId);

		dispatch(unsubscribeFOVs([cameraId], fovs.subscription));
		dispatch(subscribeFOVs(cameraIds));
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};