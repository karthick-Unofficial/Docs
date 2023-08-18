import * as t from "./actionTypes";
import { listService, userService } from "client-app-core";

const setLookupValues = (lookupType, values) => {
	return {
		type: t.LOOKUP_DATA_RECEIVED,
		payload: {
			lookupType,
			values
		}
	};
};
/*
* Add list data to state
* @param lists: an associative array of lists
*/
const listsReceived = lists => {
	return {
		type: t.LISTS_RECEIVED,
		payload: {
			lists
		}
	};
};

// Get all Original Lists from DB
export const getAllLists = () => {
	return dispatch => {
		listService.getAll((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(listsReceived(response));
		});
	};
};

// Stream all original (Lists App) lists from DB
export const streamLists = () => {
	return dispatch => {
		listService.streamOriginalLists((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(listReceived(response.new_val.id, response.new_val));
		});
	};
};

/*
* Update list data in state
* @param listId: id of list to be updated
* @param list: updated list data
*/
const listReceived = (listId, list) => {
	return {
		type: t.LIST_RECEIVED,
		payload: {
			listId,
			list
		}
	};
};

/*
* Create a new list
* @param list: list data
*/
export const createList = list => {
	return dispatch => {
		listService.createList(list, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

/*
* Remove list data from state
* @param listId: id of list to be removed
*/
export const updateList = (listId, list) => {
	return dispatch => {
		listService.updateList(listId, list, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

/*
* Remove list data from state
* @param listId: id of list to be removed
*/
const listRemoved = listId => {
	return {
		type: t.LIST_REMOVED,
		payload: {
			listId
		}
	};
};

/* Remove list from DB
* @param listId: id of list to be removed
*/
export const deleteList = listId => {
	return dispatch => {
		listService.deleteList(listId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

/* Duplicate
* @param listId: id of list to be shared
* @param list: new list data ({name, type})
*/
export const duplicateList = (listId, list) => {
	return dispatch => {
		listService.cloneList(listId, list, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

export const getLookupValues = (lookupType) => {
	return dispatch => {
		userService.getAllOrgUsers((err, result) => {
			if (err)
				console.log(err);
			else {
				dispatch(setLookupValues(lookupType, result));
			}
		});
	};
};
