import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import Cameras from "./Cameras.jsx";
import * as actionCreators from "./camerasActions";

const mapStateToProps = state => {
	const facilityId = primaryContextSelector(state);
	const facility = state.contextualData[facilityId];
	const { selectedFloor } = floorPlanSelector(state);
	const { mapRef } = state.mapState.baseMap;

	return {
		cameras: facility && facility.floorPlanCameras ? facility.floorPlanCameras : [],
		map: mapRef,
		labelsVisible: true,
		selectedFloor
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CamerasContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Cameras);

export default CamerasContainer;