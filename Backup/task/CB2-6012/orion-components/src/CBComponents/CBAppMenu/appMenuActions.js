import { authService } from "client-app-core";
import * as t from "./actionTypes.js";

export const identityInvalidated = () => {
	return {
		type: t.IDENTITY_INVALIDATED
	};
};

export const logOut = () => {
	return (dispatch) => {
		authService.logout((err) => {
			if (err) console.log(err);
			dispatch(identityInvalidated());
		});
	};
};
