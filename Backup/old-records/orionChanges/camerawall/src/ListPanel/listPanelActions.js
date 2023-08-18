import {
	clearCameras,
	setSelectedGroup
} from "./CameraGroup/cameraGroupActions";
import { setSelectedPinnedItem } from "./PinnedItem/pinnedItemActions";
import { setStagedItem } from "./SearchField/searchFieldActions";
export { stageItem } from "./SearchField/searchFieldActions";
export { updateWidgetLaunchData } from "../appActions";

export const setNewCameraGroup = () => {
	return dispatch => {
		dispatch(clearCameras());
		dispatch(setSelectedGroup(null));
		dispatch(setSelectedPinnedItem(null));
		dispatch(setStagedItem(null));
	};
};