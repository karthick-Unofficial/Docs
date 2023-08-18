import { createSelector } from "reselect";
import values from "lodash/values";

const ruleState = (state) => state.globalData.rules;

export const rulesSelector = createSelector(ruleState, (rules) => {
	return values(rules);
});
