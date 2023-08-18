import * as t from "./actionTypes";
import { clearCameras, setSelectedGroup } from "../CameraGroup/cameraGroupActions";
import { setSelectedPinnedItem, subscribeCameraContexts } from "../PinnedItem/pinnedItemActions";

export const setStagedItem = (item) => {
	return {
		type: t.SET_STAGED_ITEM,
		payload: { item }
	};
};

export const stageItem = (item) => {
	return (dispatch) => {
		dispatch(clearCameras());
		if (item) {
			dispatch(setSelectedGroup(null));
			dispatch(setSelectedPinnedItem(null));
			dispatch(subscribeCameraContexts(item.id, item.entityType));
		}
		dispatch(setStagedItem(item));
	};
};
