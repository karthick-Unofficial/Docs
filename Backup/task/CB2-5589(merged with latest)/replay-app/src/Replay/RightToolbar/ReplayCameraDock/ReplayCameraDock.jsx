import React, { useEffect, useState, useRef, Fragment, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import tNearestPoint from "@turf/nearest-point";
import moment from "moment";
import { Translate } from "orion-components/i18n";
import { withStyles } from "@mui/styles";
import { LinearProgress, SvgIcon } from "@mui/material";
import { Close } from "@mui/icons-material";
import { mdiVolumeMute, mdiVolumeHigh } from "@mdi/js";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { CameraDockModule } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import { cameraDockSelector, dockedCamerasSelector } from "./selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import * as actionCreators from "./replayCameraDockActions";

const styles = {
	drawerHeader: {
		display: "flex",
		justifyContent: "space-between",
		width: "90%",
		margin: "auto",
		marginTop: "20px",
		marginBottom: "20px",
		color: "#fff"
	},
	audioContainer: {
		position: "relative",
		width: "90%",
		margin: "auto"
	},
	audioContent: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		display: "flex"
	},
	audioIcon: {
		marginRight: "16px"
	},
	audioText: {
		paddingTop: "2px"
	}
};

const AudioProgress = withStyles({
	root: {
		height: 50,
		borderRadius: 10
	},
	colorPrimary: {
		backgroundColor: "#41454A"
	},
	bar: {
		borderRadius: 5,
		backgroundColor: "#1688BD"
	}
})(LinearProgress);

// -- tool for storing previous prop/state values in hooks
function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

const propTypes = {
	readOnly: PropTypes.bool,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
	closeDrawer: PropTypes.func
};

