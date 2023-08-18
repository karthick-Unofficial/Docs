import React, { memo, useEffect, useState, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
// material-ui
import { IconButton, Slider, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PlayCircleFilledWhite, SlowMotionVideo, PauseCircleFilled, Info } from "@material-ui/icons";
import { Alert } from "orion-components/CBComponents/Icons";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";
import {
	contextPanelState
} from "orion-components/ContextPanel/Selectors";
import { cameraDockSelector } from "../RightToolbar/ReplayCameraDock/selectors";
import {
	clearPlayBarValue,
	setPlayBarValue,
	updatePlaying
} from "./playBarActions";

const styles = {
	playBarContainer: {
		display: "flex",
		position: "absolute",
		right: 0,
		bottom: 0,
		height: 100,
		backgroundColor: "rgb(65, 69, 74)",
		zIndex: 2
	},
	playBarContainerRTL: {
		display: "flex",
		position: "absolute",
		left: 0,
		bottom: 0,
		height: 100,
		backgroundColor: "rgb(65, 69, 74)",
		zIndex: 2
	}
};

const useStyles = makeStyles({
	root: {
		color: "#4eb5f3"
	},
	rail: {
		borderRadius: 5,
		height: 5
	},
	track: {
		borderRadius: 5,
		height: 5
	},
	thumb: {
		width: 24,
		height: 24,
		marginTop: -10
	},
	mark: {
		display: "none"
	},
	valueLabel: {
		top: -30,
		width: 100,
		fontSize: "1rem",
		transform: "none",
		"& *": {
			transform: "none",
			backgroundColor: "rgb(65, 69, 74)",
			color: "white",
			width: "100%"
		}
	}
});

const getAlertMarks = (playBarAlerts, playBarValue) => {
	const marks = Object.keys(playBarAlerts).map(timestamp => {
		return {
			value: moment(timestamp).valueOf(),
			label: (
				<div style={{ marginLeft: 12 }}>
					{moment(timestamp).valueOf() <= moment(playBarValue).valueOf() ? <Alert /> : <Alert customStyles={{ errorStyle: { color: "#B5B9BE" } }} />}
				</div>
			)
		};
	});

	return marks;
};

// -- tool for storing previous prop/state values in hooks
function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

const PlayBar = ({ startDate, endDate }) => {

	const dispatch = useDispatch();

	const audioVideoDock = useSelector(state => cameraDockSelector(state));
	const playBarAlerts = useSelector(state => state.replay.playBarAlerts);
	const playBarValue = useSelector(state => state.playBar.playBarValue);
	const playing = useSelector(state => state.playBar.playing);
	const currentMedia = useSelector(state => state.appState.replayCamerasDock.currentMedia);
	const dockState = audioVideoDock.dockState;
	const secondaryExpanded = useSelector(state => contextPanelState(state).secondaryExpanded);
	const secondaryOpen = useSelector(state => contextPanelState(state).secondaryOpen);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => getCultureCode(state));

	const [isActivePaused, setIsActivePaused] = useState(false);
	const [playSpeed, updatePlaySpeed] = useState(1);
	const [menuElement, updateMenuElement] = useState(null);
	const [timerId, setTimerId] = useState(null);
	const classes = useStyles();

	const prevMedia = usePrevious(currentMedia);
	const prevDockState = usePrevious(dockState);

	useEffect(() => {
		dispatch(clearPlayBarValue());
	}, [clearPlayBarValue]);

	useEffect(() => {
		// -- stop playing, reset timer, and set playback to "0" when start or end dates change
		dispatch(updatePlaying(false));
		clearTimeout(timerId);
		setTimerId(null);
		dispatch(setPlayBarValue(moment(startDate).locale("en").startOf("second").toISOString()));
	}, [startDate, endDate]);

	useEffect(() => {
		if (playing) {
			if (playBarValue >= endDate) {
				// -- stop playing if reached the end
				dispatch(updatePlaying(!playing));
			}
			else {
				const timer = setTimeout(() => {
					dispatch(setPlayBarValue(moment.utc(playBarValue).locale("en").add(1, "second").format()));
				}, (1000 / playSpeed));
				setTimerId(timer);
			}
		}
		else if (!playing && timerId) {
			clearTimeout(timerId);
			setTimerId(null);
		}
	}, [playBarValue, playing]);

	useEffect(() => {
		if (dockState === "cameras" && currentMedia.length > 0) {
			// -- update playbar value if dockState changed or new media added (not removed)
			const newMediaArray = currentMedia.filter(media => !prevMedia.includes(media));
			if (dockState !== prevDockState || newMediaArray.length > 0) {
				// -- pause playback, set playback speed to 1, and restart playback position when audio is loaded
				dispatch(updatePlaying(false));
				updatePlaySpeed(1);
				dispatch(setPlayBarValue(moment(startDate).locale("en").startOf("second").toISOString()));
			}
		}
	}, [dockState, currentMedia]);

	const playSpeedOptions = dockState === "cameras" && currentMedia.length > 0 ? [1] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	return (
		<ErrorBoundary>
			<div style={dir == "rtl" ? { ...styles.playBarContainerRTL, width: secondaryOpen || secondaryExpanded ? `calc(100% - ${secondaryExpanded ? "600px" : "360px"})` : "100%" } : {
				...styles.playBarContainer,
				width: secondaryOpen || secondaryExpanded ? `calc(100% - ${secondaryExpanded ? "600px" : "360px"})` : "100%"
			}}>
				<div style={{ textAlign: "center", width: 80, backgroundColor: "#2c2d2f" }}>
					<div style={{
						paddingLeft: 10,
						paddingRight: 10,
						paddingTop: 10,
						paddingBottom: 10,
						position: "relative"
					}}>
						<div style={{
							height: 15,
							width: 15,
							top: 22,
							right: 31,
							position: "absolute",
							backgroundColor: "white"
						}}
						/>
						<IconButton onClick={() => {
							dispatch(updatePlaying(!playing));
						}} style={{ padding: 0 }} color="primary">
							{playing ? (
								<PauseCircleFilled style={{ height: 40, width: 40 }} />
							) : (
								<PlayCircleFilledWhite style={{ height: 40, width: 40 }} />
							)
							}
						</IconButton>
					</div>
					<div style={{ display: "flex", alignItems: "center", paddingLeft: 14, height: 40, paddingBottom: 10 }}>
						<IconButton onClick={(e) => updateMenuElement(e.currentTarget)} style={{ backgroundColor: "transparent", color: "white", paddingRight: 2 }}>
							<SlowMotionVideo style={{ height: 24, width: 24 }} />
						</IconButton>
						<p style={{ color: "white", fontSize: 12 }}>{playSpeed.toLocaleString(locale)}x</p>
						<Menu
							id="play-speed"
							anchorEl={menuElement}
							keepMounted
							open={Boolean(menuElement)}
							onClose={() => updateMenuElement(null)}
						>
							{playSpeedOptions.map((speed, index) =>
								<MenuItem
									key={index}
									onClick={() => {
										updatePlaySpeed(speed);
										updateMenuElement(null);
									}}>
									{speed.toLocaleString(locale)}x
								</MenuItem>
							)}
						</Menu>
					</div>

				</div>
				<div style={{
					alignItems: "center",
					width: "100%",
					paddingLeft: 25,
					paddingRight: 25
				}}>
					<div style={{ height: 19, marginBottom: 10, marginTop: 10 }}>
						<div style={{ float: "left", color: "white" }}>{moment(startDate).locale(locale).format("h:mm A")}</div>
						<div style={{ float: "right", color: "white" }}>{moment(endDate).locale(locale).format("h:mm A")}</div>
					</div>
					<Slider
						classes={{
							root: classes.root,
							rail: classes.rail,
							track: classes.track,
							thumb: classes.thumb,
							mark: classes.mark,
							valueLabel: classes.valueLabel
						}}
						disabled={dockState === "cameras" && currentMedia.length > 0}
						valueLabelDisplay="on"
						valueLabelFormat={(x) => moment(x).locale(locale).format("h:mm:ss A")}
						value={moment(playBarValue).valueOf()}
						min={moment(startDate).valueOf()}
						max={moment(endDate).valueOf()}
						step={1000}
						onChange={(e, value) => {
							if (playing) {
								dispatch(updatePlaying(false));
								setIsActivePaused(true);
							}
							dispatch(setPlayBarValue(moment.utc(value).locale("en").format()));
						}}
						onChangeCommitted={(e, value) => {
							// -- resume playing when slider released
							if (isActivePaused) {
								dispatch(updatePlaying(true));
								setIsActivePaused(false);
							}
						}}
						marks={getAlertMarks(playBarAlerts, playBarValue)}
					/>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default memo(PlayBar);
