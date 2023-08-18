import { connect } from "react-redux";
import { mapLayerSettingsSelector } from "../../../selectors";
import TraceLineLayer from "./TraceLineLayer";

const mapStateToProps = state => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	return {
		features: state.tabletopSession ? state.tabletopSession.traceLineFeatures : [],
		traceSettings: mapLayerSettings.traces
	};
};

const TraceLineLayerContainer = connect(
	mapStateToProps
)(TraceLineLayer);

export default TraceLineLayerContainer;
