import React, { Fragment, useState, useEffect } from "react";
import { cameraService, facilityService } from "client-app-core";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import { TargetingIcon } from "orion-components/SharedComponents";
import {
	Card,
	CardActions,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Collapse,
	CardContent,
	Divider,
	IconButton,
	Button,
	Popover
	//Switch
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos, Close, Lock, LockOpen, MoreVert } from "@material-ui/icons";
//import { withStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";

// const CBSwitch = withStyles({
// 	switchBase: {
// 	  "&$checked": {
// 			color: "#29B6F6"
// 	  },
// 	  "&$checked + $track": {
// 			backgroundColor: "#84D5FA"
// 	  }
// 	},
// 	checked: {},
// 	track: {}
// })(Switch);

const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null

};

const CameraCard = ({
	camera,
	loadProfile,
	addCameraToDockMode,
	removeDockedCamera,
	dockedCameras,
	cameraIndex,
	isInDock,
	playbackStartTime,
	removeReplayMedia,
	geometry,
	floorPlansWithFacilityFeed,
	selectFloorPlanOn,
	contextId, entityType,
	expanded,
	canUnlink,
	canExpand,
	handleCardExpand,
	canTarget,
	hasMenu,
	useCameraGeometry,
	sidebarOpen,
	dialog,
	openDialog,
	closeDialog,
	canControl,
	subscriberRef,
	setCameraPriority,
	fullscreenCamera,
	disableSlew,
	readOnly,
	playBarValue,
	playbackPlaying,
	currentReplayMedia,
	addReplayMedia,
	unlinkCameras,
	dir
}) => {
	const instanceId = uuidv4();
	const [anchorEl, setAnchorEl] = useState(null);
	const [presetsOpen, setPresetsOpen] = useState(false);
	const [presets, setPresets] = useState([]);
	const [reRenderFlag, setReRenderFlag] = useState(false);

	const setupPresets = async () => {
		const presets = await cameraService.getPresets(camera.id);
		setPresets(presets);

	};

	useEffect(() => {
		setupPresets();
	}, []);

	const handleHeaderClick = (e, camera) => {
		e.stopPropagation();
		const { id, entityData } = camera;
		loadProfile(id, entityData.properties.name, "camera", "profile");
	};

	const handleAddToDock = () => {
		addCameraToDockMode(camera, true);
		setAnchorEl(null);
	};

	const handleRemoveFromDock = () => {
		// -- remove selected camera if removed from inside Dock, otherwise remove the last instance of the camera in the dock
		const dockIndex = isInDock ? cameraIndex : dockedCameras.lastIndexOf(camera.id);
		removeDockedCamera(dockIndex, dockedCameras);

		// -- remove replay media if playback camera
		if (playbackStartTime) {
			removeReplayMedia(camera.id);
		}
		setAnchorEl(null);
	};

	const handleSlew = e => {
		e.stopPropagation();
		const { coordinates } = geometry;
		// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
		cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
	};

	const showFloorPlanOnTargetClick = () => {
		if (floorPlansWithFacilityFeed === null) {
			selectFloorPlanOn(camera);
		}
		else {
			const { entityData } = camera;
			if (entityData.displayType === "facility") {
				const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
				if (floorPlanData.id === entityData.displayTargetId) {
					selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
				}
			}
		}
	};

	const handleSlewLock = (e, locked) => {
		const { id } = camera;
		e.stopPropagation();
		locked
			? cameraService.releaseSlewLock(id, (err, response) => {
				if (err) {
					console.log(err);
				}
				else {
					// -- force rerender to pick up latest camera value
					//this.setState({ state: this.state });
					setReRenderFlag(!reRenderFlag);
				}
			})
			: cameraService.setSlewLock(
				id,
				contextId,
				entityType,
				geometry,
				(err, response) => {
					if (err) {
						console.log(err);
					}
					else {
						// -- force rerender to pick up latest camera value
						//this.setState({ state: this.state });
						setReRenderFlag(!reRenderFlag);
					}
				}
			);
	};

	const handleExpandMenu = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
		setPresetsOpen(false);
	};

	const handlePopoverClick = (e) => {
		// -- stop propogation outside the popover
		e.stopPropagation();
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	// handleToggle = (e, name) => {
	// 	this.setState({ [name]: e.target.checked });
	// };

	const handlePresetsClick = () => {
		setPresetsOpen(true);
	};

	const handleBackClick = () => {
		setPresetsOpen(false);
	};

	const execFeatureCommand = (cmd) => {
		cameraService.sendAuxCmd(camera.id, cmd);
	};

	const selectPreset = (preset) => {
		// fire preset
		cameraService.gotoPreset(camera.id, preset);
		setAnchorEl(null);
		// close menu
	};

	const hasCapability = (capability) => {
		return camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability);
	};

	const backgroundColor = expanded ? "#1F1F21" : "#494D53";
	const { id, feedId, entityData, slewLock } = camera;
	const { name } = entityData.properties;
	const cameraFeatures = camera.entityData.properties.features || null;
	const buttonFeatures = cameraFeatures ?
		cameraFeatures.filter((feat) => {
			return typeof feat === "object" && feat.type === "button";
		}) :
		null;
	const unlinkControls = canUnlink && camera.linkedWith && camera.linkedWith === contextId ? (
		<div style={dir && dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}>
			<Button
				onClick={() => unlinkCameras([{ id: contextId, type: entityType }, { id: camera.id, type: "camera" }], "manually-assigned-camera")}
				color="primary"
				style={{ textTransform: "none" }}
			>
				<Translate value="global.profiles.widgets.cameras.camCard.unlinkCam" />
			</Button>

		</div>
	) : (<div></div>);

	const slewControls = !disableSlew ? (
		<div style={dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}>
			{!slewLock && (
				<Button
					onClick={e => handleSlew(e)}
					color="primary"
					style={{ textTransform: "none" }}
				>
					<Translate value="global.profiles.widgets.cameras.camCard.slew" />
				</Button>
			)}
			<IconButton
				style={{ padding: 0 }}
				onClick={e => handleSlewLock(e, slewLock)}
			>
				{slewLock ? <Lock color="primary" /> : <LockOpen />}
			</IconButton>
		</div>
	) : (<div></div>);

	return (
		<Card style={{ borderRadius: 0, marginBottom: 12 }}>
			<ListItem
				button={canExpand}
				onClick={() => handleCardExpand(id)}
				style={dir == "rtl" ? { backgroundColor, padding: "0px 6px", minHeight: 48, direction: "rtl" } : { backgroundColor, padding: "0px 6px", minHeight: 48 }}
			>
				{canTarget && <TargetingIcon selectFloor={showFloorPlanOnTargetClick} geometry={useCameraGeometry ? camera.entityData.geometry : null} id={id} feedId={feedId} />}
				<ListItemText
					style={dir == "rtl" ? { textAlign: "right", padding: 0 } : { padding: 0 }}
					primary={
						expanded && loadProfile && !readOnly ? (
							<Button
								onClick={e => handleHeaderClick(e, camera)}
								color="primary"
								style={{ textTransform: "none" }}
							>
								{name}
							</Button>
						) : (
							<div style={{ padding: "0px 12px" }}>{name}</div>
						)
					}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}

				/>
				{/* Camera Menu Button and Options */}
				{hasMenu &&
					<Fragment>
						<IconButton
							aria-label="more"
							aria-controls="long-menu"
							aria-haspopup="true"
							onClick={handleExpandMenu}
						>
							<MoreVert style={{ color: "#FFF" }} />
						</IconButton>
						<Popover
							open={!!anchorEl}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							onClose={handleCloseMenu}
							onClick={handlePopoverClick}
						>
							<List style={{ background: "#4A4D52", width: 300 }}>
								{!presetsOpen ? (
									<Fragment>
										<ListItem style={{ paddingLeft: 16, paddingRight: 16, height: 30 }}>
											<ListItemText primary="" />
											<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={handleCloseMenu}>
												<IconButton edge={dir == "rtl" ? "start" : "end"} aria-label="close">
													<Close style={{ color: "#FFF" }} />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										{sidebarOpen && dockedCameras.includes(id) ? (
											<ListItem
												button
												style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
												onClick={handleRemoveFromDock}
											>
												<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.removeFromDock")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
											</ListItem>
										) : (
											<ListItem
												button
												style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
												onClick={handleAddToDock}
											>
												<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.addToDock")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
											</ListItem>
										)}
										<Divider style={{ background: "#626466" }} />
										{(hasCapability("control") && canControl) && (
											<ListItem
												button
												style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
												onClick={handlePresetsClick}
											>
												<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.presets")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
												<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
													<IconButton edge={dir == "rtl" ? "start" : "end"}>
														{dir == "rtl" ? <ArrowBackIos style={{ color: "#FFF", fontSize: "medium" }} /> : <ArrowForwardIos style={{ color: "#FFF", fontSize: "medium" }} />}
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
										)}
										{(hasCapability("control") && canControl && buttonFeatures) && (
											<Fragment>
												<Divider style={{ background: "#626466" }} />
												{/*
													<ListItem style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16}}>
														<ListItemText id="wipers-switch" primary="Wipers On/Off" />
														<ListItemSecondaryAction>
															<CBSwitch
																edge="end"
																onChange={e => this.handleToggle(e, "wipers")}
																checked={wipers}
																inputProps={{ "aria-labelledby": "wipers-switch" }}
															/>
														</ListItemSecondaryAction>
													</ListItem>
													*/}
												{buttonFeatures.map(feat => (
													<ListItem button style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
														<ListItemText primary={feat.label} style={dir == "rtl" ? { textAlign: "right" } : {}} />
														<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={e => execFeatureCommand(feat.auxCmd)}>
															<Button size="small" style={{ height: "22px", backgroundColor: "#4DB5F4", color: "#FFF" }}>
																{feat.buttonLabel || " "}
															</Button>
														</ListItemSecondaryAction>
													</ListItem>
												))}
											</Fragment>
										)}
									</Fragment>
								) : (
									<Fragment>
										<ListItem
											button
											onClick={handleBackClick}
											style={{ paddingLeft: 16, paddingRight: 16, height: 30 }}
										>
											{dir == "rtl" ?
												<ArrowForwardIos style={dir == "rtl" ? { color: "#FFF", fontSize: "medium", marginLeft: 10 } : { color: "#FFF", fontSize: "medium", marginRight: 10 }} />
												:
												<ArrowBackIos style={dir == "rtl" ? { color: "#FFF", fontSize: "medium", marginLeft: 10 } : { color: "#FFF", fontSize: "medium", marginRight: 10 }} />
											}

											<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.back")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
											<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={handleCloseMenu}>
												<IconButton edge={dir == "rtl" ? "start" : "end"} aria-label="close">
													<Close style={{ color: "#FFF" }} />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										<Divider style={{ background: "#626466" }} />
										{presets.length > 0 ? presets.map(preset => (
											<ListItem
												key={preset.value}
												button
												style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
												onClick={e => selectPreset(preset.value)}
											>
												<ListItemText primary={preset.label} style={dir == "rtl" ? { textAlign: "right" } : {}} />
											</ListItem>
										)) : (
											<ListItem
												key={"none"}
												style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
											>
												<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.noPresets")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
											</ListItem>
										)}
									</Fragment>
								)}
							</List>
						</Popover>
					</Fragment>
				}
			</ListItem>
			<Collapse unmountOnExit in={expanded}>
				<CardContent style={{ padding: 0 }}>
					<VideoPlayerWrapper
						camera={camera}
						instanceId={instanceId}
						entityId={contextId}
						entityType={entityType}
						docked={!isInDock && sidebarOpen && dockedCameras.includes(id)}
						dialogKey={`${subscriberRef}-${camera.id}-${cameraIndex}`}
						dialog={dialog}
						modal={fullscreenCamera}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canControl={canControl}
						setCameraPriority={setCameraPriority}
						expanded={false}
						readOnly={readOnly}
						playbackStartTime={playbackStartTime}
						playBarValue={playBarValue}
						playbackPlaying={playbackPlaying}
						currentReplayMedia={currentReplayMedia}
						addReplayMedia={addReplayMedia}
						removeReplayMedia={removeReplayMedia}
						dir={dir}
					/>
				</CardContent>
				{!readOnly && (
					<CardActions style={{ backgroundColor, padding: "0px 4px" }}>
						{hasCapability("control") && unlinkControls}
						{hasCapability("auto-slew") && slewControls}
					</CardActions>
				)
				}
			</Collapse>
		</Card>
	);
};


CameraCard.propTypes = propTypes;
CameraCard.defaultProps = defaultProps;

export default CameraCard;
