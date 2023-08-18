import * as t from "./actionTypes";
import { cameraGroupService } from "client-app-core";
export { updateGroup } from "../Toolbar/EditGroupDialog/editGroupDialogActions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { setCameraPriority } from "orion-components/Dock/Actions/index.js";

export const removeCamera = index => {
	return {
		type: t.REMOVE_CAMERA,
		payload: { index }
	};
};

export const removeFromWall = (id, index) => {
	return dispatch => {
		dispatch(removeCamera(index));
	};
};

export const removeFromGroup = (groupId, index) => {
	return (dispatch, getState) => {
		const { cameras } = getState().globalData.cameraGroups[groupId];
		const newCameras = { ...cameras, [index]: null };
		cameraGroupService.update(
			groupId,
			{ cameras: newCameras },
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else if (response) {
					dispatch(removeCamera(index));
				}
			}
		);
	};
};
