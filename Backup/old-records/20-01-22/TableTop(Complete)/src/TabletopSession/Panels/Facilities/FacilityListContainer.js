import { connect } from "react-redux";
import FacilityList from "./FacilityList";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		facilityFloorPlans : state.tabletopSession ? state.tabletopSession.floorPlans : null,
		dir: getDir(state)
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
