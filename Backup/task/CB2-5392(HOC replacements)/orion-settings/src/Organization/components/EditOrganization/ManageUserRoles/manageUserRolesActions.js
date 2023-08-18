import { roleService, userService, organizationService } from "client-app-core";
import { fetchProfileSuccess } from "../../../../UserAccount/userAccountActions";
import * as t from "../../../../actionTypes";
import {
	closeDialog,
	setLoading
} from "orion-components/AppState/Actions";
// Custom Metrics
import Metric from "browser-metrics/lib/Metric";
export {
	openDialog,
	closeDialog
} from "orion-components/AppState/Actions";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const deleteRoleMetric = new Metric("DELETE_ROLE_METRIC");
const updateUserRoleMetric = new Metric("UPDATE_USER_ROLE_METRIC");
const updateRoleMetric = new Metric("UPDATE_ROLE_METRIC");
const createRoleMetric = new Metric("CREATE_ROLE_METRIC");
const loadPermissionsMetric = new Metric("LOAD_PERMISSIONS_METRIC");

export const hasError = () => {
	return {
		type: t.HAS_ERROR
	};
};

export const deleteRoleSuccess = (id, orgId) => {
	deleteRoleMetric.end();
	logMetric(deleteRoleMetric);
	return {
		id,
		orgId,
		type: t.DELETE_ROLE_SUCCESS
	};
};

export const closePermissionsDialog = () => {
	return dispatch => {
		dispatch(closeDialog("permissionsDialog"));
	};
};

export const permissionsDialogWorking = () => {
	return dispatch => {
		dispatch(setLoading("permissionsDialog", true));
	};
};

export const permissionsDialogDone = () => {
	return dispatch => {
		dispatch(setLoading("permissionsDialog", false));
		dispatch(closeDialog("permissionsDialog"));
	};
};

export const permissionsDialogError = () => {
	return {
		type: t.PERMISSIONS_DIALOG_ERROR
	};
};

export const deleteRole = (selectOrgRole, updateChangeUserRoleList, id, orgId) => {
	return dispatch => {
		deleteRoleMetric.start();
		dispatch(permissionsDialogWorking());
		roleService.deleteRole(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				updateChangeUserRoleList({});
				dispatch(deleteRoleSuccess(id, orgId));
				dispatch(closeDialog("deleteRole"));
				selectOrgRole(null);
			}
		});
	};
};

export const updateUserRoleSuccess = (userId, roleId) => {
	updateUserRoleMetric.end();
	logMetric(updateUserRoleMetric);
	return {
		type: t.UPDATE_USER_ROLE_SUCCESS,
		userId,
		roleId
	};
};

export const updateUserRole = (userId, role) => {
	return dispatch => {
		updateUserRoleMetric.start();
		userService.updateRole(userId, role, (err, response) => {
			if (err) {
				console.log(err);
				dispatch(permissionsDialogError());
			} else {
				dispatch(closePermissionsDialog());
				userService.getProfile(userId, (err, response) => {
					if (err) {
						// dispatch error action
						console.log(err);
						// Once handleError dispatches an action, uncomment
						// dispatch(handleError(err));
					} else {
						const user = Object.assign({}, response.user, {
							org: response.org
						});
						dispatch(fetchProfileSuccess(user));
					}
				});
			}
		});
	};
};

export const updateRoleSuccess = (newRole, orgId) => {
	updateRoleMetric.end();
	logMetric(updateRoleMetric);
	return {
		newRole,
		orgId,
		type: t.UPDATE_ROLE_SUCCESS
	};
};

export const updateRole = (roleId, request) => {
	return dispatch => {
		updateRoleMetric.start();
		roleService.updateRole(roleId, request, (err, response) => {
			if (err) {
				console.log(err);
			} else if (!response.success && response.reason) {
				console.log("Error while trying to update role permissions: ", response.reason.message.message);
			} else {
				dispatch(updateRoleSuccess(request, request.orgId));
			}
		});
	};
};

export const createRoleSuccess = (newRole, orgId) => {
	createRoleMetric.end();
	logMetric(createRoleMetric);
	return {
		newRole,
		orgId,
		type: t.CREATE_ROLE_SUCCESS
	};
};

export const createNewRole = (request, clearDescription) => {
	return dispatch => {
		createRoleMetric.start();
		roleService.createRole(request, (err, response) => {
			if (err) {
				console.log(err);
			} else if (!response.length || !response[0].changes || !response[0].changes.length || !response[0].changes[0].new_val) {
				console.log("Error creating new role");
			} else {
				dispatch(createRoleSuccess(response[0].changes[0].new_val, request.orgId));
				dispatch(closeDialog("createRole"));
				clearDescription("");
			}
		});
	};
};