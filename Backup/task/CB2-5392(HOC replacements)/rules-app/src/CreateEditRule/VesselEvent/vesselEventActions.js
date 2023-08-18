import { berthService, cameraService, restClient } from "client-app-core";
import * as t from "./actionTypes";

export { openDialog } from "orion-components/AppState/Actions";


export const berthsReceived = (berths) => {
	return {
		type: t.BERTHS_RECEIVED,
		payload: {
			berths
		}
	};
};

// TODO: Make this work
export const getAllBerths = () => {
	return dispatch => {
		berthService.getAllBerths((err, res) => {
			if (err) {
				console.log("Err", err);
			} else {
				dispatch(berthsReceived(res));
			}
		});
	};
};