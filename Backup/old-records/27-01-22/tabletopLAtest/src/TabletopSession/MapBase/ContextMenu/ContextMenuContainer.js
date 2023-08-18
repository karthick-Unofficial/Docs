import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { 
	loadAgentProfile, 
	loadFacilityProfile, 
	openMapLayersWidget,
	fetchLocationHistory,
	clearLocationHistory,
	displayGuardOrders,
	displayFov,
	hideFov,
	persistMapFloorplanControlState,
	handleApiError
} from "../../tabletopSessionActions";
import { triggerCreateModification } from "../../Widgets/Modifications/modificationActions";
import { mapLayerSettingsSelector, mapFloorPlanSettingsSelector } from "../../selectors";
import ContextMenu from "./ContextMenu";
import { getDir } from "orion-components/i18n/Config/selector";

function mapStateToProps(state) {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const mapFloorPlanSettings = mapFloorPlanSettingsSelector(state);
	return {
		userInfo: state.tabletopSession && state.tabletopSession.userInfo? state.tabletopSession.userInfo: null,
		sessionId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.id : null,
		facilitator: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.facilitator : null,
		controller: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.controller : null,
		simId: state.tabletopSession && state.tabletopSession.session && state.tabletopSession.session.currentSimulation ? state.tabletopSession.session.currentSimulation.simId : null,
		userMappings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.userMappings : null,
		orgId: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.orgId : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		mapLayerSettings,
		mapFloorPlanSettings,
		modificationsActive: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.modificationsActive : false,
		modificationsConfig: state.clientConfig ? state.clientConfig.modificationsConfig : null,
		simulationMode: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.simulationMode : "simulation",
		locationHistory: state.tabletopSession && state.tabletopSession.locationHistory ? state.tabletopSession.locationHistory : null,
		fovAgents: state.tabletopSession && state.tabletopSession.fovAgents ? state.tabletopSession.fovAgents : null,
		dir: getDir(state)
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators( { 
		updatePersistedState,
		loadAgentProfile, 
		loadFacilityProfile, 
		openMapLayersWidget,
		fetchLocationHistory,
		clearLocationHistory,
		triggerCreateModification,
		displayGuardOrders,
		displayFov,
		hideFov,
		persistMapFloorplanControlState,
		handleApiError
	}, dispatch);
}

const ContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ContextMenu);

export default ContextMenuContainer;
