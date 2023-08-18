import { connect } from "react-redux";
import * as actionCreators from "./replayAppBarActions";
import ReplayAppBar from "./ReplayAppBar";
import { bindActionCreators } from "redux";
import {getDir} from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	let title = "Replay";
	if (ownProps.location.state && ownProps.location.state.name) {
		title = ownProps.location.state.name;
	}
	else if (state.application && state.application.name) {
		title = state.application.name;
	}

	return {
		user: state.session.user,
		title,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ReplayAppBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayAppBar);

export default ReplayAppBarContainer;
