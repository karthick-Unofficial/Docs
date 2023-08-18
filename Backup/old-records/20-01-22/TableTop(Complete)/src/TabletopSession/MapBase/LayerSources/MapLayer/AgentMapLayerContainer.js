import { connect } from "react-redux";
import { mapLayerSettingsSelector, exerciseSettingsSelector, mapFloorPlanSettingsSelector } from "../../../selectors";
import AgentMapLayer from "./AgentMapLayer";

const mapStateToProps = (state) => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const exerciseSettings = exerciseSettingsSelector(state);
	const mapFloorPlanSettings = mapFloorPlanSettingsSelector(state);
	return {
		agents: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agents : null,
		agentGroups: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.agentGroups : null,
		teamsSettings: mapLayerSettings.mapLayers.teams,
		labelsVisible: mapLayerSettings.mapLayers.labels,
		teamsMarkerSize: exerciseSettings.mapDisplay.markerSizes.agents,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null,
		floorPlansOnMainMap: mapFloorPlanSettings.facilityFloorplans
	};
};

const AgentMapLayerContainer = connect(
	mapStateToProps
)(AgentMapLayer);

export default AgentMapLayerContainer;
