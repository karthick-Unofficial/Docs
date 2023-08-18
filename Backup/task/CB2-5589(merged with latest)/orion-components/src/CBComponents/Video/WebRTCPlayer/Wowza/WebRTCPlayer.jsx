import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { CircularProgress } from "@mui/material";

import Player from "./Player";
import PlaySettings from "./PlaySettings";
import { useState } from "react";
import { cameraService } from "client-app-core";

import { useDispatch } from "react-redux";

import * as PlaySettingsActions from "orion-components/GlobalData/WowzaWebRTC/PlaySettings/actions";
import * as PlaySettingsActionTypes from "orion-components/GlobalData/WowzaWebRTC/PlaySettings/actionTypes";



const WowzaWebRTCPlayer = ({ camera }) => {
	const dispatch = useDispatch();

	const [wowzaResponseData, setWowzaResponseData] = useState({});
	const [isLoaded, setIsLoaded] = useState(false);


	const getWowzaStream = () => {
		const { id, player } = camera;
		//Logic for retrieving wowza webrtc information
		cameraService.getWowzaStream(id, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			}
			if (!response) return;
			const { streamConnected } = response.data;
			if (streamConnected) {
				const { streamName } = response.data;
				const { applicationName, url } = player;
				setWowzaResponseData(prevState => ({
					...prevState,
					streamName,
					applicationName,
					signalingURL: url
				}));

			}
		});
	};

	useEffect(() => {
		getWowzaStream();
	}, [camera]);

	const setPlaySettings = () => {
		const { streamName, applicationName, signalingURL } = wowzaResponseData;
		dispatch({ type: PlaySettingsActionTypes.SET_PLAY_SETTINGS, signalingURL, streamName, applicationName });
		dispatch(PlaySettingsActions.startPlay(streamName));
	};
	const toggleLoading = () => {
		setIsLoaded(!isLoaded);
	};


	return (
		<Grid container spacing={3} className="mt-3" id="WebRTCPlayer-play-content">
			<Grid item xs={12} md={12} sm={12} lg={12}>
				{isLoaded ?(
					<Player
						getWowzaStream={getWowzaStream}
						setPlaySettings={setPlaySettings}
						wowzaResponseData={wowzaResponseData} />
				):(
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
				)
				}
			</Grid>
			<Grid item xs={12}>
				{Object.keys(wowzaResponseData).length !== 0 &&
					<PlaySettings
						signalingURL={wowzaResponseData.signalingURL}
						applicationName={wowzaResponseData.applicationName}
						streamName={wowzaResponseData.streamName}
						toggleLoading={toggleLoading}
					/>}

			</Grid>
		</Grid>

	);
};

export default WowzaWebRTCPlayer;