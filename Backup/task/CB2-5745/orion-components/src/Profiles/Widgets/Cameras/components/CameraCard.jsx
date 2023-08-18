import React, { Fragment, useState, useEffect } from "react";
import { cameraService } from "client-app-core";
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
} from "@mui/material";
import {
	ArrowBackIos,
	ArrowForwardIos,
	Close,
	Lock,
	LockOpen,
	MoreVert
} from "@mui/icons-material";
//import { withStyles } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

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
	contextId,
	entityType,
	expanded,
	canUnlink,
	canExpand,
	handleCardExpand,
	canTarget,
	hasMenu,
	useCameraGeometry,
	sidebarOpen,
	dialog,
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
	const dispatch = useDispatch();

	const instanceId = uuidv4();
	const [anchorEl, setAnchorEl] = useState(null);
	const [presetsOpen, setPresetsOpen] = useState(false);
	const [presets, setPresets] = useState([]); // this should get populated with valid preset values, example: {label: "Home", value: "home"}
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
		dispatch(
			loadProfile(id, entityData.properties.name, "camera", "profile")
		);
	};

	const handleAddToDock = () => {
		dispatch(addCameraToDockMode(camera, true));
		setAnchorEl(null);
	};

	const handleRemoveFromDock = () => {
		// -- remove selected camera if removed from inside Dock, otherwise remove the last instance of the camera in the dock
		const dockIndex = isInDock
			? cameraIndex
			: dockedCameras.lastIndexOf(camera.id);
		dispatch(removeDockedCamera(dockIndex, dockedCameras));

		// -- remove replay media if playback camera
		if (playbackStartTime) {
			dispatch(removeReplayMedia(camera.id));
		}
		setAnchorEl(null);
	};

	const handleSlew = (e) => {
		e.stopPropagation();
		const { coordinates } = geometry;
		// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
		cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
	};

	const showFloorPlanOnTargetClick = () => {
		if (floorPlansWithFacilityFeed === null) {
			dispatch(selectFloorPlanOn(camera));
		} else {
			const { entityData } = camera;
			if (entityData.displayType === "facility") {
				const floorPlanData =
					floorPlansWithFacilityFeed[entityData.displayTargetId];
				if (floorPlanData.id === entityData.displayTargetId) {
					dispatch(
						selectFloorPlanOn(
							floorPlanData,
							floorPlanData.facilityFeedId
						)
					);
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
					console.log(err, response);
				} else {
					// -- force rerender to pick up latest camera value
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
						console.log(err, response);
					} else {
						// -- force rerender to pick up latest camera value
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
		// -- stop propagation outside the popover
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
		return (
			camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability)
		);
	};

	const backgroundColor = expanded ? "#1F1F21" : "#494D53";
	const styles = {
		marginAuto: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" })
		},
		cardExpand: {
			backgroundColor,
			padding: "0px 6px",
			minHeight: 48,
			...(dir === "rtl" && { direction: "rtl" })
		},
		listItemText: {
			padding: 0,
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" && { right: "unset", left: 16 })
		},
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		arrow: {
			color: "#FFF",
			fontSize: "medium",
			...(dir === "rtl" && { marginLeft: 10 }),
			...(dir === "ltr" && { marginRight: 10 })
		}
	};
	const { id, feedId, entityData, slewLock } = camera;
	const { name } = entityData.properties;
	const cameraFeatures = camera.entityData.properties.features || null;
	const buttonFeatures = cameraFeatures
		? cameraFeatures.filter((feat) => {
			return typeof feat === "object" && feat.type === "button";
		})
		: null;
	const unlinkControls =
		canUnlink && camera.linkedWith && camera.linkedWith === contextId ? (
			<div style={styles.marginAuto}>
				<Button
					onClick={() =>
						dispatch(
							unlinkCameras(
								[
									{ id: contextId, type: entityType },
									{ id: camera.id, type: "camera" }
								],
								"manually-assigned-camera"
							)
						)
					}
					color="primary"
					style={{ textTransform: "none" }}
				>
					<Translate value="global.profiles.widgets.cameras.camCard.unlinkCam" />
				</Button>
			</div>
		) : (
			<div></div>
		);

	const slewControls = !disableSlew ? (
		<div style={styles.marginAuto}>
			{!slewLock && (
				<Button
					onClick={(e) => handleSlew(e)}
					color="primary"
					style={{ textTransform: "none" }}
				>
					<Translate value="global.profiles.widgets.cameras.camCard.slew" />
				</Button>
			)}
			<IconButton
				style={{ padding: 0 }}
				onClick={(e) => handleSlewLock(e, slewLock)}
			>
				{slewLock ? <Lock color="primary" /> : <LockOpen />}
			</IconButton>
		</div>
	) : (
		<div></div>
	);

	return (
		<Card style={{ borderRadius: 0, marginBottom: 12 }}>
			<ListItem
				button={canExpand}
				onClick={() => handleCardExpand(id)}
				style={styles.cardExpand}
			>
				{canTarget && (
					<TargetingIcon
						selectFloor={showFloorPlanOnTargetClick}
						geometry={
							useCameraGeometry
								? camera.entityData.geometry
								: null
						}
						id={id}
						feedId={feedId}
					/>
				)}
				<ListItemText
					style={styles.listItemText}
					primary={
						expanded && loadProfile && !readOnly ? (
							<Button
								onClick={(e) => handleHeaderClick(e, camera)}
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
				{hasMenu && (
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
										<ListItem
											style={{
												paddingLeft: 16,
												paddingRight: 16,
												height: 30
											}}
										>
											<ListItemText primary="" />
											<ListItemSecondaryAction
												style={
													styles.listItemSecondaryAction
												}
												onClick={handleCloseMenu}
											>
												<IconButton
													edge={
														dir == "rtl"
															? "start"
															: "end"
													}
													aria-label="close"
												>
													<Close
														style={{
															color: "#FFF"
														}}
													/>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										{sidebarOpen &&
											dockedCameras.includes(id) ? (
											<ListItem
												button
												style={{
													paddingTop: 8,
													paddingBottom: 8,
													paddingLeft: 16,
													paddingRight: 16
												}}
												onClick={handleRemoveFromDock}
											>
												<ListItemText
													primary={getTranslation(
														"global.profiles.widgets.cameras.camCard.removeFromDock"
													)}
													style={
														styles.textAlignRight
													}
												/>
											</ListItem>
										) : (
											<ListItem
												button
												style={{
													paddingTop: 8,
													paddingBottom: 8,
													paddingLeft: 16,
													paddingRight: 16
												}}
												onClick={handleAddToDock}
											>
												<ListItemText
													primary={getTranslation(
														"global.profiles.widgets.cameras.camCard.addToDock"
													)}
													style={
														styles.textAlignRight
													}
												/>
											</ListItem>
										)}
										<Divider
											style={{ background: "#626466" }}
										/>
										{hasCapability("control") &&
											canControl && (
												<ListItem
													button
													style={{
														paddingTop: 8,
														paddingBottom: 8,
														paddingLeft: 16,
														paddingRight: 16
													}}
													onClick={handlePresetsClick}
												>
													<ListItemText
														primary={getTranslation(
															"global.profiles.widgets.cameras.camCard.presets"
														)}
														style={
															styles.textAlignRight
														}
													/>
													<ListItemSecondaryAction
														style={
															styles.listItemSecondaryAction
														}
													>
														<IconButton
															edge={
																dir == "rtl"
																	? "start"
																	: "end"
															}
														>
															{dir == "rtl" ? (
																<ArrowBackIos
																	style={{
																		color: "#FFF",
																		fontSize:
																			"medium"
																	}}
																/>
															) : (
																<ArrowForwardIos
																	style={{
																		color: "#FFF",
																		fontSize:
																			"medium"
																	}}
																/>
															)}
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											)}
										{hasCapability("control") &&
											canControl &&
											buttonFeatures && (
												<Fragment>
													<Divider
														style={{
															background:
																"#626466"
														}}
													/>
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
													{buttonFeatures.map(
														(feat, index) => (
															<ListItem
																key={`feature-${index}-list-item`}
																button
																style={{
																	paddingTop: 8,
																	paddingBottom: 8,
																	paddingLeft: 16,
																	paddingRight: 16
																}}
															>
																<ListItemText
																	primary={
																		feat.label
																	}
																	style={
																		styles.textAlignRight
																	}
																/>
																<ListItemSecondaryAction
																	style={
																		styles.listItemSecondaryAction
																	}
																	onClick={() =>
																		execFeatureCommand(
																			feat.auxCmd
																		)
																	}
																>
																	<Button
																		size="small"
																		style={{
																			height: "22px",
																			backgroundColor:
																				"#4DB5F4",
																			color: "#FFF"
																		}}
																	>
																		{feat.buttonLabel ||
																			" "}
																	</Button>
																</ListItemSecondaryAction>
															</ListItem>
														)
													)}
												</Fragment>
											)}
									</Fragment>
								) : (
									<Fragment>
										<ListItem
											button
											onClick={handleBackClick}
											style={{
												paddingLeft: 16,
												paddingRight: 16,
												height: 30
											}}
										>
											{dir == "rtl" ? (
												<ArrowForwardIos
													style={styles.arrow}
												/>
											) : (
												<ArrowBackIos
													style={styles.arrow}
												/>
											)}

											<ListItemText
												primary={getTranslation(
													"global.profiles.widgets.cameras.camCard.back"
												)}
												style={styles.textAlignRight}
											/>
											<ListItemSecondaryAction
												style={
													styles.listItemSecondaryAction
												}
												onClick={handleCloseMenu}
											>
												<IconButton
													edge={
														dir == "rtl"
															? "start"
															: "end"
													}
													aria-label="close"
												>
													<Close
														style={{
															color: "#FFF"
														}}
													/>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										<Divider
											style={{ background: "#626466" }}
										/>
										{presets.length > 0 ? (
											presets.map((preset) => (
												<ListItem
													key={preset.value}
													button
													style={{
														paddingTop: 8,
														paddingBottom: 8,
														paddingLeft: 16,
														paddingRight: 16
													}}
													onClick={() =>
														selectPreset(
															preset.value
														)
													}
												>
													<ListItemText
														primary={preset.label}
														style={
															styles.textAlignRight
														}
													/>
												</ListItem>
											))
										) : (
											<ListItem
												key={"none"}
												style={{
													paddingTop: 8,
													paddingBottom: 8,
													paddingLeft: 16,
													paddingRight: 16
												}}
											>
												<ListItemText
													primary={getTranslation(
														"global.profiles.widgets.cameras.camCard.noPresets"
													)}
													style={
														styles.textAlignRight
													}
												/>
											</ListItem>
										)}
									</Fragment>
								)}
							</List>
						</Popover>
					</Fragment>
				)}
			</ListItem>
			<Collapse unmountOnExit in={expanded}>
				<CardContent style={{ padding: 0 }}>
					<VideoPlayerWrapper
						camera={camera}
						instanceId={instanceId}
						entityId={contextId}
						entityType={entityType}
						inDock={isInDock}
						dialogKey={`${subscriberRef}-${camera.id}-${cameraIndex}`}
						dialog={dialog}
						modal={fullscreenCamera}
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
					<CardActions
						style={{ backgroundColor, padding: "0px 4px" }}
					>
						{hasCapability("control") && unlinkControls}
						{hasCapability("auto-slew") && slewControls}
					</CardActions>
				)}
			</Collapse>
		</Card>
	);
};

CameraCard.propTypes = propTypes;
CameraCard.defaultProps = defaultProps;

export default CameraCard;
