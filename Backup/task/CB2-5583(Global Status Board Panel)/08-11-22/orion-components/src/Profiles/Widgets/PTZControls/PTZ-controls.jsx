import React from "react";
import { cameraService } from "client-app-core";

// Material UI
import { Button, Fab as FloatingActionButton } from "@mui/material";

// Material UI Icons

import { default as HomeIcon } from "@mui/icons-material/Home";
import { NorthWest, North, NorthEast, East, SouthEast, South, SouthWest, West, Add, Remove } from '@mui/icons-material';

//import { default as NavigationArrowTopRight } from "material-ui/svg-icons/communication/call-made"; // There are no diagonal arrows
//import { default as NavigationArrowBottomLeft } from "material-ui/svg-icons/communication/call-received"; // There are no diagonal arrows


const PTZControls = ({
	instanceId,
	camera,
	dock
}) => {


	const handleContinuousStop = () => {
		cameraService.moveContinuous(camera.id, instanceId, "tilt", 0, 0);
		cameraService.moveContinuous(camera.id, instanceId, "pan", 0, 0);
		cameraService.moveContinuous(camera.id, instanceId, "zoom", 0, 0);
	};

	const handleCameraNorthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, -1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, .5);
		cameraService.moveContinuous(camera.id, instanceId, "pan", -1, .5);
	};

	const handleCameraNorth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, -1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, .5);
	};

	const handleCameraNorthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, -1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "pan", 1, .5);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", -1, .5);
	};

	const handleCameraWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 0, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "pan", -1, .5);
	};

	const handleCameraHome = () => {
		cameraService.moveHome(camera.id);
	};

	const handleCameraEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 0, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "pan", 1, .5);
	};

	const handleCameraSouthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "pan", -1, .5);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, .5);
	};

	const handleCameraSouth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, 1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, .5);
	};

	const handleCameraSouthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 1, 1, 1);
		cameraService.moveContinuous(camera.id, instanceId, "pan", 1, .5);
		cameraService.moveContinuous(camera.id, instanceId, "tilt", 1, .5);
	};

	const handleCameraZoomIn = () => {
		cameraService.moveContinuous(camera.id, instanceId, "zoom", 1, .5);
	};

	const handleCameraZoomOut = () => {
		cameraService.moveContinuous(camera.id, instanceId, "zoom", -1, .5);
	};

	const buttonStyles = {
		zoom: {
			margin: ".5rem 1rem",
			color: "#fff",
			borderRadius: "50px",
			backgroundColor: "#828283",
			width: "35px",
			height: "30px",
			fontSize: "25px"
		},
		move: {
			width: "100%",
			height: "100%",
			minWidth: 0,
			color: "#fff",
			borderRadius: "2px"
		}
	};

	return (
		<div className="ptz-control-main-container">
			<div className="ptz-button-wrapper">
				<div className="ptz-circle">
					<FloatingActionButton
						onMouseDown={handleCameraZoomIn}
						onMouseUp={handleContinuousStop}
						style={buttonStyles.zoom}
						mini={dock}
					>
						<Add />
					</FloatingActionButton>
				</div>
				<div className="ptz-circle">
					<FloatingActionButton
						onMouseDown={handleCameraZoomOut}
						onMouseUp={handleContinuousStop}
						style={buttonStyles.zoom}
						mini={dock}
					>
						<Remove />
					</FloatingActionButton>
				</div>
			</div>
			<div className={`ptz-grid ${dock ? "docked-grid" : ""}`}>
				<div className="ptz-grid-item">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
						onMouseDown={handleCameraNorthWest}
						onMouseUp={handleContinuousStop}
					>
						<NorthWest />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
						onMouseDown={handleCameraNorth}
						onMouseUp={handleContinuousStop}
					>
						<North />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
						onMouseDown={handleCameraNorthEast}
						onMouseUp={handleContinuousStop}
					>
						<NorthEast />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
						onMouseDown={handleCameraWest}
						onMouseUp={handleContinuousStop}
					>
						<West />
					</Button>
				</div>
				<div className="ptz-grid-item ptz-home">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move }}
						onClick={handleCameraHome}
					>
						<HomeIcon />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						onMouseDown={handleCameraEast}
						onMouseUp={handleContinuousStop}
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
					>
						<East />
					</Button>
				</div>

				<div className="ptz-grid-item">
					<Button
						onMouseDown={handleCameraSouthWest}
						onMouseUp={handleContinuousStop}
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
					>
						<SouthWest />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						onMouseDown={handleCameraSouth}
						onMouseUp={handleContinuousStop}
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
					>
						<South />
					</Button>
				</div>
				<div className="ptz-grid-item">
					<Button
						variant="text"
						color="primary"
						style={{ ...buttonStyles.move, backgroundColor: "#828283" }}
						onMouseDown={handleCameraSouthEast}
						onMouseUp={handleContinuousStop}
					>
						<SouthEast />
					</Button>
				</div>
			</div>
		</div >
	);
};

export default PTZControls;
