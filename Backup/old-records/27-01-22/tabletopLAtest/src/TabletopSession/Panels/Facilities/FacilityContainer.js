import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import Facility from "./Facility";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = ( state, ownProps ) => {
	const { facility } = ownProps;
	let floorPlans;
	if (state.tabletopSession.floorPlans) {
		floorPlans = state.tabletopSession.floorPlans[facility.entityData.properties.id];
	}
	return {
		floorPlans,
		dir: getDir(state)
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
