import * as t from "../../../../actionTypes";

import { organizationService, attachmentService } from "client-app-core";
import {
	setLoading
} from "orion-components/AppState/Actions";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const updateOrgMetric = new Metric("UPDATE_ORG_METRIC");
const profileImageUploadMetric = new Metric("PROFILE_IMAGE_UPLOAD_METRIC");
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
		callback(null, setResult.changes[0].new_val.profileImage);

		profileImageUploadMetric.end();
		logMetric(profileImageUploadMetric);
	};
}

export const updateOrgSuccess = org => {
	updateOrgMetric.end();
	logMetric(updateOrgMetric);
	return {
		type: t.UPDATE_ORG_SUCCESS,
		update: org
	};
};

export const isSubmittingOrgUpdate = () => {
	return {
		type: t.IS_SUBMITTING_ORG_UPDATE
	};
};

export const updateOrg = (orgId, data, profileImage) => {
	return dispatch => {
		updateOrgMetric.start();

		// Removed because triggers app rerender when we don't want it
		// -- Can set a different fetching state to render a spinner while updating?
		// dispatch(isFetching());
		dispatch(setLoading("orgDetails", true));
		organizationService.updateOrganization(orgId, data, (err, response) => {
			if (err) {
				console.log(err);
				// Once handleError dispatches an action, uncomment
				// dispatch(handleError(err));
			} else {
				const updateResult = response.changes[0].new_val;
				dispatch(
					uploadOrgProfileImage(
						data.organization,
						profileImage,
						(err, response) => {
							if (err) {
								console.log(err);
							} else {
								updateResult.profileImage = response;
								dispatch(setLoading("orgDetails", false));
								dispatch(updateOrgSuccess(updateResult));
							}
						}
					)
				);
			}
		});
	};
};