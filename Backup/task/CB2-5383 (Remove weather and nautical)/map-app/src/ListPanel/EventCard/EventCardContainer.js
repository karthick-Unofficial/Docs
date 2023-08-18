import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventCardActions";
import { EventCard } from "orion-components/Events";
import {
	makeGetEvent,
	makeGetPinnedItems,
	userFeedsSelector,
	floorPlanSelector
} from "orion-components/GlobalData/Selectors";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
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
		const { locale } = state.i18n;
		const floorPlansWithFacilityFeed = floorPlanSelector(state);
		Object.values(userFeedsSelector(state)).forEach(feed => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
		return {
			floorPlansWithFacilityFeed,
			event,
			pinnedItems,
			commentCount: eventStats ? eventStats.commentCount : null,
			profileIconTemplates,
			timeFormatPreference: state.appState.global.timeFormat,
			selectedEntity: selectedEntityState(state),
			dir: getDir(state),
			locale
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
