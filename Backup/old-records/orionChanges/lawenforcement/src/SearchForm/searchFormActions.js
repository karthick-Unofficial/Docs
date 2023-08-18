import * as t from "./actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
import uuid from "uuid/v4";
import { restClient } from "client-app-core";
import { savedSearchCleared } from "../SearchPanel/SavedSearch/savedSearchActions";

export const searchFormReset = () => {
	return {
		type: t.SEARCH_FORM_RESET
	};
};

export const searchFieldUpdated = (field, value) => {
	return {
		type: t.SEARCH_FIELD_UPDATED,
		payload: { field, value }
	};
};

export const saveSearch = () => {
	return (dispatch, getState) => {
		const { appState, searchForm } = getState();
		const savedSearches = appState.persisted.savedSearches || [];
		const { type } = searchForm;
		const values = searchForm[type];
		const newSavedSearches = [
			...savedSearches,
			{ id: uuid(), type, values, date: new Date() }
		];
		dispatch(
			updatePersistedState("law-enforcement-search-app", "savedSearches", {
				savedSearches: newSavedSearches
			})
		);
	};
};

export const searchResultsReceived = results => {
	return {
		type: t.SEARCH_RESULTS_RECEIVED,
		payload: { results }
	};
};

export const search = id => {
	return (dispatch, getState) => {
		const { searchForm } = getState();
		if (!id) {
			dispatch(savedSearchCleared());
		}
		const fields = searchForm[searchForm.type];
		let request = "/law-enforcement-search-app/api/search?";
		Object.keys(fields).forEach((key, index) => {
			if (fields[key] && fields[key] !== "all") {
				if (index !== 0) {
					request += "&";
				}
				request += `${key.toLowerCase()}=${fields[key].toLowerCase()}`;
			}
		});
		restClient.exec_get(request, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(searchResultsReceived(response));
			}
		});
	};
};
