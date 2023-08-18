import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthRowActions";
import BerthRow from "./BerthRow.jsx";
const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthRowContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthRow);

export default BerthRowContainer;
