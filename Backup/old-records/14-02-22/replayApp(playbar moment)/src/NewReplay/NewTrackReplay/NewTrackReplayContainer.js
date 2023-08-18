import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newTrackReplayActions";
import NewTrackReplay from "./NewTrackReplay.jsx";

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewTrackReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewTrackReplay);

export default NewTrackReplayContainer;
