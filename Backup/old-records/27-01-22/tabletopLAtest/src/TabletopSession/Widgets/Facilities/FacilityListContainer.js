import { connect } from "react-redux";
import FacilityList from "./FacilityList";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";

const mapStateToProps = state => {
	return {
		facilityFloorPlans : state.tabletopSession ? state.tabletopSession.floorPlans : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilityList);

export default FacilityListContainer;
