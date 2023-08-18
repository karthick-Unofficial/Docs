import React, { useEffect, useState, useRef, Fragment, useCallback } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import tNearestPoint from "@turf/nearest-point";
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import { LinearProgress, SvgIcon } from "@material-ui/core";
import Close from "material-ui/svg-icons/content/clear";
import { mdiVolumeMute, mdiVolumeHigh } from "@mdi/js";

import ErrorBoundary from "orion-components/ErrorBoundary";
import { CameraDockModule } from "orion-components/Dock";

const styles = {
	drawerHeader: {
		display: "flex",
		justifyContent: "space-between",
		width: "90%",
		margin: "auto",
		marginTop: "20px",
		marginBottom: "20px"
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
	user: PropTypes.object,
	userCameras: PropTypes.array,
	dockedCameras: PropTypes.array,
	mapRef: PropTypes.object,
	cameraView: PropTypes.bool,
	findNearestMode: PropTypes.array,
	findNearestPosition: PropTypes.number,
	cameraReplaceMode: PropTypes.object,
	permissions: PropTypes.object,
	dialog: PropTypes.string,
	hasProfile: PropTypes.bool,
	fullscreenCameraOpen: PropTypes.bool,
	currentMedia: PropTypes.array,
	playing: PropTypes.bool,
	startDate: PropTypes.string,
	endDate: PropTypes.string,
	eventideEndpoint: PropTypes.string,
	addToDock: PropTypes.func,
	removeFromDock: PropTypes.func,
	setCameraPriority: PropTypes.func,
	setFindNearestMode: PropTypes.func,
	clearFindNearestMode: PropTypes.func,
	clearCameraReplaceMode: PropTypes.func,
	openDialog: PropTypes.func,
	closeDialog: PropTypes.func,
	loadProfile: PropTypes.func,
	closeDrawer: PropTypes.func,
	addMedia: PropTypes.func,
	removeMedia: PropTypes.func
};

const ReplayCameraDock = ({
	readOnly,
	user,
	userCameras,
	dockedCameras,
	mapRef,
	cameraView,
	findNearestMode,
	findNearestPosition,
	cameraReplaceMode,
	permissions,
	dialog,
	hasProfile,
	fullscreenCameraOpen,
	currentMedia,
	playing,
	startDate,
	endDate,
	eventideEndpoint,
	addToDock,
	removeFromDock,
	setCameraPriority,
	setFindNearestMode,
	clearFindNearestMode,
	clearCameraReplaceMode,
	openDialog,
	closeDialog,
	loadProfile,
	closeDrawer,
	addMedia,
	removeMedia
}) => {
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
		const handleFindNearestCamera = e => {
			// Builds a GeoJSON FeatureCollection using data from available cameras
			const features = userCameras.map(camera => {
				const { entityData } = camera;
				const { geometry, properties } = entityData;
				return {
					type: "Feature",
					geometry,
					properties
				};
			});
			const cleanFeatures = features.filter((f) => {
				return f.geometry !== undefined && f.geometry !== null && f.geometry.type === "Point" &&
					Array.isArray(f.geometry.coordinates) && f.geometry.coordinates[0] !== null && f.geometry.coordinates[1] != null &&
					!isNaN(f.geometry.coordinates[0]) && !isNaN(f.geometry.coordinates[1]);
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
			addToDock(
				nearestCamera.properties.id,
				findNearestPosition,
				dockedCameras
			);
			// reset state and buttons
			clearFindNearestMode();
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
		const camera = userCameras.find(camera => camera.id === id);
		let fromOrg = false;
		let fromEco = false;
		if (camera) {
			fromOrg = camera.ownerOrg === user.orgId;
			fromEco = camera.ownerOrg !== user.orgId;
		}
		const playbackStartTime = moment.utc(startDate).startOf("second").toISOString();

		return (
			<div key={index}
				className={
					"docked-camera-wrapper " +
					(!camera ? "dashed-border" : "")
				}
			>
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
					playbackPlaying={playing}
					currentReplayMedia={currentMedia}
					addReplayMedia={addMedia}
					removeReplayMedia={removeMedia}
				/>
			</div>
		);
	});

	// -- handle current media time reset when new media (audio or video) is loaded
	useEffect(() => {
		if (currentMedia.length > 0) {
			const newMediaId = currentMedia.filter(media => !prevMedia.includes(media))[0];
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
				}
				else {
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
			onDownloadProgress: progressEvent => {
				if (progressEvent.total > 0) {
					const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setAudioProgress(percentage);
					if (percentage === 100) {
						setTimeout(() => {
							setLoading(false);
							addMedia("audio");	// this does not have to be a unique id since there can't be multiple audio sources
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

	const downloadAudio = config => {
		// -- format start and end datetimes
		const startTime = moment(startDate).format("YYYYMMDDTHHmmss");
		const endTime = moment(endDate).format("YYYYMMDDTHHmmss");

		const endpoint = encodeURI(eventideEndpoint.replace("{startTime}", startTime).replace("{endTime}", endTime)).replaceAll("&", "%26");
		axios.get(`/_proxy?type=eventide&url=${endpoint}`, config)
			.then((res) => {
				// -- force progress update when not getting content length in the headers
				if (manualProgress > 0) {
					setTimeout(() => {
						setAudioProgress(100);
						setLoading(false);
						addMedia("audio");	// this does not have to be a unique id since there can't be multiple audio sources
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
				<p>Replay Cameras</p>
				<a>
					<div className="close-ad-text" style={{cursor: "pointer"}} onClick={closeDrawer}>
						<Close />
					</div>
				</a>
			</div>
			{/* Content */}
			<ErrorBoundary>
				<div style={{ overflow: "scroll", height: "calc(100% - 68px)" }}>
					{/* Audio */}
					{eventideEndpoint && (<ErrorBoundary>
						<div style={{...styles.audioContainer, cursor: cursorStyle}} onClick={audioClick}>
							<AudioProgress variant="determinate" value={audioProgress} />
							<div style={styles.audioContent}>
								{!audio && !loading ? (
									<p>Load Audio</p>
								) : loading ? (
									<p>Loading Audio...</p>
								) : (
									<Fragment>
										{volumeMuted ? (
											<Fragment>
												<SvgIcon style={styles.audioIcon}>
													<path d={mdiVolumeMute} />
												</SvgIcon>
												<p style={styles.audioText}>Unmute Audio</p>
											</Fragment>
										) : (
											<Fragment>
												<SvgIcon style={styles.audioIcon}>
													<path d={mdiVolumeHigh} />
												</SvgIcon>
												<p style={styles.audioText}>Mute Audio</p>
											</Fragment>
										)}
									</Fragment>
								)}
							</div>
						</div>
					</ErrorBoundary>)}
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
