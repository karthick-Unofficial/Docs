import { useEffect } from "react";
import { useDispatch } from "react-redux";

import * as PlaySettingsActions from "orion-components/GlobalData/WowzaWebRTC/PlaySettings/actions";
import * as PlaySettingsActionTypes from "orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes";
import PropTypes from "prop-types";

const propTypes = {
	streamName: PropTypes.string,
	applicationName: PropTypes.string,
	signalingURL: PropTypes.string,
	toggleLoading: PropTypes.func
};

const PlaySettings = ({ streamName, applicationName, signalingURL, toggleLoading }) => {

	const dispatch = useDispatch();

	const setPlaySettings = () => {
		dispatch({ type: PlaySettingsActionTypes.SET_PLAY_SETTINGS, signalingURL, streamName, applicationName });
		dispatch(PlaySettingsActions.startPlay(streamName));
		toggleLoading();
	};

	useEffect(() => {
		setPlaySettings();
	}, [streamName, applicationName, signalingURL]);


	return null;
};

PlaySettings.propTypes = propTypes;

export default PlaySettings;