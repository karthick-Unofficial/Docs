import { eventService } from "client-app-core";

import * as t from "../../../actionTypes";

export const updateItemSearch = (textEntry) => {
	return {
		type: t.UPDATE_ITEM_SEARCH,
		payload: textEntry
	};
};

export const showSearchResults = (results) => {
	return {
		type: t.SHOW_SEARCH_RESULTS,
		payload: results
	};
};

export const queryDialogError = (err) => {
	return {
		type: t.QUERY_DIALOG_ERROR,
		err: err
	};
};

export const queryPinnableItems = (textEntry) => {
	const thunk = (dispatch, getState) => {
		const eventId = getState().appState.selectedEvent.id;

		dispatch(updateItemSearch(textEntry));

		if (textEntry === "") {
			dispatch(showSearchResults([]));
			return;
		}

		eventService.queryPinnable(eventId, textEntry, 5, (err, response) => {
			if (err) {
				console.log(err);
				dispatch(queryDialogError(err));
			} else {
				dispatch(showSearchResults(response));
				console.log(response);
			}
		});
	};

	thunk.meta = {
		debounce: {
			time: 300,
			key: "QUERY_PINNABLE"
		}
	};
	return thunk;
};

export const pinItems = (items) => {
	return (dispatch, getState) => {
		const eventId = getState().appState.selectedEvent.id;

		eventService.pinEntities(eventId, items, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				console.log(response);
			}
		});
	};
};

export const closePinDialog = () => {
	return {
		type: t.CLOSE_EVENT_PIN_DIALOG
	};
};
