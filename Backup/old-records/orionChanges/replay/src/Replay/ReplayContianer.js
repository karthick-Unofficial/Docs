import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayActions";
import Replay from "./Replay.jsx";

const mapStateToProps = state => {
	const { baseMaps } = state;
	return {
		servicesReady: window.api ? true : state.servicesReady,
		baseMaps
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ReplayContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Replay);

export default ReplayContainer;
