import React, { useEffect, useState } from "react";

import PTZControls from "../../../Profiles/Widgets/PTZControls/PTZ-controls";
import { TargetingIcon } from "../../../SharedComponents";
// Material UI
import FlatButton from "material-ui/FlatButton";
import { Cancel } from "@material-ui/icons";
import { withWidth, IconButton } from "@material-ui/core";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import { v4 as uuidv4 } from "uuid";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const DockedCamera = ({
	setCameraPriority,
	removeDockedCamera,
	dockedCameras,
	hasProfile, loadProfile, camera,
	cameraPosition,
	overlay,
	cameraView,
	canControl,
	dialog,
	openDialog,
	closeDialog,
	fullscreenCameraOpen,
	addToDock,
	overlayText
}) => {
	const dispatch = useDispatch();

	const [showControls, setShowControls] = useState(false);
	const [cameraExpanded, setCameraExpanded] = useState(false);
	const [instanceId, setInstanceId] = useState(uuidv4());

	useEffect(() => {
		dispatch(setCameraPriority(true, false));

		return () => {
			dispatch(setCameraPriority(false, false));
		};
	}, []);

	const removeCamera = position => {
		dispatch(removeDockedCamera(position, dockedCameras));
	};

	const handleControls = () => {
		setShowControls(!showControls);
	};

	const loadCameraProfile = () => {
		const { id, entityData } = camera;

		if (!hasProfile) {
			return;
		}

		dispatch(loadProfile(id, entityData.properties.name, "camera", "profile"));
	};

	const hasCapability = (capability) => {
		return camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability);
	};

	const buttonStyles = {
		controls: {
			color: "#35b7f3"
		}
	};

	const targetIcon = <TargetingIcon id={camera.id} feedId={camera.feedId} />;

	return (
		<div style={{ position: "relative" }}>
			{overlay && (
				<p
					className="overlay-text"
					onClick={overlay ? addToDock : () => { }} // handle replacing docked camera
				>
					{" "}
					{overlayText}{" "}
				</p>
			)}
			<div className={overlay ? "camera-overlay" : "video-wrapper"}>
				<div className="camera-header">
					{/* Only render target icon if map is expanded */}
					{cameraView && targetIcon}
					<p className="camera-title" onClick={loadCameraProfile}>
						{camera.entityData.properties.name}
					</p>
					<IconButton onClick={() => removeCamera(cameraPosition)}>
						<Cancel />
					</IconButton>
				</div>

				{/* Camera */}
				<div style={{ width: "100%" }}>
					<VideoPlayerWrapper
						instanceId={instanceId}
						camera={camera}
						docked={false}
						modal={fullscreenCameraOpen}
						dialogKey={`dock-${camera.id}-${cameraPosition}`}
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canControl={canControl}
						setCameraPriority={setCameraPriority}
						expanded={false}
					/>
				</div>

				<div className="camera-footer">
					{/* PTZ Controls */}
					{hasCapability("control") && showControls && (
						<div className="camera-dock-ptz-wrapper">
							<PTZControls
								dock={true}
								camera={camera}
								instanceId={instanceId}
							/>
						</div>
					)}
					{/* Show Camera Controls Button */}
					{hasCapability("control") && canControl ? (
						!showControls ? (
							<FlatButton
								onClick={handleControls}
								label={getTranslation("global.dock.cameras.dockedCam.showControls")}
								labelStyle={buttonStyles.controls}
							/>
						) : (
							<FlatButton
								onClick={handleControls}
								label={getTranslation("global.dock.cameras.dockedCam.hideControls")}
								labelStyle={buttonStyles.controls}
							/>
						)
					) : null}
				</div>
			</div>
		</div>
	);
};

export default withWidth()(DockedCamera);
