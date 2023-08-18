import { applicationService } from "client-app-core";
import * as t from "./actionTypes";


const clientConfigReceived = data => {
	return {
		type: t.CLIENT_CONFIG_RECEIVED,
		payload: data
	};
};

export const getClientConfig = (setReady) => {
	return dispatch => {
		applicationService.getApplicationConfig((err, res) => {
			if (err) {
				console.log("Client config error received", err);
			}
			else {
				dispatch(clientConfigReceived(res));
				dispatch(setReady());
			}
		});
	};
};