import { restClient } from "client-app-core";
import { removeContext } from "orion-components/ContextualData/Actions";
import * as t from "../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = (metric) => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])

};

const deleteRuleMetric = new Metric("DELETE_RULE_METRIC");

export const unsubscribeFromRule = (ruleId) => {
	return dispatch => {
		restClient.exec_put(`./api/rules/${ruleId}/unsubscribe`, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(removeContext(ruleId));
			}
		});
	};
};

export const filterToggleTrigger = (type) => {
	return {
		type: t.FILTER_TRIGGER_TOGGLE,
		payload: {
			type
		}
	};
};

export function deleteRuleSuccess(id) {
	deleteRuleMetric.end();
	logMetric(deleteRuleMetric);
	return {
		type: t.DELETE_RULE_SUCCESS,
		id
	};
}

// delete rule
/// ALSO USED IN VIEW RULE ///
export function deleteRule(id) {
	return dispatch => {
		deleteRuleMetric.start();
		restClient.exec_delete(`./api/rules/${id}`, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(deleteRuleSuccess(id));
				dispatch(removeContext(id));
			}
		});
	};
}