import { browserHistory } from "react-router";
import { routes as r } from "../routes.js";

import * as t from "../actionTypes";

import { organizationService, attachmentService } from "client-app-core";
import {
	setLoading
} from "orion-components/AppState/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { refreshEcosystem } from "../appActions";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const fetchOrgMetric = new Metric("FETCH_ORG_METRIC");
const updateOrgMetric = new Metric("UPDATE_ORG_METRIC");
const profileImageUploadMetric = new Metric("PROFILE_IMAGE_UPLOAD_METRIC");


export const fetchOrgSuccess = id => {
	fetchOrgMetric.end();
	logMetric(fetchOrgMetric);
	return {
		type: t.FETCH_ORG_SUCCESS,
		id
	};
};

export const fetchOrg = orgId => {
	return dispatch => {
		fetchOrgMetric.start();
		dispatch(setLoading("orgProfile", true));

		organizationService.getById(orgId, (err, response) => {
			if (err) {
				// dispatch error action
				console.log(err);
				// Once handleError dispatches an action, uncomment
				// dispatch(handleError(err));
			} else {
				dispatch(fetchOrgSuccess(response.orgId));
			}
		});
		dispatch(setLoading("orgProfile", false));
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
								dispatch(setLoading("orgDetails", false));
								dispatch(updateOrgSuccess(updateResult));
								// remove /edit
								browserHistory.push(r.SETTINGS + "org/" + orgId);
							}
						}
					)
				);
			}
		});
	};
};
