import * as actionTypes from "./actionTypes";

import {
	userService
} from "client-app-core";

import { FETCH_USERS_SUCCESS } from "./actionTypes";

export { hydrateUser } from "orion-components/Session/Actions";
export { subscribeFeedPermissions } from "orion-components/GlobalData/Actions";
export { getAppState, getGlobalAppState } from "orion-components/AppState/Actions";

export const fetchUsersSuccess = (users) => {
	return {
		type: FETCH_USERS_SUCCESS,
		payload: {
			users
		}
	};
};

export const fetchUsers = () => {
	return async dispatch => {
		try {
			const responses = await Promise.all([
				userService.getAll()
			]);
			dispatch(
				fetchUsersSuccess(
					responses[0]
				)
			);
		} catch (err) {
			console.log(err);
		}
	};
};

export const sendComponentMessage = ( message ) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message
	};
};

export const clearComponentMessage = () => {
	return {
		type: actionTypes.CLEAR_COMPONENT_MESSAGE
	};
};

export const raiseError = (error) => {
	return {
		type: actionTypes.OPERATION_FAILED,
		error
	};
};

export const setLocalState = (component, key, value) => {
	return {
		type: actionTypes.SET_LOCAL_STATE,
		component,
		key,
		value
	};
};