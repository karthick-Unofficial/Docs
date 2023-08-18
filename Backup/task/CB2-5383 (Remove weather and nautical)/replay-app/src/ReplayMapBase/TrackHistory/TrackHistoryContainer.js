import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TrackHistory from "./TrackHistory";
import * as actionCreators from "./trackHistoryActions";
import {
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
const mapStateToProps = (state) => {
	const disabledFeeds = disabledFeedsSelector(state);
	const trackHistory = {};
	const context = state.contextualData;
	Object.keys(context).forEach(contextKey => {
		//Every track has a buffer starting before the replay date, we don't want that data for track history
		let passedInitial = false;
		if (context[contextKey] && context[contextKey].trackHistory && (disabledFeeds ? !disabledFeeds.includes(context[contextKey].entity.feedId) : true)) {
			trackHistory[contextKey] = state.replay.allTransactions.filter(entity => {
				if (!passedInitial) {
					passedInitial = true;
					return false;
				}
				return entity.id === contextKey;
			});
		}
	});
	return {
		trackHistory
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TrackHistoryContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TrackHistory);

export default TrackHistoryContainer;