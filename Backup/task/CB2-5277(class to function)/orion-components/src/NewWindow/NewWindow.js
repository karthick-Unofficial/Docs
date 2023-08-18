import React, { useRef } from "react";

const NewWindow = (config) => {
	/**
	 * @param {object} config {
	 * 		@param {string} url - The url of the page you'd like to open in the new window
	 * 		@param {string} id - Unique ID for your window
	 * 		@param {object} data - Any data you'd like the new window to have access to via window.cbProps
	 * 		@param {string} properties - Special string used by the new window for styling and other properties
	 * }
	 */

	const { url, id, data, properties } = config;

	// Create and store reference to window
	const windowRef = useRef(window.open(url, id, properties));
	var configId = id;
	var sendMessages = true;
	// Set data for use by window
	windowRef.cbProps = data;

	/**
	 * Send a message to a spawned window
	 * @param {any} data - Data to send to spawned window
	 * @param {string} uri - URI you are sending the message to
	 */
	const sendMessage = (data, uri) => {

		// We always append the id of the opened window to the sent data
		// to ensure we only accept the data we're expecting
		const messageData = {
			id: configId,
			payload: data
		};

		windowRef.postMessage(messageData, uri);
	};

	/**
	 * Listen for messages from a specific window
	 * @param {object} sourceWindow - window object from source page
	 * @param {string} origin - URI you expect messages to come from
	 * @param {function} callback 
	 */
	const listen = (sourceWindow, origin, callback) => {

		// Message event handler
		const handleMessage = (event) => {

			// Do not accept messages from unwanted sites
			if (
				event.origin !== origin
				|| !event.data.id
				|| event.data.id !== configId
			) {
				return;
			}

			// When the child window sends across an 'exit' message
			// This should happen in the onbeforeunload event in the child window
			// which covers both refreshes and exits
			if (event.data.payload === "exit") {

				// Remove the event listener from the parent window
				sourceWindow.removeEventListener("message", handleMessage, false);

				// Kill the child window
				windowRef.close();
			}

			if (sendMessages) {
				callback(null, event.data);
			}
		};

		// Listen for messages from parent window
		sourceWindow.addEventListener("message", handleMessage, false);

		// When parent window closes or refreshes, kill the child window
		sourceWindow.addEventListener("beforeunload", () => {
			sendMessages = false;
			windowRef.close();
		});
	}

	/**
	 * Close the spawned window
	 */
	const close = () => {
		windowRef.close();
	}
}

export default NewWindow;
