export { searchFormReset } from "../SearchForm/searchFormActions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { savedSearchCleared } from "./SavedSearch/savedSearchActions";

export const clearSavedSearches = () => {
	return (dispatch, getState) => {
		dispatch(
			updatePersistedState("law-enforcement-search-app", "savedSearches", {
				savedSearches: []
			})
		);
		if (getState().searchForm.selected) {
			dispatch(savedSearchCleared());
		}
	};
};
