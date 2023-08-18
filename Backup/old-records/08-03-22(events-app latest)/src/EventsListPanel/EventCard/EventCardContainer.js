import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EventCard } from "orion-components/Events";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const thisEventStats =
		state.globalData.events.eventStatistics[ownProps.event.id];
	const { locale } = state.i18n;
	return {
		commentCount: thisEventStats ? thisEventStats.commentCount : null,
		timeFormatPreference: state.appState.global.timeFormat,
		dir: getDir(state),
		locale
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			loadProfile
		},
		dispatch
	);
};

const EventCardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventCard);

export default EventCardContainer;
