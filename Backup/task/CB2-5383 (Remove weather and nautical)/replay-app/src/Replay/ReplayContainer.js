import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayActions";
import Replay from "./Replay.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { baseMaps } = state;
	const { error } = state.replay;
	return {
		servicesReady: window.api ? true : state.servicesReady,
		baseMaps,
		dir: getDir(state),
		transactionError: error
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
