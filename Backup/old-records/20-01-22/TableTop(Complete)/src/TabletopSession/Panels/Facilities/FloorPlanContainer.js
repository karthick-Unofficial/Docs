import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import FloorPlan from "./FloorPlan";

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FloorPlanContainer = connect(
	null,
	mapDispatchToProps
)(FloorPlan);

export default FloorPlanContainer;