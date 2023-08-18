import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import Facility from "./Facility";

const mapStateToProps = ( state, ownProps ) => {
	const { facility } = ownProps;
	let floorPlans;
	if (state.tabletopSession.floorPlans) {
		floorPlans = state.tabletopSession.floorPlans[facility.entityData.properties.id];
	}
	return {
		floorPlans
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Facility);

export default FacilityContainer;
