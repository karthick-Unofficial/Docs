import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setLocalAppState } from "orion-components/AppState/Persisted/actions";
import { 
	clearComponentMessage, 
	createCommunication, 
	fetchLocationHistory,
	clearLocationHistory,
	displayGuardOrders 
} from "../../tabletopSessionActions";
import Roster from "./Roster";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		equipmentConfig: state.clientConfig && state.clientConfig.equipmentConfig ? state.clientConfig.equipmentConfig : null,
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		userMappings: state.tabletopSession && state.tabletopSession.session.userMappings ? state.tabletopSession.session.userMappings : [],
		userInfo: state.tabletopSession && state.tabletopSession.userInfo? state.tabletopSession.userInfo: null,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		simId: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : null,
		orgId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.orgId : null,
		userHasCommDevices: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.userHasCommDevices : false,
		simulationMode: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.simulationMode : "simulation",
		locationHistory: state.tabletopSession && state.tabletopSession.locationHistory,
		externalMessage: state.componentMessage.message && state.componentMessage.message.recipient === "panel_roster" ?
			state.componentMessage.message.data : null,
		localState: state.appState.persisted.panel_roster,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ 
		clearComponentMessage, 
		createCommunication, 
		fetchLocationHistory,
		clearLocationHistory,
		displayGuardOrders,
		setLocalAppState 
	}, dispatch);
};

const RosterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Roster);

export default RosterContainer;
