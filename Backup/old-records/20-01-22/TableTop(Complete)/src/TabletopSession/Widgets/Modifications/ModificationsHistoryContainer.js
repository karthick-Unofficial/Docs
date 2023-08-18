import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./modificationActions";
import ModificationsHistory from "./ModificationsHistory";
import { exerciseSettingsSelector } from "../../selectors";

const mapStateToProps = state => {
	const isFacilitator = state.tabletopSession && state.tabletopSession.session && state.session && state.tabletopSession.session.facilitator === state.session.user.profile.id;
	const isController = state.tabletopSession && state.tabletopSession.session && state.session && state.tabletopSession.session.controller === state.session.user.profile.id;
	const sessionId = state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null;
	const simId = state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation 
		? state.tabletopSession.session.currentSimulation.simId : 0;
	const currentSimTime =  state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation 
			&& state.tabletopSession.session.currentSimulation.playStatus ? state.tabletopSession.session.currentSimulation.playStatus.simTime : 0;
	const exerciseSettings = exerciseSettingsSelector(state);
	
	return {
		isFacilitator: isFacilitator,
		isController: isController,
		userInfo: state.tabletopSession && state.tabletopSession.userInfo? state.tabletopSession.userInfo: null,
		sessionId: sessionId,
		simId: simId,
		currentSimTime: currentSimTime,
		simulations  : state.tabletopSession ? state.tabletopSession.simulations : null,
		simulationData: state.tabletopSession && state.tabletopSession.simulationData,
		modificationsConfig: state.clientConfig ? state.clientConfig.modificationsConfig : null,
		users: state.globalData.users,
		userMappings: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.userMappings ? state.tabletopSession.session.userMappings : [],
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents: null,
		allAgents: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.agents: null,
		agentGroups: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.agentGroups : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		simTimePrecision: exerciseSettings.simTimePrecision
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ModificationsHistoryContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ModificationsHistory);

export default ModificationsHistoryContainer;
