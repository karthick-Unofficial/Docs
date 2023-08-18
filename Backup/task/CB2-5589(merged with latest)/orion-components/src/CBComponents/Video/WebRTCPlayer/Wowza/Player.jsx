import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Fab, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

import { Translate } from "orion-components/i18n";
import * as PlaySettingsActions from "orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes";
import * as WebRTCPlayActions from "orion-components/GlobalData/WowzaWebRTC/WebRTCPlay/actionTypes";
import { getPlaySettings, getWebrtcPlay } from "orion-components/GlobalData/Selectors";

import startPlay from "./utils/startPlay";
import stopPlay from "./utils/stopPlay";
import { useState } from "react";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const Player = ({ getWowzaStream, setPlaySettings, wowzaResponseData }) => {

	const videoElement = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const [socketRetryCount, setSocketRetryCount] = useState(0);
	const [streamError, setStreamError] = useState(false);

	const dispatch = useDispatch();
		
	const playSettings = useSelector((state) => getPlaySettings(state, wowzaResponseData.streamName));
	const webrtcPlay = useSelector((state) => getWebrtcPlay(state, wowzaResponseData.streamName));

	const peerConnection = webrtcPlay ? webrtcPlay.peerConnection : null;
	const websocket = webrtcPlay ? webrtcPlay.websocket : null;
	const connected = webrtcPlay ? webrtcPlay.connected : null;
	const audioTrack = webrtcPlay ? webrtcPlay.audioTrack : null;
	const videoTrack = webrtcPlay ? webrtcPlay.videoTrack : null;

	const playStart=playSettings?playSettings.playStart:false;
	const playStarting=playSettings?playSettings.playStarting:false;
	const playStop=playSettings?playSettings.playStop:false;
	const playStopping=playSettings?playSettings.playStopping :false;

	// Listen for changes in the play* flags in the playSettings store
	// and stop or stop playback accordingly


	useEffect(() => {

		if (playStart && !playStarting && !connected) {
			dispatch({ type: PlaySettingsActions.SET_PLAY_FLAGS, playStart: false, playStarting: true, streamName: wowzaResponseData.streamName });
			startPlay(playSettings, websocket, {
				onError: (error) => {
					// handle error					
					if (hasOwn(error, "websocketError") && socketRetryCount < 3) {
						dispatch({ type: PlaySettingsActions.RESET_PLAY_SETTINGS, data: wowzaResponseData });
						dispatch({ type: WebRTCPlayActions.RESET_WEBRTC, data: wowzaResponseData });						
						setPlaySettings();
						setSocketRetryCount(socketRetryCount + 1);
					}
					else {
						setIsLoading(false);
						setStreamError(true);
					}
				},
				onConnectionStateChange: (result) => {
					const actionData = { ...wowzaResponseData, ...result };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_CONNECTED, data: actionData });
				},
				onSetPeerConnection: (result) => {
					const actionData = { ...wowzaResponseData, ...result };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_PEERCONNECTION, data: actionData });
				},
				onSetWebsocket: (result) => {
					const actionData = { ...wowzaResponseData, ...result };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_WEBSOCKET, data: actionData });
				},
				onPeerConnectionOnTrack: (event) => {
					if (event.track != null && event.track.kind != null) {
						if (event.track.kind === "audio") {
							const actionData = { audioTrack: event.track, ...wowzaResponseData };
							dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_AUDIO_TRACK, data: actionData });
						}
						else if (event.track.kind === "video") {
							const actionData = { videoTrack: event.track, ...wowzaResponseData };
							dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_VIDEO_TRACK, data: actionData });
						}
					}
				}
			});
		}
		if (playStarting && connected) {
			dispatch({ type: PlaySettingsActions.SET_PLAY_FLAGS, playStarting: false, streamName: wowzaResponseData.streamName });
		}

		if (playStop && !playStopping && connected) {
			dispatch({ type: PlaySettingsActions.SET_PLAY_FLAGS, playStop: false, playStopping: true, streamName: wowzaResponseData.streamName });
			stopPlay(peerConnection, websocket, {
				onSetPeerConnection: (result) => {
					const actionData = { ...wowzaResponseData, ...result };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_PEERCONNECTION, data: actionData });
				},
				onSetWebsocket: (result) => {
					const actionData = { ...wowzaResponseData, ...result };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_WEBSOCKET, data: actionData });
				},
				onPlayStopped: () => {
					const actionData = { connected: false, ...wowzaResponseData };
					dispatch({ type: WebRTCPlayActions.SET_WEBRTC_PLAY_CONNECTED, data: actionData });
				}
			});
		}
		if (playStopping && !connected) {
			dispatch({ type: PlaySettingsActions.SET_PLAY_FLAGS, playStopping: false, streamName: wowzaResponseData.streamName });
		}


	}, [dispatch, videoElement, playSettings, peerConnection, websocket, connected]);

	useEffect(() => {

		if (connected) {
			let newStream = new MediaStream();
			if (audioTrack != null)
				newStream.addTrack(audioTrack);

			if (videoTrack != null)
				newStream.addTrack(videoTrack);

			if (videoElement != null && videoElement.current != null)
				videoElement.current.srcObject = newStream;
		}
		else {
			if (videoElement != null && videoElement.current != null)
				videoElement.current.srcObject = null;
		}

	}, [audioTrack, videoTrack, connected, videoElement]);


	const styles = {
		wrapper: {
			display: "flex",
			alignItems: "center",
			flex: "auto",
			flexDirection: "column",
			justifyContent: "center",
			padding: "2.5%"
		},
		button: {
			zIndex: 99,
			marginTop: 12
		}
	};

	useEffect(() => {
		if (playStart) {
			setIsLoading(!isLoading);
		}
		else if (!connected && !playStarting && isLoading) {
			setIsLoading(!isLoading);
		}
	}, [playSettings]);

	const playContent = () => {
		if (!connected && playStarting && isLoading) {
			return (
				<div
					style={{
						height: "100%",
						width: "100%",
						padding: "2.5%",
						textAlign: "center"
					}}
				>
					<CircularProgress />
				</div>
			);
		}
		else if ((!connected && !playStarting) || streamError) {
			return (
				<div className="camera-text-wrapper" style={styles.wrapper}>
					<Typography align="center" variant="subtitle1">
						<Translate value="global.CBComponents.video.webRTCPlayer.camProblem" />
					</Typography>
					<Fab
						style={styles.button}
						color="primary"
						onClick={getWowzaStream}
						size="small"
					>
						<Refresh style={{ color: "#FFF" }} />
					</Fab>
				</div >
			);
		}
		else {
			return (
				<div
					id="WebRTCPlayer-play-video-container"
					style={{
						height: "100%",
						width: "100%"
					}}
				>
					<video
						id="player-video"
						style={{
							height: "100%",
							width: "100%",
							padding: "2.5%"
						}}
						ref={videoElement}
						autoPlay
						playsInline
						muted
					>
					</video>
				</div>
			);
		}

	};


	return playContent();
};

export default Player;