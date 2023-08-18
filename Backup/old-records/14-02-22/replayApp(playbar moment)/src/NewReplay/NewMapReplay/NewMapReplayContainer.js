import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newMapReplayActions";
import NewMapReplay from "./NewMapReplay.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { baseMap } = state.mapState;
	const { mapRef } = baseMap;
	const { clientConfig, baseMaps } = state;
	const { locale } = state.i18n;

	return {
		servicesReady: state.servicesReady,
		identity: state.session.identity,
		map: mapRef,
		durationOptions: clientConfig.durationOptions,
		baseMaps,
		dir: getDir(state),
		locale
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewMapReplay);

export default MapReplayContainer;
