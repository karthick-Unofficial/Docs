import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { facilitiesSelector } from "../../selectors";
import { clearComponentMessage } from "../../tabletopSessionActions";
import Facilities from "./Facilities";

const mapStateToProps = state => {
	const facilities = facilitiesSelector(state);

	return {
		facilities,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({clearComponentMessage}, dispatch);
};

const FacilitiesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Facilities);

export default FacilitiesContainer;
