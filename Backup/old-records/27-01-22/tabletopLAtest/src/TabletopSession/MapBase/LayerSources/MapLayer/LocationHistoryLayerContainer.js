import { connect } from "react-redux";
import LocationHistoryLayer from "./LocationHistoryLayer";
import { exerciseSettingsSelector } from "../../../selectors";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		locationHistory: state.tabletopSession ? state.tabletopSession.locationHistory : null,
		teamsConfig: state.clientConfig ? state.clientConfig.teamsConfig : null,
		currentTime: state.tabletopSession && state.tabletopSession.currentData ? state.tabletopSession.currentData.currentSimTime : null,
		simTimePrecision: exerciseSettings.simTimePrecision
	};
};

const LocationHistoryLayerContainer = connect(
	mapStateToProps
)(LocationHistoryLayer);

export default LocationHistoryLayerContainer;
