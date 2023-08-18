import React, { Component } from "react";

import DockedControls from "./DockedControls";
import CameraCard from "orion-components/Profiles/Widgets/Cameras/components/CameraCard";
import { Translate } from "orion-components/i18n/I18nContainer";

export default class CameraDockModule extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

handleCameraReplace = (newCameraId) => {
	const { cameraPosition, dockedCameras, removeDockedCamera, addToDock, clearCameraReplaceMode } = this.props;

	removeDockedCamera(cameraPosition, dockedCameras);
	setTimeout(() => {
		addToDock(newCameraId, cameraPosition, dockedCameras);
		clearCameraReplaceMode();
	}, 100);
};

	// set overlay mode
	renderCameraDisplay = (cameraReplaceMode, newCamera) => {
		const {
			camera,
			cameraPosition,
			userCameras,
			dockedCameras,
			addToDock,
			removeDockedCamera,
			cameraView,
			fromEco,
			fromOrg,
			setCameraPriority,
			setFindNearestMode,
			findNearestMode,
			findNearestPosition,
			clearCameraReplaceMode,
			permissions,
			dialog,
			openDialog,
			closeDialog,
			hasProfile,
			loadProfile,
			fullscreenCameraOpen,
			sidebarOpen,
			user,
			readOnly,
			playbackStartTime,
			playBarValue,
			playbackPlaying,
			currentReplayMedia,
			addReplayMedia,
			removeReplayMedia,
			dir
		} = this.props;

		// If name of camera includes word camera, don't add it to the dock placeholder
		// Set camera name if camera exists
		let cameraTextFix = "Camera";
		let cameraName;
		if (newCamera) {
			cameraName = newCamera.entityData.properties.name;

			if (
				newCamera.entityData.properties.name.toLowerCase().includes("camera")
			) {
				cameraTextFix = "";
			}
		}

		// if no camera and not trying to add one, show 'add camera' controls
		if (camera === null && !cameraReplaceMode.replaceMode) {
			return (
				<DockedControls
					userCameras={userCameras} // cameras user has access to
					dockedCameras={dockedCameras} // cameras that are docked
					cameraPosition={cameraPosition} // index of camera in array
					addToDock={addToDock} // method to dock camera
					addCamera={this.addCamera}
					cameraView={cameraView}
					setFindNearestMode={setFindNearestMode}
					findNearestMode={findNearestMode}
					findNearestPosition={findNearestPosition}
					dir={dir}
				/>
			);
			// if no camera and trying to replace, show camera add placeholder
		} else if (camera === null && cameraReplaceMode.replaceMode) {
			return (
				<div
					className="add-to-dock-placeholder"
					onClick={() => {
						addToDock(newCamera.id, cameraPosition, dockedCameras);
						clearCameraReplaceMode();
					}}
				>
					{cameraTextFix == "Camera" ? <Translate value="global.dock.cameras.camDockModule.addStatic" primaryValue={newCamera.entityData.properties.name} /> : <Translate value="global.dock.cameras.camDockModule.addDynamic" primaryValue={newCamera.entityData.properties.name} secondaryValue={cameraTextFix}/>}
				</div>
			);
			// otherwise, render a camera, or a camera with an overlay if trying to replace
		} else {
			return (
				<div style={{ position: "relative" }}>
					{cameraReplaceMode.replaceMode && (
						<p
							className="overlay-text"
							onClick={() => this.handleCameraReplace(newCamera.id)} // handle replacing docked camera
						>
							{" "}
							{cameraName ? <Translate value="global.dock.cameras.camDockModule.replaceWith" count={cameraName}/> : ""}{" "}
						</p>
					)}
					<div className={cameraReplaceMode.replaceMode ? "camera-overlay" : ""}>
						<CameraCard
							cameraIndex={cameraPosition}
							canUnlink={false}
							useCameraGeometry={true}
							loadProfile={loadProfile}
							camera={camera}
							canExpand={false}
							handleCardExpand={() => {}}
							canTarget={true}
							hasMenu={true}
							expanded={true}
							disableSlew={true}
							sidebarOpen={sidebarOpen}
							dockedCameras={dockedCameras}
							removeDockedCamera={removeDockedCamera}
							isInDock={true}
							dialog={dialog}
							openDialog={openDialog}
							closeDialog={closeDialog}
							readOnly={!!readOnly}
							playbackStartTime={playbackStartTime}
							playBarValue={playBarValue}
							playbackPlaying={playbackPlaying}
							currentReplayMedia={currentReplayMedia}
							addReplayMedia={addReplayMedia}
							removeReplayMedia={removeReplayMedia}
							canControl={
								!readOnly &&
								user && user.integrations
								&& user.integrations.find(int => int.intId === camera.feedId)
								&& user.integrations.find(int => int.intId === camera.feedId).permissions
								&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control")
							}
							subscriberRef={"dock"}
							setCameraPriority={setCameraPriority}
							fullscreenCamera={fullscreenCameraOpen}
							dir={dir}
						/>
					</div>
				</div>
			);
		}
	};

	render() {
		// .active = boolean, .cameraId = id
		const { cameraReplaceMode } = this.props;
		// cameraReplaceMode, cameraName, camera from camerawidget
		const cameraDisplay = this.renderCameraDisplay(
			cameraReplaceMode,
			cameraReplaceMode.camera
		);

		return (
			<div>
				{/* Conditionally render modules to ensure unmount when not in use */}
				{this.props.sidebarOpen ? cameraDisplay : <div />}
			</div>
		);
	}
}
