import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { mapLayerSettingsSelector } from "../../selectors";
import MapLayers from "./MapLayers";

const mapStateToProps = state => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	return {
		mapLayerSettings,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ updatePersistedState }, dispatch);
};

const MapLayersContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapLayers);

export default MapLayersContainer;