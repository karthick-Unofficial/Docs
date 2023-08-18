import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import * as actionCreators from "./tabletopSessionActions";
import TabletopSession from "./TabletopSession";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const userFeeds = userFeedsSelector(state);
	return {
		user: state.session.user.profile,
		isHydrated: state.session.user.isHydrated,
		userFeeds,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		simId: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : null,
		sessionStatus: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.status : null,
		simulations: state.tabletopSession ? state.tabletopSession.simulations : null,
		userInfo: state.tabletopSession ? state.tabletopSession.userInfo : null,
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TabletopSessionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TabletopSession);

export default TabletopSessionContainer;
