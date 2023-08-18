import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../modificationActions";
import BarrierSelector from "./BarrierSelector";
//import { facilitiesSelector } from "../../../../selectors";
//import { getFacilityFloorPlans } from "../../../../tabletopSessionActions";


const mapStateToProps = state => {
	return {
		barriers: state.tabletopSession && state.tabletopSession.simulationData ? state.tabletopSession.simulationData.barriers: null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BarrierSelectorContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{withRef: true}
)(BarrierSelector);

export default BarrierSelectorContainer;
