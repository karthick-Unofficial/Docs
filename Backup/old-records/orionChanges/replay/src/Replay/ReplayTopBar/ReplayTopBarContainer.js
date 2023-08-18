import { connect } from "react-redux";
import * as actionCreators from "./replayTopBarActions";
import ReplayTopBar from "./ReplayTopBar";
import { bindActionCreators } from "redux";
import { getInitialPlayBarData } from "../../shared/utility/utilities";
import { cameraDockSelector } from "../RightToolbar/ReplayCameraDock/selectors";

const mapStateToProps = (state) => {
	const { replayBaseMap } = state.replayMapState;
	const { mapRef } = replayBaseMap;
	const { playBarValue } = state.playBar;
	const { dockData } = state.appState.dock;
	const alerts = getInitialPlayBarData(playBarValue, state.replay.alerts);
	const audioVideoDock = cameraDockSelector(state);
	return {
		map: mapRef,
		componentState: dockData,
		notifications: alerts ? Object.values(alerts) : [],
		currentMedia: audioVideoDock.currentMedia
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ReplayTopBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayTopBar);

export default ReplayTopBarContainer;
