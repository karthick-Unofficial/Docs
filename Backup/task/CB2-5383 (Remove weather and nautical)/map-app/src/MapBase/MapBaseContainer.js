import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./mapBaseActions.js";
import MapBase from "./MapBase";

import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import _ from "lodash";

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
			WavCam: state.appState.dock.dockData.WavCam,
			baseMaps
		};
	} else {
		return {
			zoom,
			center,
			style: "satellite",
			WavCam: state.appState.dock.dockData.WavCam,
			baseMaps
		};
	}
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const MapBaseContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapBase);

export default MapBaseContainer;
