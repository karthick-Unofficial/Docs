import React, { useState, useEffect, useCallback, Fragment } from "react";
import PropTypes from "prop-types";

// -- components
import { BaseWidget } from "../shared";
import RobotCameraCard from "./components/RobotCameraCard";
import { RobotDogBluePrint } from "./images";
import {
	CameraBack,
	CameraTop,
	CameraFrontLeft,
	CameraFrontRight,
	CameraLeft,
	CameraRight,
	BlueCone,
	BlueConeDouble,
	RedCone,
	RedConeDouble
} from "./icons";

// -- material-ui
import { List } from "@material-ui/core";
import { Videocam, RecordVoiceOver } from "@material-ui/icons";
import { Video, RobotIndustrial, CarLightHigh } from "mdi-material-ui";
import { Translate } from "orion-components/i18n/I18nContainer";

const CAMERA_POSITION_INDEX = [ "frontLeft", "frontRight", "left", "right", "back", "top" ];
const CAMERA_POSITION_STRING = {
	"frontLeft": "Front/Left RGB Camera",
	"frontRight": "Front/Right RGB Camera",
	"left": "Left RGB Camera",
	"right": "Right RGB Camera",
	"back": "Back RGB Camera",
	"top": "TOP RGB Camera"
};

const CAMERA_POSITION_CLASS = {
	"frontLeft": "front-left-camera",
	"frontRight": "front-right-camera",
	"left": "left-camera",
	"right": "right-camera",
	"back": "back-camera",
	"top": "top-camera"
};

const CAMERA_ICONS = [
	(<CameraFrontLeft className={"camera-svg"} />),
	(<CameraFrontRight className={"camera-svg"} />),
	(<CameraLeft className={"camera-svg"} />),
	(<CameraRight className={"camera-svg"} />),
	(<CameraBack className={"camera-svg"} />),
	(<CameraTop className={"camera-svg"} />)
];

const BLUEPRINT_IMAGES = {
	"Ghost Robotics Dog": RobotDogBluePrint
};

// ***** TODO: setup propTypes correctly
const propTypes = {
	order: PropTypes.number,
	dir: PropTypes.string
};

