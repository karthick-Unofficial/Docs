import {
	userService,
	organizationService,
	applicationService,
	integrationService,
	sharingConnectionService
} from "client-app-core";
import { logOut } from "orion-components/Session/Actions";
import { closeDialog } from "orion-components/AppState/Actions";

import * as t from "./actionTypes";
export { hydrateUser } from "orion-components/Session/Actions";
import { getGlobalAppState } from "orion-components/AppState/Actions";
export { subscribeFeedPermissions } from "orion-components/GlobalData/Actions";

export const setFetching = () => {
	return {
		type: t.IS_FETCHING
	};
};

export const hydrateEcosystemSuccess = (orgs, users, apps, integrations) => {
	return {
		type: t.HYDRATE_ECOSYSTEM_SUCCESS,
		orgs,
		users,
		apps,
		integrations
	};
};

export const isRefreshingEcosystem = () => {
	return {
		type: t.IS_REFRESHING_ECOSYSTEM
	};
};

export const hydrateEcosystem = () => {
	// all run in parallel
	return async dispatch => {
		try {
			const responses = await Promise.all([
				organizationService.getAll(),
				userService.getAll(),
				applicationService.getAll(),
				integrationService.getAll()
			]);
			dispatch(
				hydrateEcosystemSuccess(
					responses[0],
					responses[1],
					responses[2],
					responses[3]
				)
			);
		} catch (err) {
			console.log(err);
		}
	};
};

export const refreshEcosystemSuccess = (orgs, users, apps, integrations) => {
	return {
		type: t.REFRESH_ECOSYSTEM_SUCCESS,
		orgs,
		users,
		apps,
		integrations
	};
};

export const refreshUserSuccess = data => {
	return {
		type: t.REFRESH_USER_SUCCESS,
		user: data.user
	};
};

export const isRefreshingUser = () => {
	return {
		type: t.IS_REFRESHING_USER
	};
};

export const refreshUser = () => {
	return dispatch => {
		dispatch(isRefreshingUser());

		userService.getMyProfile((err, response) => {
			if (err) {
				console.log(err);
				dispatch(logOut());
			} else {
				dispatch(refreshUserSuccess(response));
			}
		});
	};
};

export const refreshEcosystem = () => {
	// all run in parallel
	return async (dispatch, getState) => {
		try {
			const dialog = getState().appState.dialog.openDialog;
			dispatch(closeDialog(dialog));
			dispatch(isRefreshingEcosystem());
			const responses = await Promise.all([
				organizationService.getAll(),
				userService.getAll(),
				applicationService.getAll(),
				integrationService.getAll()
			]);
			dispatch(
				refreshEcosystemSuccess(
					responses[0],
					responses[1],
					responses[2],
					responses[3]
				)
			);
		} catch (err) {
			console.log(err);
		}
	};
};

export const refreshAll = id => {
	return dispatch => {
		dispatch(refreshEcosystem());
		dispatch(refreshUser());
	};
};

// Make this return an action that will log to ElasticSearch later, etc.
export const handleError = err => {
	console.log(err);
};

export const sharingTokenStatusReceived = enabledStatus => {
	return {
		type: t.SHARING_TOKEN_STATUS_RECEIVED,
		payload: enabledStatus
	};
};

export const checkSharingTokenSystemStatus = () => {
	return dispatch => {
		sharingConnectionService.sharingTokensEnabled((err, res) => {
			if (err) {
				console.log(err);
			}
			else {
				const enabled = res.enabled;
				dispatch(sharingTokenStatusReceived(enabled));
			}
		});
	};
};

export const hydrateGlobalAppSettings = () => {
	return dispatch => {
		dispatch(getGlobalAppState());
	}
};

export const checkSharingTokenStatus = () => {
	return dispatch => {
		dispatch(checkSharingTokenSystemStatus());
	}
};