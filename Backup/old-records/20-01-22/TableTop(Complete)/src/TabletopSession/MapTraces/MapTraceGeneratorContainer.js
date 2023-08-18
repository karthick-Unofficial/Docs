import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { exerciseSettingsSelector } from "../selectors";
import * as actionCreators from "./mapTraceActions";
import MapTraceGenerator from "./MapTraceGenerator";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	const mappedState = state.tabletopSession ? {
		userInfo: state.tabletopSession.userInfo,
		oldSimTime: state.tabletopSession.currentData ? state.tabletopSession.currentData.oldSimTime : null,
		currentSimTime: state.tabletopSession.currentData ? state.tabletopSession.currentData.currentSimTime : null,
		newEvents: state.tabletopSession.currentData ? state.tabletopSession.currentData.newEvents : [],
		playStatus: state.tabletopSession.session && state.tabletopSession.session.currentSimulation
			&& state.tabletopSession.session.currentSimulation.playStatus 
			? state.tabletopSession.session.currentSimulation.playStatus.status : null,
		modificationsActive: state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		simulationMode: state.tabletopSession.session ? state.tabletopSession.session.simulationMode : "simulation",
		simulationData: state.tabletopSession.simulationData,
		currentAgents: state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		traceDuration: exerciseSettings.mapDisplay.traceDuration,
		simTimePrecision: exerciseSettings.simTimePrecision
	} : {
		userInfo: null,
		oldSimTime: null,
		currentSimTime: null,
		newEvents: null,
		playStatus: null,
		modificationsActive: false,
		simulationMode: "simulation",
		simulationData: null,
		currentAgents: null,
		teamsConfig: null,
		traceDuration: exerciseSettings.mapDisplay.traceDuration,
		simTimePrecision: exerciseSettings.simTimePrecision
	};
	return mappedState;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapTraceGeneratorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapTraceGenerator);

export default MapTraceGeneratorContainer;
