import _ from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n/I18nContainer";
import { Divider, FormControlLabel, Button, Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextField, SelectField } from "orion-components/CBComponents";
import * as utilities from "../../../shared/utility/utilities";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import T2DialogBox from "../../../shared/components/T2DialogBox";
import Checkbox from "../../../shared/components/Checkbox";
import TeamIcon from "../../../shared/components/TeamIcon";

const propTypes = {
	open: PropTypes.bool.isRequired,
	sessionId: PropTypes.string,
	dir: PropTypes.string,
	simId: PropTypes.number,
	isController: PropTypes.bool,
	currentTime: PropTypes.number,
	endTime: PropTypes.number,
	simTimePrecision: PropTypes.number,
	playbackSettings: PropTypes.object,
	playStatus: PropTypes.string,
	timelineSettings: PropTypes.object,
	classes: PropTypes.object.isRequired,
	closeSettings: PropTypes.func.isRequired,
	updatePersistedState: PropTypes.func.isRequired,
	setPlaybackSettings: PropTypes.func.isRequired,
	moveSimulation: PropTypes.func.isRequired
};

const styles = {
	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 30,
		paddingBottom: 20,
		paddingRight: 10,
		background: "#414449"
	},
	dialogActionsRTL: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 30,
		paddingBottom: 20,
		paddingLeft: 10,
		background: "#414449"
	}
};

