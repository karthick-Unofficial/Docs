import {
	attachmentService,
	cameraService,
	entityCollection,
	eventService
} from "client-app-core";
import {
	subscribeFOVs,
	unsubscribeFOVs
} from "orion-components/GlobalData/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
export { linkEntities, unlinkEntities } from "../EntityProfile/entityProfileActions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	startLiveCameraStream,
	startActivityStream,
	startAttachmentStream,
	startFOVItemStream,
	startCamerasLinkedItemsStream,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";
export { createCollection } from "../EntityCollection/entityCollectionActions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
// Need to retain the index.js path here to prevent file/folder conflicts when importing
export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export {
	ignoreEntity
} from "orion-components/GlobalData/Actions";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";

import keys from "lodash/keys";
import pull from "lodash/pull";

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

export const attachFilesToCamera = (cameraId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(cameraId, "camera", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const addRemoveFromCollections = (entityId, added, removed, entityName, entityType, feedId, undoing) => {
	return dispatch => {
		const addedIds = added.map(collection => collection.id);
		const removedIds = removed.map(collection => collection.id);
		entityCollection.addRemoveMemberToMulti(
			entityId,
			entityName,
			entityType,
			feedId,
			addedIds,
			removedIds,
			(err, response) => {
				if (err) {
					console.log(err);
				} else {
					if (!undoing) {
						const undo = true;
						const undoFunc = () => {
							dispatch(
								// We pass null for entityName, entityType, and feedId to prevent activities 
								// from generating when we undo a collection update
								addRemoveFromCollections(entityId, removed, added, null, null, null, undo)
							);
						};
						let addedMessage = "";
						let removedMessage = "";
						if (added[0]) {
							added.forEach((collection, index) => {
								addedMessage += index !== added.length - 1 ? `${collection.name}, ` : `${collection.name}`;
							});
						}
						if (removed[0]) {
							removed.forEach((collection, index) => {
								removedMessage += index !== removed.length - 1 ? `${collection.name}, ` : `${collection.name}`;
							});
						}
						let completeMessage = addedMessage ? entityName + " added to " + addedMessage + "." : "";
						completeMessage += removedMessage ? entityName + " removed from " + removedMessage + "." : "";
						dispatch(
							createUserFeedback(
								completeMessage,
								undoFunc
							)
						);
					}

				}
			}
		);
	};
};

export const addRemoveFromEvents = (
	entityId,
	entityType,
	feedId,
	added,
	removed
) => {
	return dispatch => {
		eventService.updatePinnedEntities(
			entityId,
			entityType,
			feedId,
			added,
			removed,
			(err, response) => {
				if (err) {
					console.log(err);
				}
			}
		);
	};
};

export const updateCamera = (cameraId, camera) => {
	return dispatch => {
		cameraService.update(cameraId, camera, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const showFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [cameraId];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = [...cameraIds, ...keys(fovs.data)];

		dispatch(subscribeFOVs(cameraIds));
	};
};

export const hideFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = pull(keys(fovs.data), cameraId);

		dispatch(unsubscribeFOVs([cameraId], fovs.subscription));
		dispatch(subscribeFOVs(cameraIds));
	};
};



export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};