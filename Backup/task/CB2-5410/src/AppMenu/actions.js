import { authService, userService } from "client-app-core";

import * as t from "./actionTypes.js";

export const hydrateUserSuccess = (user) => {
	return {
		type: t.HYDRATE_USER_SUCCESS,
		user: user
	};
};

export const hydrateUser = (username) => {
	return (dispatch) => {
		return new Promise((resolve) => {
			userService.getProfile(username, (err, response) => {
				if (err) {
					console.log(err);
					if (err.response.status === 404) {
						dispatch(logOut());
					}
				} else {
					dispatch(hydrateUserSuccess(response.user));
					resolve();
				}
			});
		});
	};
};

export const identityInvalidated = () => {
	return {
		type: t.IDENTITY_INVALIDATED
	};
};

export const logOut = () => {
	return (dispatch) => {
		authService.logout(function () {
			dispatch(identityInvalidated());
		});
	};
};
