import React, { PureComponent, Fragment } from "react";
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
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos, Close, Lock, LockOpen, MoreVert } from "@material-ui/icons";
//import { withStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

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

class CameraCard extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			instanceId: uuidv4(),
			anchorEl: null,
			presetsOpen: false,
			presets: []	// this should get populated with valid preset values, example: {label: "Home", value: "home"}
		};
	}

	componentDidMount = async () => {
		// load camera presets
		const { camera } = this.props;
		const presets = await cameraService.getPresets(camera.id);
		this.setState({
			presets: presets
		});
	}

	handleHeaderClick = (e, camera) => {
		e.stopPropagation();
		const { loadProfile } = this.props;
		const { id, entityData } = camera;
		loadProfile(id, entityData.properties.name, "camera", "profile");
	};

	handleAddToDock = () => {
		const { addCameraToDockMode, camera } = this.props;
		addCameraToDockMode(camera, true);
		this.setState({
			anchorEl: null
		});
	};

	handleRemoveFromDock = () => {
		const { removeDockedCamera, dockedCameras, cameraIndex, camera, isInDock, playbackStartTime, removeReplayMedia } = this.props;

		// -- remove selected camera if removed from inside Dock, otherwise remove the last instance of the camera in the dock
		const dockIndex = isInDock ? cameraIndex : dockedCameras.lastIndexOf(camera.id);
		removeDockedCamera(dockIndex, dockedCameras);

		// -- remove replay media if playback camera
		if (playbackStartTime) {
			removeReplayMedia(camera.id);
		}

		this.setState({
			anchorEl: null
		});
	};

	handleSlew = e => {
		e.stopPropagation();
		const { camera, geometry } = this.props;
		const { coordinates } = geometry;
		// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
		cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
	};

	handleSlewLock = (e, locked) => {
		const { camera, contextId, entityType, geometry } = this.props;
		const { id } = camera;
		e.stopPropagation();
		locked
			? cameraService.releaseSlewLock(id, (err, response) => {
				if (err) {
					console.log(err);
				}
				else {
					// -- force rerender to pick up latest camera value
					this.setState({ state: this.state });
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
						this.setState({ state: this.state });
					}
				}
			);
	};

	handleExpandMenu = (e) => {
		e.stopPropagation();
		this.setState({
			anchorEl: e.currentTarget,
			presetsOpen: false
		});
	};

	handlePopoverClick = (e) => {
		// -- stop propogation outside the popover
		e.stopPropagation();
	}

	handleCloseMenu = () => {
		this.setState({
			anchorEl: null
		});
	};

	// handleToggle = (e, name) => {
	// 	this.setState({ [name]: e.target.checked });
	// };

	handlePresetsClick = () => {
		this.setState({
			presetsOpen: true
		});
	}

	handleBackClick = () => {
		this.setState({
			presetsOpen: false
		});
	}

	execFeatureCommand = (cmd) => {
		cameraService.sendAuxCmd(this.props.camera.id, cmd);
	}

	selectPreset = (preset) => {
		// fire preset
		cameraService.gotoPreset(this.props.camera.id, preset);
		// close menu
		this.setState({
			anchorEl: null
		});
	}

	hasCapability = (capability) => {
		return this.props.camera.entityData.properties.features &&
			this.props.camera.entityData.properties.features.includes(capability);
	}

	render() {
		const {
			camera,
			expanded,
			contextId,
			canUnlink,
			entityType,
			canExpand,
			handleCardExpand,
			canTarget,
			hasMenu,
			useCameraGeometry,
			dockedCameras,
			sidebarOpen,
			loadProfile,
			cameraIndex,
			dialog,
			openDialog,
			closeDialog,
			canControl,
			subscriberRef,
			setCameraPriority,
			fullscreenCamera,
			disableSlew,
			readOnly,
			playbackStartTime,
			playBarValue,
			playbackPlaying,
			currentReplayMedia,
			addReplayMedia,
			removeReplayMedia,
			unlinkCameras,
			isInDock,
			dir
		} = this.props;
		const { anchorEl, presetsOpen, presets, instanceId } = this.state;

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
						onClick={e => this.handleSlew(e)}
						color="primary"
						style={{ textTransform: "none" }}
					>
						<Translate value="global.profiles.widgets.cameras.camCard.slew" />
					</Button>
				)}
				<IconButton
					style={{ padding: 0 }}
					onClick={e => this.handleSlewLock(e, slewLock)}
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
					{canTarget && <TargetingIcon geometry={useCameraGeometry ? camera.entityData.geometry : null} id={id} feedId={feedId} />}
					<ListItemText
						style={{ padding: 0 }}
						primary={
							expanded && loadProfile && !readOnly ? (
								<Button
									onClick={e => this.handleHeaderClick(e, camera)}
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
						style={dir == "rtl" ? { textAlign: "right" } : {}}
					/>
					{/* Camera Menu Button and Options */}
					{hasMenu &&
						<Fragment>
							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								onClick={this.handleExpandMenu}
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
								onClose={this.handleCloseMenu}
								onClick={this.handlePopoverClick}
							>
								<List style={{ background: "#4A4D52", width: 300 }}>
									{!presetsOpen ? (
										<Fragment>
											<ListItem style={{ paddingLeft: 16, paddingRight: 16, height: 30 }}>
												<ListItemText primary="" />
												<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={this.handleCloseMenu}>
													<IconButton edge={dir == "rtl" ? "start" : "end"} aria-label="close">
														<Close style={{ color: "#FFF" }} />
													</IconButton>
												</ListItemSecondaryAction>
											</ListItem>
											{sidebarOpen && dockedCameras.includes(id) ? (
												<ListItem
													button
													style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
													onClick={this.handleRemoveFromDock}
												>
													<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.removeFromDock")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
												</ListItem>
											) : (
												<ListItem
													button
													style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
													onClick={this.handleAddToDock}
												>
													<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.addToDock")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
												</ListItem>
											)}
											<Divider style={{ background: "#626466" }} />
											{(this.hasCapability("control") && canControl) && (
												<ListItem
													button
													style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
													onClick={this.handlePresetsClick}
												>
													<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.presets")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
													<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
														<IconButton edge={dir == "rtl" ? "start" : "end"}>
															{dir == "rtl" ? <ArrowBackIos style={{ color: "#FFF", fontSize: "medium" }} /> : <ArrowForwardIos style={{ color: "#FFF", fontSize: "medium" }} />}
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											)}
											{(this.hasCapability("control") && canControl && buttonFeatures) && (
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
															<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={e => this.execFeatureCommand(feat.auxCmd)}>
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
												onClick={this.handleBackClick}
												style={{ paddingLeft: 16, paddingRight: 16, height: 30 }}
											>
												{dir == "rtl" ?
													<ArrowForwardIos style={dir == "rtl" ? { color: "#FFF", fontSize: "medium", marginLeft: 10 } : { color: "#FFF", fontSize: "medium", marginRight: 10 }} />
													:
													<ArrowBackIos style={dir == "rtl" ? { color: "#FFF", fontSize: "medium", marginLeft: 10 } : { color: "#FFF", fontSize: "medium", marginRight: 10 }} />
												}

												<ListItemText primary={getTranslation("global.profiles.widgets.cameras.camCard.back")} style={dir == "rtl" ? { textAlign: "right" } : {}} />
												<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}} onClick={this.handleCloseMenu}>
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
													onClick={e => this.selectPreset(preset.value)}
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
							{this.hasCapability("control") && unlinkControls}
							{this.hasCapability("auto-slew") && slewControls}
						</CardActions>
					)
					}
				</Collapse>
			</Card>
		);
	}
}

export default CameraCard;
