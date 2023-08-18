import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "./mapBaseActions";
import * as sessionActions from "../tabletopSessionActions";
import MapBase from "./MapBase";

import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { clientConfig, appState } = state;
	if (!_.isEmpty(appState.persisted)) {
		const settings = mapSettingsSelector(state);
		return {
			zoom: settings.mapZoom,
			center: settings.mapCenter,
			style: settings.mapStyle
		};
	} else {
		let zoom = 3;
		let center = [-98.2015, 39.4346];
		if (clientConfig && clientConfig.mapSettings) {
			zoom = clientConfig.mapSettings.zoom;
			center = clientConfig.mapSettings.center;
		}
		return {
			zoom,
			center,
			style: "satellite",
			dir: getDir(state)
		};
	}
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators( { ...mapActions, ...sessionActions }, dispatch);
}

const MapBaseContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapBase);

export default MapBaseContainer;
