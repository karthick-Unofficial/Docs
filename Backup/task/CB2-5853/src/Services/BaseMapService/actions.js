import { baseMapsService } from "client-app-core";
import { BASE_MAP_CONFIG_RECEIVED } from "./actionTypes";

const baseMapConfigReceived = (data) => {
	return {
		type: BASE_MAP_CONFIG_RECEIVED,
		payload: data
	};
};

export const getBaseMapConfigurations = (setReady) => {
	return (dispatch) => {
		baseMapsService.getAllBaseMaps((err, res) => {
			if (err) {
				console.log("Base map  config error received", err);
			} else {
				dispatch(baseMapConfigReceived(res));
				setReady();
			}
		});
	};
};
