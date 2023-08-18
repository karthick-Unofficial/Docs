import { browserHistory } from "react-router";
import { routes as r } from "../../routes.js";

import { userService, attachmentService } from "client-app-core";
import { setLoading } from "orion-components/AppState/Actions";
export { updateGlobalUserAppSettings } from "orion-components/AppState/Actions";
import * as t from "../../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = (metric) => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const updateUserMetric = new Metric("UPDATE_USER_METRIC");
const fetchProfileMetric = new Metric("FETCH_PROFILE_METRIC");

const passwordChangeMetric = new Metric("PASSWORD_CHANGE_METRIC");

export function isSubmittingPassword() {
	return dispatch => {
		dispatch(setLoading("changePassword", true));
	};
}

export function passwordChangeSuccess() {
	passwordChangeMetric.end();
	logMetric(passwordChangeMetric);
	return {
		type: t.PASSWORD_CHANGE_SUCCESS
	};
}

export function passwordChangeError(message) {
	return {
		message,
		type: t.PASSWORD_CHANGE_ERROR
	};
}

export function clearPasswordState() {
	return {
		type: t.CLEAR_PASSWORD_STATE
	};
}

export function changePassword(userId, currentPassword, newPassword, adminChange, callback) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			passwordChangeMetric.start();

			dispatch(isSubmittingPassword());
			userService.changePassword(
				userId,
				currentPassword,
				newPassword,
				adminChange,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
						if (err.response.status === 401) {
							const message = "The current password provided is incorrect.";
							console.log("first message: ", message);
							callback(message);
							dispatch(passwordChangeError(message));
							resolve();
						}
					}
					const { success, reason } = response;
					if (success === false) {
						let errorMessage = "Failed to change password";
						if (reason) {
							const { message } = reason;
							errorMessage = message;
						}
						console.log("second message: ", errorMessage);
						callback(errorMessage);
						dispatch(passwordChangeError(errorMessage));
						resolve();
					} else {
						callback("");
						dispatch(passwordChangeSuccess());
						resolve();
					}
				}
			);
			dispatch(setLoading("changePassword", false));
		});
	};
}

export const fetchProfileSuccess = (user) => {
	fetchProfileMetric.end();
	logMetric(fetchProfileMetric);
	return {
		type: t.FETCH_PROFILE_SUCCESS,
		user
	};
};

export function uploadUserProfileImage(user, file, callback) {
	if (!file) {
		return () => {
			callback(null, { result: "Keep moving, no need" });
		};
	}
	else {
		const userId = user.id;
		return async (dispatch) => {
			const attachResult = await attachmentService.uploadFiles(userId, "profile", file);
			const generatedHandle = attachResult.generatedHandle;

			if (user.profileImage) {
				// clear out old profile image
				await attachmentService.deleteFiles(user.profileImage);
			}
			const setResult = await userService.setProfileImage(userId, generatedHandle);
			callback(null, setResult);

		};
	}

}

export const updateUserSuccess = (data) => {
	updateUserMetric.end();
	logMetric(updateUserMetric);
	return {
		type: t.UPDATE_USER_SUCCESS,
		viewing: data
	};
};

export const isSubmittingUserUpdate = () => {
	return {
		type: t.IS_SUBMITTING_USER_UPDATE
	};
};

export const updateUser = (userId, user, profileImage) => {
	return dispatch => {
		// Removed because triggers app rerender when we don't want it
		// -- Can set a different fetching state to render a spinner while updating?
		// dispatch(isFetching());
		updateUserMetric.start();
		dispatch(setLoading("userProfile", true));

		userService.updateUser(userId, user, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				const user = response.changes[0].new_val;
				// This will return and continue immediately if we pass it a null profileImage
				dispatch(uploadUserProfileImage(user, profileImage, (err, result) => {
					if (err) {

						console.log(err);

					} else {

						dispatch(setLoading("userProfile", false));
						dispatch(updateUserSuccess(response));
						// This is only here because response does not contain updated user yet so we have to fetch again
						userService.getProfile(userId, (err, response) => {
							if (err) {
								// console.log(err);
								// Once handleError dispatches an action, uncomment
								// dispatch(handleError(err));
							}
							else {
								const user = Object.assign({}, response.user, { org: response.org });
								dispatch(fetchProfileSuccess(user));
							}
						});

					}
				}));
			}
		});
	};
};