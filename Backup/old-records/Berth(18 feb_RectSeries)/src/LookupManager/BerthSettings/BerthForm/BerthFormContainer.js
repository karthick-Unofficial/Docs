import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthFormActions";
import BerthForm from "./BerthForm.jsx";
import { getBerthsByGroup } from "../../../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, props) => {
	return { berths: getBerthsByGroup(state, props), dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthForm);

export default BerthFormContainer;
