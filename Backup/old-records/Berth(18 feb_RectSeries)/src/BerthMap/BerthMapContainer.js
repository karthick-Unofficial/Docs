import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthMapActions";
import BerthMap from "./BerthMap.jsx";

const setSpritePath = path => path.replace("location", location.hostname);
const mapStateToProps = state => {
	const { clientConfig, map, baseMaps } = state;
	const { mapSettings } = clientConfig;
	let satelliteMapStyle = {};

	if (baseMaps.length > 0) {
		satelliteMapStyle = baseMaps.find((element) => element.name === "satellite").style;
		satelliteMapStyle.sprite = "https://location/berth-schedule-app/static/icons/orion-sprites";
		satelliteMapStyle.sprite = setSpritePath(satelliteMapStyle.sprite);

	}


	return { mapSettings, map, satelliteMapStyle };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthMap);

export default BerthMapContainer;
