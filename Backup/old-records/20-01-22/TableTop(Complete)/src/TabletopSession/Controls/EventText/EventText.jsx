import React from "react";
import PropTypes from "prop-types";
import {truncate} from "../../../shared/utility/utilities";

const propTypes = {
	eventData: PropTypes.object.isRequired,
	loadAgentProfile: PropTypes.func.isRequired,
	simTimePrecision: PropTypes.number
};

const EventText = ( { eventData, loadAgentProfile, simTimePrecision } ) => {
	const getSubjectFragment = () => {
		if (eventData.subjectType === "agent") {
			return <a style={{cursor: "pointer", color: "#4db5f4"}} onClick={() => loadAgentProfile(eventData.subjectId)}>{eventData.subjectName}</a>;
		} else {
			return eventData.subjectName;
		}
	};

	const getOpponentFragment = () => {
		if (!eventData.opponentId) {
			return null;
		}
		if (eventData.opponentType === "agent") {
			return <span>by <a style={{cursor: "pointer", color: "#4db5f4"}} onClick={() => loadAgentProfile(eventData.opponentId)}>{eventData.opponentName}</a>&nbsp;</span>;
		} else {
			return eventData.opponentName;
		}
	};

	const causePrefix = eventData.classification === "detectionComms" ? ", reported on" : "using";
	const causeText = eventData.cause ? `${causePrefix} ${eventData.cause} ` : "";
	return (
		<span style={{fontSize: 14}}>
			{getSubjectFragment()} was {eventData.verb} {getOpponentFragment()}{causeText}at {truncate(eventData.time, simTimePrecision)}
		</span>
	);
};

EventText.propTypes = propTypes;
export default EventText;