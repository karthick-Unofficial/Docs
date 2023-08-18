import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newEventReplayActions";
import NewEventReplay from "./NewEventReplay.jsx";

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewEventReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewEventReplay);

export default NewEventReplayContainer;
