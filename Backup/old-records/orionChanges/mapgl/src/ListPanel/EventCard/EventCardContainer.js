import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventCardActions";
import { EventCard } from "orion-components/Events";
import {
	makeGetEvent,
	makeGetPinnedItems,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const makeMapStateToProps = () => {
	const getEvent = makeGetEvent();
	const getPinnedItems = makeGetPinnedItems();
	const mapStateToProps = (state, ownProps) => {
		const event = getEvent(state, ownProps);
		const pinnedItems = getPinnedItems(state, ownProps);
		const eventStats = state.globalData.events.eventStatistics[event.id];
		const profileIconTemplates = {};
		Object.values(userFeedsSelector(state)).forEach(feed => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
		return {
			event,
			pinnedItems,
			commentCount: eventStats ? eventStats.commentCount : null,
			profileIconTemplates,
			timeFormatPreference: state.appState.global.timeFormat,
			dir: getDir(state)
		};
	};
	return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EventCardContainer = connect(
	makeMapStateToProps,
	mapDispatchToProps
)(EventCard);

export default EventCardContainer;
