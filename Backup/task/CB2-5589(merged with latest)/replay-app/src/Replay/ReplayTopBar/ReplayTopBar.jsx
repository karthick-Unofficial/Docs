import React, { memo, useState, useEffect } from "react";
import { Menu, Close } from "@mui/icons-material";
import { makeStyles, withStyles } from "@mui/styles";
import { Translate, getTranslation } from "orion-components/i18n";
import { Typography, IconButton, Button, TextField, Drawer } from "@mui/material";
import { Dialog } from "orion-components/CBComponents";
import isEqual from "lodash/isEqual";
import { replayService } from "client-app-core";
import { NotificationTab } from "orion-components/Dock";
import ErrorBoundary from "orion-components/ErrorBoundary";
import NewMapReplay from "../../NewReplay/NewMapReplay/NewMapReplay";
//Material UI
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { getInitialPlayBarData } from "../../shared/utility/utilities";
import { cameraDockSelector } from "../RightToolbar/ReplayCameraDock/selectors";
import * as actionCreators from "./replayTopBarActions";

const StyledDrawer = withStyles({
	paper: {
		width: 420,
		backgroundColor: "#2C2B2D",
		// -- Force drawer to sit under menu bar
		position: "fixed !important",
		height: "calc(100vh - 148px) !important",
		top: "48px !important",
		right: !window.api ? "48px" : "0",
		overflow: "visible !important"
	}
})(Drawer);

const saveReplay = (name, replayData, currentMedia, updateOpen) => {
	const splitCoords = replayData.coordinates ? replayData.coordinates.split(",") : [0, 0, 0, 0];
	const coordinates = [
		[parseFloat(splitCoords[0]), parseFloat(splitCoords[1])],
		[parseFloat(splitCoords[2]), parseFloat(splitCoords[3])]
	];
	const replay = {
		name,
		coordinates,
		type: replayData.type,
		startDate: replayData.startDate,
		endDate: replayData.endDate,
		currentMedia
	};
	if (replayData.id) {
		replayService.updateReplay(replayData.id, replay, (err, result) => {
			if (err) {
				console.log("err: ", err, result);
			} else {
				updateOpen(false);
			}
		});
	} else {
		replayService.saveReplay(replay, (err, result) => {
			if (err) {
				console.log("err: ", err, result);
			} else {
				updateOpen(false);
			}
		});
	}
};

const getEditingDialog = (type, toggleEditing, params) => {
	switch (type) {
		case "map":
			return <NewMapReplay toggleEditing={toggleEditing} editing={true} params={params} />;
		default:
			break;
	}
};

const userFieldStyles = {
	width: "45%",
	marginBottom: 35
};

const useStyles = makeStyles({
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		}
	}
});

const ReplayTopBarWrapper = ({ location }) => {
	const replayBaseMap = useSelector((state) => state.replayMapState.replayBaseMap);
	const mapRef = replayBaseMap.mapRef;
	const playBarValue = useSelector((state) => state.playBar.playBarValue);
	const dockData = useSelector((state) => state.appState.dock.dockData);
	const alertData = useSelector((state) => state.replay.alerts);
	const alerts = getInitialPlayBarData(playBarValue, alertData);
	const componentState = dockData;
	const notifications = alerts ? Object.values(alerts) : [];
	const currentMedia = useSelector((state) => cameraDockSelector(state).currentMedia);
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state.i18n.locale);
	return (
		<ReplayTopBar
			location={location}
			map={mapRef}
			componentState={componentState}
			notifications={notifications}
			currentMedia={currentMedia}
			dir={dir}
			locale={locale}
		/>
	);
};

