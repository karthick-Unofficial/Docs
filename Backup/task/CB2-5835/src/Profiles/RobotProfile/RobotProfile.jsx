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
import { feedInfoSelector } from "orion-components/GlobalData/Selectors";
import { widgetStateSelector, trackHistoryDuration, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import unionBy from "lodash/unionBy";

//actions
import { addRemoveFromCollections, addRemoveFromEvents } from "orion-components/SharedActions/cameraProfileActions";
import { createCollection } from "orion-components/SharedActions/commonActions";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";
import { deleteShape } from "orion-components/Map/Tools/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	unsubscribeFromFeed,
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startTrackHistoryStream,
	removeSubscriber
} from "orion-components/ContextualData/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import { shareEntityToOrg, unshareEntityToOrg } from "orion-components/SharedActions/entityProfileActions";
import { defaultRobotProfileWidgets } from "orion-components/Profiles/Utils/RobotProfileWidgets";
import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";
import { getGlobalWidgetState } from "../Widgets/Selectors";

const DEFAULT_WIDGET_CONFIG = defaultRobotProfileWidgets;

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
	dialogData: PropTypes.object,
	user: PropTypes.object,
	fullscreenCamera: PropTypes.bool,
	appId: PropTypes.string,
	profileIconTemplate: PropTypes.string,
	readOnly: PropTypes.bool,
	endDate: PropTypes.object,
	appData: PropTypes.func,
	dir: PropTypes.string
};

