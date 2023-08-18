import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	agent: PropTypes.object.isRequired,
	mapIcon: PropTypes.bool,
	group: PropTypes.bool,
	groupSize: PropTypes.number,
	size: PropTypes.number,
	onMainMapFloor: PropTypes.bool
};

const AgentIcon = ( { agent, mapIcon, group, groupSize, size, onMainMapFloor } ) => {
	const { enabled, lastSeenTime, team, vehicle, aerielFlier, heading, detected, neutralized } = agent.entityData.properties;
	//TODO: Need to switch to teamsConfig, but that would require teamsConfig to be passed to the icon from all places
	// So need to come up with a better solution
	const fillColor = team === "BLUE" 
		? (enabled && lastSeenTime !== undefined && lastSeenTime !== null ? "#bbcee5" : "#2371e5")
		: (enabled && lastSeenTime !== undefined && lastSeenTime !== null ? "#e5bfbb" : "#b14033");
	let width, height;
	if (size) {
		width = size;
		height = size;
	} else {
		width = 50;
		height = 50;
	}
	const effectiveHeading = heading === undefined ? 0 : heading;
	return (
		<svg width={width} height={height} viewBox="0 0 60 60">
			<defs>
				<filter id="AgentWithShadow" x="0" y="0" width="60" height="60" filterUnits="userSpaceOnUse">
					<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
  					<feOffset in="blur" dx="3" dy="3" result="offsetBlur"/>
					<feMerge>
						<feMergeNode in="offsetBlur"/>
						<feMergeNode in="SourceGraphic"/>
					</feMerge>
				</filter>
			</defs>
			<g filter={`${mapIcon ? "url(#AgentWithShadow)" : ""}`}>
				{onMainMapFloor && enabled && <path d="M15,52L45,52" stroke="#fff" strokeWidth="3" />}
				{enabled && <circle cx="30" cy="30" r="20" fill={fillColor} stroke="#fff" strokeWidth="3" strokeDasharray={`${detected?"":"8 5"}`} />}
				{!enabled && <path fill={fillColor} d="M10,10L10,50L50,50L50,10Z" stroke="#fff" strokeWidth="3" />}
				{mapIcon && enabled && <path transform={`rotate(${effectiveHeading},30,30)`} d="M30,2L23,8L37,8Z" fill="#fff" stroke="#5d5d5d" strokeWidth="1" />}
				{group && groupSize && <g transform={`translate(${!mapIcon || effectiveHeading === 0 || effectiveHeading > 180 ? "42" : "4"}, 6)`}>
					<circle cx="7" cy="7" r="7" fill="#d9d9d9" stroke="#fff" strokeWidth="2" />
					<text x="4" y="11" fontSize="12" fill="#141414"><tspan>{groupSize}</tspan></text>
				</g>}
				{!aerielFlier && vehicle && <path transform="translate(18, 18)" fill="#fff" d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />}
				{!aerielFlier && !vehicle && !group && <path transform="translate(18, 18)" fill="#fff" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />}
				{!aerielFlier && !vehicle && group && <path transform="translate(18, 18)" fill="#fff" d="M16.5,12A2.5,2.5 0 0,0 19,9.5A2.5,2.5 0 0,0 16.5,7A2.5,2.5 0 0,0 14,9.5A2.5,2.5 0 0,0 16.5,12M9,11A3,3 0 0,0 12,8A3,3 0 0,0 9,5A3,3 0 0,0 6,8A3,3 0 0,0 9,11M16.5,14C14.67,14 11,14.92 11,16.75V19H22V16.75C22,14.92 18.33,14 16.5,14M9,13C6.67,13 2,14.17 2,16.5V19H9V16.75C9,15.9 9.33,14.41 11.37,13.28C10.5,13.1 9.66,13 9,13Z" />}
				{aerielFlier && <path transform="translate(18, 18)" fill="#fff" d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" />}
				{neutralized && <path d="M44,14L14,44" stroke="#fff" strokeWidth="2" />}
			</g>
		</svg>
	);
};

AgentIcon.propTypes = propTypes;
export default AgentIcon;