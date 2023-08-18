import * as t from "./actionTypes";


export const searchUpdated = value => {
	return {
		type: t.SEARCH_UPDATED,
		payload: value
	};
};

