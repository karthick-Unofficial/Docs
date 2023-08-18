import { organizationService } from "client-app-core";
import { refreshEcosystem } from "../../../../../appActions";
import * as t from "../../../../..//actionTypes";

export const shareIntSuccess = () => {
	// shareIntMetric.end();
	// logMetric(shareIntMetric);
	return {
		type: t.SHARE_INT_SUCCESS
	};
};

export const savePolicies = (intId, policies) => {
	return dispatch => {

		const orgIds = Object.keys(policies);

		const promiseArray = orgIds.map((orgId) => {
			if (!policies[orgId].enabled) {
				return organizationService.removeIntegration(orgId, intId);
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
				return organizationService.addIntegration(orgId, intId, req);

			}
		});

		Promise.all(promiseArray)
			.then((result) => {
				dispatch(shareIntSuccess());
				dispatch(refreshEcosystem());
			})
			// dispatch ok action
			// dispatch close dialog action
			.catch((e) => {
				console.log(e);
				dispatch(refreshEcosystem());
				// dispatch error action
			});


	};
};