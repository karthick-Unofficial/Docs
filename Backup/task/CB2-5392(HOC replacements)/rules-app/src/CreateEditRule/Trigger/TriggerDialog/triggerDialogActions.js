import { shapeService } from "client-app-core";
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

export const clearSearchResults = () => {
	return {
		type: t.CLEAR_SEARCH_RESULTS
	};
};

export const toggleQuerying = () => {
	return {
		type: t.TOGGLE_QUERYING
	};
};

export const queryShapes = () => {
	return dispatch => {
		dispatch(toggleQuerying());
		shapeService.getMyShapes((err, response) => {
			if (err) {
				console.log(err);
				dispatch(queryDialogError(err));
			} else {
				dispatch(showSearchResults(response));
			}
		});
	};
};