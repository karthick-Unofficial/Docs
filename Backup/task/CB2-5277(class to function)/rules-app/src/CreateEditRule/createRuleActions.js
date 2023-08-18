import { restClient } from "client-app-core";
export { removeContext } from "orion-components/ContextualData/Actions";
export { updateRule } from "../ViewRule/viewRuleActions";
import * as t from "../actionTypes";

// Custom Metrics
import Metric from "browser-metrics/lib/Metric";

// Collect and display metrics
const logMetric = (metric) => {
	// Display metric in a table for legibility
	// Uncomment to log in console
	// console.table([{name: metric.name, duration: metric.duration}])

};

const addRuleMetric = new Metric("ADD_RULE_METRIC");

export function addRuleSuccess(id, body) {
	addRuleMetric.end();
	logMetric(addRuleMetric);
	return {
		type: t.ADD_RULE_SUCCESS,
		id,
		body
	};
}

export function addRule(title, desc, audioSettings, dismissForOrg, statement, subject, trigger, targets, conditions, escalationEvent, assignments, userId, orgId, type, userName) {
	return dispatch => {
		addRuleMetric.start();
		const body = JSON.stringify({
			title: title,
			desc: desc,
			audioSettings: audioSettings,
			dismissForOrg: dismissForOrg,
			statement: statement,
			subject: subject,
			type: type,
			trigger: trigger,
			targets: targets,
			conditions: conditions,
			escalationEvent: escalationEvent,
			assignments: assignments,
			owner: userId,
			ownerOrg: orgId,
			ownerName: userName
		});

		restClient.exec_post("./api/rules", body, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				dispatch(addRuleSuccess(response.generated_keys[0], body));
			}
		});

	};
}