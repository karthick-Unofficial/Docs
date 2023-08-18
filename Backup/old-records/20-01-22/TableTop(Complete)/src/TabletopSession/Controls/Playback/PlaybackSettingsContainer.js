import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../tabletopSessionActions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import PlaybackSettings from "./PlaybackSettings";
import { exerciseSettingsSelector } from "../../selectors";
import {getDir} from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const exerciseSettings = exerciseSettingsSelector(state);
	return {
		playbackSettings: state.tabletopSession && state.tabletopSession.session ? state.tabletopSession.session.playbackSettings : null,
		timelineSettings: state.appState && state.appState.persisted ? state.appState.persisted.timelineSettings : null,
		simTimePrecision: exerciseSettings.simTimePrecision,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actionCreators, updatePersistedState }, dispatch);
};

const PlaybackSettingsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PlaybackSettings);

export default PlaybackSettingsContainer;
