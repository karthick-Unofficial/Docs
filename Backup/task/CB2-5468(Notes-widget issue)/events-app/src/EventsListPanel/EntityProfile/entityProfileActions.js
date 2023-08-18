import {
	shapeService,
	attachmentService,
	entityCollection,
	userService,
	eventService,
	linkedEntitiesService
} from "client-app-core";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import _ from "lodash";
import * as t from "../../actionTypes.js";
import { createUserFeedback } from "orion-components/Dock/actions";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
import { updatePersistedState } from "orion-components/AppState/Actions";
export {
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startCameraInRangeVideoStream,
	startRulesStream
} from "orion-components/ContextualData/Actions";
export { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";

// Need to retain the index.js path here to prevent file/folder conflicts when importing
export {
	createUserFeedback,
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { ignoreEntity } from "orion-components/GlobalData/Actions";
export { setMapTools } from "orion-components/Map/Tools/Actions";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";

export function setWidgetOrder(profile, widgets) {
	return function (dispatch) {
		const keyVal = { [profile]: widgets };
		dispatch(updatePersistedState("events-app", "profileWidgetOrder", keyVal));
	};
}

// Update Viewing History
export const updateViewingHistory = history => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		history,
		payload: {
			// FOR NEW REDUCER
			id: history.id,
			name: history.name,
			type: history.type
		}
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
				}

				const state = getState();
				dispatch(
					loadProfile(
						selectedEntityState(state).id,
						selectedEntityState(state).name,
						selectedEntityState(state).entityType,
						"profile"
					)
				);
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

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("events-app", "activityFilters", filters));
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

// UPDATE - persisted
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

// UPDATE - persisted
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

export const attachFilesToEntity = (entityId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(
			entityId,
			entityType,
			files,
			(err, result) => {
				if (err) {
					console.log(err);
				}
				console.log(result);
			}
		);
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

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};