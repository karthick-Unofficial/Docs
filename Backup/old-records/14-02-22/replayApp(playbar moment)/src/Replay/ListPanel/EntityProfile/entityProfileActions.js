
// Need to retain the index.js path here to prevent file/folder conflicts when importing
export {
	createUserFeedback,
	closeNotification,
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export {
	addRemoveFromCollections,
	addRemoveFromEvents,
	setWidgetOrder,
	updateActivityFilters
} from "../CameraProfile/cameraProfileActions";
export { deleteShape } from "orion-components/Map/Tools/Actions";
export { setDrawingMode } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	unsubscribeFromFeed,
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startCameraInRangeVideoStream,
	startTrackHistoryStream,
	startRulesStream,
	removeSubscriber
} from "orion-components/ContextualData/Actions";
export { ignoreEntity } from "orion-components/GlobalData/Actions";

export { setMapTools } from "orion-components/Map/Tools/Actions";
