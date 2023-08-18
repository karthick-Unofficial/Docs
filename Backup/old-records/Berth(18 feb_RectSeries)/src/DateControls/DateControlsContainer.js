import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./dateControlsActions";
import DateControls from "./DateControls.jsx";

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const DateControlsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DateControls);

export default DateControlsContainer;
