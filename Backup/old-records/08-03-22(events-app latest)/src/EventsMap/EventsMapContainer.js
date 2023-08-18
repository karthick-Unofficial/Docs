import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventsMapActions.js";

// New Orion-Components Actions
import { setMapReference } from "orion-components/AppState/Actions";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import EventsMap from "./EventsMap";

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
	return bindActionCreators(
		{
			...actionCreators,
			setMapReference
		},
		dispatch
	);
}

const EventsMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventsMap);

export default EventsMapContainer;
