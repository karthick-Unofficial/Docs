import { cameraGroupService } from "client-app-core";
import { setSelectedGroup } from "../../../ListPanel/CameraGroup/cameraGroupActions";
import { updatePersistedState } from "orion-components/AppState/Actions";
export { closeDialog } from "orion-components/AppState/Actions";

export const deleteGroup = groupId => {
	return dispatch => {
		cameraGroupService.delete(groupId, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else if (response) {
				dispatch(setSelectedGroup(null));
			}
		});
	};
};

export const updateGroup = (groupId, update) => {
	return dispatch => {
		cameraGroupService.update(groupId, update, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else if (response) {
				const { name } = update;
				dispatch(
					updatePersistedState("camera-wall-app", "selectedGroup", {
						name: name
					})
				);
			}
		});
	};
};
