/*import { connect } from "react-redux";
import WeatherRadar from "./WeatherRadar.jsx";

const mapStateToProps = state => {
	const { appState, clientConfig } = state;
	const { mapSettings } = appState.persisted;
	const { AERIS_API_KEY } = clientConfig.mapSettings;
	if (mapSettings && mapSettings["weather"]) {
		const { opacity, visible } = mapSettings["weather"];
		return { opacity, visible, aerisKey: AERIS_API_KEY };
	}
	return {};
};

const WeatherRadarContainer = connect(mapStateToProps)(WeatherRadar);

export default WeatherRadarContainer;
*/