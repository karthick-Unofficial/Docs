import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newReplayActions";
import NewReplay from "./NewReplay.jsx";

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewReplay);

export default NewReplayContainer;
