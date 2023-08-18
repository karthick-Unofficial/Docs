import * as t from "./actionTypes";
import { userService } from "client-app-core";

import _ from "lodash";

/*
* Set persisted app state from DB
* @params appState: app state object
*/
const appStateReceived = appState => {
	return {
		type: t.APP_STATE_RECEIVED,
		payload: { appState }
	};
};

/*
* Get persisted app state from DB
* @params app: app name string
*/
export const getAppState = app => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			userService.getAppState(app, (err, result) => {
				if (err) console.log(err);
				else {
					dispatch(appStateReceived({
						...result.state
					}));
					resolve();
				}
			});
		});
	};
};

/*
* Set app state from caller - for offline usage, i.e. standalone replay
* @params app: app name string
* @params state: app state object
*/
export const setAppState = (app, state) => {
	return dispatch => {
		dispatch(appStateReceived({
			...state
		}));
	};
};


/*
* Update persisted app state in local state
* @params keyVal: an object with a key-value pair to update in the local state (ex: { mapZoom: 11 })
*/
export const setLocalAppState = (key, value) => {
	return {
		type: t.SET_LOCAL_APP_STATE,
		payload: {
			key,
			value
		}
	};
};

/*
* Update persisted app state in DB and local state
* @params app: app name string
* @params key: an object key string to update in the DB and local state 
* @params value: an object value to update in the DB and local state
* @params reliable: if set to true, the local state would be updated only after the persistence 
*                   on server is successful. Default value is true.
*/
export const updatePersistedState = (app, key, value, reliable = true) => {
	return (dispatch, getState) => {
		// Check to see if we are updating a nested object
		const isNested = !_.keys(value).includes(key);
		const oldValue = getState().appState.persisted[key];
		// If not updating a nested object, only return the value
		const update = isNested
			? { ...(oldValue || value), ...value }
			: _.get(value, key);
		if (!reliable) { // We update the local state straight-away
			dispatch(setLocalAppState(key, update));
		}

		userService.setAppState(app, { [key]: update }, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				if (reliable) {
					dispatch(setLocalAppState(key, update));
				}
			}
		});
	};
};
