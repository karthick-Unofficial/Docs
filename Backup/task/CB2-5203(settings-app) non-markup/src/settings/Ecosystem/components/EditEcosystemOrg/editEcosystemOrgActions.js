import { organizationService } from "client-app-core";
import Metric from "browser-metrics/lib/Metric";
import { updateOrgSuccess } from "../../../Organization/manageOrganizationActions";
import * as t from "../../../actionTypes";

const updateOrgMetric = new Metric("UPDATE_ORG_METRIC");

export const assignApp = (orgId, app) => {
	return {
		app,
		orgId,
		type: t.ASSIGN_APP
	};
};

/**
 * Update the maximum number of sharing connections an organization may have
 * @param {string} orgId 
 * @param {number} connections 
 */
export const updateOrgSharingConnections = (orgId, connections) => {
	const data = { organization: { maxSharingConnections: connections } };

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