import { connect } from "react-redux";
import { exerciseSettingsSelector } from "../../selectors";
import MapObjectConnector from "./MapObjectConnector";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		markerSizes: exerciseSettings.mapDisplay.markerSizes
	};
};

const MapObjectConnectorContainer = connect(
	mapStateToProps,
)(MapObjectConnector);

export default MapObjectConnectorContainer;
