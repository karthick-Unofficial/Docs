import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import {Typography, IconButton, Button, TextField, Drawer} from "@material-ui/core";
import { Dialog } from "orion-components/CBComponents";
import _ from "lodash";
import { replayService } from "client-app-core";
import { NotificationTab } from "orion-components/Dock";
import ErrorBoundary from "orion-components/ErrorBoundary";
import NewMapReplayContainer from "../../NewReplay/NewMapReplay/NewMapReplayContainer";
import NewZoneReplayContainer from "../../NewReplay/NewZoneReplay/NewZoneReplayContainer";
import NewTrackReplayContainer from "../../NewReplay/NewTrackReplay/NewTrackReplayContainer";
import NewEventReplayContainer from "../../NewReplay/NewEventReplay/NewEventReplayContainer";
//Material UI
import Close from "material-ui/svg-icons/content/clear";
import moment from "moment-timezone";

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

const propTypes = {
	location: PropTypes.object,
	openSettingsMenu: PropTypes.func,
	map: PropTypes.object,
	componentState: PropTypes.object,
	notifications: PropTypes.array,
	currentMedia: PropTypes.array,
	toggleOpen: PropTypes.func
};

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
			return <NewMapReplayContainer toggleEditing={toggleEditing} editing={true} params={params} />;
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

const ReplayTopBar = ({
	location,
	openSettingsMenu,
	map,
	componentState,
	notifications,
	currentMedia,
	toggleOpen
}) => {
	const [open, updateOpen] = useState(false);
	const [editing, toggleEditing] = useState(false);
	const [replayName, setReplayName] = useState("");
	const [nameFieldError, setNameFieldError] = useState(false);
	const capitalizedTitle = location.query.type[0].toUpperCase() + location.query.type.slice(1) + " Replay";
	useEffect(() => {
		if (location && location.query) {
			if (location.query.name) {
				setReplayName(location.query.name);
			} else {
				setReplayName(`${capitalizedTitle} Replay ${location.query.startDate ? moment(location.query.startDate).format("MMMM D, YYYY") : ""}`);
			}
		}
	}, [capitalizedTitle, location]);
	let startDate = "";
	let endDate = "";
	let dateString = "";
	if (location.query && location.query.endDate && location.query.startDate) {
		endDate = moment(location.query.endDate);
		startDate = moment(location.query.startDate);
		dateString = `${startDate.format("MMMM D, YYYY h:mm A")} to ${startDate.isSame(endDate, "day") ?
			endDate.format("h:mm A") :
			endDate.format("MMMM D, YYYY h:mm A")}`;
	}
	return (
		<div>
			<div style={styles}>
				<IconButton style={{ marginLeft: -16, marginRight: 8, color: "white" }} onClick={openSettingsMenu}>
					<Menu />
				</IconButton>
				<Typography variant="h3" color="inherit">{capitalizedTitle}</Typography>

				<div style={{ flex: "1 1 0%", fontSize: 17, textAlign: "center", color: "#bdbdbd" }}>
					<div style={{ display: "inline-flex", alignItems: "baseline"}}>
						{dateString && (
							<p>{`${dateString} (${parseInt(moment.duration(endDate.diff(startDate)).asMinutes())} mins)`}</p>
						)}
						{!window.api && (
							<Button onClick={() => toggleEditing(true)} style={{ textTransform: "none" }} color="primary">
							Edit
							</Button>
						)}
					</div>
				</div>

				{!window.api && (
					<Button onClick={() => updateOpen(true)} 
						style={{ marginLeft: "auto", marginRight: 22, height: 30, width: 105  }} 
						variant="contained" 
						color="primary"
					>
					Save
					</Button>
				)}
				<StyledDrawer
					variant="persistent"
					anchor="right"
					open={componentState.isOpen}
				>
					<div id="sidebar-inner-wrapper" className="cf">
						<ErrorBoundary>
							{componentState.isOpen && (
								<div
									onClick={() => toggleOpen()}
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
				title={<h3>Save the Replay</h3>}
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
						label="Name"
						error={nameFieldError}
						helperText={nameFieldError ? "The Replay must have a name" : ""}
						onChange={(e) => {
							setReplayName(e.target.value);
						}}
						value={replayName}
					/>
				</div>
				<div style={{ alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
					<Button onClick={() => updateOpen(false)} style={{ height: 40, width: 130 }}>
						Cancel
					</Button>
					{location && location.query && (
						<Button 
							onClick={() => saveReplay(replayName, location.query, currentMedia, updateOpen)}
							style={{ height: 40, width: 130 }} 
							variant="contained" 
							color="primary">
						Save
						</Button>
					)}
				</div>

			</Dialog>
		</div>
	);
};

ReplayTopBar.propTypes = propTypes;

export default memo(ReplayTopBar, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
