import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { cameraService } from "client-app-core";
import { simpleUnsub } from "orion-components/ContextualData/contextStreaming";
import { CircularProgress, Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

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
	addReplayMedia: () => { },
	removeReplayMedia: () => { }
};

const WSImagePlayer = (props) => {
	const {
		cameraId,
		videoProfile,
		instanceId,
		entityType,
		playbackStartTime,
		entityId,
		playBarValue,
		playbackPlaying,
		removeReplayMedia,
		currentReplayMedia,
		addReplayMedia,
		fullscreen,
		imageChange,
		displayProgress
	} = props;
	const dispatch = useDispatch();

	const [videoData, setVideoData] = useState(null);
	const [metadata, setMetadata] = useState(null);
	const [subscription, setSubscription] = useState(null);
	const [error, setError] = useState(null);
	const [playbackVideoId, setPlaybackVideoId] = useState(null);
	const [playbackStreamStarted, setPlaybackStreamStarted] = useState(false);
	const [replaySetupStream, setReplaySetupStream] = useState(false);
	const [recoverPlaybackStreamState, setRecoverPlaybackStreamState] = useState();

	const prevPropCameraId = useRef();
	const prevPropPlaybackPlaying = useRef();
	const prevPropCurrentReplayMedia = useRef();

	const imageRef = useRef();
	const playerDiv = useRef();

	const isMounted = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		prevPropCameraId.current = cameraId;
		prevPropPlaybackPlaying.current = playbackPlaying;
		prevPropCurrentReplayMedia.current = currentReplayMedia;
	}, [cameraId, playbackPlaying, currentReplayMedia]);

	useEffect(() => {
		if (!playbackStartTime) {
			play(cameraId, videoProfile, instanceId, entityId, entityType);
		} else {
			setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
		}
	}, []);

	// If stream, kill it on unmount
	useEffect(() => {
		return () => {
			if (subscription) {
				//simpleUnsub(subscription.channel);
				subscription.unsubscribe();
			}
		};
	}, [subscription]);

	// If camera changes, unsub old camera and sub to new camera
	useEffect(() => {
		// If camera is different on prop change
		if (prevPropCameraId.current !== cameraId) {
			// If subscription, unsub
			if (subscription) {
				simpleUnsub(subscription.channel);
			}

			if (playbackVideoId) {
				// -- if there is a playback video loaded, decrement the loadedVideos state count
				dispatch(removeReplayMedia(cameraId));
			}

			// Clear out state
			setVideoData(null);
			setSubscription(null);
			setError(null);
			setPlaybackVideoId(null);
			setPlaybackStreamStarted(false);
			setRecoverPlaybackStreamState(false);

			// Start new video
			if (!playbackStartTime) {
				play(cameraId, videoProfile, instanceId, entityId, entityType);
			} else {
				setupPlaybackStream(cameraId, videoProfile, playbackStartTime);
			}
		} else {
			// -- Pause/Play playback stream if applicable
			if (playbackVideoId && prevPropPlaybackPlaying.current !== playbackPlaying) {
				if (playbackPlaying) {
					startPlaybackStream(cameraId, playbackVideoId);
				} else {
					pausePlaybackStream(cameraId, playbackVideoId);
				}
			}
		}

		// -- FOR REPLAY - restart playback video if new media (audio or video) has been loaded
		if (prevPropCurrentReplayMedia.current !== currentReplayMedia && currentReplayMedia.length > 0 && playbackStartTime) {
			// -- restart playback video if the new media is not this camera
			const newMediaId = currentReplayMedia.filter(media => !prevPropCurrentReplayMedia.current.includes(media))[0];
			if (newMediaId && newMediaId !== cameraId) {
				// If subscription, unsub
				if (subscription) {
					simpleUnsub(subscription.channel);
				}
				// Clear out state
				setVideoData(null);
				setSubscription(null);
				setError(null);
				setPlaybackVideoId(null);
				setPlaybackStreamStarted(false);
				// -- Establish a new stream at current playbar value without firing the videoUpdated event
				restartPlaybackStream(cameraId, videoProfile, playbackStartTime);
			}
		}

		if (recoverPlaybackStreamState) {
			// Clear out state
			setVideoData(null);
			setSubscription(null);
			setError(null);
			setPlaybackVideoId(null);
			setPlaybackStreamStarted(false);
			setRecoverPlaybackStreamState(false);
			// -- Establish a new stream without firing the videoUpdated event
			restartPlaybackStream(cameraId, videoProfile, playBarValue, true);
		}
	}, [props, recoverPlaybackStreamState]);

	const play = (cameraId, videoProfile, instanceId, entityId, entityType) => {
		// -- Live video
		const options = {
			instanceId: instanceId,
			playerWidth: playerDiv.current.offsetWidth,
			playerHeight: playerDiv.current.offsetHeight
		};
		if (entityId) options["entityId"] = entityId;
		if (entityType) options["entityType"] = entityType;

		cameraService.streamVideo(cameraId, videoProfile, options, (err, response) => {
			if (err) console.log(err);
			if (!response || !isMounted.current) return;

			const { code, Data, metadata } = response;
			if (code) {
				setError(true);
			} else if (Data) {
				setVideoData("data:image/jpeg;base64," + Data);
				setMetadata(metadata);
			}
		}).then(sub => {
			setSubscription(sub);
		});
	};

	const setupPlaybackStream = (cameraId, videoProfile, playbackStartTime) => {
		// -- Playback video
		cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, (err, response) => {
			if (err) console.log(err);
			if (!response) return;

			// -- allow a null image for now, as milestone can't always access the exact time in the recorder service
			if (response.result && response.result.videoId) {
				const videoId = response.result.videoId;
				setVideoData(response.result.image || null);
				setPlaybackVideoId(videoId);
				setReplaySetupStream(false);
				dispatch(addReplayMedia(cameraId));
			}
			else {
				setError(true);
				setReplaySetupStream(false);
			}
		});

		// -- enable loading icon
		setReplaySetupStream(true);
	};

	const restartPlaybackStream = (cameraId, videoProfile, playbackStartTime, autoStart = false) => {
		// -- Playback video
		const t0 = performance.now();
		cameraService.setupPlaybackStream(cameraId, videoProfile, playbackStartTime, (err, response) => {
			if (err) console.log(err);
			if (!response || response.result === false) {
				setError(true);
				return console.log("Error restarting stream. Check camera-app logs for more details.");
			}

			const t1 = performance.now();
			console.log(`Time to restart playback stream took ${(t1 - t0)} milliseconds.`);

			// -- allow a null image for now, as milestone can't always access the exact time in the recorder service
			if (response.result && response.result.videoId) {
				const videoId = response.result.videoId;
				setVideoData(response.result.image || null);
				setPlaybackVideoId(videoId);
				setReplaySetupStream(false);
				if (autoStart) {
					startPlaybackStream(cameraId, videoId);
				}
			}
			else {
				setError(true);
				setReplaySetupStream(false);
			}
		});

		// -- enable loading icon
		setReplaySetupStream(true);
	};

	const startPlaybackStream = (cameraId, videoId) => {

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
							setRecoverPlaybackStreamState(true);
						} else if (image) {
							setError(false);
							setVideoData(image);
						}
					})
					.then(sub => {
						setSubscription(sub);
						setPlaybackStreamStarted(true);
					});
			}
		});
	};

	const pausePlaybackStream = (cameraId, videoId) => {
		// -- pause stream and stop image retrieval
		cameraService.pausePlaybackStream(cameraId, videoId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};

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
		const dim = imageRef.current ? [imageRef.current.offsetWidth, imageRef.current.offsetHeight] : null;
		if (imageChange) imageChange(metadata, dim);
	};

	return (
		<div style={styles.wrapper} ref={playerDiv}>
			{displayProgress && !error && (subscription || replaySetupStream) && !videoData && <CircularProgress />}
			{error && (
				<Typography align="center" variant="subtitle1">
					<Translate value="global.CBComponents.video.wsImagePlayer.encounteredText" />
				</Typography>
			)}
			{videoData && (
				<img
					ref={imageRef}
					onLoad={handleImageChange}
					key="camera"
					alt="camera"
					src={videoData}
					style={styles.video}
				/>
			)}
		</div>
	);
};

WSImagePlayer.propTypes = propTypes;
WSImagePlayer.defaultProps = defaultProps;

export default WSImagePlayer;