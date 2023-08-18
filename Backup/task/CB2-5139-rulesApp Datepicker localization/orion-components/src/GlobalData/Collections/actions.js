import * as t from "./actionTypes";
import { entityCollection } from "client-app-core";

/*
* Add or update a collection in state
* @param collection: a collection object
*/
const collectionReceived = collection => {
	return {
		type: t.COLLECTION_RECEIVED,
		payload: { collection }
	};
};

/*
* Remove a collection in state
* @param collection: ID of a collection to be removed
*/
const collectionRemoved = collectionId => {
	return {
		type: t.COLLECTION_REMOVED,
		payload: { collectionId }
	};
};

/*
* Subscribe to collections feed
*/
export const subscribeCollections = () => {
	return (dispatch, getState) => {
		entityCollection.subscribeAll((err, response) => {
			if (err) console.log(err);
			else {
				if (!response) return;
				switch (response.type) {
					case "initial":
						dispatch(collectionReceived(response.new_val));
						break;
					case "add":
						dispatch(collectionReceived(response.new_val));
						break;
					case "remove":
						dispatch(collectionRemoved(response.old_val.id));
						break;
					case "change":
						dispatch(collectionReceived(response.new_val));
						break;

					default:
				}
			}
		});
	};
};
