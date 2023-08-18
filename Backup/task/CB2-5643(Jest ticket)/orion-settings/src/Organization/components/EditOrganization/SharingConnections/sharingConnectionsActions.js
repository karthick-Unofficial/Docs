import { sharingConnectionService, organizationService } from "client-app-core";
import * as t from "../../../../actionTypes";

export { openDialog, closeDialog } from "orion-components/AppState/Actions";


const getAllOrgsSuccess = payload => {
	return {
		type: t.GET_ALL_ORGS_SUCCESS,
		orgs: payload
	};
};

// This will refresh sharing connection data
export const getAllOrgs = () => {
	return dispatch => {
		organizationService.getAll((err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(getAllOrgsSuccess(response));
			}
		});
	};
};

export const createConnection = () => {
	return dispatch => {
		sharingConnectionService.createConnection((err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(getAllOrgs());
			}
		});
	};
};

export const disconnect = (connectionId) => {
	return dispatch => {
		sharingConnectionService.disconnectConnection(connectionId, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				if (response.success) {
					dispatch(getAllOrgs());
				}
			}
		});
	};
};

export const establishConnection = (connectionId, callback) => {
	return dispatch => {
		sharingConnectionService.establishConnection(connectionId, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				if (response.success) {
					dispatch(getAllOrgs());
				}
				callback(null, response);
			}
		});
	};
};