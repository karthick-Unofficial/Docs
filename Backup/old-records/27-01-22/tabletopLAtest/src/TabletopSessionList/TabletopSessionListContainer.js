import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./tabletopSessionListActions";
import { activeSessionSelector } from "./selectors";
import TabletopSessionList from "./TabletopSessionList";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const activeSession = activeSessionSelector(state);
	return {
		isHydrated: state.session.user.isHydrated,
		user: state.session.user,
		showUserMappings: state.tabletopSessions ? state.tabletopSessions.displayUserMappings : false,
		activeSession,
		allSessionsLoaded: state.tabletopSessions ? state.tabletopSessions.allSessionsLoaded : false,
		dir: getDir(state)
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
