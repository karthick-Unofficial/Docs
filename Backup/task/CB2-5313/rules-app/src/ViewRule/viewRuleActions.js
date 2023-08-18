import { restClient } from "client-app-core";
import { updateContext } from "orion-components/ContextualData/Actions";

export { deleteRule } from "../Main/mainActions";
export { addContext, removeContext } from "orion-components/ContextualData/Actions";


import * as t from "../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";

// Collect and display metrics
const logMetric = (metric) => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])

};

const updateRuleMetric = new Metric("UPDATE_RULE_METRIC");

export function updateRuleSuccess(id, body) {
	updateRuleMetric.end();
	logMetric(updateRuleMetric);
	return {
		type: t.UPDATE_RULE_SUCCESS,
		id,
		body
	};
}

/// ALSO USED IN RULE ITEM & CREATE/EDIT RULE ///
export function updateRule(id, title, desc, audioSettings, dismissForOrg, statement, subject, trigger, targets, conditions, escalationEvent, assignments) {
	return dispatch => {
		updateRuleMetric.start();
		const body = JSON.stringify({
			title: title,
			desc: desc,
			audioSettings: audioSettings,
			dismissForOrg: dismissForOrg,
			statement: statement,
			subject: subject,
			trigger: trigger,
			targets: targets,
			conditions: conditions,
			escalationEvent: escalationEvent,
			assignments: assignments
		});
		restClient.exec_put(`./api/rules/${id}`, body, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(updateRuleSuccess(id, body));
				dispatch(updateContext(id, body));
			}
		});
	};
}