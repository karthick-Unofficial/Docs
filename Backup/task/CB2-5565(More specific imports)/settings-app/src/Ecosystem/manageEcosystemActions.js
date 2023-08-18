// Toggle organizations app permissions on/off
// This has been updated in client-app-core and ecosystem on v0.0.3

import { organizationService, attachmentService } from "client-app-core";

import { updateOrgSuccess } from "../Organization/manageOrganizationActions";
import { getAllOrgs } from "../Organization/components/EditOrganization/SharingConnections/sharingConnectionsActions";
import { closeDialog } from "orion-components/AppState/Actions";
import * as t from "../actionTypes";
import { createNewUser } from "../Organization/components/EditOrganization/ManageUsers/manageUserActions";
// Custom Metrics
import Metric from "browser-metrics/lib/Metric";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";

const updateOrgMetric = new Metric("UPDATE_ORG_METRIC");

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};
const createOrgSuccessMetric = new Metric("CREATE_ORG_SUCCESS_METRIC");
const profileImageUploadMetric = new Metric("PROFILE_IMAGE_UPLOAD_METRIC");

export const toggleOrgDisabled = (orgId) => {

	const data = { organization: { disabled: true } };

	return dispatch => {
		updateOrgMetric.start();

		organizationService.updateOrganization(orgId, data, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const updateResult = response.changes[0].new_val;
				dispatch(updateOrgSuccess(updateResult));
			}
		});
	};
};

export const toggleOrgActive = (orgId) => {

	const data = { organization: { disabled: false } };

	return dispatch => {
		updateOrgMetric.start();

		organizationService.updateOrganization(orgId, data, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const updateResult = response.changes[0].new_val;
				dispatch(updateOrgSuccess(updateResult));
			}
		});
	};

};
export function uploadOrgProfileImage(org, file, callback) {
	if (!file) {
		callback(null, { result: "Keep moving, no need" });
		return;
	}
	const orgId = org.orgId;
	return async dispatch => {
		profileImageUploadMetric.start();
		const attachResult = await attachmentService.uploadFiles(orgId, "orgProfile", file);
		const generatedHandle = attachResult.generatedHandle;

		if (org.profileImage) {
			// clear out old profile image
			await attachmentService.deleteFiles(org.profileImage);
		}

		const setResult = await organizationService.setOrgProfileImage(
			orgId,
			generatedHandle
		);

		callback(null, setResult);

		profileImageUploadMetric.end();
		logMetric(profileImageUploadMetric);
	};
}

export const createOrgSuccess = data => {
	createOrgSuccessMetric.end();
	logMetric(createOrgSuccessMetric);
	return {
		type: t.CREATE_ORG_SUCCESS,
		payload: data
	};
};

export const newOrgError = err => {
	return {
		type: t.CREATE_ORG_ERROR,
		message: err
	};
};

export const clearOrgError = () => {
	return {
		type: t.CLEAR_ORG_ERROR
	};
};

/*	Bcarson -- For whatever reason, I cannot seem to get this method to send across an 'err' response.
 *	Attempting to use res.send on the error will cause there to be nothing on the callback,
 *	and different formats sent on res.err don't seem to work, either. For now, I have updated the
 *	method to handle differently based on the response alone. TODO: Update this to be better.
 */
export const createNewOrg = (data, image, user) => {
	return dispatch => {
		createOrgSuccessMetric.start();
		// Attempt to create org
		organizationService.createOrganization(data, user, (err, response) => {
			// For whatever reason, this method will not send across an error
			if (err) {
				console.log("Create organization error:", err);
			}
			// When response is received
			else {
				// If response has "success" property, it probably means success will be false. This is how we're
				// able to judge a failure since this method won't send an err for some reason.
				// eslint-disable-next-line no-prototype-builtins
				if (response.hasOwnProperty("success")) {
					// If it is false, that means there was an issue (usually email is already in use)
					if (!response.success) {
						dispatch(newOrgError(response.reason.message.message));
					}
				}
				// Otherwise, if it inserted an org
				else if (response.orgId) {
					// Go ahead and create an org admin
					const initial = true;
					user.orgId = response.orgId;
					dispatch(createNewUser(user, initial));
					// If there is an image, upload it
					if (image) {
						dispatch(
							uploadOrgProfileImage(response, image, (err, response) => {
								if (err) {
									console.log(err);
								} else {
									dispatch(createOrgSuccess(data));
									dispatch(clearOrgError());
									dispatch(closeDialog("new-org-dialog"));
									dispatch(getAllOrgs());
								}
							})
						);
					}
					// Otherwise if no image, just set success flags and browser history
					else {
						dispatch(createOrgSuccess(data));
						dispatch(clearOrgError());
						dispatch(closeDialog("new-org-dialog"));
						dispatch(getAllOrgs());
					}
				}
			}
		});
	};
};