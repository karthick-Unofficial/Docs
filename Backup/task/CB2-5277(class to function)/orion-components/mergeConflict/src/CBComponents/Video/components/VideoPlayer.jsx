import React, { useEffect, createRef, useState, useRef } from "react";
import PropTypes from "prop-types";
import { WebRTCPlayer, WSImagePlayer } from "orion-components/CBComponents";
import { Typography, IconButton } from "@material-ui/core";
import { Fullscreen } from "@material-ui/icons";
import { cameraService } from "client-app-core";
import $ from "jquery";
import VideoIntegratedControls from "../../../Profiles/Widgets/PTZControls/VideoIntegratedControls";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	camera: PropTypes.shape({
		id: PropTypes.string.isRequired,
		player: PropTypes.shape({
			type: PropTypes.string.isRequired,
			url: PropTypes.string
		})
	}).isRequired,
	docked: PropTypes.bool,
	fillAvailable: PropTypes.bool,
	modal: PropTypes.bool,
	openDialog: PropTypes.func,
	dialogKey: PropTypes.string,
	setCameraPriority: PropTypes.func,
	fullscreen: PropTypes.bool,
	instanceId: PropTypes.string,
	entityId: PropTypes.string,
	entityType: PropTypes.string
};

const defaultProps = {
	camera: { player: { url: null } },
	docked: false,
	fillAvailable: false,
	modal: false,
	openDialog: () => { },
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
		docked,
		openDialog,
		dialogKey,
		setCameraPriority,
		modal,
		expanded
	} = props;
	const [streamUrl, setStreamUrl] = useState(null);
	const [showFullScreenButton, setShowFullScreenButton] = useState(false);
	const frame = createRef();

	const usePrevious = (value) => {
		const ref = useRef(null);
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		const { id } = camera;
		if (camera.player.type !== "ws-jpeg") {
			getStreamURL(id);
		}
		else {
			setStreamUrl("ws-jpeg");
		}
	}, []);

	useEffect(() => {
		if (prevProps) {
			const { id } = camera;
			const prevId = prevProps.camera ? prevProps.camera.id : null;

			if (id !== prevId) {
				getStreamURL(id);
			}
		}
		else {
			const { id } = camera;
			getStreamURL(id);
		}

	}, [props]);


	const getStreamURL = (cameraId) => {
		cameraService.getStreamURL(cameraId, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			}
			if (!response) return;
			const { streamUrl } = response;
			setStreamUrl(streamUrl);
		});
	};

	const getPlayer = () => {
		const { player, id } = camera;
		// -- handle cameras that have different player types for live and replay streaming
		const type = readOnly && player.replayType ? player.replayType : player.type;
		switch (type) {
			case "flashphoner":
				return (
					<WebRTCPlayer
						url={player.url}
						streamUrl={streamUrl || camera.entityData.properties.streamUrl}
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
						playbackStartTime={(readOnly && playbackStartTime) ? playbackStartTime : null}
						playBarValue={(readOnly && playBarValue) ? playBarValue : null}
						playbackPlaying={(readOnly && playbackPlaying) ? playbackPlaying : null}
						currentReplayMedia={(readOnly && currentReplayMedia) ? currentReplayMedia : []}
						addReplayMedia={(readOnly && addReplayMedia) ? addReplayMedia : () => { }}
						removeReplayMedia={(readOnly && removeReplayMedia) ? removeReplayMedia : () => { }}
					/>
				);
			case "file":
				return (
					<video muted autoPlay loop style={{ maxHeight: "100%", maxWidth: "100%" }}>
						<source src={camera.entityData.properties.videoUrl} type={camera.entityData.properties.videoType} />
					</video>
				);
			default:
				return null;
		}
	};

	const drawAspectRatio = (currentAspectRatio) => {
		const contents = docked || modal ? (
			<Typography style={{ position: "absolute" }} variant="subtitle1">
				{docked ? <Translate value="global.CBComponents.video.videoPlayer.camInDock" /> : <Translate value="global.CBComponents.video.videoPlayer.camInModal" />}
			</Typography>
		) : getPlayer();

		if (currentAspectRatio < 0.5625) {
			return (
				<div className="maintain-height-aspect-ratio-box">
					{/* Trick to hold a 16:9 aspect ratio when height is the limiter */}
					<svg className="aspect-ratio-helper" xmlns="http://www.w3.org/2000/svg" width="320" height="180" />
					<div className="aspect-ratio-box-inside">
						{contents}
					</div>
				</div>
			);
		} else {
			return (
				<div className="maintain-width-aspect-ratio-box">
					<div className="aspect-ratio-box-inside">
						{contents}
					</div>
				</div>
			);
		}
	};

	const toggleFullscreen = () => {
		if (dialogKey === "") {
			return;
		}

		setCameraPriority(null, true);
		openDialog(dialogKey);
	};

	const hasCapability = (capability) => {
		return camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability);
	};

	const Frame = frame.current;
	const currentAspectRatio = Frame ? Frame.clientHeight / (Frame.clientWidth * 1.0) : null;
	const isMobile = $(window).width() <= 1023;
	const canToggleFullscreen = (showFullScreenButton || isMobile) && !modal && !fullscreen && !expanded;
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
			{!readOnly &&
				<div style={styles.fullScreenButtonDiv}>
					<IconButton style={styles.fullScreenButtonIcon} onClick={toggleFullscreen}>
						<Fullscreen />
					</IconButton>
				</div>
			}
			{hasCapability("control") && hasCapability("video-integrated-control") &&
				<VideoIntegratedControls camera={camera} instanceId={instanceId} />
			}

			{/* Maintain aspect ratio and show video/message content */}
			{currentAspectRatio && drawAspectRatio(currentAspectRatio)}
		</div>
	);
};

VideoPlayer.propTypes = propTypes;
VideoPlayer.defaultProps = defaultProps;

export default VideoPlayer;
