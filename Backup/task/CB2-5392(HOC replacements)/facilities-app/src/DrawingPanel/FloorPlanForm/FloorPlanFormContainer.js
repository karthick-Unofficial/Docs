/*import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./floorPlanFormActions";
import FloorPlanForm from "./FloorPlanForm.jsx";
import { floorPlanSelector } from "orion-components/Map/Selectors";

const mapStateToProps = state => {
	const { appState } = state;
	const { selectedFloor, coordinates, creating } = floorPlanSelector(state);
	const selectedFloorPlan = selectedFloor;
	return { selectedFloorPlan, coordinates, creating, dialog: appState.dialog.openDialog };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FloorPlanFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FloorPlanForm);

export default FloorPlanFormContainer;
*/