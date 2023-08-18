import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./tabletopSessionListActions";
import { activeSessionSelector } from "./selectors";
import TabletopSessionList from "./TabletopSessionList";

const mapStateToProps = state => {
	const activeSession = activeSessionSelector(state);
	return {
		isHydrated: state.session.user.isHydrated,
		user: state.session.user,
		showUserMappings: state.tabletopSessions ? state.tabletopSessions.displayUserMappings : false,
		activeSession,
		allSessionsLoaded: state.tabletopSessions ? state.tabletopSessions.allSessionsLoaded : false
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TabletopSessionListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TabletopSessionList);

export default TabletopSessionListContainer;
