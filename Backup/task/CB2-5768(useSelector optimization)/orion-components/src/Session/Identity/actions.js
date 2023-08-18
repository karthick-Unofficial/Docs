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
