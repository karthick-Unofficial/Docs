import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const propTypes = {
	sessionSettings: PropTypes.object,
	playStatus: PropTypes.string.isRequired,
	newEvents: PropTypes.array
};

// Currently we only play audio for weapon shots and so we are keeping this simple. If we start adding 
// more audio for other traces, we should consider refactoring this design.
const AudioTraceGenerator = ({ sessionSettings, playStatus, newEvents }) => {
	const audioElemRef = useRef();
	useEffect(() => {
		// Check if audio is enabled. If setting is not found, default is assumed to be true.
		if (!sessionSettings || (sessionSettings.hasOwnProperty("enableAudio") && !sessionSettings.enableAudio)) {
			return;
		}

		// Skip if simulation is not playing or there are no new weapon fire events
		if (playStatus !== "playing" || !newEvents || newEvents.length === 0 || !newEvents.find(ev => ev.classification === "weaponFire")) {
			return;
		}
		if (audioElemRef) {
			audioElemRef.current.play();
		}
	}, [ newEvents ]);

	return (
		<audio ref={audioElemRef}>
			<source src="static/audio/weaponShot.mp3" />
		</audio>
	);
};

AudioTraceGenerator.propTypes = propTypes;
export default AudioTraceGenerator;