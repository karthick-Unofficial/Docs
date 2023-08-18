import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
//import { updatePersistedState } from "orion-components/AppState/Actions";
import EventSharing from "./EventSharing";
//import * as eventUtilities from "../../../shared/utility/eventUtility";
import { exerciseSettingsSelector } from "../../selectors";


const mapStateToProps = state => {
	const simulationData = state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData : null;
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		userInfo: state.tabletopSession && state.tabletopSession.userInfo ? state.tabletopSession.userInfo: null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		communications: state.tabletopSession && state.tabletopSession.communications? state.tabletopSession.communications: [],
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		simId: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : null,
		simTime: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.currentSimTime: 0,
		simulationData,
		simTimePrecision: exerciseSettings.simTimePrecision
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actionCreators }, dispatch);
};

const EventSharingContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventSharing);

export default EventSharingContainer;
