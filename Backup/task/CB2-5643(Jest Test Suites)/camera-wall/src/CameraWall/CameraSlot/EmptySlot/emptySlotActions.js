import * as t from "./actionTypes";
import { cameraGroupService } from "client-app-core";

export const addCamera = (id, index) => {
	return {
		type: t.ADD_CAMERA,
		payload: { id, index }
	};
};

export const addToWall = (id, index) => {
	return (dispatch) => {
		dispatch(addCamera(id, index));
	};
};

export const addToGroup = (groupId, index, cameraId) => {
	return (dispatch, getState) => {
		const { cameras } = getState().globalData.cameraGroups[groupId];
		const newCameras = { ...cameras, [index]: cameraId };
		cameraGroupService.update(groupId, { cameras: newCameras }, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else if (response) {
				dispatch(addCamera(cameraId, index));
			}
		});
	};
};
