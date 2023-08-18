import { createSelector } from "reselect";

const exclusionState = (state) => state.globalData.exclusions;
const userIdSelector = (state) => state.session.user.profile.id;

export const userExclusionSelector = createSelector(userIdSelector, exclusionState, (userId, exclusions) => {
	const userExclusions = exclusions[userId]
		? exclusions[userId].filter((exclusion) => exclusion.userId === userId)
		: [];
	return userExclusions;
});
