import React, {
	Fragment,
	useEffect,
	useRef,
	useState,
	useCallback
} from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography, Fab } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import Flashphoner from "./flashphoner.js";
import { Translate } from "orion-components/i18n";

const { constants } = Flashphoner;
const { SESSION_STATUS, STREAM_STATUS } = constants;
const { ESTABLISHED, DISCONNECTED, FAILED } = SESSION_STATUS;
const { PENDING, PLAYING, PLAYBACK_PROBLEM, STOPPED, NOT_ENOUGH_BANDWIDTH } =
	STREAM_STATUS;
// Potentially necessary to connect across different networks
// const mediaOptions = {
// 	iceServers: [
// 		{
// 			urls: "turn:turn.flashphoner.com:443?transport=tcp",
// 			username: "flashphoner",
// 			credential: "coM77EMrV7Cwhyan"
// 		}
// 	]
// };

const propTypes = {
	url: PropTypes.string.isRequired,
	streamUrl: PropTypes.string,
	streamUrlError: PropTypes.bool
};

const defaultProps = { streamUrl: "" };

const WebRTCPlayer = (props) => {
	const { url, streamUrl, streamUrlError } = props;
	const [status, setStatus] = useState(null);
	const frame = useRef(null);
	const _isMounted = useRef(false);
	const [session, setSession] = useState();
	const [stream, setStream] = useState();
	const streamUrlRef = useRef(streamUrl);

	const usePrevious = (value) => {
		const ref = useRef(null);
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	//force update
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);

	useEffect(() => {
		// If we have a URL and it's either the first one or changed
		if (!!url && (!prevProps || url !== prevProps.url)) {
			if (session) {
				// Since there's an existing session, we need to kill it and create a new one
				handleRefresh();
			} else {
				// No existing session, so we just need to start one
				startSession();
			}
		}
	}, [url]);

	useEffect(() => {
		streamUrlRef.current = streamUrl;
		// If there's no existing session, we won't do anything here
		if (session) {
			// If we have a streamUrl and it's either the first one or changed
			if (
				!!streamUrl &&
				(!prevProps || streamUrl !== prevProps.streamUrl)
			) {
				if (stream) {
					// Existing stream, so we need to stop it first
					stream.stop();
				}

				// Start new stream
				startStream(session);
			}
		}
	}, [streamUrl]);

	useEffect(() => {
		_isMounted.current = true;

		return () => {
			_isMounted.current = false;
			endSession();
		};
	}, []);

	const endSession = () => {
		if (stream) stream.stop();
		if (session) session.disconnect();
	};

	const startSession = () => {
		if (!frame.current) {
			forceUpdate();
		}

		try {
			Flashphoner.init({
				receiverLocation: "WSReceiver2.js",
				decoderLocation: "video-worker2.js",
				preferredMediaProviders: []
			});
			Flashphoner.createSession({ urlServer: url })
				.on(ESTABLISHED, (session) => {
					if (_isMounted.current) {
						setStatus(session.status());

						// If we have a streamUrl, we'll go ahead and start the stream
						// If we don't, we will start the stream when we have one.
						if (streamUrlRef.current) {
							startStream(session);
						}
						setSession(session);
					} else {
						session.disconnect();
					}
				})
				.on(DISCONNECTED, () => {
					if (_isMounted.current) {
						setStatus("DISCONNECTED");
					}
				})
				.on(FAILED, () => {
					if (_isMounted.current) {
						setStatus("FAILED");
					}
				});
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	const startStream = (session) => {
		const options = {
			name: streamUrlRef.current,
			display: frame.current
		};
		const stream = session
			.createStream(options)
			.on(PENDING, () => {
				if (_isMounted.current) {
					setStatus("PENDING");
					const video = document.getElementById(stream.id());
					video.style.maxWidth = "100%";
					video.style.maxHeight = "100%";
					video.style.objectFit = "contain";
					video.style.height = "100%";
					video.style.display = "none";
				}
			})
			.on(PLAYBACK_PROBLEM, () => {
				if (_isMounted.current) {
					setStatus("FAILED");
				}
			})
			.on(PLAYING, () => {
				if (_isMounted.current) {
					setStatus("PLAYING");
					const video = document.getElementById(stream.id());
					video.style.display = "block";
				} else {
					stream.stop();
				}
			})
			.on(STOPPED, () => {
				if (_isMounted.current) {
					setStatus("STOPPED");
				}
			})
			.on(STREAM_STATUS.FAILED, () => {
				if (_isMounted.current) {
					setStatus("FAILED");
				}
			})
			.on(NOT_ENOUGH_BANDWIDTH, () => {
				if (_isMounted.current) {
					setStatus("LOW BANDWIDTH");
				}
			});

		setStream(stream);
		stream.play();
	};

	const handleRefresh = (e) => {
		if (e) {
			e.stopPropagation();
		}
		endSession();
		setStatus(null);
		startSession();
	};

	const styles = {
		wrapper: {
			display: "flex",
			position: "absolute",
			alignItems: "center",
			flex: "auto",
			flexDirection: "column",
			justifyContent: "center"
		},
		button: {
			zIndex: 99,
			marginTop: 12
		}
	};

	const statusIndicator = () => {
		if (status === "FAILED") {
			return (
				<Fragment>
					<Typography align="center" variant="subtitle1">
						<Translate value="global.CBComponents.video.webRTCPlayer.camProblem" />
					</Typography>
					<Fab
						style={styles.button}
						color="primary"
						onClick={handleRefresh}
						size="small"
					>
						<Refresh style={{ color: "#FFF" }} />
					</Fab>
				</Fragment>
			);
		} else if (streamUrlError) {
			return (
				<Typography align="center" variant="subtitle1">
					<Translate value="global.CBComponents.video.webRTCPlayer.unableToAccess" />
				</Typography>
			);
		} else if (status === "PLAYING") {
			return null;
		}
		else {
			return (
				<CircularProgress />
			);
		}
	};

	return (
		<div ref={frame} className="camera-text-wrapper" style={styles.wrapper}>
			{statusIndicator()}
		</div>
	);
};

WebRTCPlayer.propTypes = propTypes;
WebRTCPlayer.defaultProps = defaultProps;

export default WebRTCPlayer;
