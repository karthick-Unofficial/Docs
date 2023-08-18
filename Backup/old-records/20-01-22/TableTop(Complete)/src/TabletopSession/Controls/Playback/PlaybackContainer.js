import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { playSimulation, pauseSimulation, moveSimulation } from "../../tabletopSessionActions";
import { mapLayerSettingsSelector } from "../../selectors";
import Playback from "./Playback";

const mapStateToProps = state => {
	const mapLayerSettings = mapLayerSettingsSelector(state);
	const derivedState = {
		user: state.session.user.profile,
		mapLayerSettings
	};
	if (state.tabletopSession) {
		derivedState.simulations = state.tabletopSession.simulations;
		if (state.tabletopSession.session) {
			derivedState.sessionId = state.tabletopSession.session.id;
			derivedState.controller = state.tabletopSession.session.controller;
			derivedState.playbackSettings = state.tabletopSession.session.playbackSettings;
			derivedState.currentSimulation = state.tabletopSession.session.currentSimulation;
			derivedState.modificationsActive = state.tabletopSession.session.modificationsActive;
		}
	}
	return derivedState;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		updatePersistedState,
		playSimulation,
		pauseSimulation,
		moveSimulation
	}, dispatch);
};

const PlaybackContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Playback);

export default PlaybackContainer;
