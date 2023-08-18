import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// -- components
import { BaseWidget } from "../shared";
import {
	BatteryFull,
	MissionObjective,
	SlopeDownhill,
	SlopeUphill,
	Speedometer,
	WaypointGray,
	WaypointGreen
} from "./icons";
import { TargetingIcon } from "orion-components/SharedComponents";

// -- material-ui
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { BatteryCharging50, ExpandMore } from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const MCWAccordionSummary = withStyles({
	root: {
		marginBottom: -1,
		minHeight: 56,
		"&$expanded": {
			minHeight: 56
		}
	},
	content: {
		"&$expanded": {
			margin: "12px 0"
		}
	},
	expanded: {}
})(AccordionSummary);

const MCWAccordionDetails = withStyles({
	root: {
		padding: 0
	}
})(AccordionDetails);

const MCWListItem = withStyles({
	root: {
		padding: 0
	}
})(ListItem);

const STATE_STRINGS = {
	"charging": getTranslation("global.profiles.widgets.missionControl.charging"),
	"stationary": getTranslation("global.profiles.widgets.missionControl.stationary"),
	"standby": getTranslation("global.profiles.widgets.missionControl.standby"),
	"in-motion": getTranslation("global.profiles.widgets.missionControl.inMotion"),
	"on-mission": getTranslation("global.profiles.widgets.missionControl.onMission"),
	"stopped": getTranslation("global.profiles.widgets.missionControl.stopped")
};
const STATE_COLORS = {
	"charging": "#262729",
	"stationary": "#5F6571",
	"standby": "#5F6571",
	"in-motion": "#5C9CD3",
	"on-mission": "#67BE6F",
	"stopped": "#D3615C"
};

// -- TEMP
const ENTITY_STATES = [
	"charging",
	"stationary",
	"in-motion",
	"on-mission",
	"stopped"
];

// ***** TODO: setup propTypes correctly
const propTypes = {
	order: PropTypes.number,
	enabled: PropTypes.bool,
	details: PropTypes.object.isRequired
};

const MissionControlWidget = ({
	order,
	enabled,
	details,
	dir
}) => {

	useEffect(() => {
		// ***** TODO: anything we want to hook into on loading?
	}, []);

	const panelButtonClicked = (command) => {
		// ***** TODO: send STOP/RESUME command
		console.log(`Sending command: ${command}`);
	};

	const getStatusPanel = useCallback(() => {
		const { speed, grade, battery, batteryStatus, assignedMission } = details;

		const state = assignedMission && Object.keys(assignedMission).length > 0 ? "on-mission" :
			batteryStatus === "charging" ? "charging" : "standby";
			// speed > 0 ? "in-motion" : "stationary";

		const stateString = STATE_STRINGS[state];
		const panelBackground = STATE_COLORS[state];

		// ***** TODO: need to figure out if a downhill grade with come through as negative or if we need to subtract 360
		let slopeIcon = grade >= 0 ? <SlopeUphill className={"detail-icon"} /> : <SlopeDownhill className={"detail-icon"} />;
		const panelDetails = state !== "charging" ? (
			<div className="details-container">
				{grade &&
					<div className="detail">
						{slopeIcon}
						<p style={{ marginBottom: "-3px" }}>{Math.abs(grade).toFixed(2)}°</p>
					</div>
				}
				<div className="detail">
					<Speedometer className={"detail-icon"} />
					<p className={"detail-content"} style={{ marginBottom: "-3px" }}>{speed.toFixed(1)}</p>
					<p className={"detail-content attribute"} style={{ marginBottom: "-1px" }}><Translate value="global.profiles.widgets.missionControl.ftPerSec"/></p>
				</div>
				<div className="detail">
					<BatteryFull className={"detail-icon battery"} />
					<p style={{ marginBottom: "-3px" }}>{battery}%</p>
				</div>
			</div>
		) : null;

		let panelButton = null;
		// -- Commenting out for now since we currently cant send robot commands through AAS - CD
		// if (state === "in-motion" || state === "on-mission") {
		// 	panelButton = (
		// 		<div className="status-panel-button" style={{ background: "#D58F8C" }} onClick={() => panelButtonClicked("stop")}>
		// 			<p>{"STOP"}</p>
		// 		</div>
		// 	);
		// }
		// else if (state === "stopped") {
		// 	panelButton = (
		// 		<div className="status-panel-button" style={{ background: "#41454B" }} onClick={() => panelButtonClicked("resume")}>
		// 			<p>{"RESUME"}</p>
		// 		</div>
		// 	);
		// }
		return (
			<div style={{display: "flex", marginTop: "22px"}}>
				<div className="status-panel-container" style={{ background: panelBackground }}>
					<div className="status-panel-header">
						{state === "charging" && <BatteryCharging50 />}
						<p>{stateString}</p>
					</div>
					{panelDetails}
				</div>
				{panelButton}
			</div>
		);
	}, [details.speed, details.grade, details.battery, details.batteryStatus, details.assignedMission]);

	const getMissionData = useCallback(() => {
		const { assignedMission } = details;
		return assignedMission ? (
			<div style={{paddingTop: "10px"}}>
				<Accordion style={{ backgroundColor: "#34383C" }}>
					<MCWAccordionSummary expandIcon={<ExpandMore />} style={{width: "100%", padding: "0 10px", color: "#FFFFFF"}} >
						<div style={{display: "flex", alignItems: "center"}}>
							<MissionObjective style={{marginRight: "12px"}}/>
							<Typography style={{height: "fit-content"}}>{assignedMission.name}</Typography>
						</div>
					</MCWAccordionSummary>
					<MCWAccordionDetails>
						<List>
							{assignedMission.waypoints.map((waypoint, index) => {
								const waypointIcon = waypoint.reached ? <WaypointGreen /> : <WaypointGray />;
								const nextWaypoint = assignedMission.waypoints[index+1];
								const nextWaypointReached = nextWaypoint ? nextWaypoint.reached : false;
								const connectingLine = nextWaypoint ? (nextWaypointReached ? "solid" : "dashed") : null;
								return (
									<MCWListItem key={index}>
										<TargetingIcon geometry={waypoint.geometry} />
										<ListItemIcon>
											<div className={"waypoint-icon"}>
												{waypointIcon}
												{connectingLine && <div className={`vl ${connectingLine}`} />}
											</div>
										</ListItemIcon>
										<ListItemText
											style={dir == "rtl" ? {textAlign: "right", padding: 0} : {padding: 0}}
											primary={index === 0 ? getTranslation("global.profiles.widgets.missionControl.waypointStatic") : getTranslation("global.profiles.widgets.missionControl.waypointDynamic", index+1)}
										/>
									</MCWListItem>
								);
							})}
						</List>
					</MCWAccordionDetails>
				</Accordion>
			</div>
		) : null;
	}, [details.assignedMission.name, details.assignedMission.waypoints]);

	return (
		<BaseWidget enabled={enabled} order={order} title={getTranslation("global.profiles.widgets.missionControl.missionControl")} dir={dir}>
			{/* STATUS PANEL */}
			{getStatusPanel()}
			{/* MISSION DATA */}
			{getMissionData()}
		</BaseWidget>
	);
};

MissionControlWidget.propTypes = propTypes;
export default MissionControlWidget;
