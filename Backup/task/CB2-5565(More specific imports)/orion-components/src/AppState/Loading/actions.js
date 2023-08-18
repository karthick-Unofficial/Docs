import * as t from "./actionTypes";

/*
* Set the loading status for a component
* @param component: listPanel, profile, dialog, etc.
* @param loading: true/false
*/
export const setLoading = (component, loading) => {
	return {
		type: t.SET_LOADING,
		payload: {
			component,
			loading
		}
	};
};

/*
* Toggle the loading status for a component
* @param component: listPanel, profile, dialog, etc.
*/
export const toggleLoading = component => {
	return {
		type: t.TOGGLE_LOADING,
		payload: {
			component
		}
	};
};