const RobotProfile = ({ forReplay, appData, readOnly, endDate }) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user.profile);
	const context = useSelector((state) => selectedContextSelector(state));
	const entity = context.entity;
	const dialog = useSelector((state) => entity && state.appState?.dialog?.openDialog);
	const dialogData = useSelector((state) => entity && state.appState.dialog.dialogData);
	const trackHistDuration = useSelector((state) => trackHistoryDuration(state));
	const entityType = entity?.entityType;
	const feedID = entity?.feedId;
	const displayProperties = useSelector((state) => entity && feedInfoSelector(feedID)(state)?.displayProperties);
	const profileIconTemplate = useSelector((state) => entity && feedInfoSelector(feedID)(state)?.profileIconTemplate);
	const widgetState = useSelector((state) => entity && widgetStateSelector(state));
	const feedDisplayProps = entity ? displayProperties : null;
	const notifications = useSelector((state) => (entity ? state.globalData.notifications : null));
	const contextId = entity?.id;
	const fullscreenCamera = useSelector((state) => entity && fullscreenCameraOpen(state));
	const dir = useSelector((state) => getDir(state));
	const canAccess =
		!readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "config"));
	const canControl = useSelector((state) =>
		checkPermissionBasedOnFeedId(state)(entity?.feedId, "permissions", "control")
	);
	const canManage = useSelector((state) =>
		checkPermissionBasedOnFeedId(state)(entity?.feedId, "permissions", "manage")
	);
	const canDeleteFiles =
		!readOnly &&
		useSelector((state) =>
			entityType !== "track" ? canManage : canManageByApplication(state)("map-app", "manage")
		);
	const canManageEvents = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canPinToCollections = useSelector((state) => canManageByApplication(state)("map-app", "manage"));
	const layoutWidgetState = useSelector((state) => getGlobalWidgetState(state)("layoutControls")) || {};

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(layoutWidgetState?.autoExpand);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [cameraStates, setCameraStates] = useState({});

	useEffect(() => {
		if (contextId) {
			if (!forReplay) {
				if (getWidgetStatus("activities")) dispatch(startActivityStream(contextId, entityType, "profile"));
				if (getWidgetStatus("files")) dispatch(startAttachmentStream(contextId, "profile"));
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));

				// ***** TODO: Do we want to include the Rules widget in this profile?
				// startRulesStream(contextId, "profile");
			}

			// -- initialize camera states
			const newCameraStates = { ...cameraStates };
			const entity = context.entity;
			const robotCameras = entity.entityData.properties.cameras || [];
			robotCameras.forEach((robotCamera) => {
				newCameraStates[robotCamera.id] = "off";
			});
			setCameraStates(newCameraStates);
		}
	}, []);

	const handleScroll = useCallback(() => {
		$(".cb-profile-wrapper").on("resize scroll", () => {
			const elementTop = $(".summary-wrapper").offset().top;
			const elementBottom = elementTop + $(".summary-wrapper").outerHeight() + 120; // offset for app/navigation bar
			const viewportTop = $(".cb-profile-wrapper").scrollTop();
			const profileHeight = $(".cb-profile-wrapper").height();
			const viewportBottom = viewportTop + $(".cb-profile-wrapper").height();
			const widgetsHeight = $(".widgets-container").height();
			const scrollLength = viewportBottom - elementBottom;
			const pctScrolled = Math.floor((viewportTop / scrollLength) * 100); // gets percentage scrolled

			if (!scrolledUp && pctScrolled > 1 && widgetsHeight > profileHeight - 66) {
				setScrolledUp(true);
			} else if (scrolledUp && pctScrolled < 2) {
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

	function toggleTrackHistory() {
		if (context.trackHistory) {
			dispatch(removeSubscriber(contextId, "trackHistory", "map"));
			dispatch(unsubscribeFromFeed(contextId, "trackHistory", "profile"));
		} else {
			dispatch(startTrackHistoryStream(context.entity, "profile", trackHistDuration, forReplay));
		}
	}

	const handleEditLayout = (event) => {
		event.preventDefault();
		setLayoutControlsOpen(true);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const handleExpand = () => {
		setScrolledUp(false);
		$(".cb-profile-wrapper").scrollTop(0);
	};

	const handleShareClick = (entity) => {
		entity.isPublic ? dispatch(unshareEntityToOrg(entity.id)) : dispatch(shareEntityToOrg(entity.id));

		dispatch(closeDialog("shareEntityDialog"));
	};

	const getWidgetConfig = () => {
		const widgetConfig = widgetState ? unionBy(widgetState, DEFAULT_WIDGET_CONFIG, "id") : DEFAULT_WIDGET_CONFIG;

		return widgetConfig;
	};

	const getWidgetStatus = (widgetId) => {
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
				dispatch(
					openDialog("entity-profile-error", getTranslation("global.profiles.robotDogProfile.errorText"))
				);
			} else if (response) {
				if (response.hasAssociations) {
					// Passing an action along so dialog knows what text to render
					dispatch(
						openDialog("shape-association", {
							...response,
							action: associationAction
						})
					);
				} else {
					dispatch(openDialog(dialogId));
				}
			}
		});
	};

	// ***** TODO: now that we updated how camera state is stored, we might be able to move this whole interaction (and camerasStates) to the RobotCamerasWidget component
	const toggleCameraState = (id, currentState) => {
		const entity = context.entity;
		const camera = entity.entityData.properties.cameras.find((robotCamera) => robotCamera.id === id);
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
	const { attachments, rules, camerasInRange } = context;
	const { entityData, feedId } = entity;
	const { properties, geometry } = entityData;
	const { name, description, type, subtype } = properties;
	const cameras = properties.cameras || [];
	// const rulesAppPermission = user.applications.filter(application => {
	// 	return application.appId === "rules-app" && application.config.canView;
	// })[0];
	const imageAttachments = attachments
		? attachments.filter((attachment) => {
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
	actions = [
		...actions,
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
					openDialogWithAssociation("shapeHideDialog", "hide");
				}
			},
			debounce: hiding
		}
	];

	const robotCamerasWidgetCameras = camerasInRange
		? camerasInRange.filter((camera) => cameras.some((robotCamera) => robotCamera.id === camera.id))
		: [];
	const otherCameras = camerasInRange
		? camerasInRange.filter((camera) =>
			robotCamerasWidgetCameras.every((robotCamera) => robotCamera.id !== camera.id)
		)
		: [];

	const renderWidgets = (widgetName) => {
		switch (widgetName) {
			case "cameras":
				return (
					otherCameras && (
						<CamerasWidget
							id={widgetName}
							key={`${contextId}-cameras`}
							otherCameras={otherCameras}
							canLink={!readOnly && canManage}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							fullscreenCamera={fullscreenCamera}
							readOnly={readOnly}
							disableSlew={readOnly}
							isRobotProfile={true}
						/>
					)
				);
			case "missionControl":
				return (
					<MissionControlWidget id={widgetName} key={`${contextId}-mission-control`} details={properties} />
				);
			case "robotCameras":
				return (
					<RobotCamerasWidget
						id={widgetName}
						key={`${contextId}-robot-cameras`}
						cameras={robotCamerasWidgetCameras}
						// robotCameras={robotCameras}
						robotCameras={cameras}
						robotCameraStates={cameraStates}
						canLink={!readOnly && canControl}
						entityType={entityType}
						// geometry={geometry}
						entity={entity}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef="profile"
						setCameraPriority={setCameraPriority}
						fullscreenCamera={fullscreenCamera}
						readOnly={readOnly}
						toggleCameraState={toggleCameraState}
					/>
				);
			case "alerts":
				return <AlertWidget id={widgetName} key={`${contextId}-alerts`} contextId={contextId} />;
			case "activities":
				return (
					<Activities
						id={widgetName}
						key={`${contextId}-activities`}
						pageSize={5}
						canManage={canAccess}
						unsubscribeFromFeed={unsubscribeFromFeed}
						contextId={contextId}
						subscriberRef="profile"
						readOnly={readOnly}
						forReplay={forReplay}
						endDate={endDate}
					/>
				);
			case "files":
				return (
					<FileWidget
						id={widgetName}
						key={`${contextId}-files`}
						canDelete={canDeleteFiles}
						hasAccess={canAccess}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef="profile"
					/>
				);
		}
	};
	const widgetRenderFilters = {
		missionControl: !feedDisplayProps,
		robotCameras: !(robotCamerasWidgetCameras && robotCamerasWidgetCameras.length > 0),
		alerts: !notifications,
		activities: !(context?.activities || forReplay),
		files: !attachments
	};

	return (
		<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
			<div style={{ display: layoutControlsOpen ? "block" : "none" }}>
				<ErrorBoundary>
					<LayoutControls
						close={handleCloseEditLayout}
						widgetOrder={widgetState?.length > 0 ? widgetState : widgets}
						profile="robot"
						widgetState={layoutWidgetState}
					/>
				</ErrorBoundary>
			</div>
			<div style={{ display: layoutControlsOpen ? "none" : "block" }}>
				{!scrolledUp && <ImageViewer images={imageAttachments} dir={dir} />}
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						context={context}
						name={name}
						type={subtype ? subtype : type}
						geometry={geometry}
						description={description}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						profileIconTemplate={profileIconTemplate}
						actions={actions}
						readOnly={readOnly}
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
					{(widgetState?.length > 0 ? widgetState : widgets)
						.filter((element) => getWidgetStatus(element.id, widgetState))
						.map((element) => {
							const { id, enabled } = element;

							if (widgetRenderFilters[id]) {
								return false;
							}
							if (!enabled) {
								return false;
							}
							return <ErrorBoundary key={id}>{renderWidgets(id)}</ErrorBoundary>;
						})}
					<PinToDialog
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={entity}
						canManageEvents={canManageEvents}
						canPinToCollections={canPinToCollections}
						addRemoveFromCollections={addRemoveFromCollections}
						addRemoveFromEvents={addRemoveFromEvents}
						createCollection={createCollection}
						openDialog={openDialog}
						closeDialog={closeDialog}
						dir={dir}
					/>
				</div>

				<EntityDelete
					closeDialog={closeDialog}
					userId={userId}
					deleteShape={deleteShape}
					id={contextId}
					name={name}
				/>
				<EntityShare
					handleClick={() => handleShareClick(entity, orgId)}
					handleClose={() => dispatch(closeDialog("shareEntityDialog"))}
					shared={entity.isPublic}
				/>
				<ShapeAssociation closeDialog={closeDialog} dialogData={dialogData} dir={dir} />
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
		</div>
	);
};

RobotProfile.propTypes = propTypes;
export default RobotProfile;
