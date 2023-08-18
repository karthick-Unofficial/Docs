import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "react-fast-compare";
import cloneDeep from "lodash/cloneDeep";

const context = (state) => state.contextualData;

export const contextById = (id) => {
	return createSelector(context, (context) => context[id]);
};

export const contextualDataByKey = (id, key) => {
	return createSelector(contextById(id), (context) => {
		if (context) {
			return context[key];
		}
	});
};

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const getTrackHistory = (state, disabledFeeds) => {
	const trackHistory = {};
	const context = state.contextualData;
	Object.keys(context).forEach((contextKey) => {
		if (
			context[contextKey] &&
			context[contextKey].trackHistory &&
			(disabledFeeds ? !disabledFeeds.includes(context[contextKey].entity.feedId) : true)
		) {
			trackHistory[contextKey] = cloneDeep(context[contextKey].trackHistory);
		}
	});

	return trackHistory;
};

export const trackHistorySelector = createDeepEqualSelector(getTrackHistory, (trackHistory) => trackHistory);