const ReplayTopBar = memo(
	({ location, map, componentState, notifications, currentMedia, dir, locale }) => {
		const dispatch = useDispatch();
		const classes = useStyles();

		const { toggleOpen, openSettingsMenu } = actionCreators;

		const [open, updateOpen] = useState(false);
		const [editing, toggleEditing] = useState(false);
		const [replayName, setReplayName] = useState("");
		const [nameFieldError, setNameFieldError] = useState(false);
		const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);
		const capitalizedTitle = `${
			location.query.type[0].toUpperCase() + location.query.type.slice(1)
		} ${getTranslation("replay.replayToBar.title")}`;
		useEffect(() => {
			if (location && location.query) {
				if (location.query.name) {
					setReplayName(location.query.name);
				} else if (locale) {
					setReplayName(
						`${capitalizedTitle}  ${
							location.query.startDate
								? moment(location.query.startDate).locale(locale).format("MMMM D, YYYY")
								: ""
						}`
					);
				}
			}
		}, [capitalizedTitle, location, locale]);
		let startDate, endDate, dateString;
		if (location.query && location.query.endDate && location.query.startDate && locale) {
			endDate = moment(location.query.endDate).locale(locale);
			startDate = moment(location.query.startDate).locale(locale);

			if (timeFormatPreference === "24-hour") {
				dateString = `${startDate.format("MMMM D, YYYY HH:mm")} ${getTranslation("replay.replayToBar.to")} ${
					startDate.isSame(endDate, "day")
						? moment(endDate).format("HH:mm")
						: moment(endDate).format("MMMM D, YYYY HH:mm")
				}`;
			} else {
				dateString = `${startDate.format("MMMM D, YYYY h:mm A")} ${getTranslation("replay.replayToBar.to")} ${
					startDate.isSame(endDate, "day")
						? moment(endDate).format("h:mm A")
						: moment(endDate).format("MMMM D, YYYY h:mm A")
				}`;
			}
		}

		const styles = {
			wrapperDiv: {
				height: 48,
				lineHeight: "48px",
				backgroundColor: "#41454a",
				position: "relative",
				alignItems: "center",
				display: "flex",
				paddingLeft: 24,
				zIndex: 600,
				paddingRight: 6,
				color: "#fff"
			},
			typography: {
				...(dir === "rtl" && { marginRight: "25px" }),
				...(dir === "ltr" && { marginRight: "0px" })
			}
		};

		return (
			<div>
				<div style={styles.wrapperDiv}>
					<IconButton
						style={{
							marginLeft: -16,
							marginRight: 8,
							padding: 12,
							color: "white"
						}}
						onClick={() => dispatch(openSettingsMenu())}
					>
						<Menu />
					</IconButton>
					<Typography variant="h3" color="inherit" style={styles.typography}>
						{" "}
						{capitalizedTitle}
					</Typography>

					<div
						style={{
							flex: "1 1 0%",
							fontSize: 17,
							textAlign: "center",
							color: "#bdbdbd"
						}}
					>
						<div
							style={{
								display: "inline-flex",
								alignItems: "baseline"
							}}
						>
							{dateString && (
								<p>{`${dateString} (${parseInt(
									moment.duration(endDate.diff(startDate)).asMinutes()
								)} ${getTranslation("replay.replayToBar.mins")})`}</p>
							)}
							{!window.api && (
								<Button
									onClick={() => toggleEditing(true)}
									style={{ textTransform: "none" }}
									color="primary"
								>
									<Translate value="replay.replayToBar.edit" />
								</Button>
							)}
						</div>
					</div>

					{!window.api && (
						<Button
							onClick={() => updateOpen(true)}
							style={{
								marginLeft: "auto",
								marginRight: 22,
								height: 30,
								width: 105,
								color: "#fff"
							}}
							variant="contained"
							color="primary"
						>
							<Translate value="replay.replayToBar.save" />
						</Button>
					)}
					<StyledDrawer
						variant="persistent"
						anchor={dir == "rtl" ? "left" : "right"}
						open={componentState.isOpen}
					>
						<div id="sidebar-inner-wrapper" className="cf">
							<ErrorBoundary>
								{componentState.isOpen && (
									<div onClick={() => dispatch(toggleOpen())} className="ad-toggle-mobile">
										<a>
											<div className="close-ad-text">
												<Close />
											</div>
										</a>
									</div>
								)}
								<ErrorBoundary>
									<div className="margin-container">
										<NotificationTab
											map={map}
											forReplay={true}
											readOnly={true}
											notifications={notifications}
											componentState={componentState}
											endDate={endDate}
										/>
									</div>
								</ErrorBoundary>
							</ErrorBoundary>
						</div>
					</StyledDrawer>
				</div>
				{editing && getEditingDialog(location.query.type, toggleEditing, location.query)}

				<Dialog
					open={open}
					title={<h3>{getTranslation("replay.replayToBar.saveReplay")}</h3>}
					paperPropStyles={{
						backgroundColor: "#41454a",
						padding: "15px",
						width: "600px"
					}}
					dialogContentStyles={{ padding: "8px 24px!important" }}
				>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<TextField
							variant="standard"
							style={userFieldStyles}
							label={getTranslation("replay.replayToBar.name")}
							error={nameFieldError}
							helperText={nameFieldError ? getTranslation("replay.replayToBar.replayHelperText") : ""}
							onChange={(e) => {
								setReplayName(e.target.value);
							}}
							value={replayName}
							// inputProps={{ style: { fontSize: 14 } }}
							InputProps={{
								style: { fontSize: 14 },
								classes: { underline: classes.underline }
							}}
							InputLabelProps={{ style: { fontSize: 14 } }}
						/>
					</div>
					<div
						style={{
							alignItems: "center",
							display: "flex",
							justifyContent: "flex-end",
							marginTop: 40
						}}
					>
						<Button onClick={() => updateOpen(false)} style={{ height: 40, width: 130, color: "#B5B9BE" }}>
							<Translate value="replay.replayToBar.cancel" />
						</Button>
						{location && location.query && (
							<Button
								onClick={() => saveReplay(replayName, location.query, currentMedia, updateOpen)}
								style={{
									height: 40,
									width: 130,
									color: "#fff"
								}}
								variant="contained"
							>
								<Translate value="replay.replayToBar.save" />
							</Button>
						)}
					</div>
				</Dialog>
			</div>
		);
	},
	(prevProps, nextProps) => {
		if (!isEqual(prevProps, nextProps)) {
			return false;
		}
		return true;
	}
);

ReplayTopBar.displayName = "ReplayTopBar";

export default ReplayTopBarWrapper;
