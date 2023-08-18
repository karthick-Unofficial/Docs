import React, { Component } from "react";
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

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			streamUrl: null,
			showFullScreenButton: false
		};
		this.frame = React.createRef();
	}

	componentDidMount() {
		const { camera } = this.props;
		const { id } = camera;
		if (camera.player.type !== "ws-jpeg") {
			this.getStreamURL(id);
		}
		else {
			this.setState({ streamUrl: "ws-jpeg" });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { camera } = this.props;
		const { id } = camera;

		const prevId = prevProps.camera ? prevProps.camera.id : null;

		if (id !== prevId) {
			this.getStreamURL(id);
		}
	}

	getStreamURL = (cameraId) => {
		cameraService.getStreamURL(cameraId, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			}
			if (!response) return;
			const { streamUrl } = response;
			this.setState({ streamUrl });
		});
	}

	getPlayer = () => {
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
			removeReplayMedia
		} = this.props;
		const { streamUrl } = this.state;
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

	drawAspectRatio = (currentAspectRatio) => {
		const { docked, modal } = this.props;

		const contents = docked || modal ? (
			<Typography style={{ position: "absolute" }} variant="subtitle1">
				{docked ? <Translate value="global.CBComponents.video.videoPlayer.camInDock"/> : <Translate value="global.CBComponents.video.videoPlayer.camInModal"/>}
			</Typography>
		) : this.getPlayer();

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
	}

	toggleFullscreen = () => {
		const { openDialog, dialogKey, setCameraPriority } = this.props;
		if (dialogKey === "") {
			return;
		}

		setCameraPriority(null, true);
		openDialog(dialogKey);
	};

	hasCapability = (capability) => {
		return this.props.camera.entityData.properties.features &&
			this.props.camera.entityData.properties.features.includes(capability);
	}

	render() {
		const { fillAvailable, camera, fullscreen, expanded, readOnly, instanceId } = this.props;
		const frame = this.frame.current;
		const currentAspectRatio = frame ? frame.clientHeight / (frame.clientWidth * 1.0) : null;
		const isMobile = $(window).width() <= 1023;
		const canToggleFullscreen = (this.state.showFullScreenButton || isMobile) && !fullscreen && !expanded;
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
			}
		};
		return (
			<div
				ref={this.frame}
				style={styles.frame}
				onMouseOver={() => this.setState({ showFullScreenButton: true })}
				onMouseOut={() => this.setState({ showFullScreenButton: false })}
			>
				{!readOnly && <div
					style={{
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
					}}
				>
					<IconButton style={{ color: "white", height: "100%", width: "100%", padding: 3 }} onClick={() => this.toggleFullscreen()}>
						<Fullscreen />
					</IconButton>
				</div>}
				{this.hasCapability("control") && this.hasCapability("video-integrated-control") && (
					<VideoIntegratedControls camera={camera} instanceId={instanceId} />
				)}

				{/* Maintain aspect ratio and show video/message content */}
				{currentAspectRatio && this.drawAspectRatio(currentAspectRatio)}
			</div>
		);
	}
}

VideoPlayer.propTypes = propTypes;
VideoPlayer.defaultProps = defaultProps;

export default VideoPlayer;
