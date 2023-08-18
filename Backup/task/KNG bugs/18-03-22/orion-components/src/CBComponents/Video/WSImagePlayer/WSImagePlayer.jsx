import React, { Component } from "react";
import PropTypes from "prop-types";
import { cameraService } from "client-app-core";
import { simpleUnsub } from "orion-components/ContextualData/contextStreaming";
import { CircularProgress, Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	cameraId: PropTypes.string.isRequired,
	instanceId: PropTypes.string,
	videoProfile: PropTypes.string,
	fullscreen: PropTypes.bool,
	entityId: PropTypes.string,
	entityType: PropTypes.string,
	displayProgress: PropTypes.bool,
	playbackStartTime: PropTypes.string,
	playbackPlaying: PropTypes.bool,
	currentReplayMedia: PropTypes.array,
	addReplayMedia: PropTypes.func,
	removeReplayMedia: PropTypes.func
};

const defaultProps = {
	instanceId: "",
	videoProfile: "desktop",
	fullscreen: false,
	entityId: "",
	entityType: "",
	displayProgress: true,
	playbackStartTime: null,
	playbackPlaying: null,
	currentReplayMedia: [],
	addReplayMedia: () => {},
	removeReplayMedia: () => {}
};

class WSImagePlayer extends Component {
	constructor(props) {
		super(props);

		this.imageRef = React.createRef();
		this.playerDiv = React.createRef();

		this.state = {
			videoData: null,
			metadata: null,
			subscription: null,
			error: null,
			playbackVideoId: null,
			playbackStreamStarted: false,
			replaySetupStream: false
		};
	}
	// Try to start video on mount
	componentDidMount() {
		const { cameraId, videoProfile, instanceId, entityId, entityType, playbackStartTime } = this.props;

		if (!playbackStartTime) {
			this.play(cameraId, videoProfile, instanceId, entityId, entityType);
		} else {
			this.setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
		}
	}
	// If stream, kill it on unmount
	componentWillUnmount() {
		const { subscription } = this.state;
		if (subscription) {
			simpleUnsub(subscription.channel);
		}
	}
	// If camera changes, unsub old camera and sub to new camera
	componentDidUpdate(prevProps, prevState) {
		const {
			cameraId,
			videoProfile,
			instanceId,
			entityId,
			entityType,
			playbackStartTime,
			playBarValue,
			playbackPlaying,
			removeReplayMedia,
			currentReplayMedia
		} = this.props;
		const { subscription, playbackVideoId } = this.state;
		// If camera is different on prop change
		if (prevProps.cameraId !== cameraId) {
			// If subscription, unsub
			if (subscription) {
				simpleUnsub(subscription.channel);
			}

			if (playbackVideoId) {
				// -- if there is a playback video loaded, decrement the loadedVideos state count
				removeReplayMedia(cameraId);
			}

			// Clear out state
			this.setState({
				videoData: null,
				subscription: null,
				error: null,
				playbackVideoId: null,
				playbackStreamStarted: false,
				recoverPlaybackStream: false
			});

			// Start new video
			if (!playbackStartTime) {
				this.play(cameraId, videoProfile, instanceId, entityId, entityType);
			} else {
				this.setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
			}
		} else {
			// -- Pause/Play playback stream if applicable
			if (playbackVideoId && prevProps.playbackPlaying !== playbackPlaying) {
				if (playbackPlaying) {
					this.startPlaybackStream(cameraId, playbackVideoId);
				} else {
					this.pausePlaybackStream(cameraId, playbackVideoId);
				}
			}
		}

		// -- FOR REPLAY - restart playback video if new media (audio or video) has been loaded
		if (prevProps.currentReplayMedia !== currentReplayMedia && currentReplayMedia.length > 0 && playbackStartTime) {
			// -- restart playback video if the new media is not this camera
			const newMediaId = currentReplayMedia.filter(media => !prevProps.currentReplayMedia.includes(media))[0];
			if (newMediaId && newMediaId !== cameraId) {
				// If subscription, unsub
				if (subscription) {
					simpleUnsub(subscription.channel);
				}
				// Clear out state
				this.setState({
					videoData: null,
					subscription: null,
					error: null,
					playbackVideoId: null,
					playbackStreamStarted: false
				});

				// -- Establish a new stream at current playbar value without firing the videoUpdated event
				this.restartPlaybackStream(cameraId, videoProfile, playbackStartTime);
			}
		}

		if(this.state.recoverPlaybackStream) {
			// Clear out state
			this.setState({
				videoData: null,
				subscription: null,
				error: null,
				playbackVideoId: null,
				playbackStreamStarted: false,
				recoverPlaybackStream: false
			});

			// -- Establish a new stream without firing the videoUpdated event
			this.restartPlaybackStream(cameraId, videoProfile, playBarValue, true);
		}
	}

