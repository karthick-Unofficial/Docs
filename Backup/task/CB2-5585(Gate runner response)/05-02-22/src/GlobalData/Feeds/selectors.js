import { createSelector } from "reselect";
import values from "lodash/values";

const userFeedState = state => state.session.userFeeds;

export const userFeedsSelector = createSelector(userFeedState, userFeeds => {
	return values(userFeeds);
});
