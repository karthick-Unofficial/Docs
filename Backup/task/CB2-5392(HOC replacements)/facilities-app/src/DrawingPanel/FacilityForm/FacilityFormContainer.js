/*import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilityFormActions";
import FacilityForm from "./FacilityForm.jsx";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { feature } = state.mapState.mapTools;
	const context = selectedContextSelector(state);
	return { feature, context, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilityForm);

export default FacilityFormContainer;
*/