import React, { useEffect } from "react";

const NewWindowWrapper = ({ children, styles }) => {
	const sendMessage = (message) => {
		// Append the window.name (The ID you spawn the window with when using "orion-components/NewWindow")
		// to ensure we only accept messages from the window we expect to receive them from
		const messageData = {
			id: window.name,
			payload: message
		};

		// eslint-disable-next-line no-restricted-globals
		opener.postMessage(messageData, opener.origin);
	};

	// After mount
	useEffect(() => {
		// Send a message to remove the event handler on refresh/close
		window.onbeforeunload = () => {
			sendMessage("exit");
		};
	}, []);

	// Add a message handler from the child component
	const addMessageHandler = (callback) => {
		const handleMessage = (event) => {
			if (
				event.origin !== window.location.origin ||
				!event.data.id ||
				event.data.id !== window.name
			) {
				return;
			}

			callback(event.data);
		};

		window.addEventListener("message", handleMessage, false);
	};

	return (
		<div style={styles}>
			{React.cloneElement(children, { addMessageHandler, sendMessage })}
		</div>
	);
};

export default NewWindowWrapper;
