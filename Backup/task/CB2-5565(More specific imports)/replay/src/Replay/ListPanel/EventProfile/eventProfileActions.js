
import { updatePersistedState } from "orion-components/AppState/Actions";

export {
	unsubscribeFromFeed,
	getContextListCategory } from "orion-components/ContextualData/Actions";
export {
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startEventCameraStream
} from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { ignoreEntity, getLookupValues } from "orion-components/GlobalData/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";

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
