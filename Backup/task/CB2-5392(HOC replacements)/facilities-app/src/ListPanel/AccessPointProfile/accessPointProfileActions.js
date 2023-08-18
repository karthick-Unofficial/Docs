import {
	attachmentService,
	entityCollection,
	eventService,
	accessPointService,
	linkedEntitiesService
} from "client-app-core";
import { updatePersistedState } from "orion-components/AppState/Actions";
import _ from "lodash";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	startActivityStream,
	startAttachmentStream,
	startCameraInRangeVideoStream,
	unsubscribeFromFeed,
	startCamerasInRangeStream,
	startTrackHistoryStream
} from "orion-components/ContextualData/Actions";
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

export const updateActivityFilters = keyVal => {
	return dispatch => {
		dispatch(updatePersistedState("facilities-app", "activityFilters", keyVal));
	};
};

export const setWidgetOrder = (profile, widgets) => {
	return dispatch => {
		const keyVal = { [profile]: widgets };

		dispatch(updatePersistedState("facilities-app", "profileWidgetOrder", keyVal));
	};
};

export const attachFilesToAccessPoint = (accessPointId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(accessPointId, "accessPoint", files, (err, result) => {
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

export const updateAccesspoint = (accessPointId, accessPoint) => {
	return dispatch => {
		accessPointService.update(accessPointId, accessPoint, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};


export const linkEntities = (entity, linkType, added) => {
	return dispatch => {
		for (let i=0; i<added.length; i++) {
			linkedEntitiesService.create(
				{
					type: linkType,
					entities: [{id: entity.id, type: entity.entityType}, added[i]]
				},
				(err, response) => {
					if (err) {
						console.log(err);
					}
				}
			);
		}
	};
};

export const unlinkEntities = (entities, linkType) => {
	return dispatch => {
		linkedEntitiesService.delete(
			entities,
			linkType,
			(err, response) => {
				if (err) {
					console.log(err);
				}
			}
		);
		
	};
};