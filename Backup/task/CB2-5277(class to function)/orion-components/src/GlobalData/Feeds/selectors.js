import { createSelector } from "reselect";
import _ from "lodash";

const userFeedState = state => state.session.userFeeds;

export const userFeedsSelector = createSelector(userFeedState, userFeeds => {
	return _.values(userFeeds);
});
