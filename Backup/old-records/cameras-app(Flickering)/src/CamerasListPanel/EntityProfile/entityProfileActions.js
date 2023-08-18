import _ from "lodash";
import {
	shapeService,
	attachmentService,
	entityCollection,
	userService,
	linkedEntitiesService,
	cameraService} from "client-app-core";
import { closeProfile } from "../camerasListPanelActions";
import * as t from "../../actionTypes.js";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";

export {
	addRemoveFromEvents,
	setWidgetOrder
} from "../CameraProfile/cameraProfileActions";
// Need to retain the index.js path here to prevent file/folder conflicts when importing
export { 
	createUserFeedback, 
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export {
	unsubscribeFromFeed,
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startCameraInRangeVideoStream,
	startTrackHistoryStream,
	startRulesStream
} from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { updateActivityFilters } from "../CameraProfile/cameraProfileActions";
export {
	ignoreEntity
} from "orion-components/GlobalData/Actions";


// Update Viewing History
export const updateViewingHistory = ({ id, name, type, item }) => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		payload: {
			id,
			name,
			type,
			item
		}
	};
};

export const deleteShape = (id, name, undoing) => {
	return (dispatch, getState) => {
		shapeService.delete(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undoFunc = () => {
						dispatch(restoreShape(id));
					};
			
					dispatch(createUserFeedback(name + " has been deleted.", undoFunc));
					dispatch(closeProfile());
				}
			}
		});
	};
};

export const restoreShape = id => {
	return dispatch => {
		shapeService.restore(id, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	};
};

export const shareEntityToOrg = entityId => {
	return dispatch => {
		shapeService.share(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const unshareEntityToOrg = entityId => {
	return dispatch => {
		shapeService.unshare(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export function addedToMyItems(ids) {
	return {
		type: t.ADDED_TO_MY_ITEMS,
		ids
	};
}

// No Longer used
export function removedFromMyItems(ids) {
	return {
		type: t.REMOVED_FROM_MY_ITEMS,
		ids
	};
}

export const removeFromMyItems = (entityIds, undoing) => {
	return (dispatch, getState) => {
		// Result of save isn't consequential enough for us to care so we go ahead and update locally here
		dispatch(removedFromMyItems(entityIds));

		const state = getState();

		// Get copy of current dock items
		const dockItems = state.userAppState.dockItems.slice();

		// Append if not present
		const newDockItems = dockItems.filter(id => {
			return entityIds.map(entity => {
				return id !== entity.id;
			});
		});

		const app = "map-app";
		const keyVal = { dockItems: newDockItems };
		userService.setAppState(app, keyVal, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undo = true;
					const undoFunc = () => {
						// entityName = null as number of items vary on removal
						dispatch(addAllToMyItems(entityIds, null, undo));
					};

					const messageBody =
						entityIds.length > 1
							? " items removed from "
							: " item removed from ";

					dispatch(
						createUserFeedback(
							entityIds.length + messageBody + "My Items.",
							undoFunc
						)
					);
				}
			}
		});
	};
};

export const addAllToMyItems = (entityIds, entityName, undoing) => {
	return (dispatch, getState) => {
		const state = getState();
		const dockItems = state.userAppState.dockItems || [];
		const app = "map-app";
		const keyVal = { dockItems: _.union(dockItems, entityIds) };
		userService.setAppState(app, keyVal, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undo = true;

					const undoFunc = () => {
						dispatch(removeFromMyItems(entityIds, undo));
					};

					dispatch(
						createUserFeedback(entityName + " added to My Items.", undoFunc)
					);
				}
				dispatch(addedToMyItems(entityIds));
			}
		});
	};
};

export const createCollection = (name, members) => {
	return dispatch => {
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const id = response.generated_keys[0];

				const undo = true;

				const undoFunc = () => {
					dispatch(deleteCollection(id, name, undo));
				};
				dispatch(createUserFeedback(name + " has been created.", undoFunc));
			}
		});
	};
};

export const deleteCollection = (collectionId, collectionName, undoing) => {
	return dispatch => {
		entityCollection.deleteCollection(collectionId, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undoFunc = () => {
						dispatch(restoreCollection(collectionId));
					};

					dispatch(
						createUserFeedback(collectionName + " has been deleted.", undoFunc)
					);
				}
			}
		});
	};
};

export const restoreCollection = collectionId => {
	return dispatch => {
		entityCollection.restoreCollection(collectionId, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				console.log(response);
			}
		});
	};
};

export const addToCollection = (
	collectionName,
	collectionId,
	members,
	entityName,
	undoing
) => {
	return dispatch => {
		entityCollection.addMembers(collectionId, members, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undo = true;
					const undoFunc = () => {
						dispatch(
							removeFromCollection(collectionName, collectionId, members, undo)
						);
					};

					dispatch(
						createUserFeedback(
							entityName + " added to " + collectionName + ".",
							undoFunc
						)
					);
				}
			}
		});
	};
};

export const removeFromCollection = (
	collectionName,
	collectionId,
	members,
	undoing
) => {
	return dispatch => {
		entityCollection.removeMembers(collectionId, members, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undo = true;
					const undoFunc = () => {
						// entityName = null as number of items vary on removal
						dispatch(
							addToCollection(collectionName, collectionId, members, null, undo)
						);
					};

					const messageBody =
						members.length > 1 ? " items removed from " : " item removed from ";

					dispatch(
						createUserFeedback(
							members.length + messageBody + collectionName + ".",
							undoFunc
						)
					);
				}
			}
		});
	};
};

// Cam In Range
export const cameraInRangeVideoReceived = (stream, cameraId) => {
	return {
		type: t.CAMERA_IN_RANGE_VIDEO_STREAM_RECEIVED,
		payload: {
			cameraId,
			stream
		}
	};
};

export const cameraInRangeStreamReceived = sub => {
	return {
		type: t.CAMERA_IN_RANGE_SUBSCRIPTION_RECEIVED,
		payload: {
			sub
		}
	};
};

export const camerasInRangeReceived = cameras => {
	return {
		type: t.CAMERAS_IN_RANGE_RECEIVED,
		payload: cameras
	};
};

export const camerasInRangeRemoved = cameraIds => {
	return {
		type: t.CAMERAS_IN_RANGE_REMOVED,
		payload: cameraIds
	};
};

export const setCamerasInRangeSubscription = sub => {
	return {
		type: t.SET_CAMERAS_IN_RANGE_SUBSCRIPTION,
		payload: sub
	};
};

export const linkEntities = (entity, linkType, added) => {
	return dispatch => {
		for (let i = 0; i < added.length; i++) {
			linkedEntitiesService.create(
				{
					type: linkType,
					entities: [{ id: entity.id, type: entity.entityType }, added[i]]
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

