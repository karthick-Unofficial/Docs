import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";
import { SkipPrevious, SkipNext, CloseCircle } from "mdi-material-ui";
import SettingsButton from "../../../shared/components/SettingsButton";
import PlaybackSettingsContainer from "./PlaybackSettingsContainer";
import TimelineContainer from "./Timeline/TimelineContainer";
import * as utilities from "../../../shared/utility/utilities";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	user: PropTypes.object.isRequired,
	mapLayerSettings: PropTypes.object,
	sessionId: PropTypes.string,
	controller: PropTypes.string,
	playbackSettings: PropTypes.object,
	currentSimulation: PropTypes.object,
	simulations: PropTypes.object,
	modificationsActive: PropTypes.bool,
	updatePersistedState: PropTypes.func.isRequired,
	playSimulation: PropTypes.func.isRequired,
	pauseSimulation: PropTypes.func.isRequired,
	moveSimulation: PropTypes.func.isRequired,
	reportPlaybackHeight: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const Playback = ({
	user, 
	mapLayerSettings, 
	sessionId, 
	controller, 
	playbackSettings, 
	currentSimulation, 
	simulations, 
	modificationsActive,
	updatePersistedState,
	playSimulation, 
	pauseSimulation, 
	moveSimulation,
	reportPlaybackHeight,
	dir 
}) => {
	const [ openSettings, setOpenSettings ] = useState(false);

	if (!currentSimulation || currentSimulation.loadStatus === "loading" || !currentSimulation.playStatus || !mapLayerSettings.displayTimeline
		|| !simulations || !simulations.hasOwnProperty(currentSimulation.simId)) {
		return null;
	}

	const playStatus = currentSimulation.playStatus.status;
	const isController = controller === user.id;
	const simId = currentSimulation.simId;
	const simulation = simulations[simId];

	let playStatusToDisplay;
	if (!isController) {
		playStatusToDisplay = playStatus === "playing" ? <Translate value="tableopSession.controls.playback.simPlaying"/>
			: (utilities.doubleEquals(currentSimulation.playStatus.simTime, simulation.endTime) ? <Translate value="tableopSession.controls.playback.simEnded"/> : <Translate value="tableopSession.controls.playback.simPaused"/>);
	}

	const moveSim = ( direction, type ) => {
		if (playStatus === "paused") {
			moveSimulation(sessionId, simId, { direction, type });
		}
	};

	const closeSettings = () => {
		setOpenSettings(false);
	};
	
	const renderPlaybackControls = () => {
		if (modificationsActive) {
			return null;
		}
		return (
			<Fragment>
				<Tooltip title={<Translate value="tableopSession.controls.playback.stepBack"/>}>
					<SkipPrevious 
						className="stepButton" 
						style={{visibility: `${playbackSettings.steppingActive && playStatus === "paused" ? "visible" : "hidden"}`}} 
						onClick={() => moveSim("back", "step")} 
					/>
				</Tooltip>
				{playStatus === "paused" && // Display Play button
					<Tooltip title={<Translate value="tableopSession.controls.playback.play"/>}>
						<svg 
							className="playPauseButton" 
							width={26} 
							height={26} 
							viewBox="0 0 35 35" 
							onClick={() => playSimulation(sessionId, simId, currentSimulation.playStatus.simTime)}
						>
							<circle cx="17.5" cy="17.5" r="17.5" fill="#4DB5F4" />
							<path d="M13,11L13,25L24,18Z" fill="#fff" />
						</svg>
					</Tooltip>
				}
				{playStatus === "playing" && // Display Pause button
					<Tooltip title={<Translate value="tableopSession.controls.playback.pause"/>}>
						<svg 
							className="playPauseButton" 
							width={26} 
							height={26} 
							viewBox="0 0 35 35" 
							onClick={() => pauseSimulation(sessionId, simId)}
						>
							<circle cx="17.5" cy="17.5" r="17.5" fill="#4DB5F4" />
							<path d="M12,11L12,25L16,25L16,11Z" fill="#fff" />
							<path d="M20,11L20,25L24,25L24,11Z" fill="#fff" />
						</svg>
					</Tooltip>
				}
				<Tooltip title={<Translate value="tableopSession.controls.playback.stepAhead"/>}>
					<SkipNext 
						className="stepButton" 
						style={{visibility: `${playbackSettings.steppingActive && playStatus === "paused" ? "visible" : "hidden"}`}} 
						onClick={() => moveSim("forward", "step")} 
					/>
				</Tooltip>
			</Fragment>
		);
	};

	return (
		<div className="playbackPanel">
			<div className="playbackControlsPanel" style={dir == "rtl" ? {direction: "ltr"} : {}}>
				<Tooltip title={<Translate value="tableopSession.controls.playback.timelineSettings"/>}>
					<span style={{marginTop: 3}}>
						<SettingsButton width={18} height={18} clickHandler={()=>setOpenSettings(true)} />
					</span>
				</Tooltip>
				{isController &&
					renderPlaybackControls()
				}
				{!isController &&
					<div className="playStatusText">{playStatusToDisplay}</div>
				}
			</div>
			<div className="playbackControlClose">
				<Tooltip title={<Translate value="tableopSession.controls.playback.closeTimeline"/>}>
					<CloseCircle className="closeBtn" onClick={() => updatePersistedState("tabletop-app", "mapLayerSettings", 
						{...mapLayerSettings, displayTimeline: false})} />
				</Tooltip>
			</div>
			{simulation && simulation.endTime && 
				<TimelineContainer 
					sessionId={sessionId} 
					isController={isController}
					currentSimulation={currentSimulation} 
					endTime={simulation.endTime} 
					playStatus={playStatus}
					reportTimelineHeight={reportPlaybackHeight} 
				/>
			}
			{openSettings && 
				<PlaybackSettingsContainer
					open={openSettings}
					sessionId={sessionId}
					simId={simId}
					isController={isController}
					currentTime={currentSimulation.playStatus.simTime}
					endTime={simulation ? simulation.endTime : null}
					playStatus={playStatus}
					closeSettings={closeSettings}
				/>
			}
		</div>
	);
};

Playback.propTypes = propTypes;
export default Playback;