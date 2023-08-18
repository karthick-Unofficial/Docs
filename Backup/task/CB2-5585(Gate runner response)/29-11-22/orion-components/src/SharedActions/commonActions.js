import { updatePersistedState } from "orion-components/AppState/Actions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import { entityCollection, eventService } from "client-app-core";
import { closeSecondary } from "orion-components/ContextPanel/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";

export const updateActivityFilters = (appId, keyVal) => {
	return dispatch => {
		dispatch(updatePersistedState(appId, "activityFilters", keyVal));
	};
};

export const setWidgetOrder = (appId, profile, widgets) => {
	return dispatch => {
		const keyVal = { [profile]: widgets };

		dispatch(updatePersistedState(appId, "profileWidgetOrder", keyVal));
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


export const closeProfile = () => {
	return dispatch => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};
export function createCollection(name, members) {
	return function (dispatch, getState) {
		const state = getState();
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (state.appId && state.appId === "events-app" || state.appId === "map-app") {
					const id = response.generated_keys[0];

					const undo = true;

					const undoFunc = () => {
						dispatch(deleteCollection(id, name, undo));
					};
					dispatch(createUserFeedback(name + " has been created.", undoFunc));
				}
			}
		});
	};
}

export function deleteCollection(collectionId, collectionName, undoing) {
	return function (dispatch) {
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
}

export function restoreCollection(collectionId) {
	return function (dispatch) {
		entityCollection.restoreCollection(collectionId, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				console.log(response);
			}
		});
	};
}