const PlaybackSettings = ({
	open,
	sessionId,
	simId,
	isController,
	currentTime,
	endTime,
	simTimePrecision,
	playbackSettings,
	playStatus,
	timelineSettings,
	classes,
	closeSettings,
	updatePersistedState,
	setPlaybackSettings,
	moveSimulation,
	dir
}) => {
	const [moveTime, setMoveTime] = useState(utilities.truncate(currentTime, simTimePrecision));
	const [playbackSpeed, setPlaybackSpeed] = useState(Number.isInteger(playbackSettings.speed) ? (parseFloat(playbackSettings.speed) + ".0") : parseFloat(playbackSettings.speed));
	const [steppingActive, setSteppingActive] = useState(playbackSettings.steppingActive);
	const [stepSize, setStepSize] = useState(playbackSettings.stepSize);
	const [timelineEventState, settimelineEventState] = useState(timelineSettings ? timelineSettings : eventUtilities.createDefaultObject(true));
	const [timeError, setTimeError] = useState(null);
	const [stepError, setStepError] = useState(null);

	useEffect(() => {
		if (!moveTime) {
			setTimeError(null);
			return;
		}
		const fTime = parseFloat(moveTime);
		if (utilities.doubleGreaterThan(fTime, utilities.truncate(endTime, simTimePrecision))) {
			setTimeError(<Translate value="tableopSession.controls.playback.playBackSettings.errorText.valueLessThan" count={utilities.truncate(endTime, simTimePrecision)}/>);
		} else if (fTime < 0) {
			setTimeError(<Translate value="tableopSession.controls.playback.playBackSettings.errorText.greaterThan"/>);
		} else {
			setTimeError(null);
		}
	}, [moveTime]);

	useEffect(() => {
		if (!steppingActive && !stepSize) {
			if (stepError) {
				setStepError(null);
			}
			return;
		}
		if (steppingActive && !stepSize) {
			setStepError(<Translate value="tableopSession.controls.playback.playBackSettings.errorText.greaterThan"/>);
			return;
		}
		const fStep = parseFloat(stepSize);
		if (fStep <= 0) {
			setStepError(<Translate value="tableopSession.controls.playback.playBackSettings.errorText.greaterThan"/>);
		} else {
			setStepError(null);
		}
	}, [steppingActive, stepSize]);

	if (!playbackSettings || !playStatus) {
		return null;
	}

	const handleSettingsClose = () => {
		closeSettings();
	};

	const handleSave = () => {
		if (timeError || stepError) {
			return;
		}
		if (parseFloat(playbackSpeed) !== playbackSettings.speed
			|| steppingActive !== playbackSettings.steppingActive
			|| stepSize !== playbackSettings.stepSize) {
			setPlaybackSettings(sessionId, {
				speed: parseFloat(playbackSpeed),
				steppingActive,
				stepSize: parseInt(stepSize)
			});
		}

		if (moveTime != null && moveTime !== utilities.truncate(currentTime, simTimePrecision) && playStatus === "paused") {
			moveSimulation(sessionId, simId, { direction: "absolute", toTime: parseFloat(moveTime) });
		}
		if (!timelineSettings || !_.isEqual(timelineEventState, timelineSettings)) {
			updatePersistedState("tabletop-app", "timelineSettings", timelineEventState);
		}
		closeSettings();
	};

	const allEventTypesSelected = (teamSelection) => {
		if (_.values(teamSelection).includes(false)) {
			return false;
		}
		return true;
	};

	const selectAllEventTypes = (teamSelection, selected) => {
		_.keys(teamSelection).forEach(eventType => {
			teamSelection[eventType] = selected;
		});
		return teamSelection;
	};

	const renderDialogContent = () => {
		return (
			<div className="playbackSettingsContainer">
				<div className="b1-bright-gray"><Translate value="tableopSession.playBack.playBackSettings.title" /></div>
				<div className="fieldContainer">
					<TextField
						id="startTimeText"
						formControlStyles={{ margin: "18px 50px 10px 0px" }}
						label={<Translate value="tableopSession.playBack.playBackSettings.start" />}
						type="number"
						error={Boolean(timeError)}
						helperText={timeError}
						value={moveTime}
						dir={dir}
						handleChange={(e) => setMoveTime(e.target.value)}
						disabled={!isController || playStatus === "playing"}
					/>
					<SelectField
						id="playSpeedSelect"
						formControlProps={{
							style: { margin: "18px 10px 10px 0px" }
						}}
						label={<Translate value="tableopSession.playBack.playBackSettings.playBack" />}
						value={playbackSpeed}
						handleChange={(e) => setPlaybackSpeed(e.target.value)}
						dir={dir}
						items={[
							{ value: "0.5x", id: "0.5" },
							{ value: "1x", id: "1.0" },
							{ value: "2x", id: "2.0" },
							{ value: "4x", id: "4.0" },
							{ value: "8x", id: "8.0" },
							{ value: "10x", id: "10.0" }
						]}
						disabled={!isController || playStatus === "playing"}
					/>
				</div>
				<div className="stepCheckContainer">
					<Checkbox
						checked={steppingActive}
						onChange={(e) => setSteppingActive(e.target.checked)}
						name="steppingActive"
						disabled={!isController || playStatus === "playing"}
					/>
					<div className="b1-bright-gray"><Translate value="tableopSession.playBack.playBackSettings.exercise" /></div>
				</div>
				<TextField
					id="stepSizeText"
					formControlStyles={{ margin: "18px 10px 10px 0px" }}
					label={<Translate value="tableopSession.playBack.playBackSettings.setStep" />}
					type="number"
					dir={dir}
					error={Boolean(stepError)}
					helperText={stepError}
					disabled={!steppingActive || !isController || playStatus === "playing"}
					value={stepSize}
					handleChange={(e) => setStepSize(e.target.value)}
				/>
				<Divider className="divider" />
				<div className="b1-bright-gray"><Translate value="tableopSession.playBack.playBackSettings.timeline" /></div>
				<div className="fieldContainer">
					{_.keys(timelineEventState).sort().map(team => {
						return (
							<div key={team} className="teamContainer">
								<FormControlLabel key={team}
									className="control"
									control={
										<div className="teamIconContainer">
											<TeamIcon team={team} />
										</div>
									}
									label={<Translate value="tableopSession.controls.playback.playBackSettings.team" primaryValue={team.charAt(0).toUpperCase()} secondaryValue={team.substring(1).toLowerCase()}/>}
								/>
								<FormControlLabel key={`${team}-all`}
									className="control"
									dir={dir}
									control={
										<Checkbox
											checked={allEventTypesSelected(timelineEventState[team])}
											onChange={(e) => settimelineEventState({
												...timelineEventState,
												[team]: selectAllEventTypes({ ...timelineEventState[team] }, e.target.checked)
											})}
											name={`${team}-all`}
										/>
									}
									label={<Translate value="tableopSession.playBack.playBackSettings.all" />}
								/>
								{eventUtilities.getEventClassifications().map(eventClassification => {
									if (timelineEventState[team].hasOwnProperty(eventClassification.classification)) {
										return (
											<FormControlLabel key={eventClassification.classification}
												className="control"
												control={
													<Checkbox
														checked={timelineEventState[team][eventClassification.classification]}
														onChange={(e) => settimelineEventState({
															...timelineEventState,
															[team]: {
																...timelineEventState[team],
																[eventClassification.classification]: e.target.checked
															}
														})}
														name={eventClassification.classification}
													/>
												}
												label={eventClassification.description}
											/>
										);
									} else {
										return null;
									}
								})}
							</div>
						);
					})}
				</div>
				<Container className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
					<Button
						className="cancelBtn"
						onClick={handleSettingsClose}
					>
						<Translate value="tableopSession.playBack.playBackSettings.cancel" />
					</Button>
					<Button
						variant="contained"
						color="primary"
						disabled={Boolean(timeError || stepError)}
						className="saveBtn"
						onClick={handleSave}
					>
						<Translate value="tableopSession.playBack.playBackSettings.ok" />
					</Button>
				</Container>
			</div>
		);
	};

	return (
		<T2DialogBox
			open={open}
			onClose={handleSettingsClose}
			headline={<Translate value="tableopSession.playBack.playBackSettings.headline" />}
			content={renderDialogContent()}
			dir={dir}
		/>
	);
};

PlaybackSettings.propTypes = propTypes;
export default withStyles(styles)(PlaybackSettings);