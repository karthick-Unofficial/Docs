import React, { Fragment, useEffect, useRef, useState, createRef, useCallback } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography, Fab } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import Flashphoner from "./flashphoner.js";
import { Translate } from "orion-components/i18n/I18nContainer";

const { constants } = Flashphoner;
const { SESSION_STATUS, STREAM_STATUS } = constants;
const { ESTABLISHED, DISCONNECTED, FAILED } = SESSION_STATUS;
const {
	PENDING,
	PLAYING,
	PLAYBACK_PROBLEM,
	STOPPED,
	NOT_ENOUGH_BANDWIDTH
} = STREAM_STATUS;
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
	streamUrl: PropTypes.string
};

const defaultProps = { streamUrl: "" };


const usePrevious = (value) => {
	const ref = useRef(null);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const WebRTCPlayer = (props) => {
	const { url, streamUrl } = props;
	const [status, setStatus] = useState();
	const frame = createRef();
	const [_isMounted, set_IsMounted] = useState(false);
	const [session, setSession] = useState();
	const [stream, setStream] = useState();
	const prevProps = usePrevious(props);

	//force update
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);

	useEffect(() => {

		set_IsMounted(true);
		startSession();

		return () => {
			set_IsMounted(false);
			endSession();
		};
	}, []);


	useEffect(() => {
		if (prevProps) {
			if (url !== prevProps.url && streamUrl !== prevProps.streamUrl) {
				handleRefresh();
			}
		}
	}, [props]);

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
				.on(ESTABLISHED, session => {
					if (_isMounted) {
						setStatus(session.status());
						if (streamUrl) startStream(session);
						setSession(session);
					}
					else {
						session.disconnect();
					}
				})
				.on(DISCONNECTED, () => {
					if (_isMounted) {
						setStatus("DISCONNECTED");
					}
				})
				.on(FAILED, () => {
					if (_isMounted) {
						setStatus("FAILED");
					}
				});
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	const startStream = session => {
		const options = {
			name: streamUrl,
			display: frame.current
		};
		const stream = session
			.createStream(options)
			.on(PENDING, () => {
				if (_isMounted) {
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
				if (_isMounted) {
					setStatus("FAILED");
				}
			})
			.on(PLAYING, () => {
				if (_isMounted) {
					setStatus("PLAYING");
					const video = document.getElementById(stream.id());
					video.style.display = "block";
				}
				else {
					stream.stop();
				}
			})
			.on(STOPPED, () => {
				if (_isMounted) {
					setStatus("STOPPED");
				}
			})
			.on(STREAM_STATUS.FAILED, () => {
				if (_isMounted) {
					setStatus("FAILED");
				}
			})
			.on(NOT_ENOUGH_BANDWIDTH, () => {
				if (_isMounted) {
					setStatus("LOW BANDWIDTH");
				}
			});
		setStream(stream);
		stream.play();
	};

	const handleRefresh = e => {
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

	return (
		<div ref={frame} className="camera-text-wrapper" style={styles.wrapper}>
			{(status === null || status === "PENDING") && <CircularProgress />}
			{status === "ESTABLISHED" && !streamUrl && (
				<Typography align="center" variant="subtitle1">
					<Translate value="global.CBComponents.video.webRTCPlayer.unableToAccess" />
				</Typography>
			)}
			{status === "FAILED" && (
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
			)}
		</div>
	);

};

WebRTCPlayer.propTypes = propTypes;
WebRTCPlayer.defaultProps = defaultProps;

export default WebRTCPlayer;
