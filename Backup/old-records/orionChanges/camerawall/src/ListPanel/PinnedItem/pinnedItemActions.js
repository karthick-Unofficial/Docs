import * as t from "./actionTypes";
import { cameraGroupService } from "client-app-core";
import { updatePersistedState } from "orion-components/AppState/Actions";
import {
	setSelectedGroup,
	clearCameras
} from "../CameraGroup/cameraGroupActions";
import { setStagedItem } from "../SearchField/searchFieldActions";

export const setSelectedPinnedItem = item => {
	return dispatch => {
		dispatch(
			updatePersistedState("camera-wall-app", "selectedPinnedItem", {
				selectedPinnedItem: item
			})
		);
		dispatch(clearCameras());
		if (item) {
			dispatch(setSelectedGroup(null));
			dispatch(setStagedItem(null));
		}
	};
};

export const removeFromPinnedItems = itemId => {
	return (dispatch, getState) => {
		const { pinnedItems } = getState().appState.persisted;
		const newPinnedItems = pinnedItems.filter(item => item.id !== itemId);
		dispatch(setSelectedPinnedItem(null));
		dispatch(
			updatePersistedState("camera-wall-app", "pinnedItems", {
				pinnedItems: newPinnedItems
			})
		);
	};
};

const contextualCameraReceived = (id, cameras) => {
	return {
		type: t.CONTEXTUAL_CAMERA_RECEIVED,
		payload: { id, cameras }
	};
};

const contextualCameraRemoved = (id, cameras) => {
	return {
		type: t.CONTEXTUAL_CAMERA_REMOVED,
		payload: { id, cameras }
	};
};

const contextualCameraBatchReceived = (id, cameras) => {
	return {
		type: t.CONTEXTUAL_CAMERA_BATCH_RECEIVED,
		payload: { id, cameras }
	};
};

export const subscribeCameraContexts = (id, entityType) => {
	return (dispatch, getState) => {
		if (!Object.keys(getState().camerasByContext).includes(id)) {
			cameraGroupService.subscribeCameraContexts(
				id,
				entityType,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
					} else {
						response.forEach(response => {
							const { type, new_val, old_val, code } = response;
							if (!new_val && !old_val && code) {
								dispatch(contextualCameraBatchReceived(id, []));
								dispatch(setSelectedPinnedItem(null));
							}
							switch (type) {
								case "initial":
								case "add":
									dispatch(contextualCameraReceived(id, new_val.cameras));
									break;
								case "change":
									dispatch(contextualCameraBatchReceived(id, new_val.cameras));
									break;
								case "remove":
									dispatch(contextualCameraRemoved(id, old_val.cameras));
									break;
								default:
									break;
							}
						});
					}
				}
			);
		}
	};
};
