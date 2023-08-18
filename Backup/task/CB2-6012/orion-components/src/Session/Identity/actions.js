import { authService } from "client-app-core";

import * as t from "./actionTypes.js";

/*
 * Set user identity state to null
 */
export const identityInvalidated = () => {
	return {
		type: t.IDENTITY_INVALIDATED
	};
};

/*
 * Log out user
 */
export const logOut = () => {
	return (dispatch) => {
		authService.logout(function () {
			dispatch(identityInvalidated());
		});
	};
};

export const getIdentitySuccess = (user) => {
	return {
		type: t.GET_IDENTITY_SUCCESS,
		user: user
	};
};

export const getIdentityFailure = (errMsg) => {
	return {
		type: t.GET_IDENTITY_FAILURE,
		errMsg
	};
};

export const getIdentity = () => {
	return (dispatch) => {
		authService.getLoggedInUser(function (err, user) {
			if (err) {
				dispatch(getIdentityFailure(err.response.status === 401 ? "Unauthorized" : "Server Error"));
			} else {
				dispatch(getIdentitySuccess(user));
			}
		});
	};
};
