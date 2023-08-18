import { connect } from "react-redux";
import FacilityMap from "./FacilityMap.jsx";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilityMapActions";

const mapStateToProps = state => {
	const { appState, clientConfig, baseMaps } = state;
	const { persisted } = appState;
	const { zoom, center } = clientConfig.mapSettings;
	const { nauticalChartsEnabled, weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;

	if (persisted.mapSettings) {
		const { mapZoom, mapCenter, mapStyle } = persisted.mapSettings;
		return {
			zoom: mapZoom || zoom,
			center: mapCenter || center,
			style: mapStyle,
			baseMaps,
			nauticalChartsEnabled,
			weatherEnabled
		};

	} else {
		return { zoom, center, baseMaps, nauticalChartsEnabled, weatherEnabled };
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilityMap);

export default FacilityMapContainer;
