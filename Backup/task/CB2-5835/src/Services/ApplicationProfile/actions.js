import { applicationService } from "client-app-core";
import * as t from "./actionTypes";

const applicationProfileReceived = (data) => {
	return {
		type: t.APPLICATION_PROFILE_RECEIVED,
		payload: data
	};
};

export const getApplicationProfile = (setReady) => {
	return (dispatch) => {
		const path = window.location.pathname;
		const app = path.split("/")[1];
		applicationService.getApplication(app, (err, res) => {
			if (err) {
				console.log("Application profile error received", err);
			} else {
				dispatch(applicationProfileReceived(res));
				setReady();
			}
		});
	};
};
