import React, { memo, useState, useEffect } from "react";
import { Menu } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { Translate, getTranslation } from "orion-components/i18n";
import { Typography, IconButton, Button, TextField, Drawer } from "@material-ui/core";
import { Dialog } from "orion-components/CBComponents";
import _ from "lodash";
import { replayService } from "client-app-core";
import { NotificationTab } from "orion-components/Dock";
import ErrorBoundary from "orion-components/ErrorBoundary";
import NewMapReplay from "../../NewReplay/NewMapReplay/NewMapReplay";
import NewZoneReplay from "../../NewReplay/NewZoneReplay/NewZoneReplay";
import NewTrackReplay from "../../NewReplay/NewTrackReplay/NewTrackReplay";
import NewEventReplay from "../../NewReplay/NewEventReplay/NewEventReplay";
//Material UI
import Close from "material-ui/svg-icons/content/clear";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { getInitialPlayBarData } from "../../shared/utility/utilities";
import { cameraDockSelector } from "../RightToolbar/ReplayCameraDock/selectors";
import { toggleOpen, openSettingsMenu } from "./replayTopBarActions";

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
				console.log("err: ", err);
			} else {
				updateOpen(false);
			}
		});
	} else {
		replayService.saveReplay(replay, (err, result) => {
			if (err) {
				console.log("err: ", err);
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

const styles = {
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
};

const userFieldStyles = {
	width: "45%",
	marginBottom: 35
};

const ReplayTopBarWrapper = ({ location }) => {
	const replayBaseMap = useSelector(state => state.replayMapState.replayBaseMap);
	const mapRef = replayBaseMap.mapRef;
	const playBarValue = useSelector(state => state.playBar.playBarValue);
	const dockData = useSelector(state => state.appState.dock.dockData);
	const alert = useSelector(state => state.replay.alerts);
	const alerts = getInitialPlayBarData(playBarValue, alert);
	const audioVideoDock = useSelector(state => cameraDockSelector(state));
	const componentState = dockData;
	const notifications = alerts ? Object.values(alerts) : [];
	const currentMedia = useSelector(state => cameraDockSelector(state).currentMedia);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	return <ReplayTopBar
		location={location}
		map={mapRef}
		componentState={componentState}
		notifications={notifications}
		currentMedia={currentMedia}
		dir={dir}
		locale={locale}
	/>;
};

const ReplayTopBar = memo(({ location, map, componentState, notifications, currentMedia, dir, locale }) => {

	const dispatch = useDispatch();

	const [open, updateOpen] = useState(false);
	const [editing, toggleEditing] = useState(false);
	const [replayName, setReplayName] = useState("");
	const [nameFieldError, setNameFieldError] = useState(false);
	const capitalizedTitle = `${location.query.type[0].toUpperCase() + location.query.type.slice(1)} ${getTranslation("replay.replayToBar.title")}`;
	useEffect(() => {
		if (location && location.query) {
			if (location.query.name) {
				setReplayName(location.query.name);
			} else {
				setReplayName(`${capitalizedTitle} ${getTranslation("replay.replayToBar.title")} ${location.query.startDate ? moment(location.query.startDate).locale(locale).format("MMMM D, YYYY") : ""}`);
			}
		}
	}, [capitalizedTitle, location]);
	let startDate = "";
	let endDate = "";
	let dateString = "";
	if (location.query && location.query.endDate && location.query.startDate) {
		endDate = moment(location.query.endDate).locale(locale);
		startDate = moment(location.query.startDate).locale(locale);
		dateString = `${startDate.locale(locale).format("MMMM D, YYYY h:mm A")} ${getTranslation("replay.replayToBar.to")} ${startDate.isSame(endDate, "day") ?
			moment(endDate).locale(locale).format("h:mm A") :
			moment(endDate).locale(locale).format("MMMM D, YYYY h:mm A")}`;
	}
	return (
		<div>
			<div style={styles}>
				<IconButton style={{ marginLeft: -16, marginRight: 8, color: "white" }} onClick={() => dispatch(openSettingsMenu())}>
					<Menu />
				</IconButton>
				<Typography variant="h3" color="inherit" style={{ marginRight: dir === "rtl" ? "25px" : "0px" }} > {capitalizedTitle}</Typography>

				<div style={{ flex: "1 1 0%", fontSize: 17, textAlign: "center", color: "#bdbdbd" }}>
					<div style={{ display: "inline-flex", alignItems: "baseline" }}>
						{dateString && (
							<p>{`${dateString} (${parseInt(moment.duration(endDate.diff(startDate)).asMinutes())} ${getTranslation("replay.replayToBar.mins")})`}</p>
						)}
						{!window.api && (
							<Button onClick={() => toggleEditing(true)} style={{ textTransform: "none" }} color="primary">
								<Translate value="replay.replayToBar.edit" />
							</Button>
						)}
					</div>
				</div>

				{!window.api && (
					<Button onClick={() => updateOpen(true)}
						style={{ marginLeft: "auto", marginRight: 22, height: 30, width: 105 }}
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
								<div
									onClick={() => dispatch(toggleOpen())}
									className="ad-toggle-mobile"
								>
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
					padding: 15,
					width: 600
				}}
			>
				<div
					style={{ display: "flex", flexDirection: "column" }}
				>
					<TextField
						style={userFieldStyles}
						label={getTranslation("replay.replayToBar.name")}
						error={nameFieldError}
						helperText={nameFieldError ? getTranslation("replay.replayToBar.replayHelperText") : ""}
						onChange={(e) => {
							setReplayName(e.target.value);
						}}
						value={replayName}
					/>
				</div>
				<div style={{ alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
					<Button onClick={() => updateOpen(false)} style={{ height: 40, width: 130 }}>
						<Translate value="replay.replayToBar.cancel" />
					</Button>
					{location && location.query && (
						<Button
							onClick={() => saveReplay(replayName, location.query, currentMedia, updateOpen)}
							style={{ height: 40, width: 130 }}
							variant="contained"
							color="primary">
							<Translate value="replay.replayToBar.save" />
						</Button>
					)}
				</div>

			</Dialog>
		</div >
	);
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});

export default ReplayTopBarWrapper;
