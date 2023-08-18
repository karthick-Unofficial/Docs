import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { associationService } from "client-app-core";

// components
import { Dialog } from "../../CBComponents";
import FileWidget from "../Widgets/File/FileWidget";
// import RulesWidget from "../Widgets/Rules/RulesWidget";
import EntityDelete from "../EntityProfile/components/EntityDelete";
import EntityShare from "../EntityProfile/components/EntityShare";
import ShapeAssociation from "../EntityProfile/components/ShapeAssociation";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import RobotCamerasWidget from "../Widgets/RobotCameras/RobotCamerasWidget";
import MissionControlWidget from "../Widgets/MissionControl/MissionControlWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import AlertWidget from "../Widgets/Alert/AlertWidget";
import PinToDialog from "../../SharedComponents/PinToDialog";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ImageViewer from "../../SharedComponents/ImageViewer";
import Activities from "../Widgets/Activities/Activities";

// error boundary
import ErrorBoundary from "../../ErrorBoundary";

// utility
import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { collectionsSelector, feedInfoSelector } from "orion-components/GlobalData/Selectors";
import { mapState, widgetStateSelector, trackHistoryDuration, persistedState, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import unionBy from "lodash/unionBy";
import isObject from "lodash/isObject";

//actions
import { addRemoveFromCollections, addRemoveFromEvents } from "orion-components/SharedActions/cameraProfileActions"

let DEFAULT_WIDGET_CONFIG = [];

const propTypes = {
	context: PropTypes.object,
	contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	entityType: PropTypes.string,
	forReplay: PropTypes.bool,
	trackHistDuration: PropTypes.number,
	widgetState: PropTypes.array,
	feedDisplayProps: PropTypes.array,
	notifications: PropTypes.object,
	entityCollections: PropTypes.array,
	sidebarOpen: PropTypes.bool,
	dockedCameras: PropTypes.array,
	dialog: PropTypes.object,
	dialogData: PropTypes.object,
	user: PropTypes.object,
	activityFilters: PropTypes.array,
	mapVisible: PropTypes.bool,
	fullscreenCamera: PropTypes.bool,
	appId: PropTypes.string,
	widgetsLaunchable: PropTypes.bool,
	profileIconTemplate: PropTypes.string,
	timeFormatPreference: PropTypes.string,
	readOnly: PropTypes.bool,
	endDate: PropTypes.object,
	appData: PropTypes.func,
	ignoreEntity: PropTypes.func,
	startAttachmentStream: PropTypes.func,
	startActivityStream: PropTypes.func,
	startCamerasInRangeStream: PropTypes.func,
	startRulesStream: PropTypes.func,
	startTrackHistoryStream: PropTypes.func,
	unsubscribeFromFeed: PropTypes.func,
	removeSubscriber: PropTypes.func,
	unshareEntityToOrg: PropTypes.func,
	shareEntityToOrg: PropTypes.func,
	closeDialog: PropTypes.func,
	openDialog: PropTypes.func,
	linkEntities: PropTypes.func,
	unlinkEntities: PropTypes.func,
	createCollection: PropTypes.func,
	addCameraToDockMode: PropTypes.func,
	removeDockedCameraAndState: PropTypes.func,
	loadProfile: PropTypes.func,
	deleteShape: PropTypes.func,
	setCameraPriority: PropTypes.func,
	closeNotification: PropTypes.func,
	attachFilesToEntity: PropTypes.func,
	dir: PropTypes.string
};

const RobotProfile = ({
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startRulesStream,
	forReplay,
	startTrackHistoryStream,
	unsubscribeFromFeed,
	removeSubscriber,
	unshareEntityToOrg,
	shareEntityToOrg,
	closeDialog,
	openDialog,
	linkEntities,
	unlinkEntities,
	createCollection,
	addCameraToDockMode,
	removeDockedCameraAndState,
	loadProfile,
	deleteShape,
	setCameraPriority,
	ignoreEntity,
	appData,
	widgetsLaunchable,
	readOnly,
	endDate,
	closeNotification,
	attachFilesToEntity
}) => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user.profile);
	const context = useSelector(state => selectedContextSelector(state));
	const isLoaded = isObject(context) && context.entity;
	const dialog = useSelector(state => isLoaded && state.appState.dialog.openDialog);
	const dialogData = useSelector(state => isLoaded && state.appState.dialog.dialogData);
	const { activityFilters } = useSelector(state => persistedState(state));
	const mapStatus = useSelector(state => mapState(state));
	const trackHistDuration = useSelector(state => trackHistoryDuration(state));
	const orgID = isLoaded && user.orgId;
	const ownerOrg = isLoaded && context.entity.ownerOrg;
	const entityType = isLoaded && context.entity.entityType;
	const feedID = isLoaded && context.entity.feedId;
	const { displayProperties, marineTrafficVisible, profileIconTemplate } = useSelector(state => isLoaded && feedInfoSelector(feedID)(state));
	const widgetState = useSelector(state => isLoaded && widgetStateSelector(state));
	// Check which org created camera
	const fromOrg = isLoaded && ownerOrg === orgID;
	const fromEco = isLoaded && ownerOrg !== orgID;
	const entityCollections = useSelector(state => isLoaded && collectionsSelector(state));
	const feedDisplayProps = isLoaded ? displayProperties : null;
	const notifications = useSelector(state => isLoaded ? state.globalData.notifications : null);
	const sidebarOpen = useSelector(state => isLoaded ? state.appState.dock.dockData.isOpen : null);
	const dockedCameras = useSelector(state => isLoaded ? state.appState.dock.cameraDock.dockedCameras : null);
	const contextId = isLoaded && context.entity.id;
	const mapVisible = isLoaded && mapStatus.visible;
	const fullscreenCamera = useSelector(state => isLoaded && fullscreenCameraOpen(state));
	const appId = useSelector(state => state.appId);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));

	const [anchorEl, setAnchorEl] = useState(null);
	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [cameraStates, setCameraStates] = useState({});

	useEffect(() => {
		if (contextId) {
			if (!forReplay) {
				dispatch(startActivityStream(contextId, entityType, "profile"));
				dispatch(startAttachmentStream(contextId, "profile"));
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));

				// ***** TODO: Do we want to include the Rules widget in this profile?
				// startRulesStream(contextId, "profile");
			}

			// -- initialize camera states
			const newCameraStates = { ...cameraStates };
			const entity = context.entity;
			const robotCameras = entity.entityData.properties.cameras || [];
			robotCameras.forEach(robotCamera => {
				newCameraStates[robotCamera.id] = "off";
			});
			setCameraStates(newCameraStates);
		}
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "alerts",
				name: getTranslation("global.profiles.robotDogProfile.alerts")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.robotDogProfile.activities")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.robotDogProfile.files")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.robotDogProfile.cameras")
			},
			{
				enabled: true,
				id: "robotCameras",
				name: getTranslation("global.profiles.robotDogProfile.robotCams")
			},
			{
				enabled: true,
				id: "missionControl",
				name: getTranslation("global.profiles.robotDogProfile.missionControl")
			}
		];
	}, []);

	const handleScroll = useCallback(() => {
		$(".cb-profile-wrapper").on("resize scroll", () => {
			const elementTop = $(".summary-wrapper").offset().top;
			const elementBottom =
				elementTop + $(".summary-wrapper").outerHeight() + 120; // offset for app/navigation bar
			const viewportTop = $(".cb-profile-wrapper").scrollTop();
			const profileHeight = $(".cb-profile-wrapper").height();
			const viewportBottom = viewportTop + $(".cb-profile-wrapper").height();
			const widgetsHeight = $(".widgets-container").height();
			const scrollLength = viewportBottom - elementBottom;
			const pctScrolled = Math.floor(viewportTop / scrollLength * 100); // gets percentage scrolled 

			if (
				!scrolledUp && pctScrolled > 1 &&
				widgetsHeight > profileHeight - 66
			) {
				setScrolledUp(true);
			}
			else if (
				scrolledUp && pctScrolled < 2
			) {
				setScrolledUp(false);
			}
		});
	}, [scrolledUp]);

	useEffect(() => {
		handleScroll();

		return () => {
			$(".cb-profile-wrapper").off("resize scroll");
		};
	}, [handleScroll]);

	function toggleTrackHistory(id) {
		if (context.trackHistory) {
			dispatch(removeSubscriber(contextId, "trackHistory", "map"));
			dispatch(unsubscribeFromFeed(contextId, "trackHistory", "profile"));
		} else {
			dispatch(startTrackHistoryStream(context.entity, "profile", trackHistDuration, forReplay));
		}
	}

	const handleEditLayout = event => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEl(event.currentTarget);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const handleExpand = () => {
		setScrolledUp(false);
		$(".cb-profile-wrapper").scrollTop(0);
	};

	const handleShareClick = entity => {
		entity.isPublic
			? dispatch(unshareEntityToOrg(entity.id))
			: dispatch(shareEntityToOrg(entity.id));

		dispatch(closeDialog("shareEntityDialog"));
	};

	const getWidgetConfig = () => {
		const widgetConfig = widgetState
			? unionBy(widgetState, DEFAULT_WIDGET_CONFIG, "id")
			: DEFAULT_WIDGET_CONFIG;

		return widgetConfig;
	};

	const getWidgetStatus = widgetId => {
		const widgetConfig = getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	/**
	 * Check association before opening a dialog, throwing an error or failed association dialog if entity is associated
	 * @param {string} dialogId -- Id of dialog you'd like to open if association checks are passed
	 * @param {string} associationAction -- "delete" or "unshare"
	 */
	const openDialogWithAssociation = (dialogId, associationAction) => {
		associationService.checkAssociations(contextId, (err, response) => {
			if (err || response.error) {
				dispatch(openDialog("entity-profile-error", getTranslation("global.profiles.robotDogProfile.errorText")));
			} else if (response) {
				if (response.hasAssociations) {
					// Passing an action along so dialog knows what text to render
					dispatch(openDialog("shape-association", {
						...response,
						action: associationAction
					}));
				} else {
					dispatch(openDialog(dialogId));
				}
			}
		});
	};

	// ***** TODO: now that we updated how camera state is stored, we might be able to move this whole interaction (and camerasStates) to the RobotCamerasWidget component
	const toggleCameraState = (id, currentState) => {
		const entity = context.entity;
		const camera = entity.entityData.properties.cameras.find(robotCamera => robotCamera.id === id);
		if (camera) {
			// -- grab next state in series
			const newStateIndex = camera.states.indexOf(currentState) + 1;
			const newState = camera.states[newStateIndex < camera.states.length ? newStateIndex : 0];

			// -- update local camera state
			const newCameraStates = { ...cameraStates };
			if (newCameraStates[id]) {
				newCameraStates[id] = newState;
				setCameraStates(newCameraStates);
			}
		}
	};

	if (!context) {
		return <div />;
	}

	const { orgId } = user;
	const userId = user.id;
	const {
		attachments,
		rules,
		camerasInRange,
		activities
	} = context;
	const entity = context.entity;
	const { entityData, feedId } = entity;
	const { properties, geometry } = entityData;
	const { name, description, type, subtype, assignedMission } = properties;
	const cameras = properties.cameras || [];
	// const rulesAppPermission = user.applications.filter(application => {
	// 	return application.appId === "rules-app" && application.config.canView;
	// })[0];
	const imageAttachments = attachments
		? attachments.filter(attachment => {
			return /(jpg)|(png)|(jpeg)|(gif)|(svg)/.exec(attachment.mimeType);
		})
		: [];

	// Height of summary-info (consistent between scrolled and not scrolled state) + padding
	const scrollOffset = scrolledUp ? 167 : 0;
	// Dynamic offset for widget container when SummaryWidget is collapsed
	const widgetsContainerStyle = {
		top: scrollOffset
	};
	const widgets = getWidgetConfig();
	let actions = [];
	actions = [...actions,
	{
		name: getTranslation("global.profiles.robotDogProfile.trackHistory"),
		nameText: "Track History",
		// action: () => this.toggleTrackHistory(contextId)
		action: () => toggleTrackHistory(contextId)
	},
	{
		name: getTranslation("global.profiles.robotDogProfile.pinTo"),
		nameText: "Pin To",
		action: () => dispatch(openDialog("pinToDialog"))
	},
	{
		name: getTranslation("global.profiles.robotDogProfile.hide"),
		nameText: "Hide",
		action: () => {
			if (context.trackHistory && (!rules || rules.length === 0)) {
				// If track history is on, toggle it off before removing
				// this.toggleTrackHistory(contextId);
				toggleTrackHistory(contextId);
			}
			if (!rules || rules.length === 0) {
				setHiding(true);
				dispatch(ignoreEntity(contextId, entityType, feedId, appData));
			} else {
				openDialogWithAssociation(
					"shapeHideDialog",
					"hide"
				);
			}
		},
		debounce: hiding
	}
	];
	const hasAccessToFeed = user.integrations
		&& user.integrations.find(int => int.intId === entity.feedId)
		&& user.integrations.find(int => int.intId === entity.feedId).config
		&& user.integrations.find(int => int.intId === entity.feedId).config.canView;

	const robotCamerasWidgetCameras = camerasInRange ? camerasInRange.filter(camera => cameras.some(robotCamera => robotCamera.id === camera.id)) : [];
	const otherCameras = camerasInRange ? camerasInRange.filter(camera => robotCamerasWidgetCameras.every(robotCamera => robotCamera.id !== camera.id)) : [];

	return (
		<div
			className="cb-profile-wrapper"
			style={{ height: "100%", overflow: "scroll" }}
		>
			{!scrolledUp && <ImageViewer images={imageAttachments} dir={dir} />}
			<ErrorBoundary>
				<SummaryWidget
					id={contextId}
					user={user}
					context={context}
					name={name}
					type={subtype ? subtype : type}
					geometry={geometry}
					description={description}
					scrolledUp={scrolledUp}
					handleExpand={handleExpand}
					mapVisible={mapVisible}
					appId={appId}
					profileIconTemplate={profileIconTemplate}
					actions={actions}
					readOnly={readOnly}
					dir={dir}
				/>
			</ErrorBoundary>
			{!scrolledUp && (
				<div className="layout-control-button">
					<a className="cb-font-link" onClick={handleEditLayout}>
						<Translate value="global.profiles.robotDogProfile.editProfileLayout" />
					</a>
				</div>
			)}
			<div className="widgets-container" style={widgetsContainerStyle}>
				<ErrorBoundary>
					<LayoutControls
						key={`${contextId}-layout-controls`}
						open={layoutControlsOpen}
						anchor={anchorEl}
						close={handleCloseEditLayout}
						widgetOrder={widgets}
						profile="entity"
					/>
				</ErrorBoundary>
				{getWidgetStatus("cameras") && otherCameras && (
					<ErrorBoundary>
						<CamerasWidget
							key={`${contextId}-cameras`}
							cameras={otherCameras}
							canLink={!readOnly && user.integrations
								&& user.integrations.find(int => int.intId === entity.feedId)
								&& user.integrations.find(int => int.intId === entity.feedId).permissions
								&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")}
							entityType={entityType}
							geometry={geometry}
							order={getWidgetStatus("cameras").index}
							enabled={getWidgetStatus("cameras").enabled}
							loadProfile={loadProfile}
							sidebarOpen={sidebarOpen}
							entity={entity}
							linkEntities={linkEntities}
							unlinkCameras={unlinkEntities}
							dockedCameras={dockedCameras}
							addCameraToDockMode={addCameraToDockMode}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							dialog={dialog}
							openDialog={openDialog}
							closeDialog={closeDialog}
							setCameraPriority={setCameraPriority}
							fullscreenCamera={fullscreenCamera}
							readOnly={readOnly}
							disableSlew={readOnly}
							widgetsLaunchable={!readOnly && widgetsLaunchable}
							user={user}
							removeDockedCamera={removeDockedCameraAndState}
							dir={dir}
						/>
					</ErrorBoundary>
				)}
				{getWidgetStatus("missionControl") && feedDisplayProps && (
					<MissionControlWidget
						key={`${contextId}-mission-control`}
						order={getWidgetStatus("missionControl").index}
						enabled={getWidgetStatus("missionControl").enabled}
						details={properties}
						dir={dir}
					/>
				)}
				{getWidgetStatus("robotCameras") && robotCamerasWidgetCameras && robotCamerasWidgetCameras.length > 0 && (
					<RobotCamerasWidget
						key={`${contextId}-robot-cameras`}
						order={getWidgetStatus("robotCameras").index}
						enabled={getWidgetStatus("robotCameras").enabled}
						timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
						cameras={robotCamerasWidgetCameras}
						// robotCameras={robotCameras}
						robotCameras={cameras}
						robotCameraStates={cameraStates}
						canLink={!readOnly && user.integrations
							&& user.integrations.find(int => int.intId === entity.feedId)
							&& user.integrations.find(int => int.intId === entity.feedId).permissions
							&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")}
						entityType={entityType}
						// geometry={geometry}
						loadProfile={loadProfile}
						sidebarOpen={sidebarOpen}
						entity={entity}
						linkEntities={linkEntities}
						unlinkCameras={unlinkEntities}
						dockedCameras={dockedCameras}
						addCameraToDockMode={addCameraToDockMode}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef="profile"
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						setCameraPriority={setCameraPriority}
						fullscreenCamera={fullscreenCamera}
						readOnly={readOnly}
						widgetsLaunchable={!readOnly && widgetsLaunchable}
						user={user}
						removeDockedCamera={removeDockedCameraAndState}
						toggleCameraState={toggleCameraState}
						dir={dir}
					/>
				)}
				{getWidgetStatus("alerts") && notifications && (
					<ErrorBoundary>
						<AlertWidget
							key={`${contextId}-alerts`}
							order={getWidgetStatus("alerts").index}
							enabled={getWidgetStatus("alerts").enabled}
							contextId={contextId}
							loadProfile={loadProfile}
							notifications={notifications}
							closeNotification={closeNotification}
							dir={dir}
						/>
					</ErrorBoundary>
				)}
				{getWidgetStatus("activities") && (activities || forReplay) && (
					<ErrorBoundary>
						<Activities
							key={`${contextId}-activities`}
							entity={entity}
							order={getWidgetStatus("activities").index}
							enabled={getWidgetStatus("activities").enabled}
							pageSize={5}
							activities={activities}
							canManage={user.integrations
								&& user.integrations.find(int => int.intId === entity.feedId)
								&& user.integrations.find(int => int.intId === entity.feedId).config
								&& user.integrations.find(int => int.intId === entity.feedId).config.canView}
							activityFilters={activityFilters}
							unsubscribeFromFeed={unsubscribeFromFeed}
							contextId={contextId}
							userId={userId}
							subscriberRef="profile"
							openDialog={openDialog}
							closeDialog={closeDialog}
							dialog={dialog}
							readOnly={readOnly}
							forReplay={forReplay}
							endDate={endDate}
							timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
							dir={dir}
						/>
					</ErrorBoundary>
				)}
				{getWidgetStatus("files") && attachments && (
					<ErrorBoundary>
						<FileWidget
							key={`${contextId}-files`}
							order={getWidgetStatus("files").index}
							enabled={getWidgetStatus("files").enabled}
							attachments={attachments}
							canDelete={!readOnly && (entityType !== "track" ? user && user.integrations
								&& user.integrations.find(int => int.intId === entity.feedId)
								&& user.integrations.find(int => int.intId === entity.feedId).permissions
								&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage") :
								user && user.applications
								&& user.applications.find(app => app.appId === "map-app")
								&& user.applications.find(app => app.appId === "map-app").permissions
								&& user.applications.find(app => app.appId === "map-app").permissions.includes("manage"))}
							hasAccess={!readOnly && hasAccessToFeed}
							attachFiles={attachFilesToEntity}
							entityType={entityType}
							contextId={contextId}
							dialog={dialog}
							unsubscribeFromFeed={unsubscribeFromFeed}
							openDialog={openDialog}
							closeDialog={closeDialog}
							subscriberRef="profile"
							dir={dir}
						/>
					</ErrorBoundary>
				)}
				<PinToDialog
					open={dialog === "pinToDialog"}
					close={() => dispatch(closeDialog("pinToDialog"))}
					entity={entity}
					canManageEvents={user.applications &&
						user.applications.find(app => app.appId === "events-app") &&
						user.applications.find(app => app.appId === "events-app").permissions &&
						user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
					canPinToCollections={user.applications &&
						user.applications.find(app => app.appId === "map-app") &&
						user.applications.find(app => app.appId === "map-app").permissions &&
						user.applications.find(app => app.appId === "map-app").permissions.includes("manage")}
					addRemoveFromCollections={addRemoveFromCollections}
					addRemoveFromEvents={addRemoveFromEvents}
					createCollection={createCollection}
					dialog={dialog}
					openDialog={openDialog}
					closeDialog={closeDialog}
					userId={userId}
					dir={dir}
				/>
			</div>

			<EntityDelete
				open={dialog === "shapeDeleteDialog"}
				closeDialog={closeDialog}
				userId={userId}
				deleteShape={deleteShape}
				id={contextId}
				name={name}
			/>
			<EntityShare
				handleClick={() => handleShareClick(entity, orgId)}
				open={dialog === "shareEntityDialog"}
				handleClose={() => dispatch(closeDialog("shareEntityDialog"))}
				shared={entity.isPublic}
			/>
			<ShapeAssociation
				open={dialog === "shape-association"}
				closeDialog={closeDialog}
				dialogData={dialogData}
				dir={dir}
			/>
			<Dialog
				key="entity-profile-error"
				open={dialog === "entity-profile-error"}
				confirm={{
					label: getTranslation("global.profiles.robotDogProfile.ok"),
					action: () => {
						dispatch(closeDialog("entity-profile-error"));
					}
				}}
				textContent={dialogData}
				dir={dir}
			/>
		</div>
	);
};

RobotProfile.propTypes = propTypes;
export default RobotProfile;
