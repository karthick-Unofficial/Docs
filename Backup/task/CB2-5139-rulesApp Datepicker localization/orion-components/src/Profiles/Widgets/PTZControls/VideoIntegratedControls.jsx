import React, { Component } from "react";
import { cameraService } from "client-app-core";
import $ from "jquery";

class VideoIntegratedControls extends Component {
	constructor(props) {
		super(props);

		this.controlSurface = React.createRef();

		this.state = {
			instanceId: props.instanceId,
			ctrlEngaged: false,
			panSpd: 0,
			tiltSpd: 0,
			zoom: 0
		};
	}

	_onPointerDown = (e) => {
		this.controlSurface.current.setPointerCapture(e.nativeEvent.pointerId);
		this.controlSurface.current.startX = e.nativeEvent.offsetX;
		this.controlSurface.current.startY = e.nativeEvent.offsetY;
		this.controlSurface.current.lastX = 0;
		this.controlSurface.current.lastY = 0;
		this.setState({
			ctrlEngaged: true
		});
	}

	_onPointerUp = (e) => {
		this.setState({
			ctrlEngaged: false
		});
		this.controlSurface.current.releasePointerCapture(e.nativeEvent.pointerId);
		this.stopContinuousPanTilt();
	}

	_onPointerMove = (e) => {
		if (this.state.ctrlEngaged) {
			this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
			this.moveContinuousPanTilt(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
	}

	_onMouseWheel = (e) => {
		let zoomFactor = this.props.camera.entityData.properties.vicZoomFactor || 20;
		const zoomDirFactor = zoomFactor < 0 ? 1 : -1;
		zoomFactor = Math.abs(zoomFactor);
		const distance = Math.abs(Math.round((e.nativeEvent.deltaY) / 100) / zoomFactor);
		if(distance !== 0) {
			const direction = (e.nativeEvent.deltaY < 0 ? -1 : 1) * zoomDirFactor;
			this.setState({ zoom: distance });
			this.relativeZoom(direction, distance, 1);
		}
	}

	_onPointerEnter = (e) => {
		const profileWrapper = $(".cb-profile-wrapper")[0];
		const cameraDock = $(".camera-dock")[0];
		if(profileWrapper) profileWrapper.style.overflow = "hidden";
		if(cameraDock) cameraDock.parentElement.style.overflow = "hidden";
	}

	_onPointerLeave = (e) => {
		const profileWrapper = $(".cb-profile-wrapper")[0];
		const cameraDock = $(".camera-dock")[0];
		if(profileWrapper) profileWrapper.style.overflow = "scroll";
		if(cameraDock) cameraDock.parentElement.style.overflow = "scroll";
	}

	// will only need the one command for XY and another for zoom relative
	moveContinuousPanTilt = (x, y) => {
		let panFactor = this.props.camera.entityData.properties.vicPanFactor || 10;
		let tiltFactor = this.props.camera.entityData.properties.vicTiltFactor || 10;

		const deltaX = x - this.controlSurface.current.startX;
		const deltaY = this.controlSurface.current.startY - y;

		// -- negative values for factors flip the direction
		const panDir = deltaX < 0 ? -1 : 1 * (panFactor < 0 ? -1 : 1);
		const tiltDir = deltaY < 0 ? 1 : -1 * (tiltFactor < 0 ? -1 : 1);

		panFactor = Math.abs(panFactor);
		tiltFactor = Math.abs(tiltFactor);

		// pan/tilt speed is 0-1
		// 10 is the default distance unit for speed change. Debating whether should be calculated or fixed. Leaning toward fixed for consistent behavior
		let panSpd = Math.round(Math.abs(deltaX) / 10) / panFactor;
		panSpd = panSpd > 1 ? 1 : panSpd;
		let tiltSpd = Math.round(Math.abs(deltaY) / 10) / tiltFactor;
		tiltSpd = tiltSpd > 1 ? 1 : tiltSpd;
		if (this.controlSurface.current.lastX !== (panSpd * panDir)) {
			cameraService.moveContinuous(this.props.camera.id, this.state.instanceId, "pan", panDir, panSpd);
			this.controlSurface.current.lastX = panSpd * panDir;
			this.setState({ panSpd: panSpd * panDir });
		}
		if (this.controlSurface.current.lastY !== (tiltSpd * tiltDir)) {
			cameraService.moveContinuous(this.props.camera.id, this.state.instanceId, "tilt", tiltDir, tiltSpd);
			this.controlSurface.current.lastY = tiltSpd * tiltDir;
			this.setState({ tiltSpd: tiltSpd * tiltDir });
		}
	};

	stopContinuousPanTilt = () => {
		cameraService.moveContinuous(this.props.camera.id, this.state.instanceId, "pan", 0, 0);
		cameraService.moveContinuous(this.props.camera.id, this.state.instanceId, "tilt", 0, 0);
	};

	relativeZoom = (direction, distance, speed = 1) => {
		cameraService.zoomRelative(this.props.camera.id, this.state.instanceId, direction, distance, speed);
	};


	render() {

		const styles = {
			control_surface: {
				"position": "absolute",
				"zIndex": "1900",
				"width": "100%",
				"height": "100%"
			}
		};

		return (
			<div ref={this.controlSurface}
				style={styles.control_surface}
				onPointerDown={this._onPointerDown}
				onPointerMove={this._onPointerMove}
				onPointerUp={this._onPointerUp}
				onWheel={this._onMouseWheel}
				onPointerEnter={this._onPointerEnter}
				onPointerLeave={this._onPointerLeave}>
				
			</div>
		);
	}
}

export default VideoIntegratedControls;