const RobotCamerasWidget = ({
	selected,
	order,
	canLink,
	enabled,
	entity,
	widgetsExpandable,
	widgetsLaunchable,
	cameras,
	robotCameras,
	robotCameraStates,
	loadProfile,
	sidebarOpen,
	dockedCameras,
	addCameraToDockMode,
	removeDockedCamera,
	entityType,
	// geometry,
	useCameraGeometry,
	readOnly,
	contextId,
	dialog,
	openDialog,
	closeDialog,
	subscriberRef,
	setCameraPriority,
	fullscreenCamera,
	linkEntities,
	unlinkCameras,
	user,
	eventEnded,
	isAlertProfile,
	toggleCameraState,
	hideBlueprint,
	dir

}) => {
	const [expandedCameras, setExpandedCameras] = useState([]);
	const [hideCameras, setHideCameras] = useState(true);

	/* Generate cameras required for robot */
	const getRobotLayoutCameras = (hideInVisibleCameras) => {

		const labels = ["FL", "FR", "L", "R", "B", "T", "O"];
		const positions = ["frontLeft", "frontRight", "left", "right", "back", "top", "other"];
		let camerasIntial = [];

		let otherCameraIndex = 6; //generally all position 'other' cameras will start from 6
		if (cameras && cameras.length > 0) {
			cameras.forEach(cam => {
				const camTmp = { ...cam };
				camTmp.isVisible = true;

				const robotCamera = robotCameras.find(robotCamera => robotCamera.id === camTmp.id);
				if (robotCamera) {
					if (robotCamera.position !== "other") {
						const { position } = robotCamera;
						camTmp.entityData.properties = { ...camTmp.entityData.properties, position: CAMERA_POSITION_STRING[position] };
						camTmp.index = CAMERA_POSITION_INDEX.indexOf(position);
						camTmp.positionLookup = position;
					}
					else {
						camTmp.index = otherCameraIndex++;
						camTmp.positionLookup = "";
					}
				}

				camerasIntial.push(camTmp);

			});

			robotCameras.forEach(rcam => {
				const index = positions.indexOf(rcam.position);
				delete labels[index];
				delete positions[index];
			});

			const otherIndexPosition = labels.findIndex( (l) => {
				return (l === "O");
			}) || 6; //other position is 6

			//enter non visible dummy cameras
			let ix = 1;

			labels.forEach(lbl => {
				//Note: CAMERA_POSITION_INDEX dont contain 'other'
				let indexTmp = (ix >= (otherIndexPosition + 1)) ? (otherIndexPosition + 1) : CAMERA_POSITION_INDEX.indexOf(positions[ix - 1]);
				
				camerasIntial.push({
					id: ix + "-invisible",
					index: indexTmp,
					positionLookup: positions[ix - 1],
					isVisible: false
				});

				ix = ix + 1;
			});

			//dont show on UI : cameras list.
			if (hideInVisibleCameras) {
				camerasIntial = camerasIntial.filter(c => c.isVisible === true);
			}

			return camerasIntial.sort((a, b) => a.index - b.index);

		}

		return camerasIntial;
	};

	const layoutCameras = getRobotLayoutCameras(false);

	const getCameraIndexOnRobot = (robotCamId) => {
		const camTmp = layoutCameras.find(c => c.id === robotCamId);
		if (camTmp) {
			return camTmp.index;
		} else {
			return -1;
		}

	};
	/* */

	const getRobotCameras = (excludeOtherPositionType) => {
		//Note: cameras containing position = 'other' should not be show on blueprint.
		if (robotCameras && robotCameras.length > 0 && excludeOtherPositionType) {
			return robotCameras.filter(c => c.position !== "other");
		} else {
			return robotCameras || [];
		}
	};

	useEffect(() => {
		if (!hideCameras && expandedCameras.length > 0 && (!robotCameras || robotCameras.length < 1)){
			setExpandedCameras([]);
			setHideCameras(true);
		}
		
	}, [robotCameras]);

	useEffect(() => {
		if (hideBlueprint && hideCameras && expandedCameras.length > 0) {
			expandedCameras.forEach(camId => {
				toggleCameraState(camId, "off");
			});

			setExpandedCameras([]);

		}
	}, [hideBlueprint]);

	const toggleCameraList = () => {
		setHideCameras(!hideCameras);
	};

	const blueprintCameraClick = (cameraId, cameraState) => {
		// -- update camera state and expand camera card
		toggleCameraState(cameraId, cameraState);

		const cameraStates = robotCameras.find(robotCamera => robotCamera.id === cameraId).states;
		if (
			expandedCameras.includes(cameraId) && cameraState === cameraStates[cameraStates.length-1] ||
			!expandedCameras.includes(cameraId) && cameraState !== cameraStates[cameraStates.length-1]
		) {
			handleCardExpand(cameraId);
		}
	};

	const handleCardExpand = id => {
		const newExpandedCameras = [...expandedCameras];
		const cameraIndex = expandedCameras.indexOf(id);
		if (cameraIndex < 0) {
			newExpandedCameras.push(id);
			setExpandedCameras(newExpandedCameras);
		}
		else {
			newExpandedCameras.splice(cameraIndex, 1);
			setExpandedCameras(newExpandedCameras);
		}
	};

	const toggleCardExpand = id => {
		const newExpandedCameras = [...expandedCameras];
		const cameraIndex = expandedCameras.indexOf(id);
		if (cameraIndex < 0) {
			newExpandedCameras.push(id);
			setExpandedCameras(newExpandedCameras);
			
			// -- turn camera state on
			const robotCamera = robotCameras.find(robotCamera => robotCamera.id === id);
			if (robotCamera && robotCamera.states) {
				toggleCameraState(id, "off");
			}
		}
		else {
			newExpandedCameras.splice(cameraIndex, 1);
			setExpandedCameras(newExpandedCameras);
			
			// -- turn camera state off
			const robotCamera = robotCameras.find(robotCamera => robotCamera.id === id);
			if (robotCamera && robotCamera.states) {
				toggleCameraState(id, robotCamera.states[robotCamera.states.length-1]);
			}
		}
	};

	const getCameraCone = (cameraIndex, cameraState, frontLeftCameraState, frontRightCameraState) => {
		if (cameraIndex <= 1 && frontLeftCameraState === frontRightCameraState) {
			// -- one of the first 2 cameras and same state, check for double cone
			if (cameraIndex === 1) {
				// -- only return one double cone
				return null;
			}
			if (cameraState === "normal") {
				return <BlueConeDouble className="camera-double-cone" />;
			}
			else if (cameraState === "thermal") {
				return <RedConeDouble className="camera-double-cone" />;
			}
		}
		else {
			if (cameraState === "normal") {
				return <BlueCone className="camera-cone" />;
			}
			else if (cameraState === "thermal") {
				return <RedCone className="camera-cone" />;
			}
		}
		return null;
	};

	// -- check front camera for outside styling
	const isOutsideCamera = (cameraIndex, frontLeftCameraState, frontRightCameraState) => {
		if (frontLeftCameraState !== frontRightCameraState) {
			// -- push camera outside if different state from other front camera, and that camera is on
			if (cameraIndex === 0) {
				if (!frontRightCameraState) {
					return false;
				} else if (frontRightCameraState !== "off") {
					return true;
				}
			}
			else if (cameraIndex === 1) {
				if (!frontLeftCameraState) {
					return false;
				} else if (frontLeftCameraState !== "off") {
					return true;
				}
			}
		}
		return false;
	};

	const getCameraState = (id) => {
		if (!id || expandedCameras.length < 1 || !expandedCameras.includes(id) || !robotCameraStates || !robotCameraStates[id]) {
			return "off";
		} else {
			return robotCameraStates[id];
		}
	};

	// -- store front camera states for use in cone icon selection
	let frontLeftCameraState, frontRightCameraState;
	const setFrontLeftRightCameraState = () => {
		const camFrontLeft = layoutCameras.find(c => c.positionLookup === "frontLeft");
		const camFrontRight = layoutCameras.find(c => c.positionLookup === "frontRight");

		frontLeftCameraState = getCameraState(camFrontLeft ? camFrontLeft.id : null);
		frontRightCameraState = getCameraState(camFrontRight ? camFrontRight.id : null);
	};

	if (layoutCameras.length > 0) {
		setFrontLeftRightCameraState();
	}

	const displaySensorsButton = useCallback(() => {
		return (
			<div className="sensors-icon-container" style={{ marginTop: (hideBlueprint ? 10 : -5) }}>
				<div className={`icon-container ${hideCameras ? "b2-dark-gray" : "b2-white"}`} onClick={toggleCameraList}>
					<div className="icon" style={{ color: (hideCameras ? "#828283" : "#4DB5F4") }}><Video /></div>
					<div className="icon-label" ><Translate value="global.profiles.widgets.robotCams.main.cameras"/></div>
				</div>
				{/*Todo: Audio, Lights and Arm functionalities needs to be implemented once its available */}
				<div className="icon-container b2-dark-gray disabled">
					<div className="icon" ><RecordVoiceOver /></div>
					<div className="icon-label" ><Translate value="global.profiles.widgets.robotCams.main.audio"/></div>
				</div>
				<div className="icon-container b2-dark-gray disabled">
					<div className="icon" ><CarLightHigh /></div>
					<div className="icon-label" ><Translate value="global.profiles.widgets.robotCams.main.lights"/></div>
				</div>
				<div className="icon-container b2-dark-gray disabled">
					<div className="icon" ><RobotIndustrial /></div>
					<div className="icon-label" ><Translate value="global.profiles.widgets.robotCams.main.arm"/></div>
				</div>
			</div>
		);
	}, [hideCameras]);

	const getBlueprintCameraLayout = useCallback(() => {
		const robotType = (entity && entity.entityData && entity.entityData.properties && entity.entityData.properties.subtype) || "Unknown";
		return (
			!hideBlueprint && <div className="camera-layout-container">
				{
					(robotType !== "Unknown") && <img src={BLUEPRINT_IMAGES[robotType]} className="blueprint-image" alt="Robot blueprint" />
				}
				{getRobotCameras(true).map((camera) => {
					const index = getCameraIndexOnRobot(camera.id);

					const isOutside = isOutsideCamera(index, frontLeftCameraState, frontRightCameraState);
					const cameraState = getCameraState(camera.id);
					return (
						<Fragment key={camera.id}>
							<div className={`blueprint-camera ${CAMERA_POSITION_CLASS[camera.position]} ${isOutside && "outside"}`} style={{zIndex: 2}}>
								{getCameraCone(index, cameraState, frontLeftCameraState, frontRightCameraState)}
								<Videocam className={`camera-icon ${cameraState}`} fontSize="large" />
								<p>{camera.label}</p>
							</div>
							{/* click handler overlay */}
							<div className={`blueprint-camera click-handler ${CAMERA_POSITION_CLASS[camera.position]} ${isOutside && "outside"}`} style={{zIndex: 3}} onClick={() => blueprintCameraClick(camera.id, cameraState)} />
						</Fragment>
					);
				})}
			</div>
		);
	}, [hideBlueprint, robotCameras, robotCameraStates, frontLeftCameraState, frontRightCameraState]);

	const getCamerasPanel = useCallback(() => {
		const camerasVisible = getRobotLayoutCameras(true);
		return (
			<div>
				<List id="camera-list">
					{camerasVisible && camerasVisible.length > 0 && camerasVisible.map((camera) => {
						const index = camera.index;

						const cameraIcon = CAMERA_ICONS[index] || (<Videocam fontSize="large" />);
						const isOpen = expandedCameras.includes(camera.id);
						const showCamera = camera && (!hideCameras || (hideCameras && isOpen));

						// canUnlink={canLink}
						// useCameraGeometry={useCameraGeometry}
						// unlinkCameras={unlinkCameras}
						// canTarget={!cameraDisabled}
						// geometry={geometry}
						return showCamera ? (
							<RobotCameraCard
								contextId={contextId}
								cameraIndex={index}
								entityType={entityType}
								key={camera.id}
								loadProfile={loadProfile}
								camera={camera}
								canExpand={!camera.isDeleted}
								toggleCardExpand={toggleCardExpand}
								hasMenu={isOpen && !camera.isDeleted}
								expanded={isOpen}
								sidebarOpen={sidebarOpen}
								dockedCameras={dockedCameras}
								addCameraToDockMode={addCameraToDockMode}
								removeDockedCamera={removeDockedCamera}
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								readOnly={readOnly}
								canControl={
									!readOnly &&
									user && user.integrations
									&& user.integrations.find(int => int.intId === camera.feedId)
									&& user.integrations.find(int => int.intId === camera.feedId).permissions
									&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control")
								}
								subscriberRef={subscriberRef}
								setCameraPriority={setCameraPriority}
								fullscreenCamera={fullscreenCamera}
								cameraIcon={cameraIcon}
								dir={dir}
							/>
						) : null;
					})}
				</List>
			</div>
		);
	}, [
		cameras,
		expandedCameras,
		hideCameras,
		contextId,
		entityType,
		sidebarOpen,
		dockedCameras,
		dialog,
		readOnly,
		user.integrations,
		fullscreenCamera
	]);

	return (
		<BaseWidget enabled={enabled} order={order} title="" dir={dir}>
			{/* Blueprint Camera Layout */}
			{getBlueprintCameraLayout()}
			{/* cameras, Audio, Lights and Arm sensors buttons*/}
			{displaySensorsButton()}
			{/* Cameras Panel */}
			{getCamerasPanel()}
		</BaseWidget>
	);
};

RobotCamerasWidget.propTypes = propTypes;
export default RobotCamerasWidget;
