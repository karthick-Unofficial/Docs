import { connect } from "react-redux";
import { mapLayerSettingsSelector, exerciseSettingsSelector } from "../../../selectors";
import TracePointLayer from "./TracePointLayer";

const mapStateToProps = state => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		features: state.tabletopSession ? state.tabletopSession.tracePointFeatures : [],
		traceSettings: mapLayerSettings.traces,
		markerSize: exerciseSettings.mapDisplay.markerSizes.trace
	};
};

const TracePointLayerContainer = connect(
	mapStateToProps
)(TracePointLayer);

export default TracePointLayerContainer;
