import React, { Component } from "react";

import PTZControls from "../../../Profiles/Widgets/PTZControls/PTZ-controls";
import { TargetingIcon } from "../../../SharedComponents";
// Material UI
import FlatButton from "material-ui/FlatButton";
import { Cancel } from "@material-ui/icons";
import { withWidth, IconButton } from "@material-ui/core";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import { v4 as uuidv4 } from "uuid";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class DockedCamera extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showControls: false,
			cameraExpanded: false,
			instanceId: uuidv4()
		};
	}

	componentDidMount() {
		// dockOpen, modalOpen
		this.props.setCameraPriority(true, false);
	}

	componentWillUnmount() {
		// dockOpen, modalOpen
		this.props.setCameraPriority(false, false);
	}

	removeCamera = position => {
		this.props.removeDockedCamera(position, this.props.dockedCameras);
	};

	handleControls = () => {
		this.setState({ showControls: !this.state.showControls });
	};

	loadCameraProfile = () => {
		const { hasProfile, loadProfile, camera } = this.props;
		const { id, entityData } = camera;

		if (!hasProfile) {
			return;
		}

		loadProfile(id, entityData.properties.name, "camera", "profile");
	}

	hasCapability = (capability) => {
		return this.props.camera.entityData.properties.features && 
		this.props.camera.entityData.properties.features.includes(capability);
	}

	render() {
		const {
			camera,
			cameraPosition,
			overlay,
			cameraView,
			canControl,
			dialog,
			openDialog,
			closeDialog,
			setCameraPriority,
			fullscreenCameraOpen
		} = this.props;

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
						onClick={overlay ? this.props.addToDock : () => {}} // handle replacing docked camera
					>
						{" "}
						{this.props.overlayText}{" "}
					</p>
				)}
				<div className={overlay ? "camera-overlay" : "video-wrapper"}>
					<div className="camera-header">
						{/* Only render target icon if map is expanded */}
						{cameraView && targetIcon}
						<p className="camera-title" onClick={this.loadCameraProfile}>
							{camera.entityData.properties.name}
						</p>
						<IconButton onClick={() => this.removeCamera(cameraPosition)}>
							<Cancel />
						</IconButton>
					</div>

					{/* Camera */}
					<div style={{ width: "100%" }}>
						<VideoPlayerWrapper
							instanceId={this.state.instanceId}
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
						{this.hasCapability("control") && this.state.showControls && (
							<div className="camera-dock-ptz-wrapper">
								<PTZControls 
									dock={true} 
									camera={camera} 
									instanceId={this.state.instanceId}
								/>
							</div>
						)}
						{/* Show Camera Controls Button */}
						{this.hasCapability("control") && canControl ? (
							!this.state.showControls ? (
								<FlatButton
									onClick={this.handleControls}
									label={getTranslation("global.dock.cameras.dockedCam.showControls")}
									labelStyle={buttonStyles.controls}
								/>
							) : (
								<FlatButton
									onClick={this.handleControls}
									label={getTranslation("global.dock.cameras.dockedCam.hideControls")}
									labelStyle={buttonStyles.controls}
								/>
							)
						) : null}
					</div>
				</div>
			</div>
		);
	}
}

export default withWidth()(DockedCamera);
