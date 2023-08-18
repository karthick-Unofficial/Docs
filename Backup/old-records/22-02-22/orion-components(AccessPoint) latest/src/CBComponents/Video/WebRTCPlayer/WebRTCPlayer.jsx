import React, { Component, Fragment } from "react";
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

class WebRTCPlayer extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = { status: null };
		this.frame = React.createRef();
	}
	componentDidMount() {
		this._isMounted = true;
		this.startSession();
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.endSession();
	}

	componentDidUpdate(prevProps, prevState) {
		const { url, streamUrl } = this.props;
		// If either URL is updated, restart session and stream
		if (url !== prevProps.url || streamUrl !== prevProps.streamUrl)
			this.handleRefresh();
	}

	endSession = () => {
		const { session, stream } = this.state;
		if (stream) stream.stop();
		if (session) session.disconnect();
	};

	startSession = () => {
		const { url, streamUrl } = this.props;

		if (!this.frame.current) {
			this.forceUpdate();
		}

		try {
			Flashphoner.init({
				receiverLocation: "WSReceiver2.js",
				decoderLocation: "video-worker2.js",
				preferredMediaProviders: []
			});
			Flashphoner.createSession({ urlServer: url })
				.on(ESTABLISHED, session => {
					if (this._isMounted) {
						this.setState({ status: session.status() });
						if (streamUrl) this.startStream(session);
						this.setState({ session });
					}
					else {
						session.disconnect();
					}
				})
				.on(DISCONNECTED, () => {
					if (this._isMounted) {
						this.setState({ status: "DISCONNECTED" });
					}
				})
				.on(FAILED, () => {
					if (this._isMounted) {
						this.setState({ status: "FAILED" });
					}
				});
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	startStream = session => {
		const { streamUrl } = this.props;
		const options = {
			name: streamUrl,
			display: this.frame.current
		};
		const stream = session
			.createStream(options)
			.on(PENDING, () => {
				if (this._isMounted) {
					this.setState({ status: "PENDING" });
					const video = document.getElementById(stream.id());
					video.style.maxWidth = "100%";
					video.style.maxHeight = "100%";
					video.style.objectFit = "contain";
					video.style.height = "100%";
					video.style.display = "none";
				}
			})
			.on(PLAYBACK_PROBLEM, () => {
				if (this._isMounted) {
					this.setState({ status: "FAILED" });
				}
			})
			.on(PLAYING, () => {
				if (this._isMounted) {
					this.setState({ status: "PLAYING" });
					const video = document.getElementById(stream.id());
					video.style.display = "block";
				}
				else {
					stream.stop();
				}
			})
			.on(STOPPED, () => {
				if (this._isMounted) {
					this.setState({ status: "STOPPED" });
				}
			})
			.on(STREAM_STATUS.FAILED, () => {
				if (this._isMounted) {
					this.setState({ status: "FAILED" });
				}
			})
			.on(NOT_ENOUGH_BANDWIDTH, () => {
				if (this._isMounted) {
					this.setState({ status: "LOW BANDWIDTH" });
				}
			});
		this.setState({ stream });
		stream.play();
	};

	handleRefresh = e => {
		if (e) {
			e.stopPropagation();
		}
		this.endSession();
		this.setState({ status: null });
		this.startSession();
	};

	render() {
		const { streamUrl } = this.props;
		const { status } = this.state;
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
			<div ref={this.frame} className="camera-text-wrapper" style={styles.wrapper}>
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
							onClick={this.handleRefresh}
							size="small"
						>
							<Refresh style={{ color: "#FFF" }} />
						</Fab>
					</Fragment>
				)}
			</div>
		);
	}
}

WebRTCPlayer.propTypes = propTypes;
WebRTCPlayer.defaultProps = defaultProps;

export default WebRTCPlayer;
