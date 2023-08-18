import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {Popper, ClickAwayListener, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DotsHorizontal } from "mdi-material-ui";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	userInfo: PropTypes.object,
	controller: PropTypes.string,
	modificationsActive: PropTypes.bool,
	pencilsDown: PropTypes.bool,
	modificationsData: PropTypes.object,
	sessionId: PropTypes.string,
	setModificationsData: PropTypes.func.isRequired,
	modifyTimerDuration: PropTypes.number,
	userMappings: PropTypes.array
};


const ModificationTimer = ({
	modificationsData,
	modificationsActive,
	sessionId,
	setModificationsData,
	controller,
	userInfo,
	modifyTimerDuration,
	userMappings
}) => {
	const [displayTime, setDisplayTime] = useState({
		minutes: 0,
		seconds: 0
	});
	const id = useRef(null);
	const timeDurationRef = useRef(null);
	const clear = () => {
		if (id.current) {
			window.clearInterval(id.current);
			id.current = 0;
		}
	};

	const popperStyles = makeStyles({
		paper: {
			background: "#292b30"
		}
	});
	const setCountdownDate = () => {
		setNewTime();
	};

	const [anchorEl, setAnchorEl] = React.useState(null);

	useEffect(() => {
		return () => cleanUpModificationsData();
	}, []);

	const cleanUpModificationsData = () => {
		if (userInfo.userId === controller) {
			setModificationsData(sessionId, null);
		}
		clear();
	};

	const handleToggle = (event) => {
		//console.log(event);
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClose =() => {
		setAnchorEl(null);
	};
	
	const showHideTimer = () => {
		const x = document.getElementsByClassName("showTimeBox")[0];
		const y = document.getElementsByClassName("addMinutesInTimer")[0];
		if (x) {
			if (x.style.display === "none") {
				x.style.display = "inline-block";
			} else {
				x.style.display = "none";
			}
		}
		if(userInfo.userId !== controller){
			if (y) {
				if (y.style.display === "none") {
					y.style.display = "inline-block";
				} else {
					y.style.display = "none";
				}
			}
		}
	};

	const initModificationsData = () => {
		const currentTime = new Date();
		const newModificationsData = {
			timerStartTime: currentTime.toISOString(),
			timerDuration: parseInt(modifyTimerDuration),
			pencilsDown: false
		};
		// Call action to save this newModicationsData
		setModificationsData(sessionId, newModificationsData);
	};

	useEffect(() => {
		if (modificationsActive && !modificationsData && userInfo.userId === controller && userMappings ) {
			initModificationsData();
		}
		if (!modificationsActive && modificationsData && userInfo.userId === controller) {
			setModificationsData(sessionId, null);
			clear();
		}
	}, [modificationsActive]);

	const addTime = (addSeconds) => {
		let startTime;
		if (timeDurationRef.current <= 0) {
			startTime = (new Date()).toISOString();
			timeDurationRef.current = addSeconds;
		} else {
			startTime = modificationsData.timerStartTime;
			timeDurationRef.current = addSeconds + modificationsData.timerDuration;
		}
		handleClose();
		const newModificationsData = { ...modificationsData, timerStartTime: startTime, timerDuration: timeDurationRef.current };
		setModificationsData(sessionId, newModificationsData);
	};

	const popperClasses = popperStyles();

	const endModifications = () => {
		const newModificationsData = { ...modificationsData, pencilsDown: true };
		setModificationsData(sessionId, newModificationsData);
		showHideTimer();
		clear();
		handleClose();
	};
	
	const restartModifications = () => {
		initModificationsData();
		showHideTimer();
	};

	useEffect(() => {
		if (modificationsData) {
			const startTime = modificationsData.timerStartTime;
			let dt = new Date(startTime);
			const currentTime = new Date();
			let timediff = currentTime.getTime() - dt.getTime();
			timediff = Math.floor(timediff / 1000);
			dt = dt.getMinutes();
			timeDurationRef.current = modificationsData.timerDuration;
			if (timediff > 0) {
				timeDurationRef.current = timeDurationRef.current - timediff;
			}
		}
	}, [modificationsData]);

	useEffect(() => {
		if (modificationsData) {
			id.current = window.setInterval(() => {
				setCountdownDate();
			}, 1000);
			return () => clear();
		}
	}, [modificationsData]);

	if (!modificationsData || !userMappings || userMappings.length === 0) {
		return null;
	}

	const setNewTime = () => {
		if (timeDurationRef.current >= 0) {
			const minutes = Math.floor((timeDurationRef.current / 60));
			let seconds = Math.floor((timeDurationRef.current % 60));
			setDisplayTime({ minutes: minutes, seconds: seconds });
		}
		timeDurationRef.current = timeDurationRef.current - 1;
		if (timeDurationRef.current === 0) {
			setDisplayTime({ minutes: 0, seconds: 0 });
			if(userInfo.userId === controller){
				const newModificationsData = { ...modificationsData, pencilsDown: true };
				setModificationsData(sessionId, newModificationsData);
			}
		}
		if (timeDurationRef.current <= 0) {
			clear();
		}
	};

	return (
		<div>
			{modificationsActive && modificationsData.pencilsDown === false &&
				< div style={{ float: "left" }}>
					<section className="showTimeBox">
						<p className="showTimeBoxLabel"><Translate value="tableopSession.controls.simulationTree.modificationTimer.modActive"/></p>
						<p className={displayTime.seconds >= 0 && displayTime.minutes >= 1 ? "showTimeBoxValue" : "showTimeBoxValue redFont"}>{displayTime.minutes}:{displayTime.seconds.toString().padStart(2, "0")} <Translate value="tableopSession.controls.simulationTree.modificationTimer.min"/></p>
					</section>
					<div className="timeAddBox">
						{userInfo.userId === controller &&
							<div className="addMinutesInTimer">
								<DotsHorizontal className="closeBtn" onClick={(event) => handleToggle(event)} ></DotsHorizontal>
								<Popper 
									disablePortal open={Boolean(anchorEl)} 
									anchorEl={anchorEl} 
									classes={{paper: popperClasses.paper}} 
									style={{zIndex: 99}} 
									modifiers={{
										flip: {
											enabled: false
										},
										offset: {
											enabled: true,
											offset: "0,-15"
										}
									}}>
									<ClickAwayListener onClickAway={handleClose}>
										<div className="addModifierTimes" id="addModifierTimes" >
											<div className="selectBox">
												<ul>
													<li onClick={() => addTime(120)}><Translate value="tableopSession.simulation.modification.add2" /></li>
													<li onClick={() => addTime(300)}><Translate value="tableopSession.simulation.modification.add5" /></li>
													<li onClick={() => addTime(600)}><Translate value="tableopSession.simulation.modification.add10" /></li>
													<li onClick={() => addTime(900)}><Translate value="tableopSession.simulation.modification.add15" /></li>
												</ul>
											</div>
											<div className="endModificationsButton">
												<Button variant="contained" className="resetModifications" onClick={() => endModifications()} style={{ minWidth: 114, marginLeft: 10, marginRight: 10, maxWidth: 114 }}><Translate value="tableopSession.simulation.modification.player" /></Button>
											</div>
										</div>
										
									</ClickAwayListener>
								</Popper>
							</div>
						}
					</div>
				</div>
			}
			{modificationsData.pencilsDown === true && userInfo.userId === controller &&
				< div className="resetModificationsButton">
					<Button variant="contained" className="resetModifications" onClick={() => restartModifications()} style={{ minWidth: 114, marginLeft: 10, marginRight: 10, maxWidth: 114 }}><Translate value="tableopSession.simulation.modification.restart" /></Button>
				</div>
			}
		</div >
	);
};

ModificationTimer.propTypes = propTypes;
export default ModificationTimer;