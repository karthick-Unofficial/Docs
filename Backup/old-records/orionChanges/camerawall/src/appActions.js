import * as t from "./actionTypes";
import { addCameraBatch } from "./ListPanel/CameraGroup/cameraGroupActions";
import { cameraGroupService } from "client-app-core";
export { hydrateUser } from "orion-components/Session/Actions";
export {
	subscribeFeed,
	subscribeFeedPermissions
} from "orion-components/GlobalData/Actions";
export {
	getAppState,
	getGlobalAppState
} from "orion-components/AppState/Actions";

const cameraGroupReceived = group => {
	return {
		type: t.CAMERA_GROUP_RECEIVED,
		payload: {
			group
		}
	};
};

const cameraGroupRemoved = groupId => {
	return {
		type: t.CAMERA_GROUP_REMOVED,
		payload: {
			groupId
		}
	};
};

export const getPersistedCameras = () => {
	return (dispatch, getState) => {
		const { appState, globalData } = getState();
		const { selectedGroup } = appState.persisted;
		if (selectedGroup) {
			const { cameras } = globalData.cameraGroups[selectedGroup.id];
			dispatch(addCameraBatch(cameras));
		}
	};
};

export const subscribeCameraGroups = () => {
	return dispatch => {
		cameraGroupService.subscribeCameraGroups((err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else if (response) {
				response.forEach(response => {
					const { new_val, old_val, type } = response;
					switch (type) {
						case "initial":
						case "add":
						case "change":
							dispatch(cameraGroupReceived(new_val));
							break;
						case "remove":
							dispatch(cameraGroupRemoved(old_val.id));
							break;
						default:
							break;
					}
				});
				dispatch(getPersistedCameras());
			}
		});
	};
};

export const _updateWidgetLaunchData = widgetLaunchData => {
	return {
		type: t.SET_WIDGET_LAUNCH_DATA,
		payload: widgetLaunchData
	};
};

export const updateWidgetLaunchData = (data) => {
	return dispatch => {
		dispatch(_updateWidgetLaunchData({ widgetLaunchData: data }));
	};
};