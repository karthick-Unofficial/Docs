import * as t from "./actionTypes";
import { userService } from "client-app-core";
import { setLocaleWithFallback } from "orion-components/i18n/Actions";

const globalAppStateReceived = appState => {
	return {
		type: t.APP_SETTINGS_STATE_RECEIVED,
		payload: appState
	};
};

const updateLocalUserAppSettings = (update) => {
	return {
		type: t.LOCAL_APP_SETTINGS_UPDATED,
		payload: update
	};
};

/**
 * Retrieve a user's appSettings and set in redux state
 */
export const getGlobalAppState = () => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			userService.getAppSettings((err, result) => {
				if (err) {
					console.log(err);
				}
				else {
					dispatch(globalAppStateReceived(result));
					dispatch(setLocaleWithFallback(result.locale));
					resolve();
				}
			});
		});
	};
};


/**
 * Update a user's appSettings in local redux state and in the database
 * @param {object} update -- Update object
 */
export function updateGlobalUserAppSettings(update) {
	return dispatch => {
		userService.updateAppSettings(update, (err, res) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(updateLocalUserAppSettings(update));
			}
		});
	};
}