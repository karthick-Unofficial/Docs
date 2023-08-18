import {
	attachmentService
} from "client-app-core";
import {
	subscribeFOVs,
	unsubscribeFOVs
} from "orion-components/GlobalData/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import _ from "lodash";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	startLiveCameraStream,
	startActivityStream,
	startAttachmentStream,
	startFOVItemStream,
	startCamerasLinkedItemsStream,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
// Need to retain the index.js path here to prevent file/folder conflicts when importing
export { 
	addCameraToDockMode, 
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export {
	ignoreEntity
} from "orion-components/GlobalData/Actions";

export const updateActivityFilters = keyVal => {
	return dispatch => {
		dispatch(updatePersistedState("map-app", "activityFilters", keyVal));
	};
};

export const setWidgetOrder = (profile, widgets) => {
	return dispatch => {
		const keyVal = { [profile]: widgets };

		dispatch(updatePersistedState("map-app", "profileWidgetOrder", keyVal));
	};
};

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

export const showFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [cameraId];
		const fovs = getState().globalData.fovs;

		if (fovs) {cameraIds = [...cameraIds, ..._.keys(fovs.data)];}

		dispatch(subscribeFOVs(cameraIds));
	};
};

export const hideFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [];
		const fovs = getState().globalData.fovs;

		if (fovs) {cameraIds = _.pull(_.keys(fovs.data), cameraId);}

		dispatch(unsubscribeFOVs([cameraId], fovs.subscription));
		dispatch(subscribeFOVs(cameraIds));
	};
};