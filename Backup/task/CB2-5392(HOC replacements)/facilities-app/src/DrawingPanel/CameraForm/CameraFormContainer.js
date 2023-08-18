/*import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraFormActions";
import CameraForm from "./CameraForm.jsx";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const context = selectedContextSelector(state);
	const { feature } = state.mapState.mapTools;
	const {
		selectedFloor
	} = floorPlanSelector(state);
	return { selectedFloor, context, feature, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraForm);

export default CameraFormContainer;*/