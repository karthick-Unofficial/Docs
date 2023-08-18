import { createSelector } from "reselect";
import _ from "lodash";

const ruleState = state => state.globalData.rules;

export const rulesSelector = createSelector(ruleState, rules => {
	return _.values(rules);
});

