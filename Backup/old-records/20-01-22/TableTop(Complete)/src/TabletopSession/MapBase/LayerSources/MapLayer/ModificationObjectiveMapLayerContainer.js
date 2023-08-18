import { connect } from "react-redux";
import { mapLayerSettingsSelector, exerciseSettingsSelector } from "../../../selectors";
import ModificationObjectiveMapLayer from "./ModificationObjectiveMapLayer";

const mapStateToProps = ( state ) => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const exerciseSettings = exerciseSettingsSelector(state);
	
	return {
		labelsVisible: mapLayerSettings.mapLayers.labels,
		showLayer: state.tabletopSession.session.modificationsActive,
		modifications: state.tabletopSession.modifications,
		markerSize: exerciseSettings.mapDisplay.markerSizes.others
	};
};

const ModificationObjectiveMapLayerContainer = connect(
	mapStateToProps
)(ModificationObjectiveMapLayer);

export default ModificationObjectiveMapLayerContainer;