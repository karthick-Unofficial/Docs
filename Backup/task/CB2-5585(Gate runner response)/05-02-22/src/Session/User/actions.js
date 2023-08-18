import { userService, authService, restClient } from "client-app-core";
import { logOut } from "../Identity/actions";
import * as t from "./actionTypes";

/*
 * Set a user's profile in state
 * @param user: user object
 */
const hydrateUserSuccess = res => {
	return {
		type: t.HYDRATE_USER_SUCCESS,
		user: res.user,
		org: res.org,
		externalSystems: res.externalSystems
	};
};

const endSession = () => {
	return {
		type: t.SESSION_ENDED
	};
};

const handleSessionEnd = mockStore => {
	mockStore.dispatch(endSession());
};

const firstUseTextReceived = text => {
	return {
		type: t.FIRST_USE_TEXT_RECEIVED,
		payload: { text }
	};
};

export const getFirstUseText = () => {
	return dispatch => {
		restClient.exec_get("/ecosystem/api/_clientConfig", (err, response) => {
			if (err) console.log("ERROR", err);
			if (!response) return;
			const { firstUseText } = response;
			if (firstUseText) dispatch(firstUseTextReceived(firstUseText));
		});
	};
};

const firstUseConfirmed = () => {
	return {
		type: t.FIRST_USE_CONFIRMED
	};
};

export const confirmFirstUse = userId => {
	return dispatch => {
		const update = { firstUseAck: true };
		userService.updateUser(userId, update, (err, response) => {
			if (err) console.log("ERROR", err);
			if (!response) return;
			dispatch(firstUseConfirmed());
		});
	};
};

/*
 * Get a user's profile
 * @param userId: user's ID
 */
export const hydrateUser = userId => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			userService.getProfile(userId, (err, response) => {
				if (err) {
					console.log(err);
					if (err.response.status === 404 || err.response.status === 401) {
						dispatch(logOut());
					}
				} else {
					const { firstUseAck } = response.user;
					dispatch(hydrateUserSuccess(response));
					const mockStore = { dispatch };
					const handler = handleSessionEnd.bind(this, mockStore);
					authService.addSessionEndHandler(handler);
					if (!firstUseAck) dispatch(getFirstUseText());
					resolve();
				}
			});
		});
	};
};

/*
 * Set a user's profile - used in portable replay
 * @param userProfile: user profile with same schema retrieved in hydrateUser
 */
export const setUserProfile = userProfile => {
	return dispatch => {
		dispatch(hydrateUserSuccess(userProfile));
	};
};
