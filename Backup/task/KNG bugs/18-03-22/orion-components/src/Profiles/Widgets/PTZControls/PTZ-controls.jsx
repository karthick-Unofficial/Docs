import React, { Component } from "react";
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

class PTZControls extends Component {
	constructor(props) {
		super(props);

		const { instanceId } = props;
		this.state = {
			instanceId: instanceId
		};
	}

	handleContinuousStop = () => {
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", 0, 0, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "pan", 0, 0, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "zoom", 0, 0, { instanceId: this.props.instanceId });
	};

	handleCameraNorthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, -1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", -1, .5, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "pan", -1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraNorth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, -1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", -1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraNorthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, -1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "pan", 1, .5, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", -1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 0, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "pan", -1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraHome = () => {
		cameraService.moveHome(this.props.camera.id, { instanceId: this.props.instanceId });
	};

	handleCameraEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 0, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "pan", 1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraSouthWest = () => {
		// cameraService.moveRelative(this.props.camera.id, -1, 1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "pan", -1, .5, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", 1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraSouth = () => {
		// cameraService.moveRelative(this.props.camera.id, 0, 1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", 1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraSouthEast = () => {
		// cameraService.moveRelative(this.props.camera.id, 1, 1, 1, 1);
		cameraService.moveContinuous(this.props.camera.id, null, "pan", 1, .5, { instanceId: this.props.instanceId });
		cameraService.moveContinuous(this.props.camera.id, null, "tilt", 1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraZoomIn = () => {
		cameraService.moveContinuous(this.props.camera.id, null, "zoom", 1, .5, { instanceId: this.props.instanceId });
	};

	handleCameraZoomOut = () => {
		cameraService.moveContinuous(this.props.camera.id, null, "zoom", -1, .5, { instanceId: this.props.instanceId });
	};

	render() {
		const { dock } = this.props;

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
							onMouseDown={this.handleCameraZoomIn}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							style={buttonStyles.zoom}
							mini={dock}
						>
							<ZoomInIcon />
						</FloatingActionButton>
					</div>
					<div className="ptz-circle">
						<FloatingActionButton
							onMouseDown={this.handleCameraZoomOut}
							onMouseUp={this.handleContinuousStop}
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
							onMouseDown={this.handleCameraNorthWest}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowBottomLeft className="rotate-arrow" />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraNorth}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowUpward />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraNorthEast}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowTopRight />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraWest}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowBack />}
						/>
					</div>
					<div className="ptz-grid-item ptz-home">
						<FlatButton
							style={buttonStyles.move}
							onClick={this.handleCameraHome}
							icon={<HomeIcon />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraEast}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowForward />}
						/>
					</div>

					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraSouthWest}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowBottomLeft />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraSouth}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowDownward />}
						/>
					</div>
					<div className="ptz-grid-item">
						<FlatButton
							style={buttonStyles.move}
							onMouseDown={this.handleCameraSouthEast}
							onMouseUp={this.handleContinuousStop}
							backgroundColor="#828283"
							icon={<NavigationArrowTopRight className="rotate-arrow" />}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default PTZControls;
