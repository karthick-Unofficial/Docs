import { userService, entityCollection } from "client-app-core";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";

export function createCollection(name, members) {
	return function (dispatch) {
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

export function removeFromMyItems(entityIds, undoing) {
	return (dispatch, getState) => {
		// Result of save isn't consequential enough for us to care so we go ahead and update locally here
		dispatch(removedFromMyItems(entityIds));

		const state = getState();

		// Get copy of current dock items
		const dockItems = state.appState.dockItems.slice();

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
}

export function addAllToMyItems(entityIds, entityName, undoing) {
	return function (dispatch, getState) {
		const state = getState();
		const dockItems = state.appState.dockItems || [];
		const app = "map-app";
		const keyVal = { dockItems: union(dockItems, entityIds) };
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
			}
		});
	};
}

// Only used to undo the below removeFromCollection action
export function addToCollection(
	collectionName,
	collectionId,
	members,
	entityName,
	undoing
) {
	return function (dispatch) {
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
}

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
