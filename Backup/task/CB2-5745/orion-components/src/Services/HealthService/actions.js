import { systemHealthService } from "client-app-core";
import * as t from "./actionTypes";

const systemHealthReceived = (data) => {
	return {
		type: t.SYSTEM_HEALTH_RECEIVED,
		payload: data
	};
};

const systemHealthError = () => {
	return {
		type: t.SYSTEM_HEALTH_ERROR,
		payload: true
	};
};

const getSystemHealth = () => {
	return (dispatch) => {
		systemHealthService.getAllWithAuth((err, res) => {
			if (err) {
				console.log("System health error received", err);
				dispatch(systemHealthError());
			} else {
				dispatch(systemHealthReceived(res));
			}
		});
	};
};

export const startHealthPolling = () => {
	return (dispatch) => {
		// Get initial system health on load
		dispatch(getSystemHealth());

		// Poll for system health every 15 seconds
		setInterval(() => {
			dispatch(getSystemHealth());
		}, 15000);
	};
};
