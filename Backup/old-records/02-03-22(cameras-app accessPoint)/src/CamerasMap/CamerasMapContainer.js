import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./camerasMapActions.js";

import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import _ from "lodash";

import CamerasMap from "./CamerasMap";

const mapStateToProps = state => {
	const { clientConfig, appState, baseMaps } = state;
	const { mapSettings } = clientConfig;
	const { zoom, center } = mapSettings;
	if (!_.isEmpty(appState.persisted)) {
		const settings = mapSettingsSelector(state);
		return {
			zoom: settings.mapZoom,
			center: settings.mapCenter,
			style: settings.mapStyle,
			WavCamOpen: state.appState.dock.dockData.WavCam,
			baseMaps
		};
	} else {
		return {
			zoom,
			center,
			style: "satellite",
			WavCamOpen: state.appState.dock.dockData.WavCam,
			baseMaps
		};
	}
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const CamerasMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CamerasMap);

export default CamerasMapContainer;
