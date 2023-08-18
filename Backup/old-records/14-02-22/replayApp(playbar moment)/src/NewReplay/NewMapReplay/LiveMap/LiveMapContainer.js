import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./liveMapActions.js";
import LiveMap from "./LiveMap";

import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import _ from "lodash";

const mapStateToProps = state => {
	const { clientConfig, appState } = state;
	const { mapSettings } = clientConfig;
	const { zoom, center } = mapSettings;
	const { baseMap } = state.mapState;
	const { mapRef } = baseMap;
	const { baseMaps } = state;
	if (!_.isEmpty(appState.persisted)) {
		const settings = mapSettingsSelector(state);		
		return {
			map: mapRef,
			zoom: settings.mapZoom,
			center: settings.mapCenter,
			style: settings.mapStyle,
			baseMaps
		};
	} else {
		return {
			map: mapRef,
			zoom,
			center,
			style: "satellite",
			baseMaps
		};
	}
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const LiveMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LiveMap);

export default LiveMapContainer;
