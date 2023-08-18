import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthGroupActions";
import BerthGroup from "./BerthGroup.jsx";

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthGroupContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthGroup);

export default BerthGroupContainer;
