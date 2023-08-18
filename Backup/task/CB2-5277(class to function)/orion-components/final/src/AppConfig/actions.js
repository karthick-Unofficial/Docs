import * as t from "./actionTypes";
import { applicationService } from "client-app-core";

const appConfigReceived = config => {
	return {
		type: t.APP_CONFIG_RECEIVED,
		payload: { config }
	};
};

export const getAppConfig = app => {
	return dispatch => {
		applicationService.getApplicationConfig(app, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(appConfigReceived(response));
			}
		});
	};
};
