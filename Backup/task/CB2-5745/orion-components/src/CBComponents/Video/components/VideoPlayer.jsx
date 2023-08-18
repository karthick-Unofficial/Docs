import React, { useEffect, createRef, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
	WSImagePlayer,
	WowzaWebRTCPlayer,
	WebRTCPlayer
} from "orion-components/CBComponents";
import { Typography, IconButton } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";
import { cameraService } from "client-app-core";
import $ from "jquery";
import VideoIntegratedControls from "../../../Profiles/Widgets/PTZControls/VideoIntegratedControls";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "orion-components/AppState/Actions";

const propTypes = {
	camera: PropTypes.shape({
		id: PropTypes.string.isRequired,
		player: PropTypes.shape({
			type: PropTypes.string.isRequired,
			url: PropTypes.string
		})
	}).isRequired,
	inDock: PropTypes.bool,
	fillAvailable: PropTypes.bool,
	modal: PropTypes.bool,
	dialogKey: PropTypes.string,
	setCameraPriority: PropTypes.func,
	fullscreen: PropTypes.bool,
	instanceId: PropTypes.string,
	entityId: PropTypes.string,
	entityType: PropTypes.string
};

const defaultProps = {
	camera: { player: { url: null } },
	inDock: false,
	fillAvailable: false,
	modal: false,
	setCameraPriority: () => { },
	dialogKey: "",
	fullscreen: false,
	instanceId: "",
	entityId: "",
	entityType: ""
};

