import * as t from "./actionTypes.js";
import { cameraService } from "client-app-core";
import { setAppState } from "../actions";
import { dockedCamerasSelector, userCamerasSelector } from "./selectors";

export { openDialog, closeDialog } from "../../AppState/Actions";
export { loadProfile } from "../../ContextPanel/Actions";

export const addCameraToDockMode = (camera, replaceMode) => {
	return {
		type: t.CAMERA_TO_DOCK_MODE,
		payload: {
			camera,
			replaceMode
		}
	};
};

export const cameraDocked = (cameraPosition, response) => {
	return {
		type: t.CAMERA_DOCKED,
		payload: {
			cameraPosition,
			response
		}
	};
};

export const addToDock = (cameraId, cameraPosition, dockedCameras) => {
	return (dispatch) => {
		const cameras = [...dockedCameras];
		cameras[cameraPosition] = cameraId;
		const keyVal = { dockedCameras: cameras };
		dispatch(setAppState(keyVal));
		dispatch(cameraDocked(cameraPosition, cameraId));
	};
};

export const removeDockedCamera = (cameraPosition) => {
	return {
		type: t.REMOVE_DOCKED_CAMERA,
		payload: {
			cameraPosition
		}
	};
};

export const removeDockedCameraAndState = (cameraPosition, dockedCameras) => {
	return function (dispatch) {
		const cameras = dockedCameras;
		cameras[cameraPosition] = null;

		const keyVal = { dockedCameras: cameras };
		dispatch(removeDockedCamera(cameraPosition));
		dispatch(setAppState(keyVal));
	};
};

/**
 * Remove a camera from the dock and userAppState via id
 * @param {string} cameraId
 */
export const removeDockedCameraById = (cameraId) => {
	return (dispatch, getState) => {
		const cameraIds = dockedCamerasSelector(getState());
		const userCameras = userCamerasSelector(getState());

		// Find all places the camera is docked, if any
		const cameraPositions = [];
		cameraIds.forEach((id, index) => {
			if (id === cameraId) {
				cameraPositions.push(index);
			}
		});

		// If camera isn't docked, bail out
		if (!cameraPositions.length) {
			return;
		}

		// Build an array of camera objects for updating userAppState
		const cameraObjArr = cameraIds.map((id) => {
			return userCameras.find((camera) => camera.id === id);
		});

		// Filter removed cameras out of the camera object array
		const filteredCameras = cameraObjArr.map((cam) => {
			if (cam && cam.id === cameraId) {
				return null;
			} else {
				return cam ? cam : null;
			}
		});

		const keyVal = { dockedCameras: filteredCameras };
		cameraPositions.forEach((cameraPosition) => {
			dispatch(removeDockedCamera(cameraPosition));
		});
		dispatch(setAppState(keyVal));
	};
};

export const camerasReceived = (cameras) => {
	return {
		type: t.CAMERAS_RECEIVED,
		payload: cameras
	};
};

export const getAllCameras = () => {
	return (dispatch) => {
		cameraService.getMyCameras((err, response) => {
			if (err) {
				console.log(err);
			} else {
				// Uncomment to save to userSidebarAppState
				// const keyVal = {userCameras: response};
				// dispatch(setAppState(keyVal));
				dispatch(camerasReceived(response));
			}
		});
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

export const setFindNearestMode = (cameraPosition) => {
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

export const cameraReplaceModeCleared = () => {
	return {
		type: t.CLEAR_CAMERA_REPLACE_MODE
	};
};

export const clearCameraReplaceMode = () => {
	return (dispatch) => {
		const keyVal = {
			cameraReplaceMode: { camera: null, replaceMode: false }
		};
		dispatch(setAppState(keyVal));
		dispatch(cameraReplaceModeCleared());
	};
};
