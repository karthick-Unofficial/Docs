import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthFormActions";
import BerthForm from "./BerthForm.jsx";
import { getBerthsByGroup } from "../../../selectors";

const mapStateToProps = (state, props) => {
	return { berths: getBerthsByGroup(state, props) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthForm);

export default BerthFormContainer;
