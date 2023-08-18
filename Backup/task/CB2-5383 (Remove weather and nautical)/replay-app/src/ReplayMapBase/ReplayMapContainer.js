import { connect } from "react-redux";
import ReplayMap from "./ReplayMap.jsx";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayMapActions";
import _ from "lodash";

const mapStateToProps = (state, props) => {
	const { appState, clientConfig, baseMaps } = state;
	const { persisted } = appState;
	const { zoom } = !window.api ? clientConfig.mapSettings : { zoom: 0 };
	let center = [0, 0];
	const { nauticalChartsEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	if (props.location && props.location.query) {
		// parse the coordinates
		const splitCoords = props.location.query.coordinates.split(",");
		const coordinates = [
			[parseFloat(splitCoords[0]), parseFloat(splitCoords[1])],
			[parseFloat(splitCoords[2]), parseFloat(splitCoords[3])]
		];
		center = [(coordinates[0][0] + coordinates[1][0]) / 2, (coordinates[0][1] + coordinates[1][1]) / 2];
	}
	if (persisted.mapSettings) {
		const { mapZoom, mapStyle } = persisted.mapSettings;
		return {
			zoom: mapZoom || zoom,
			center,
			style: mapStyle,
			baseMaps,
			nauticalChartsEnabled
		};
	} else {
		return { zoom, center, baseMaps, nauticalChartsEnabled };
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ReplayMapContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayMap);

export default ReplayMapContainer;
