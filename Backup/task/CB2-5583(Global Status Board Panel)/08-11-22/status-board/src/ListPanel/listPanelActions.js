import * as t from "./actionTypes";


export const orgFilterChanged = orgFilters => {
	return {
		type: t.ORG_FILTERS_CHANGED,
		payload: orgFilters
	};
};

