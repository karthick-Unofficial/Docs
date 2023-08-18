import { entityCollection } from "client-app-core";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";

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

export function removeFromCollection(
	collectionName,
	collectionId,
	members,
	undoing
) {
	return function (dispatch) {
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
}