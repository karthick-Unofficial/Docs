import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./mapControlsActions";
import MapControls from "./MapControls.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { mapState, floorPlan } = state;
	const { dockData } = state.appState.dock;
	const { type } = mapState.mapTools;
	return {
		type,
		floorPlan,
		dockOpen: dockData.isOpen,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapControlsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapControls);

export default MapControlsContainer;