const ReplayCameraDock = ({ readOnly, startDate, endDate, closeDrawer }) => {
	const dispatch = useDispatch();

	const {
		openDialog,
		closeDialog,
		loadProfile,
		addToDock,
		removeFromDock,
		setCameraPriority,
		setFindNearestMode,
		clearFindNearestMode,
		clearCameraReplaceMode,
		addMedia,
		removeMedia
	} = actionCreators;
	const user = useSelector((state) => state.session.user.profile);
	// -- grab cameras available from map
	const cameraIntIds = user.integrations.filter((int) => int.entityType === "camera").map((int) => int.intId);
	let userCameras = [];
	const entities = useSelector((state) => state.appState.replayMapRef.entities);
	if (entities) {
		cameraIntIds.forEach((intId) => {
			if (entities[intId]) {
				const cameras = Object.keys(entities[intId]).map((key) => entities[intId][key]);
				userCameras.push(...cameras.filter((camera) => !!camera.cameraReplaySystem));
			}
		});
	}

	const audioVideoDock = useSelector((state) => cameraDockSelector(state));
	const findNearestMode = audioVideoDock.findNearestMode;
	const findNearestPosition = audioVideoDock.findNearestPosition;
	const cameraReplaceMode = audioVideoDock.cameraReplaceMode;
	const cameraPriority = audioVideoDock.cameraPriority;
	const currentMedia = audioVideoDock.currentMedia;
	const replayMapRef = useSelector((state) => state.appState.replayMapRef);
	const mapRef = replayMapRef ? replayMapRef.mapObject : null;
	const cameraView = replayMapRef ? replayMapRef.visible : null;
	const dialog = useSelector((state) => state.appState.dialog.openDialog || "");
	const hasProfile = useSelector((state) => !!state.appState.contextPanel);
	const playBarValue = useSelector((state) => state.playBar.playBarValue);
	const playing = useSelector((state) => state.playBar.playing);
	const clientConfig = useSelector((state) => state.clientConfig);

	const permissions = {};

	const camerasInt = user.integrations.filter((int) => int.intId === "cameras")[0];
	if (camerasInt && camerasInt.permissions) {
		permissions.canControl = camerasInt.permissions.includes("control");
	}
	const dockedCameras = useSelector((state) => dockedCamerasSelector(state));
	const fullscreenCameraOpen = cameraPriority.modalOpen;
	const eventideEndpoint = clientConfig.eventideEndpoint;
	const dir = useSelector((state) => getDir(state));

	const [audioProgress, setAudioProgress] = useState(0);
	const [volumeMuted, setVolumeMuted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [audio, setAudio] = useState(null);

	const prevMedia = usePrevious(currentMedia) || [];

	// -- automatically load audio on dock opening if already part of currentMedia
	useEffect(() => {
		if (currentMedia.includes("audio")) {
			fetchAudio();
		}
	}, []);

	// -- Cleanup everything when component is closed
	const cleanupAudioPlayer = useCallback(() => {
		if (audio) {
			audio.pause();
			audio.src = "";
		}
	}, [audio]);
	useEffect(() => {
		return () => {
			cleanupAudioPlayer();
		};
	}, [cleanupAudioPlayer]);

	useEffect(() => {
		const handleFindNearestCamera = (e) => {
			// Builds a GeoJSON FeatureCollection using data from available cameras
			const features = userCameras.map((camera) => {
				const { entityData } = camera;
				const { geometry, properties } = entityData;
				return {
					type: "Feature",
					geometry,
					properties
				};
			});
			const cleanFeatures = features.filter((f) => {
				return (
					f.geometry !== undefined &&
					f.geometry !== null &&
					f.geometry.type === "Point" &&
					Array.isArray(f.geometry.coordinates) &&
					f.geometry.coordinates[0] !== null &&
					f.geometry.coordinates[1] != null &&
					!isNaN(f.geometry.coordinates[0]) &&
					!isNaN(f.geometry.coordinates[1])
				);
			});
			const coords = e.lngLat;
			const coordinate = [coords.lng, coords.lat];
			const featureCollection = {
				type: "FeatureCollection",
				features: cleanFeatures
			};
			// set nearest camera using turf
			const nearestCamera = tNearestPoint(coordinate, featureCollection);
			// add to dock
			dispatch(addToDock(nearestCamera.properties.id, findNearestPosition));
			// reset state and buttons
			dispatch(clearFindNearestMode());
		};

		if (mapRef && findNearestMode.includes(true)) {
			mapRef.on("click", handleFindNearestCamera);

			// -- cleanup
			return () => {
				mapRef.off("click", handleFindNearestCamera);
			};
		}
	}, [mapRef, findNearestMode, userCameras, addToDock, findNearestPosition, dockedCameras, clearFindNearestMode]);

	// -- build out camera modules
	const cameraModules = dockedCameras.map((id, index) => {
		const camera = userCameras.find((camera) => camera.id === id);
		let fromOrg = false;
		let fromEco = false;
		if (camera) {
			fromOrg = camera.ownerOrg === user.orgId;
			fromEco = camera.ownerOrg !== user.orgId;
		}
		const playbackStartTime = moment.utc(startDate).startOf("second").toISOString();

		return (
			<div key={index} className={"docked-camera-wrapper " + (!camera ? "dashed-border" : "")}>
				<CameraDockModule
					sidebarOpen={true}
					removeDockedCamera={removeFromDock}
					addToDock={addToDock} // method to add camera to dock
					cameraPosition={index}
					userCameras={userCameras}
					dockedCameras={dockedCameras} // array of docked cameras
					camera={camera || null}
					fromEco={fromEco}
					fromOrg={fromOrg}
					cameraView={cameraView}
					// Priority
					setCameraPriority={setCameraPriority}
					// Map
					setFindNearestMode={setFindNearestMode}
					findNearestMode={findNearestMode}
					findNearestPosition={findNearestPosition}
					// Replace on dock
					cameraReplaceMode={cameraReplaceMode}
					clearCameraReplaceMode={clearCameraReplaceMode}
					permissions={permissions}
					// Dialog
					dialog={dialog}
					openDialog={openDialog}
					closeDialog={closeDialog}
					// Profile
					hasProfile={hasProfile}
					loadProfile={loadProfile}
					fullscreenCameraOpen={fullscreenCameraOpen}
					user={user}
					// Replay
					readOnly={readOnly}
					playbackStartTime={playbackStartTime}
					playBarValue={playBarValue}
					playbackPlaying={playing}
					currentReplayMedia={currentMedia}
					addReplayMedia={addMedia}
					removeReplayMedia={removeMedia}
					dir={dir}
				/>
			</div>
		);
	});

	// -- handle current media time reset when new media (audio or video) is loaded
	useEffect(() => {
		if (currentMedia.length > 0) {
			const newMediaId = currentMedia.filter((media) => !prevMedia.includes(media))[0];
			if (newMediaId && newMediaId !== "audio" && audio) {
				// -- jump audio to correct position
				audio.currentTime = 0;
			}
		}
	}, [currentMedia]);

	// -- handle play/pause interaction on PlaybackBar
	useEffect(() => {
		if (audio) {
			if (Number.isNaN(audio.duration) || audio.currentTime < audio.duration) {
				if (playing) {
					audio.play();
				} else {
					audio.pause();
				}
			}
		}
	}, [audio, playing]);

	let manualProgress = 0;
	const fetchAudio = () => {
		manualProgress = 0;
		setLoading(true);
		downloadAudio({
			onDownloadProgress: (progressEvent) => {
				if (progressEvent.total > 0) {
					const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setAudioProgress(percentage);
					if (percentage === 100) {
						setTimeout(() => {
							setLoading(false);
							dispatch(addMedia("audio")); // this does not have to be a unique id since there can't be multiple audio sources
						}, 400);
					}
				} else {
					// -- TODO: make this more sophisticated. We can probably estimate the amount of time it takes based on the duration of the replay.
					// Note: 1.1 min download time for 10 min clip (while on Corpus VPN)
					if (manualProgress < 99) {
						manualProgress += 0.1;
					}
					setAudioProgress(manualProgress);
				}
			},
			responseType: "arraybuffer"
		});
	};

	const downloadAudio = (config) => {
		// -- format start and end datetimes
		const startTime = moment(startDate).format("YYYYMMDDTHHmmss");
		const endTime = moment(endDate).format("YYYYMMDDTHHmmss");

		const endpoint = encodeURI(
			eventideEndpoint.replace("{startTime}", startTime).replace("{endTime}", endTime)
		).replaceAll("&", "%26");
		axios
			.get(`/_proxy?type=eventide&url=${endpoint}`, config)
			.then((res) => {
				// -- force progress update when not getting content length in the headers
				if (manualProgress > 0) {
					setTimeout(() => {
						setAudioProgress(100);
						setLoading(false);
						dispatch(addMedia("audio")); // this does not have to be a unique id since there can't be multiple audio sources
					}, 500);
				}

				const blob = new Blob([res.data], { type: "audio/wav" });
				const url = window.URL.createObjectURL(blob);
				setAudio(new Audio(url));
			})
			.catch((err) => {
				console.log(`Download Audio Error: ${err}`);

				setAudioProgress(0);
				setLoading(false);
			});
	};

	// -- handle differenct scenarios for the Audio button getting clicked
	const audioClick = () => {
		if (!loading) {
			// -- start audio download
			if (!audio) {
				fetchAudio();
			}
			// -- mute/unmute audio if loaded
			else {
				audio.muted = !volumeMuted;
				setVolumeMuted(!volumeMuted);
			}
		}
	};

	const cursorStyle = !loading ? "pointer" : "auto";
	return (
		<ErrorBoundary>
			{/* Header */}
			<div style={styles.drawerHeader}>
				<p>
					<Translate value="replay.replayCamera.replayCamera" />
				</p>
				<a>
					<div className="close-ad-text" style={{ cursor: "pointer" }} onClick={closeDrawer}>
						<Close />
					</div>
				</a>
			</div>
			{/* Content */}
			<ErrorBoundary>
				<div style={{ overflow: "scroll", height: "calc(100% - 68px)" }}>
					{/* Audio */}
					{eventideEndpoint && (
						<ErrorBoundary>
							<div
								style={{
									...styles.audioContainer,
									cursor: cursorStyle
								}}
								onClick={audioClick}
							>
								<AudioProgress variant="determinate" value={audioProgress} />
								<div style={styles.audioContent}>
									{!audio && !loading ? (
										<p>
											<Translate value="replay.replayCamera.loadAudio" />
										</p>
									) : loading ? (
										<p>
											<Translate value="replay.replayCamera.loading" />
										</p>
									) : (
										<Fragment>
											{volumeMuted ? (
												<Fragment>
													<SvgIcon style={styles.audioIcon}>
														<path d={mdiVolumeMute} />
													</SvgIcon>
													<p style={styles.audioText}>
														<Translate value="replay.replayCamera.unmute" />
													</p>
												</Fragment>
											) : (
												<Fragment>
													<SvgIcon style={styles.audioIcon}>
														<path d={mdiVolumeHigh} />
													</SvgIcon>
													<p style={styles.audioText}>
														<Translate value="replay.replayCamera.mute" />
													</p>
												</Fragment>
											)}
										</Fragment>
									)}
								</div>
							</div>
						</ErrorBoundary>
					)}
					{/* Cameras */}
					<ErrorBoundary>
						<div className="camera-dock">{cameraModules}</div>
					</ErrorBoundary>
				</div>
			</ErrorBoundary>
		</ErrorBoundary>
	);
};

ReplayCameraDock.propTypes = propTypes;
export default ReplayCameraDock;
