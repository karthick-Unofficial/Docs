import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./accessPointFormActions";
import AccessPointForm from "./AccessPointForm.jsx";
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

const AccessPointFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AccessPointForm);

export default AccessPointFormContainer;
