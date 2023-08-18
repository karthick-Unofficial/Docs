import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./playBarActions";
import PlayBar from "./PlayBar.jsx";
import {
	contextPanelState
} from "orion-components/ContextPanel/Selectors";
import { cameraDockSelector } from "../RightToolbar/ReplayCameraDock/selectors";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const audioVideoDock = cameraDockSelector(state);

	return {
		playBarAlerts: state.replay.playBarAlerts,
		playBarValue: state.playBar.playBarValue,
		playing: state.playBar.playing,
		currentMedia: state.appState.replayCamerasDock.currentMedia,
		dockState: audioVideoDock.dockState,
		secondaryExpanded: contextPanelState(state).secondaryExpanded,
		secondaryOpen: contextPanelState(state).secondaryOpen,
		dir: getDir(state),
		locale: getCultureCode(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const PlayBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PlayBar);

export default PlayBarContainer;
