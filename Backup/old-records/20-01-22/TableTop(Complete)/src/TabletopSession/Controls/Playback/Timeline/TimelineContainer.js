import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../../tabletopSessionActions";
import Timeline from "./Timeline";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		simulationData: state.tabletopSession ? state.tabletopSession.simulationData : null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents: {},
		events: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.events : [],
		playbackSettings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.playbackSettings : null,
		timelineSettings: state.appState && state.appState.persisted ? state.appState.persisted.timelineSettings : null,
		modificationsActive: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const TimelineContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Timeline);

export default TimelineContainer;
