import * as t from "../actionTypes.js";

export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";

const cameraDocked = (cameraPosition, response) => {
	return {
		type: t.CAMERA_DOCKED,
		payload: {
			cameraPosition,
			response
		}
	};
};

export const addToDock = (cameraId, cameraPosition, dockedCameras) => {
	return dispatch => {
		dispatch(cameraDocked(cameraPosition, cameraId));
	};
};

const cameraRemoved = cameraPosition => {
	return {
		type: t.REMOVE_DOCKED_CAMERA,
		payload: {
			cameraPosition
		}
	};
};

export const removeFromDock = (cameraPosition, dockedCameras) => {
	return function(dispatch) {
		dispatch(cameraRemoved(cameraPosition));
	};
};

export const setCameraPriority = (dockOpen, modalOpen) => {
	return {
		type: t.CAMERA_PRIORITY_SET,
		payload: {
			dockOpen,
			modalOpen
		}
	};
};

export const setFindNearestMode = cameraPosition => {
	return {
		type: t.TOGGLE_FIND_NEAREST,
		payload: {
			cameraPosition
		}
	};
};

export const clearFindNearestMode = () => {
	return {
		type: t.CLEAR_FIND_NEAREST
	};
};

const cameraReplaceModeCleared = () => {
	return {
		type: t.CLEAR_CAMERA_REPLACE_MODE
	};
};

export const clearCameraReplaceMode = () => {
	return dispatch => {
		dispatch(cameraReplaceModeCleared());
	};
};

export const addMedia = (newMedia) => {
	return {
		type: t.ADD_MEDIA,
		payload: {
			newMedia
		}
	};
};

export const setMedia = (newMedia) => {
	return {
		type: t.SET_MEDIA,
		payload: {
			newMedia
		}
	};
};

export const removeMedia = (oldMedia) => {
	return {
		type: t.REMOVE_MEDIA,
		payload: {
			oldMedia
		}
	};
};