import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./rightToolbarActions";
import RightToolbar from "./RightToolbar";

import { cameraDockSelector } from "./ReplayCameraDock/selectors";

const mapStateToProps = (state) => {
	const audioVideoDock = cameraDockSelector(state);

	return {
		dockState: audioVideoDock.dockState
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const RightToolbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(RightToolbar);

export default RightToolbarContainer;
