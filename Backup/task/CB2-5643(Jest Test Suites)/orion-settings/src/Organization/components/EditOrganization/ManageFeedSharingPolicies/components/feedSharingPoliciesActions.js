import { organizationService } from "client-app-core";
import { refreshOrganizations } from "../../../../../appActions";
import * as t from "../../../../..//actionTypes";

export const shareIntSuccess = () => {
	// shareIntMetric.end();
	// logMetric(shareIntMetric);
	return {
		type: t.SHARE_INT_SUCCESS
	};
};

export const savePolicies = (intId, policies, selectedOrg) => {

	const orgIds = selectedOrg ? [selectedOrg] : Object.keys(policies);

	return dispatch => {

		orgIds.map((orgId) => {
			if (!policies[orgId].enabled) {
				organizationService.removeIntegration(orgId, intId, (err, res) => {
					if (err) {
						console.log(err);
						dispatch(refreshOrganizations());
					} else {
						dispatch(shareIntSuccess());
						dispatch(refreshOrganizations());
					}
				});
			}
			else {
				const policy = {
					type: policies[orgId].type
				};
				const prop = policy.type === "event" ? "eventSharingOnly" : "alwaysShared";
				if (!policies[orgId][prop].unlimited) {
					policy.term = {
						start: policies[orgId][prop].startDate,
						end: policies[orgId][prop].endDate
					};
				}
				policy.allowedPermissions = policies[orgId].allowedPermissions ? policies[orgId].allowedPermissions : [];
				const req = {
					config: {},
					policy
				};
				organizationService.addIntegration(orgId, intId, req, (err, res) => {
					if (err) {
						console.log(err);
						dispatch(refreshOrganizations());
					} else {
						dispatch(shareIntSuccess());
						dispatch(refreshOrganizations());
					}
				});

			}
		});


	};
};