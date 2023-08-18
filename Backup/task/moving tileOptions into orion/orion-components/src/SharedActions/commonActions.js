import { updatePersistedState } from "orion-components/AppState/Actions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import { entityCollection, eventService } from "client-app-core";

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
