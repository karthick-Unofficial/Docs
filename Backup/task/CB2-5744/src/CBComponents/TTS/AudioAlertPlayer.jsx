import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { alertSelector, alertStateSelector } from "../../GlobalData/Selectors";

const synth = window.speechSynthesis;

const propTypes = {
	activeAlerts: PropTypes.object,
	tts: PropTypes.object,
	isInitialBatch: PropTypes.bool
};

const defaultProps = {
	activeAlerts: {},
	tts: {
		enabled: false
	},
	isInitialBatch: true
};

const AudioAlertPlayer = () => {
	const activeAlerts = useSelector((state) => alertSelector(state));
	const isInitialBatch = useSelector((state) => alertStateSelector(state));
	const globalState = useSelector((state) => state.appState.global);
	const tts = globalState.tts;

	const [voice, setVoice] = useState(null);
	const [initialLoaded, setInitialLoaded] = useState(false);
	const [playedIds, setPlayedIds] = useState([]);

	useEffect(() => {
		const voices = synth.getVoices();
		const voice = voices.filter((item) => item.lang === "en-US");
		setVoice(voice[0]);
	}, []);

	useEffect(() => {
		const alertsArr = Object.values(activeAlerts);
		playAlerts(alertsArr, tts.enabled);
	}, [activeAlerts]);

	// Add alert to array of played ids
	const setAlertPlayed = (id) => {
		setPlayedIds([...playedIds, id]);
	};

	// Render fragment components for each alert that needs to be played
	const playAlerts = (alerts, enabled) => {
		if (alerts.length) {
			// Set initial alerts as played
			if (!initialLoaded && isInitialBatch) {
				const ids = alerts.map((item) => item.id);

				setInitialLoaded(true);
				setPlayedIds(ids);
			} else {
				// Alerts that have not been marked as played
				const filteredAlerts = alerts.filter(
					(item) => !playedIds.includes(item.id)
				);

				// If audio alerts are not enabled, mark all incoming alerts as played
				if (!enabled) {
					filteredAlerts.forEach((item) => {
						setAlertPlayed(item.id);
					});
				}
				// Otherwise, if alerts are to be played, play them
				else if (filteredAlerts.length) {
					return playVoice(filteredAlerts);
				}
			}
		}

		return null;
	};

	const playVoice = (filteredAlerts) => {
		const alertText = filteredAlerts.map((alert) => {
			let alertStr = "";
			if (alert.audioSettings) {
				if (alert.audioSettings.speakAlertText)
					alertStr += alert.audioSettings.alertText
						? alert.audioSettings.alertText
						: "Alert, Alert";
				if (alert.audioSettings.speakAlertNotification)
					alertStr += " " + alert.summary;
			} else {
				alertStr = "Alert, Alert " + alert.summary;
			}
			return {
				text: alertStr,
				id: alert.id
			};
		});

		if (alertText.length) {
			const data = alertText.map((alert) => {
				const audio = new SpeechSynthesisUtterance(alert.text);
				audio.voice = voice;

				// End handler
				audio.onend = () => {
					setAlertPlayed(alert.id);
				};

				synth.speak(audio);
			});

			return data;
		}
	};

	return <Fragment />;
};

AudioAlertPlayer.propTypes = propTypes;
AudioAlertPlayer.defaultProps = defaultProps;

export default AudioAlertPlayer;
