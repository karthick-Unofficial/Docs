import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./newZoneReplayActions";
import NewZoneReplay from "./NewZoneReplay.jsx";

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const NewZoneReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewZoneReplay);

export default NewZoneReplayContainer;
