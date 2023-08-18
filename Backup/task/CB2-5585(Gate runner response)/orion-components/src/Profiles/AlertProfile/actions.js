import * as t from "./actionTypes";
import { activityService, cameraService } from "client-app-core";
import { updateContext, updateContextProperty } from "orion-components/ContextualData/Actions";
import {
	addContext,
	removeContext,
	startAttachmentStream,
	startActivityStream
} from "orion-components/ContextualData/Actions";
import { toggleOpen } from "orion-components/Dock/actions";
export { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
export {
	closeNotification,
	reopenNotification
} from "orion-components/Dock/Notifications/actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export {
	setCameraPriority,
	addCameraToDockMode
} from "orion-components/Dock/Actions/index.js";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { addSpotlight } from "orion-components/Map/Tools/Actions";

export const getActivityDetails = id => {
	return dispatch => {
		activityService.getActivityDetails(id, (err, response) => {
			if (err) {
				console.log("ERR", err);
			} else {
				dispatch(updateContext(id, response));
			}
		});
	};
};

export const getCamerasInRangeOfGeo = (contextId, geometry) => {
	return dispatch => {
		cameraService.getCamerasInRangeOfGeo(geometry, (err, response) => {
			if (err) {
				console.log("ERR", err);
			} else {
				dispatch(updateContextProperty(contextId, "camerasInRange", response));
			}
		});
	};
};

const _openAlertProfile = id => {
	return {
		type: t.OPEN_ALERT_PROFILE,
		payload: {
			id
		}
	};
};

const _closeAlertProfile = () => {
	return {
		type: t.CLOSE_ALERT_PROFILE
	};
};

export const openAlertProfile = (notification, forReplay) => {
	return (dispatch, getState) => {
		const { id, activityId, geometry } = notification;
		const { expanded, isOpen } = getState().appState.dock.dockData;
		if (!isOpen) {
			dispatch(toggleOpen());
		}
		if (expanded && expanded !== id) {
			dispatch(_closeAlertProfile());
		}
		dispatch(addContext(activityId, notification));
		dispatch(getActivityDetails(activityId));
		if (!forReplay) {
			dispatch(getCamerasInRangeOfGeo(activityId, geometry));
			dispatch(startActivityStream(activityId, "activity", "dock"));
			dispatch(startAttachmentStream(activityId, "dock"));
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}
		dispatch(_openAlertProfile(id));
	};
};

export const closeAlertProfile = activityId => {
	return dispatch => {
		dispatch(_closeAlertProfile());
		dispatch(removeContext(activityId));
	};
};
