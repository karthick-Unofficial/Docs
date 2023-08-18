import { addCameraBatch } from "../ListPanel/CameraGroup/cameraGroupActions";
import { removeCamera } from "./CameraSlot/cameraSlotActions";
import { addCamera } from "./CameraSlot/EmptySlot/emptySlotActions";

export const addToCameras = cameras => {
	const cameraIdsByIndex = {};
	cameras.forEach((camera, index) => (cameraIdsByIndex[index] = camera.id));
	return dispatch => {
		dispatch(addCameraBatch(cameraIdsByIndex));
	};
};

export const updateCameras = camera => {
	return (dispatch, getState) => {
		const { cameras } = getState().cameraWall;
		dispatch(addCamera(camera.id, cameras.length));
	};
};

export const removeFromCameras = id => {
	return (dispatch, getState) => {
		const { cameras } = getState().camerasWall;
		const index = Object.keys(cameras).find(key => cameras[key] === id);
		dispatch(removeCamera(index));
	};
};
