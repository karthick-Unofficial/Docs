import { restClient } from "client-app-core";

import * as t from "../../../actionTypes";

export { typeAheadFilter } from "../../../TypeAheadFilter/typeAheadFilterActions";

export const showSearchResults = results => {
	return {
		type: t.SHOW_SEARCH_RESULTS,
		payload: results
	};
};

export const queryDialogError = err => {
	return {
		type: t.QUERY_DIALOG_ERROR,
		err: err
	};
};

export const updateItemSearch = textEntry => {
	return {
		type: t.UPDATE_TRACK_SEARCH,
		payload: textEntry
	};
};

export const clearSearchResults = () => {
	return {
		type: t.CLEAR_SEARCH_RESULTS
	};
};

export const queryTracks = textEntry => {
	const thunk = (dispatch, getState) => {
		
		dispatch(updateItemSearch(textEntry));
		const thisId = getState().appState.profilePage.queryId;

		if (textEntry === "") {
			dispatch(showSearchResults([]));
			return;
		}

		restClient.exec_get(`/ecosystem/api/feedEntities?q=${textEntry}`, (err, response) => {
			// Cancel if new query has been performed
			if (thisId !== getState().appState.profilePage.queryId) {
				return;
			} 
			if (err) {
				console.log(err);
				dispatch(queryDialogError(err));
			} else {
				dispatch(showSearchResults(Array.isArray(response) ? response : []));
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