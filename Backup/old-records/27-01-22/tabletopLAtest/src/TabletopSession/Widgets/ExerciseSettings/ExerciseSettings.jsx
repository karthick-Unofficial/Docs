import _ from "lodash";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { SelectField } from "orion-components/CBComponents";
import Slider from "./Slider";
import Switch from "../../../shared/components/Switch";

const propTypes = {
	user: PropTypes.object.isRequired,
	sessionId: PropTypes.string,
	exerciseSettings: PropTypes.object,
	sessionSettings: PropTypes.object,
	teamsConfig: PropTypes.object,
	facilitator: PropTypes.string,
	controller: PropTypes.string,
	simulationMode: PropTypes.string,
	modificationsActive: PropTypes.bool,
	users: PropTypes.object.isRequired,
	userMappings: PropTypes.array,
	updatePersistedState: PropTypes.func.isRequired,
	setController: PropTypes.func.isRequired,
	setSimulationMode: PropTypes.func.isRequired,
	setSessionSetting: PropTypes.func.isRequired
};

const ExerciseSettings = ({
	user,
	sessionId,
	exerciseSettings,
	sessionSettings,
	teamsConfig,
	facilitator,
	controller,
	simulationMode,
	modificationsActive,
	users,
	userMappings,
	updatePersistedState,
	setController,
	setSimulationMode,
	setSessionSetting
}) => {
	const [traceDuration, setTraceDuration] = useState(exerciseSettings.mapDisplay.traceDuration);
	const [agentMarkerSizes, setAgentMarkerSizes] = useState(exerciseSettings.mapDisplay.markerSizes.agents);
	const [otherMarkerSize, setOtherMarkerSize] = useState(exerciseSettings.mapDisplay.markerSizes.others);
	const [traceMarkerSize, setTraceMarkerSize] = useState(exerciseSettings.mapDisplay.markerSizes.trace);


	const initializeUsers = () => {
		const userList = [];
		if (users.hasOwnProperty(facilitator)) {
			userList.push({
				id: facilitator,
				value: facilitator,
				name: users[facilitator].name
			});
		}
		if (userMappings) {
			userMappings.forEach(mapping => {
				if (users.hasOwnProperty(mapping.userId)) {
					userList.push({
						id: mapping.userId,
						value: mapping.userId,
						name: users[mapping.userId].name
					});
				}
			});
		}

		return _.orderBy(userList, "name", "asc");
	};

	const [sessionUsers] = useState(initializeUsers());

	const setEnableAudio = (enable) => {
		setSessionSetting(sessionId, "enableAudio", enable);
	};

	const updateTraceDuration = () => {
		const newSettings = {
			...exerciseSettings,
			mapDisplay: {
				...exerciseSettings.mapDisplay,
				traceDuration
			}
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};


	const setAgentMarkerSize = (team, value) => {
		const newSizes = {
			...agentMarkerSizes,
			[team]: value
		};
		setAgentMarkerSizes(newSizes);
	};

	const updateAgentMarkerSizes = () => {
		const newSettings = {
			...exerciseSettings,
			mapDisplay: {
				...exerciseSettings.mapDisplay,
				markerSizes: {
					...exerciseSettings.mapDisplay.markerSizes,
					agents: agentMarkerSizes
				}
			}
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};

	const updateTimerDuration = (value) => {
		const newSettings = {
			...exerciseSettings,
			modifyTimerDuration: parseInt(value)
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};

	const updateSimTimePrecision = (value) => {
		const newSettings = {
			...exerciseSettings,
			simTimePrecision: parseInt(value)
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};

	const updateOtherMarkerSize = () => {
		const newSettings = {
			...exerciseSettings,
			mapDisplay: {
				...exerciseSettings.mapDisplay,
				markerSizes: {
					...exerciseSettings.mapDisplay.markerSizes,
					others: otherMarkerSize
				}
			}
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};

	const updateTraceMarkerSize = () => {
		const newSettings = {
			...exerciseSettings,
			mapDisplay: {
				...exerciseSettings.mapDisplay,
				markerSizes: {
					...exerciseSettings.mapDisplay.markerSizes,
					trace: traceMarkerSize
				}
			}
		};
		updatePersistedState("tabletop-app", "exerciseSettings", newSettings);
	};

	return (
		<div className="exerciseSettingsContainer">
			<div className="row">
				<SelectField
					id="simulationModeSelect"
					formControlProps={{
						style: { marginRight: 51 }
					}}
					label="Simulation Mode"
					value={simulationMode}
					handleChange={(e) => setSimulationMode(sessionId, e.target.value)}
					items={[
						{ value: "simulation", id: "simulation", name: "Simulation" },
						{ value: "playback", id: "playback", name: "Playback" }
					]}
					disabled={user.id !== controller || modificationsActive}
				/>
				<SelectField
					id="controllerSelect"
					formControlProps={{
						style: { marginLeft: 51 }
					}}
					label="Controller"
					value={controller}
					handleChange={(e) => setController(sessionId, e.target.value)}
					items={sessionUsers}
					disabled={(user.id !== facilitator && user.id !== controller) || modificationsActive}
				/>
			</div>
			<div className="row">
				{(user.id === controller) &&
					<div className="" style={{ width: "100%", marginRight: 51 }}>
						<SelectField
							id="timerIntervalSelect"
							label="Modify Simulation Duration Interval"
							value={exerciseSettings.modifyTimerDuration ? exerciseSettings.modifyTimerDuration : " "}
							handleChange={(e) => updateTimerDuration(e.target.value)}
							items={[
								{ value: "2 Min", id: "120" },
								{ value: "5 Min", id: "300" },
								{ value: "10 Min", id: "600" },
								{ value: "15 Min", id: "900" }
							]}
						/>
					</div>
				}
				<div  className={user.id === controller ? "leftSpacing": "noSpacing"} >
					<SelectField
						id="timePrecision"
						label="Sim Time Precision (decimal places)"
						value={exerciseSettings.hasOwnProperty("simTimePrecision") ? exerciseSettings.simTimePrecision : " "}
						handleChange={(e) => updateSimTimePrecision(e.target.value)}
						items={[
							{ value: "0", id: "0" },
							{ value: "1", id: "1" },
							{ value: "2", id: "2" },
							{ value: "4", id: "4" }
						]}
					/>
				</div>
			</div>
			{(user.id === controller) &&
				<div className="row" style={{marginLeft: -10, marginTop: 15}}>
					<Switch 
						name="enableAudio" 
						onChange={(e) => setEnableAudio(e.target.checked)} 
						checked={sessionSettings && sessionSettings.hasOwnProperty("enableAudio") ? sessionSettings.enableAudio : true} 
					/>
					<Typography variant="body1" className="b1-white">Enable Weapon Fire Audio</Typography>
				</div>
			}
			<div style={{ marginTop: 72 }}>
				<div className="b1-white">Map Display Settings</div>
				<div className="b2-bright-gray" style={{ marginTop: 34 }}>Set Trace Display Duration (in seconds)</div>
				<Slider
					value={traceDuration}
					min={0}
					max={120}
					step={1}
					onChange={(e, value) => setTraceDuration(value)}
					onChangeCommitted={updateTraceDuration}
					marks={[
						{
							value: 0,
							label: "0"
						},
						{
							value: 120,
							label: "120"
						}
					]}
				/>
			</div>
			<div className="b1-white" style={{ marginTop: 66 }}>Map Symbol Size</div>
			{_.keys(teamsConfig).map(team => {
				return (
					<div key={`${team}-size`} className="symbolSizer">
						<div className="b2-bright-gray">
							{`${team.charAt(0).toUpperCase()}${team.substring(1).toLowerCase()} Team`}
						</div>
						<Slider
							value={agentMarkerSizes[team]}
							min={0}
							max={2}
							step={0.1}
							onChange={(e, value) => setAgentMarkerSize(team, value)}
							onChangeCommitted={updateAgentMarkerSizes}
						/>
					</div>
				);
			})}
			<div className="symbolSizer">
				<div className="b2-bright-gray">
					Map Markers (Facilities, Points, Objectives)
				</div>
				<Slider
					value={otherMarkerSize}
					min={0}
					max={2}
					step={0.1}
					onChange={(e, value) => setOtherMarkerSize(value)}
					onChangeCommitted={updateOtherMarkerSize}
				/>
			</div>
			<div className="symbolSizer">
				<div className="b2-bright-gray">Events</div>
				<Slider
					value={traceMarkerSize}
					min={0}
					max={2}
					step={0.1}
					onChange={(e, value) => setTraceMarkerSize(value)}
					onChangeCommitted={updateTraceMarkerSize}
				/>
			</div>
		</div>
	);
};

ExerciseSettings.propTypes = propTypes;
export default ExerciseSettings;