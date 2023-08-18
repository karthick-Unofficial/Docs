import {
	restClient,
	organizationService,
	userService,
	entityCollection,
	ruleService
} from "client-app-core";

export {
	getAppState,
	getGlobalAppState
} from "orion-components/AppState/Actions";
export { hydrateUser } from "orion-components/Session/Actions";

import * as t from "./actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

export {
	subscribeRules,
	subscribeCollections,
	subscribeFeedPermissions
} from "orion-components/GlobalData/Actions";

// Collect and display metrics
const logMetric = metric => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])
};

const fetchRuleMetric = new Metric("FETCH_RULE_METRIC");
const fetchOrgUsersMetric = new Metric("FETCH_ORG_USERS_METRIC");
const reHydrateUserMetric = new Metric("REHYDRATE_USER_METRIC");
const fetchCollectionsMetric = new Metric("FETCH_COLLECTIONS_METRIC");

export const fetchRulesSuccess = rules => {
	fetchRuleMetric.end();
	logMetric(fetchRuleMetric);
	return {
		type: t.FETCH_RULES_SUCCESS,
		rules
	};
};

/// ALSO USED IN CREATE/EDIT RULE ///
export const fetchRules = id => {
	return dispatch => {
		fetchRuleMetric.start();
		restClient.exec_get("./api/rules", (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const rules = response;
				dispatch(fetchRulesSuccess(rules));
			}
		});
	};
};

export const fetchOrgUsersSuccess = payload => {
	fetchOrgUsersMetric.end();
	logMetric(fetchOrgUsersMetric);
	return {
		type: t.FETCH_ORG_USERS_SUCCESS,
		payload
	};
};

export const fetchOrgUsers = orgId => {
	return dispatch => {
		reHydrateUserMetric.end();
		logMetric(reHydrateUserMetric);
		fetchOrgUsersMetric.start();
		organizationService.getOrgUsers(orgId, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(fetchOrgUsersSuccess(response));
			}
		});
	};
};

export const reHydrateUser = id => {
	// <------- allow fetching of user org id be for fetchOrgUser fires
	return dispatch => {
		reHydrateUserMetric.start();
		userService.getProfile(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(fetchOrgUsers(response.org.orgId));
			}
		});
	};
};

// export const fetchCollectionsSuccess = (collections) => {
// 	fetchCollectionsMetric.end();
// 	logMetric(fetchCollectionsMetric);
// 	return {
// 		type: t.FETCH_COLLECTIONS_SUCCESS,
// 		collections
// 	};
// };

// export const fetchCollections = () => {
// 	return dispatch => {
// 		fetchCollectionsMetric.start();
// 		entityCollection.getAll((err, result) => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				dispatch(fetchCollectionsSuccess(result));
// 			}
// 		});
// 	};
// };

export const fetchHealthSystemsSuccess = data => {
	return {
		type: t.FETCH_HEALTH_SYSTEMS_SUCCESS,
		payload: {
			systems: data
		}
	};
};

export const fetchHealthSystems = () => {
	return dispatch => {
		restClient.exec_get("/health-app/api/health-reports", (err, result) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(fetchHealthSystemsSuccess(result));
			}
		});
	};
};
