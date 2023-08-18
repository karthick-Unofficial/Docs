import { connect } from "react-redux";
import { mapLayerSettingsSelector, exerciseSettingsSelector, mapFloorPlanSettingsSelector } from "../../../selectors";
import MapLayer from "./MapLayer";

const mapStateToProps = ( state, ownProps ) => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const exerciseSettings = exerciseSettingsSelector(state);
	const mapFloorPlanSettings = mapFloorPlanSettingsSelector(state);
	return {
		labelsVisible: mapLayerSettings.mapLayers.labels,
		showLayer: mapLayerSettings.mapLayers[ownProps.name],
		markerSize: exerciseSettings.mapDisplay.markerSizes.others,
		floorPlansOnMainMap: mapFloorPlanSettings.facilityFloorplans
	};
};

const MapLayerContainer = connect(
	mapStateToProps
)(MapLayer);

export default MapLayerContainer;
