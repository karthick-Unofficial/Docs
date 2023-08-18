
import * as t from "../../actionTypes";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";


export const clearSearchResults = () => {
	return {
		type: t.CLEAR_SEARCH_RESULTS
	};
};
