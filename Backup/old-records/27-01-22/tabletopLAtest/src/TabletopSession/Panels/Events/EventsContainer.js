import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { setLocalAppState } from "orion-components/AppState/Persisted/actions";
import Events from "./Events";
import { exerciseSettingsSelector } from "../../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const events = state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.events : [];
	const newEvents = state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.newEvents : [];
	const simulationData = state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData : null;
	const userInfo= state.tabletopSession && state.tabletopSession.userInfo ? state.tabletopSession.userInfo: null;
	const userMappings = state.tabletopSession && state.tabletopSession.session.userMappings ? state.tabletopSession.session.userMappings : [];
	const eventPanelSettings = state.appState && state.appState.persisted && state.appState.persisted.eventPanelSettings ? state.appState.persisted.eventPanelSettings : null;
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		events,
		newEvents,
		eventPanelSettings,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		simulationData,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		simId: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : null,
		userInfo,
		userMappings,
		communications: state.tabletopSession && state.tabletopSession.communications? state.tabletopSession.communications: [],
		userHasCommDevices: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.userHasCommDevices : false,
		simTimePrecision: exerciseSettings.simTimePrecision,
		localState: state.appState.persisted.panel_events,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actionCreators, updatePersistedState, setLocalAppState }, dispatch);
};

const EventsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Events);

export default EventsContainer;