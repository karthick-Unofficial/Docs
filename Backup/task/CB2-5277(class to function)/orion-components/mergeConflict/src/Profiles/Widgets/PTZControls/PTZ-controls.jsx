import React from "react";
import { cameraService } from "client-app-core";

// Material UI
import { FlatButton, FloatingActionButton } from "material-ui";

// Material UI Icons
import NavigationArrowForward from "material-ui/svg-icons/navigation/arrow-forward";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import NavigationArrowDownward from "material-ui/svg-icons/navigation/arrow-downward";
import NavigationArrowUpward from "material-ui/svg-icons/navigation/arrow-upward";
import { default as NavigationArrowTopRight } from "material-ui/svg-icons/communication/call-made"; // There are no diagonal arrows
import { default as NavigationArrowBottomLeft } from "material-ui/svg-icons/communication/call-received"; // There are no diagonal arrows
import { default as HomeIcon } from "material-ui/svg-icons/action/home";
import { default as ZoomInIcon } from "material-ui/svg-icons/content/add";
import { default as ZoomOutIcon } from "material-ui/svg-icons/content/remove";

const PTZControls = ({
	instanceId,
	camera,
	dock
}) => {


	const handleContinuousStop = () => {
		cameraService.moveContinuous(camera.id, null, "tilt", 0, 0, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "pan", 0, 0, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "zoom", 0, 0, { instanceId: instanceId });
	};

	const handleCameraNorthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, -1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "tilt", -1, .5, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "pan", -1, .5, { instanceId: instanceId });
	};

	const handleCameraNorth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, -1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "tilt", -1, .5, { instanceId: instanceId });
	};

	const handleCameraNorthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, -1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "pan", 1, .5, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "tilt", -1, .5, { instanceId: instanceId });
	};

	const handleCameraWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 0, 1, 1);
		cameraService.moveContinuous(camera.id, null, "pan", -1, .5, { instanceId: instanceId });
	};

	const handleCameraHome = () => {
		cameraService.moveHome(camera.id, { instanceId: instanceId });
	};

	const handleCameraEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 0, 1, 1);
		cameraService.moveContinuous(camera.id, null, "pan", 1, .5, { instanceId: instanceId });
	};

	const handleCameraSouthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "pan", -1, .5, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "tilt", 1, .5, { instanceId: instanceId });
	};

	const handleCameraSouth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, 1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "tilt", 1, .5, { instanceId: instanceId });
	};

	const handleCameraSouthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 1, 1, 1);
		cameraService.moveContinuous(camera.id, null, "pan", 1, .5, { instanceId: instanceId });
		cameraService.moveContinuous(camera.id, null, "tilt", 1, .5, { instanceId: instanceId });
	};

	const handleCameraZoomIn = () => {
		cameraService.moveContinuous(camera.id, null, "zoom", 1, .5, { instanceId: instanceId });
	};

	const handleCameraZoomOut = () => {
		cameraService.moveContinuous(camera.id, null, "zoom", -1, .5, { instanceId: instanceId });
	};

	const buttonStyles = {
		zoom: {
			margin: ".5rem 1rem"
		},
		move: {
			width: "100%",
			height: "100%",
			minWidth: 0
		}
	};

	return (
		<div className="ptz-control-main-container">
			<div className="ptz-button-wrapper">
				<div className="ptz-circle">
					<FloatingActionButton
						onMouseDown={handleCameraZoomIn}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						style={buttonStyles.zoom}
						mini={dock}
					>
						<ZoomInIcon />
					</FloatingActionButton>
				</div>
				<div className="ptz-circle">
					<FloatingActionButton
						onMouseDown={handleCameraZoomOut}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						style={buttonStyles.zoom}
						mini={dock}
					>
						<ZoomOutIcon />
					</FloatingActionButton>
				</div>
			</div>
			<div className={`ptz-grid ${dock ? "docked-grid" : ""}`}>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraNorthWest}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowBottomLeft className="rotate-arrow" />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraNorth}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowUpward />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraNorthEast}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowTopRight />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraWest}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowBack />}
					/>
				</div>
				<div className="ptz-grid-item ptz-home">
					<FlatButton
						style={buttonStyles.move}
						onClick={handleCameraHome}
						icon={<HomeIcon />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraEast}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowForward />}
					/>
				</div>

				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraSouthWest}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowBottomLeft />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraSouth}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowDownward />}
					/>
				</div>
				<div className="ptz-grid-item">
					<FlatButton
						style={buttonStyles.move}
						onMouseDown={handleCameraSouthEast}
						onMouseUp={handleContinuousStop}
						backgroundColor="#828283"
						icon={<NavigationArrowTopRight className="rotate-arrow" />}
					/>
				</div>
			</div>
		</div>
	);
};

export default PTZControls;