	play = (cameraId, videoProfile, instanceId, entityId, entityType) => {
		// -- Live video
		const options = { 
			instanceId: instanceId,
			playerWidth: this.playerDiv.current.offsetWidth,
			playerHeight: this.playerDiv.current.offsetHeight
		};
		if(entityId) options["entityId"] = entityId;
		if(entityType) options["entityType"] = entityType;
		cameraService
			.streamVideo(cameraId, videoProfile, options, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				const { code, Data, metadata } = response;
				if (code) {
					this.setState({ error: true });
				} else if (Data) {
					this.setState({ videoData: "data:image/jpeg;base64," + Data, metadata: metadata });
				}
			})
			.then(sub => {
				this.setState({ subscription: sub });
			});
	};

	setupPlaybackStream(cameraId, videoProfile, playbackStartTime) {
		const { addReplayMedia } = this.props;

		// -- Playback video
		cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, (err, response) => {
			if (err) console.log(err);
			if (!response) return;

			// -- allow a null image for now, as milestone can't always access the exact time in the recorder service
			if (response.result && response.result.videoId) {
				const videoId = response.result.videoId;
				this.setState({
					videoData: response.result.image || null,
					playbackVideoId: videoId,
					replaySetupStream: false
				});

				addReplayMedia(cameraId);
			}
			else {
				this.setState({
					error: true,
					replaySetupStream: false
				});
			}
		});

		// -- enable loading icon
		this.setState({
			replaySetupStream: true
		});
	}

	restartPlaybackStream(cameraId, videoProfile, playbackStartTime, autoStart = false) {
		// -- Playback video
		const t0 = performance.now();
		cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, (err, response) => {
			if (err) console.log(err);
			if (!response || response.result === false) {
				this.setState({ error: true });
				return console.log("Error restarting stream. Check camera-app logs for more details.");
			}

			const t1 = performance.now();
			console.log(`Time to restart playback stream took ${(t1-t0)} milliseconds.`);

			// -- allow a null image for now, as milestone can't always access the exact time in the recorder service
			if (response.result && response.result.videoId) {
				const videoId = response.result.videoId;
				this.setState({
					videoData: response.result.image || null,
					playbackVideoId: videoId,
					replaySetupStream: false
				});
				if(autoStart) {
					this.startPlaybackStream(cameraId, videoId);
				}
			}
			else {
				this.setState({
					error: true,
					replaySetupStream: false
				});
			}
		});

		// -- enable loading icon
		this.setState({
			replaySetupStream: true
		});
	}

	startPlaybackStream(cameraId, videoId) {
		const { playbackStreamStarted } = this.state;

		// -- start stream and image retrieval stream
		cameraService.startPlaybackStream(cameraId, videoId, (err, response) => {
			if (err) console.log(err);
			if (!response || response.result === false) {
				return console.log("Error starting stream. Check camera-app logs for more details.");
			}

			if (!playbackStreamStarted) {
				cameraService
					.streamPlayback(cameraId, videoId, (err, response) => {
						if (err) console.log(err);
						if (!response) return;

						const { code, image } = response;
						if (code) {
							this.setState({ recoverPlaybackStream: true });
						} else if (image) {
							this.setState({ error: false });
							this.setState({ videoData: image });
						}
					})
					.then(sub => {
						this.setState({
							subscription: sub,
							playbackStreamStarted: true
						});
					});
			}
		});
	}

	pausePlaybackStream(cameraId, videoId) {
		// -- pause stream and stop image retrieval
		cameraService.pausePlaybackStream(cameraId, videoId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	}

	render() {
		const { fullscreen, imageChange, displayProgress } = this.props;
		const { videoData, subscription, error, replaySetupStream } = this.state;
		const styles = {
			wrapper: {
				height: "100%",
				width: "100%",
				display: "flex",
				alignItems: "center",
				placeContent: "center",
				justifyContent: "center"
			},
			video: {
				width: "100%",
				margin: "auto",
				maxWidth: "100%",
				objectFit: "contain",
				maxHeight: "100%",
				height: "100%"
			}
		};

		const handleImageChange = () => {
			const dim = this.imageRef.current ? [this.imageRef.current.offsetWidth, this.imageRef.current.offsetHeight] : null;
			if(imageChange) imageChange(this.state.metadata, dim);
		};
	
		return (
			<div style={styles.wrapper} ref={this.playerDiv}>
				{displayProgress && !error && (subscription || replaySetupStream) && !videoData && <CircularProgress />}
				{error && (
					<Typography align="center" variant="subtitle1">
						<Translate value="global.CBComponents.video.wsImagePlayer.encounteredText"/> 
					</Typography>
				)}
				{videoData && (
					<img
						ref={this.imageRef}
						onLoad={handleImageChange}
						key="camera"
						alt="camera"
						src={videoData}
						style={styles.video}
					/>
				)}
			</div>
		);
	}
}

WSImagePlayer.propTypes = propTypes;
WSImagePlayer.defaultProps = defaultProps;

export default WSImagePlayer;
