import * as t from "./actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { search } from "../../SearchForm/searchFormActions";

const savedSearchSelected = (id, type, values) => {
	return {
		type: t.SAVED_SEARCH_SELECTED,
		payload: { id, type, values }
	};
};

export const savedSearchCleared = () => {
	return {
		type: t.SAVED_SEARCH_CLEARED
	};
};

export const setSavedSearch = id => {
	return (dispatch, getState) => {
		const { savedSearches } = getState().appState.persisted;
		if (
			!id ||
			!savedSearches ||
			!savedSearches.find(search => search.id === id)
		) {
			dispatch(savedSearchCleared());
		} else {
			const { type, values } = savedSearches.find(search => search.id === id);
			dispatch(savedSearchSelected(id, type, values));
			dispatch(search(id));
		}
	};
};

export const removeSavedSearch = id => {
	return (dispatch, getState) => {
		const { savedSearches } = getState().appState.persisted;
		const { selected } = getState().searchForm;
		dispatch(
			updatePersistedState("law-enforcement-search-app", "savedSearches", {
				savedSearches: savedSearches.filter(search => search.id !== id)
			})
		);
		if (selected === id) {
			dispatch(savedSearchCleared());
		}
	};
};
