import React, { useState, createRef } from "react";
import { cameraService } from "client-app-core";
import $ from "jquery";

const VideoIntegratedControls = ({
	instanceId,
	camera
}) => {
	const [instanceIdState, setInstanceIdState] = useState(instanceId);
	const [ctrlEngaged, setCtrlEngaged] = useState(false);
	const [panSpd, setPanSpd] = useState(0);
	const [tiltSpd, setTiltSpd] = useState(0);
	const [zoom, setZoom] = useState(0);
	const [x, setX] = useState(null);
	const [y, setY] = useState(null);

	const controlSurface = createRef();

	const _onPointerDown = (e) => {
		controlSurface.current.setPointerCapture(e.nativeEvent.pointerId);
		controlSurface.current.startX = e.nativeEvent.offsetX;
		controlSurface.current.startY = e.nativeEvent.offsetY;
		controlSurface.current.lastX = 0;
		controlSurface.current.lastY = 0;
		setCtrlEngaged(true);
	};

	const _onPointerUp = (e) => {
		setCtrlEngaged(false);
		controlSurface.current.releasePointerCapture(e.nativeEvent.pointerId);
		stopContinuousPanTilt();
	};

	const _onPointerMove = (e) => {
		if (ctrlEngaged) {
			setX(e.nativeEvent.offsetX);
			setY(e.nativeEvent.offsetY);
			moveContinuousPanTilt(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		}
	};

	const _onMouseWheel = (e) => {
		let zoomFactor = camera.entityData.properties.vicZoomFactor || 20;
		const zoomDirFactor = zoomFactor < 0 ? 1 : -1;
		zoomFactor = Math.abs(zoomFactor);
		const distance = Math.abs(Math.round((e.nativeEvent.deltaY) / 100) / zoomFactor);
		if (distance !== 0) {
			const direction = (e.nativeEvent.deltaY < 0 ? -1 : 1) * zoomDirFactor;
			setZoom(distance);
			relativeZoom(direction, distance, 1);
		}
	};

	const _onPointerEnter = (e) => {
		const profileWrapper = $(".cb-profile-wrapper")[0];
		const cameraDock = $(".camera-dock")[0];
		if (profileWrapper) profileWrapper.style.overflow = "hidden";
		if (cameraDock) cameraDock.parentElement.style.overflow = "hidden";
	};

	const _onPointerLeave = (e) => {
		const profileWrapper = $(".cb-profile-wrapper")[0];
		const cameraDock = $(".camera-dock")[0];
		if (profileWrapper) profileWrapper.style.overflow = "scroll";
		if (cameraDock) cameraDock.parentElement.style.overflow = "scroll";
	};

	// will only need the one command for XY and another for zoom relative
	const moveContinuousPanTilt = (x, y) => {
		let panFactor = camera.entityData.properties.vicPanFactor || 10;
		let tiltFactor = camera.entityData.properties.vicTiltFactor || 10;

		const deltaX = x - controlSurface.current.startX;
		const deltaY = controlSurface.current.startY - y;

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
		if (controlSurface.current.lastX !== (panSpd * panDir)) {
			cameraService.moveContinuous(camera.id, instanceIdState, "pan", panDir, panSpd);
			controlSurface.current.lastX = panSpd * panDir;
			setPanSpd(panSpd * panDir);
		}
		if (controlSurface.current.lastY !== (tiltSpd * tiltDir)) {
			cameraService.moveContinuous(camera.id, instanceIdState, "tilt", tiltDir, tiltSpd);
			controlSurface.current.lastY = tiltSpd * tiltDir;
			setTiltSpd(tiltSpd * tiltDir);
		}
	};

	const stopContinuousPanTilt = () => {
		cameraService.moveContinuous(camera.id, instanceIdState, "pan", 0, 0);
		cameraService.moveContinuous(camera.id, instanceIdState, "tilt", 0, 0);
	};

	const relativeZoom = (direction, distance, speed = 1) => {
		cameraService.zoomRelative(camera.id, instanceIdState, direction, distance, speed);
	};

	const styles = {
		control_surface: {
			"position": "absolute",
			"zIndex": "1900",
			"width": "100%",
			"height": "100%"
		}
	};

	return (
		<div ref={controlSurface}
			style={styles.control_surface}
			onPointerDown={_onPointerDown}
			onPointerMove={_onPointerMove}
			onPointerUp={_onPointerUp}
			onWheel={_onMouseWheel}
			onPointerEnter={_onPointerEnter}
			onPointerLeave={_onPointerLeave}>

		</div>
	);

};

export default VideoIntegratedControls;