const VideoPlayer = (props) => {
	const {
		camera,
		fullscreen,
		instanceId,
		entityId,
		entityType,
		readOnly,
		playbackStartTime,
		playBarValue,
		playbackPlaying,
		currentReplayMedia,
		addReplayMedia,
		removeReplayMedia,
		inDock,
		dialogKey,
		setCameraPriority,
		modal,
		expanded
	} = props;
	const dispatch = useDispatch();

	const [streamUrl, setStreamUrl] = useState(null);
	const [streamUrlError, setStreamUrlError] = useState(false);
	const [showFullScreenButton, setShowFullScreenButton] = useState(false);
	const [canToggleFullscreen, setCanToggleFullscreen] = useState(false);
	const [currentFrame, setCurrentFrame] = useState(null);
	const [currentAspectRatio, setCurrentAspectRatio] = useState(null);

	const frame = createRef();

	const { appState: { dock: { dockData, cameraDock } } } = useSelector((state) => state);

	const iscameraInDock = dockData.isOpen && dockData.tab === "Cameras" && cameraDock.dockedCameras.includes(camera.id);

	const docked = iscameraInDock && inDock ? false : iscameraInDock && !inDock ? true : false;

	const usePrevious = (value) => {
		const ref = useRef(null);
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		if (camera.player.type !== "ws-jpeg" && camera.player.type != "wowza") {
			getStreamURL(camera.id);
		}
	}, []);

	useEffect(() => {
		if (prevProps) {
			const { id, player } = camera;
			const prevId = prevProps.camera ? prevProps.camera.id : null;

			if (id !== prevId && player.type !== "wowza") {
				getStreamURL(id);
			}
		}
	}, [props]);

	useEffect(() => {
		const isMobile = $(window).width() <= 1023;
		setCanToggleFullscreen(
			(showFullScreenButton || isMobile) &&
			!modal &&
			!fullscreen &&
			!expanded
		);
	}, [window, showFullScreenButton, modal, fullscreen, expanded]);

	useEffect(() => {
		setCurrentAspectRatio(
			currentFrame
				? currentFrame.clientHeight / (currentFrame.clientWidth * 1.0)
				: null
		);
	}, [currentFrame]);

	const getStreamURL = (cameraId) => {
		cameraService.getStreamURL(cameraId, (err, response) => {
			if (err) {
				console.log("ERROR", err);
				setStreamUrlError(true);
			}
			if (!response) return;
			const { streamUrl } = response;
			setStreamUrl(streamUrl);
		});
	};

	const getPlayer = () => {
		const { player, id } = camera;
		// -- handle cameras that have different player types for live and replay streaming
		const type =
			readOnly && player.replayType ? player.replayType : player.type;
		switch (type) {
			case "wowza":
				return <WowzaWebRTCPlayer camera={camera} />;
			case "flashphoner":
				return (
					<WebRTCPlayer
						url={player.url}
						streamUrl={streamUrl}
						streamUrlError={streamUrlError}
					/>
				);
			case "ws-jpeg":
				return (
					<WSImagePlayer
						cameraId={id}
						videoProfile="desktop"
						fullscreen={fullscreen}
						instanceId={instanceId}
						entityId={entityId}
						entityType={entityType}
						playbackStartTime={
							readOnly && playbackStartTime
								? playbackStartTime
								: null
						}
						playBarValue={
							readOnly && playBarValue ? playBarValue : null
						}
						playbackPlaying={
							readOnly && playbackPlaying ? playbackPlaying : null
						}
						currentReplayMedia={
							readOnly && currentReplayMedia
								? currentReplayMedia
								: []
						}
						addReplayMedia={
							readOnly && addReplayMedia
								? addReplayMedia
								: () => { }
						}
						removeReplayMedia={
							readOnly && removeReplayMedia
								? removeReplayMedia
								: () => { }
						}
					/>
				);
			case "file":
				return (
					<video
						muted
						autoPlay
						loop
						style={{ maxHeight: "100%", maxWidth: "100%" }}
					>
						<source
							src={camera.entityData.properties.videoUrl}
							type={camera.entityData.properties.videoType}
						/>
					</video>
				);
			default:
				return null;
		}
	};

	const drawAspectRatio = (currentAspectRatio) => {
		const contents =
			docked || modal ? (
				<Typography
					style={{ position: "absolute" }}
					variant="subtitle1"
				>
					{docked ? (
						<Translate value="global.CBComponents.video.videoPlayer.camInDock" />
					) : (
						<Translate value="global.CBComponents.video.videoPlayer.camInModal" />
					)}
				</Typography>
			) : (
				getPlayer()
			);

		if (currentAspectRatio < 0.5625) {
			return (
				<div className="maintain-height-aspect-ratio-box">
					{/* Trick to hold a 16:9 aspect ratio when height is the limiter */}
					<svg
						className="aspect-ratio-helper"
						xmlns="http://www.w3.org/2000/svg"
						width="320"
						height="180"
					/>
					<div className="aspect-ratio-box-inside">{contents}</div>
				</div>
			);
		} else {
			return (
				<div className="maintain-width-aspect-ratio-box">
					<div className="aspect-ratio-box-inside">{contents}</div>
				</div>
			);
		}
	};

	const toggleFullscreen = () => {
		if (dialogKey === "") {
			return;
		}

		dispatch(setCameraPriority(null, true));
		dispatch(openDialog(dialogKey));
	};

	const hasCapability = (capability) => {
		return (
			camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability)
		);
	};

	useEffect(() => {
		if (!currentFrame) {
			setCurrentFrame(frame.current);
		}
	}, [frame.current, currentFrame]);

	const styles = {
		frame: {
			position: "relative",
			display: "flex",
			alignItems: "center",
			placeContent: "center",
			backgroundColor: "#000",
			minHeight: 180,
			width: "100%",
			height: "100%"
		},
		fullScreenButtonDiv: {
			display: canToggleFullscreen ? "flex" : "none",
			backgroundColor: "rgba(65, 69, 74, 0.5)",
			zIndex: 10001,
			position: "absolute",
			height: 30,
			width: 30,
			top: 10,
			padding: 3,
			textAlign: "center",
			borderRadius: 8,
			right: 10
		},
		fullScreenButtonIcon: {
			color: "white",
			height: "100%",
			width: "100%",
			padding: 3
		}
	};
	return (
		<div
			ref={frame}
			style={styles.frame}
			onMouseOver={() => setShowFullScreenButton(true)}
			onMouseOut={() => setShowFullScreenButton(true)}
		>
			{!readOnly && (
				<div style={styles.fullScreenButtonDiv}>
					<IconButton
						style={styles.fullScreenButtonIcon}
						onClick={toggleFullscreen}
					>
						<Fullscreen />
					</IconButton>
				</div>
			)}
			{hasCapability("control") &&
				hasCapability("video-integrated-control") && (
					<VideoIntegratedControls
						camera={camera}
						instanceId={instanceId}
					/>
				)}

			{/* Maintain aspect ratio and show video/message content */}
			{currentAspectRatio && drawAspectRatio(currentAspectRatio)}
		</div>
	);
};

VideoPlayer.propTypes = propTypes;
VideoPlayer.defaultProps = defaultProps;

export default VideoPlayer;