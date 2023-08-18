import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cameraService } from "client-app-core";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import {
	Card,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	Collapse,
	CardContent,
	Divider,
	IconButton,
	Button,
	Popover,
	Switch
} from "@mui/material";
import {
	ArrowBackIos,
	ArrowForwardIos,
	Close,
	MoreVert
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	camera: PropTypes.object.isRequired,
	cameraIcon: PropTypes.object,
	cameraIndex: PropTypes.number,
	canControl: PropTypes.bool,
	canExpand: PropTypes.bool,
	contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	dialog: PropTypes.object,
	dockedCameras: PropTypes.array.isRequired,
	entityType: PropTypes.string.isRequired,
	expanded: PropTypes.bool,
	fullscreenCamera: PropTypes.bool,
	// geometry: PropTypes.object,
	hasMenu: PropTypes.bool,
	isInDock: PropTypes.bool,
	readOnly: PropTypes.bool,
	sidebarOpen: PropTypes.bool,
	subscriberRef: PropTypes.string,
	addCameraToDockMode: PropTypes.func,
	closeDialog: PropTypes.func,
	toggleCardExpand: PropTypes.func,
	loadProfile: PropTypes.func,
	openDialog: PropTypes.func,
	removeDockedCamera: PropTypes.func,
	setCameraPriority: PropTypes.func,
	dir: PropTypes.string
};

const instanceId = uuidv4();

const RobotCameraCard = ({
	camera,
	cameraIcon,
	cameraIndex,
	canControl,
	canExpand,
	contextId,
	dialog,
	dockedCameras,
	entityType,
	expanded,
	fullscreenCamera,
	// geometry,
	hasMenu,
	isInDock,
	readOnly,
	sidebarOpen,
	subscriberRef,
	addCameraToDockMode,
	closeDialog,
	toggleCardExpand,
	loadProfile,
	openDialog,
	removeDockedCamera,
	setCameraPriority,
	dir
}) => {
	const dispatch = useDispatch();
	const presets = [];

	const [anchorEl, setAnchorEl] = useState(null);
	const [presetsOpen, setPresetsOpen] = useState(false);

	useEffect(() => {
		// async function fetchCameraPresets() {
		// 	// load camera presets
		// 	const cameraPresets = await cameraService.getPresets(camera.id);
		// 	setPresets(cameraPresets);
		// }
		// fetchCameraPresets();
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

		setAnchorEl(null);
	};

	// const handleSlew = e => {
	// 	e.stopPropagation();
	// 	const { coordinates } = geometry;
	// 	// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
	// 	cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
	// };

	// const handleSlewLock = (e, locked) => {
	// 	const { id } = camera;
	// 	e.stopPropagation();
	// 	locked
	// 		? cameraService.releaseSlewLock(id, (err, response) => {
	// 			if (err) {
	// 				console.log(err);
	// 			}
	// 			else {
	// 				// -- force rerender to pick up latest camera value
	// 				this.setState({ state: this.state });
	// 			}
	// 		})
	// 		: cameraService.setSlewLock(
	// 			id,
	// 			contextId,
	// 			entityType,
	// 			geometry,
	// 			(err, response) => {
	// 				if (err) {
	// 					console.log(err);
	// 				}
	// 				else {
	// 					// -- force rerender to pick up latest camera value
	// 					this.setState({ state: this.state });
	// 				}
	// 			}
	// 		  );
	// };

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

		// close menu
		setAnchorEl(null);
	};

	const hasCapability = (capability) => {
		return (
			camera.entityData.properties.features &&
			camera.entityData.properties.features.includes(capability)
		);
	};

	const backgroundColor = expanded ? "#1F1F21" : "#FFFFFF00";
	const { id, entityData } = camera;
	const { name, position } = entityData.properties;
	const cameraFeatures = camera.entityData.properties.features || null;
	const buttonFeatures = cameraFeatures
		? cameraFeatures.filter((feat) => {
				return typeof feat === "object" && feat.type === "button";
		  })
		: null;

	return (
		<Card style={{ backgroundColor: "#FFFFFF00", boxShadow: "none" }}>
			<ListItem
				button={canExpand}
				onClick={() => toggleCardExpand(id)}
				className="camera-list-item"
				style={{ backgroundColor, minHeight: 48 }}
			>
				<Switch color="primary" checked={expanded} />
				<ListItemIcon
					className={`camera-icon ${
						expanded ? "enabled" : "disabled"
					}`}
				>
					{cameraIcon}
				</ListItemIcon>
				<ListItemText
					style={{ padding: 0 }}
					primary={
						expanded && loadProfile && !readOnly ? (
							<Button
								onClick={(e) => handleHeaderClick(e, camera)}
								color="primary"
								style={{ textTransform: "none" }}
							>
								{position || name}
							</Button>
						) : (
							<div style={{ padding: "0px 12px" }}>
								{position || name}
							</div>
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
												onClick={handleCloseMenu}
											>
												<IconButton
													edge="end"
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
														"global.profiles.widgets.robotCams.robotCamDock.removeFromDock"
													)}
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
														"global.profiles.widgets.robotCams.robotCamDock.addToDock"
													)}
												/>
											</ListItem>
										)}
										<Divider
											style={{ background: "#626466" }}
										/>
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
													"global.profiles.widgets.robotCams.robotCamDock.presets"
												)}
											/>
											<ListItemSecondaryAction>
												<IconButton edge="end">
													<ArrowForwardIos
														style={{
															color: "#FFF",
															fontSize: "medium"
														}}
													/>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										{hasCapability("control") &&
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
															onChange={e => handleToggle(e, "wipers")}
															checked={wipers}
															inputProps={{ "aria-labelledby": "wipers-switch" }}
														/>
													</ListItemSecondaryAction>
												</ListItem>
												*/}
													{buttonFeatures.map(
														(feat, index) => (
															<ListItem
																button
																style={{
																	paddingTop: 8,
																	paddingBottom: 8,
																	paddingLeft: 16,
																	paddingRight: 16
																}}
																key={`feature-button-${index}`}
															>
																<ListItemText
																	primary={
																		feat.label
																	}
																/>
																<ListItemSecondaryAction
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
											<ArrowBackIos
												style={{
													color: "#FFF",
													fontSize: "medium",
													marginRight: 10
												}}
											/>
											<ListItemText
												primary={getTranslation(
													"global.profiles.widgets.robotCams.robotCamDock.back"
												)}
											/>
											<ListItemSecondaryAction
												onClick={handleCloseMenu}
											>
												<IconButton
													edge="end"
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
														"global.profiles.widgets.robotCams.robotCamDock.noPresetsAvailable"
													)}
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
						docked={
							!isInDock &&
							sidebarOpen &&
							dockedCameras.includes(id)
						}
						dialogKey={`${subscriberRef}-${camera.id}-${cameraIndex}`}
						dialog={dialog}
						modal={fullscreenCamera}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canControl={canControl}
						setCameraPriority={setCameraPriority}
						expanded={false}
						readOnly={readOnly}
						dir={dir}
					/>
				</CardContent>
			</Collapse>
		</Card>
	);
};

RobotCameraCard.propTypes = propTypes;
export default RobotCameraCard;
