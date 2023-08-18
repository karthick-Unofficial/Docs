import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { cameraService } from "client-app-core";

import CameraGrid from "./spotlightComponents/CameraGrid";
import Translate from "orion-components/i18n/Translate";

const propTypes = {
	addMessageHandler: PropTypes.func.isRequired,
	sendMessage: PropTypes.func.isRequired
};

const defaultProps = {
	addMessageHandler: () => {},
	sendMessage: () => {}
};

const Spotlight = ({ addMessageHandler, sendMessage }) => {
	const [cameras, setCameras] = useState([]);
	const [prevCams, setPrevCams] = useState([]);
	const [user, setUser] = useState({});

	const messageHandler = (message) => {
		const { payload } = message;

		if (payload.cameras) {
			setCameras(payload.cameras);
		}
	};

	// Set window title
	window.document.title = window.cbProps
		? window.cbProps.windowTitle
		: "New Window";

	// After mount
	useLayoutEffect(() => {
		// Add an event handler to NewWindow wrapper component
		// so we can easily access messages here as they're received
		addMessageHandler(messageHandler);

		// Send exit message to parent window to remove the message event listener
		// from the parent component to ensure duplicate messages aren't sent
		// if this window is re-opened
		window.onbeforeunload = () => {
			sendMessage("exit");
		};

		// Set initial cameras and user
		if (window.cbProps) {
			if (window.cbProps.initialCameras) {
				setCameras(window.cbProps.initialCameras);
			}
			if (window.cbProps.user) {
				setUser(window.cbProps.user);
			}
		}
	}, []);

	useLayoutEffect(() => {
		const pc = prevCams.map((cam) => cam.id);
		cameras.forEach((cam) => {
			if (pc.indexOf(cam.id) < 0) {
				cameraService.moveHome(cam.id, (err, response) => {
					if (err) {
						console.log(
							`Error sending camera with ID (${cam.id}) home.`,
							err,
							response
						);
					} else {
						console.log(
							`Successfully sent camera with ID (${cam.id}) home.`
						);
					}
				});
			}
		});

		setPrevCams(cameras);
	}, [cameras]);

	return (
		<div style={{ backgroundColor: "#2c2d2f", height: "100vh" }}>
			<div
				style={{
					display: "flex",
					backgroundColor: window.cbProps.spotlightColor || "#2C2D2F"
				}}
			>
				<h1
					style={{
						color: window.cbProps.spotlightTitleColor || "white",
						fontSize: "20px",
						fontWeight: "400",
						padding: "10px",
						marginLeft: "10px",
						fontFamily: "roboto"
					}}
				>
					<Translate value="spotLight.spotLightWindow.spotlight" />
				</h1>
			</div>
			<CameraGrid
				user={user}
				cameras={cameras}
				sendMessage={sendMessage}
			/>
		</div>
	);
};

Spotlight.propTypes = propTypes;
Spotlight.defaultProps = defaultProps;

export default Spotlight;
