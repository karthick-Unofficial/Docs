import * as t from "./actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { setSelectedPinnedItem } from "../PinnedItem/pinnedItemActions";
import { setStagedItem } from "../SearchField/searchFieldActions";

export const addCameraBatch = cameras => {
	return {
		type: t.ADD_CAMERA_BATCH,
		payload: { cameras }
	};
};

export const clearCameras = () => {
	return {
		type: t.CLEAR_CAMERAS
	};
};

export const setSelectedGroup = (group, cameras) => {
	return dispatch => {
		dispatch(
			updatePersistedState("camera-wall-app", "selectedGroup", {
				selectedGroup: group
			})
		);
		dispatch(clearCameras());
		if (group) {
			dispatch(setSelectedPinnedItem(null));
			dispatch(setStagedItem(null));
			dispatch(addCameraBatch(cameras));
		}
	};
};
