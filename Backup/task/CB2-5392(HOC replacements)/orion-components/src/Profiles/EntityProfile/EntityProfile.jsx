import React, { useEffect, useState } from "react";
import { withSpan, captureUserInteraction } from "../../Apm";
import {
	associationService
} from "client-app-core";

// components
import { Dialog } from "../../CBComponents";
import FileWidget from "../Widgets/File/FileWidget";
import RulesWidget from "../Widgets/Rules/RulesWidget";
import EntityDelete from "./components/EntityDelete";
import EntityShare from "./components/EntityShare";
import ShapeAssociation from "./components/ShapeAssociation";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import DetailsWidget from "../Widgets/Details/DetailsWidget"; // get action
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import AlertWidget from "../Widgets/Alert/AlertWidget";
import PinToDialog from "../../SharedComponents/PinToDialog";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ImageViewer from "../../SharedComponents/ImageViewer";
import MarineTrafficParticularsWidget from "../Widgets/MarineTrafficParticulars/MarineTrafficParticularsWidget";
import Activities from "../Widgets/Activities/Activities";
import { integrationService } from "client-app-core";

// error boundary
import ErrorBoundary from "../../ErrorBoundary";

// utility
import $ from "jquery";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";

import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { collectionsSelector, feedInfoSelector } from "orion-components/GlobalData/Selectors";
import { mapState, widgetStateSelector, persistedState, trackHistoryDuration, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { }
};

let DEFAULT_WIDGET_CONFIG = [];

const EntityProfile = ({
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startRulesStream,
	forReplay,
	startTrackHistoryStream,
	unsubscribeFromFeed,
	removeSubscriber,
	hideInfo,
	updateViewingHistory,
	unshareEntityToOrg,
	shareEntityToOrg,
	closeDialog,
	openDialog,
	setWidgetOrder,
	linkEntities,
	unlinkEntities,
	addRemoveFromCollections,
	addRemoveFromEvents,
	createCollection,
	addCameraToDockMode,
	removeDockedCameraAndState,
	loadProfile,
	setMapTools,
	deleteShape,
	updateActivityFilters,
	setCameraPriority,
	ignoreEntity,
	appData,
	widgetsLaunchable,
	readOnly,
	endDate,
	replayEntity,
	selectFloorPlanOn,
	floorPlansWithFacFeed,
	closeNotification,
	attachFilesToEntity,
	mapstatus
}) => {
	const dispatch = useDispatch();

	const session = useSelector(state => state.session);
	const appState = useSelector(state => state.appState);
	const globalData = useSelector(state => state.globalData);
	const mapstate = useSelector(state => state.mapState);
	const mapStatus = useSelector(state => mapState(state));
	const user = session.user.profile;
	const context = useSelector(state => selectedContextSelector(state));
	const entity = context.entity;
	const isLoaded = _.isObject(context) && entity;
	const dialog = isLoaded && appState.dialog.openDialog;
	const dialogData = isLoaded && appState.dialog.dialogData;
	const activityFilters = useSelector(state => isLoaded && persistedState(state).activityFilters);
	const trackHistDuration = useSelector(state => isLoaded && trackHistoryDuration(state));
	const { orgId } = user;
	const ownerOrg = isLoaded && entity.ownerOrg;
	const entityType = isLoaded && entity.entityType;
	const feedId = isLoaded && entity.feedId;
	const { displayProperties } = useSelector(state => isLoaded && feedInfoSelector(feedId)(state));
	const profileIconTemplate = useSelector(state => isLoaded && feedInfoSelector(feedId)(state).profileIconTemplate);
	const marineTrafficVisible = useSelector(state => isLoaded && feedInfoSelector(feedId)(state).marineTrafficVisible);
	const widgetState = useSelector(state => isLoaded && widgetStateSelector(state));
	// Check which org created camera
	const fromOrg = isLoaded && ownerOrg === orgId;
	const fromEco = isLoaded && ownerOrg !== orgId;
	const entityCollections = useSelector(state => isLoaded && collectionsSelector(state));
	const feedDisplayProps = isLoaded && displayProperties;
	const notifications = isLoaded && globalData.notifications;
	const sidebarOpen = isLoaded && appState.dock.dockData.isOpen;
	const dockedCameras = isLoaded && appState.dock.cameraDock.dockedCameras;
	const contextId = isLoaded && entity.id;
	const mapVisible = mapstatus ? mapStatus.visible : isLoaded && mapstate.baseMap.visible;
	const fullscreenCamera = useSelector(state => isLoaded && fullscreenCameraOpen(state));
	const appId = useSelector(state => isLoaded && state.appId);
	const timeFormatPreference = useSelector(state => isLoaded && state.appState.global.timeFormat);
	const dir = useSelector(state => isLoaded && getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	const floorPlansWithFacilityFeed = useSelector(state => floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null);

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [zetronPhoneVisible, setZetronPhoneVisible] = useState(false);
	const [anchorEl, setAnchorEL] = useState(null);
	const [mounted, setMounted] = useState(false);

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "alerts",
				name: getTranslation("global.profiles.entityProfile.main.alerts")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.entityProfile.main.activities")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.entityProfile.main.files")
			},
			{
				enabled: true,
				id: "details",
				name: getTranslation("global.profiles.entityProfile.main.details")
			},
			{
				enabled: true,
				id: "rules",
				name: getTranslation("global.profiles.entityProfile.main.rules")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.entityProfile.main.cameras")
			},
			{
				enabled: false,
				id: "marineTrafficParticulars",
				name: getTranslation("global.profiles.entityProfile.main.marineTraffic")
			}
		];
		setMounted(true);
	}

	useEffect(() => {
		const serviceCallBackExternalSystem = (err, response) => {
			if (err) {
				if (!zetronPhoneVisible) {
					setZetronPhoneVisible(false);
				}
			} else {
				if (response.clientInstalled) {
					setZetronPhoneVisible(true);
				}
			}
		};

		if (contextId) {
			if (!forReplay) {
				dispatch(startActivityStream(contextId, entityType, "profile"));
				dispatch(startAttachmentStream(contextId, "profile"));
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));
				dispatch(startRulesStream(contextId, "profile"));

				const { entityData, feedId } = context.entity;

				if ((entityType === "track" && feedId === "zetron") && entityData && entityData.properties
					&& entityData.properties.subtype && entityData.properties.subtype.toLowerCase() === "zetron") {

					/* Note:
						Suppose to get externalSystems [] from redux state (e.g. state.session.organization.externalSystems)
						but different apps profileContainer needs to be modified in order to pass it as props.
						therefore here fetching directly to avoid modifying multiple apps profile container.
					*/

					integrationService.getExternalSystem("zetron", (errExt, responseExt) => {
						if (errExt) {
							console.log("An error has occurred to check external system is available to user.");
						} else {
							if (responseExt && responseExt.externalSystemId) {
								integrationService.getExternalSystemLookup("zetron", "serviceAvailableToUser", serviceCallBackExternalSystem);
							}
						}
					});
				}

			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}
		setMounted(true);
	}, []);


	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);


	const handleInitiateRadioCall = (radioUnitId) => {
		const dataToPost = { radioUnitId: radioUnitId };

		if (radioUnitId) {
			//post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callRadio
			integrationService.postExternalSystemResource("zetron", "callRadio", dataToPost, function (err, response) {
				//Note : At present we just fire and forget and incase of error display standard error message in console.
				if (err) {
					console.log("An error has occurred sending command to zetron interface.");
				}
			});
		}
	};


	const handleScroll = () => {
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
	};

	const toggleTrackHistory = (id) => {
		if (context.trackHistory) {
			captureUserInteraction("EntityProfile Track History On");
			dispatch(removeSubscriber(contextId, "trackHistory", "map"));
			dispatch(unsubscribeFromFeed(contextId, "trackHistory", "profile"));
		} else {
			dispatch(startTrackHistoryStream(id, "profile", trackHistDuration, forReplay));
		}
	};

	//this function is not called anywhere
	//const handleCloseEntityProfile = () => {
	//	hideInfo();
	//	updateViewingHistory([]);
	//};

	const handleEditLayout = event => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEL(event.currentTarget);
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
		const { entityType } = context.entity;
		let widgetConfig = widgetState
			? _.unionBy(widgetState, DEFAULT_WIDGET_CONFIG, "id")
			: DEFAULT_WIDGET_CONFIG;

		// -- remove details from shapes
		widgetConfig = entityType === "shapes"
			? widgetConfig.filter(widget => widget.id !== "details")
			: widgetConfig;

		// -- remove marine traffic from irrelevant feeds
		widgetConfig = !marineTrafficVisible
			? widgetConfig.filter(widget => widget.id !== "marineTrafficParticulars")
			: widgetConfig;

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
				dispatch(openDialog("entity-profile-error", getTranslation("global.profiles.entityProfile.main.problemOccured")));
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

	if (context) {
		const { orgId } = user;
		const userId = user.id;
		const {
			attachments,
			rules,
			camerasInRange,
			activities
		} = context;
		const entity = forReplay && replayEntity ? replayEntity : context.entity;
		const { entityType, entityData, feedId } = entity;
		const { properties, geometry } = entityData;
		const { name, description, type, subtype } = properties;
		const rulesAppPermission = user.applications.filter(application => {
			return application.appId === "rules-app" && application.config.canView;
		})[0];
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
		const isMarker = context && entityType === "shapes" && type === "Point";
		const widgets = getWidgetConfig();
		let actions = [];

		if (zetronPhoneVisible) {
			actions = [...actions,
			{
				name: getTranslation("global.profiles.entityProfile.main.tetraRadioCall"),
				nameText: "Zetron Call",
				action: () => handleInitiateRadioCall(properties.radioUnitId)
			}];
		}

		actions = [...actions,
		{
			name: getTranslation("global.profiles.entityProfile.main.trackHistory"),
			nameText: "Track History",
			action: () => toggleTrackHistory(contextId)
		},
		{
			name: getTranslation("global.profiles.entityProfile.main.pinTo"),
			nameText: "Pin To",
			action: () => dispatch(openDialog("pinToDialog"))
		}];
		if (user.integrations
			&& user.integrations.find(int => int.intId === entity.feedId)
			&& user.integrations.find(int => int.intId === entity.feedId).permissions
			&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")) {
			actions = [...actions,
			{
				name: getTranslation("global.profiles.entityProfile.main.edit"),
				nameText: "Edit",
				action: () => dispatch(setMapTools({ type: "drawing", mode: geometry.type === "Point" ? "simple_select" : "direct_select", feature: { id: contextId, ...entity.entityData } }))
			},
			{
				name: getTranslation("global.profiles.entityProfile.main.delete"),
				nameText: "Delete",
				action: () =>
					openDialogWithAssociation(
						"shapeDeleteDialog",
						"delete"
					)
			}
			];
		}
		actions = [...actions,
		{
			name: getTranslation("global.profiles.entityProfile.main.hide"),
			nameText: "Hide",
			action: () => {
				if (context.trackHistory && rules.length === 0) {
					// If track history is on, toggle it off before removing
					toggleTrackHistory(contextId);
				}
				if (rules.length === 0) {
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
		return (
			<div
				className="cb-profile-wrapper"
				style={{ height: "100%", overflow: "scroll" }}
			>
				{!scrolledUp && <ImageViewer images={imageAttachments} dir={dir} />}
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						user={zetronPhoneVisible ? { ...user, zetronSystemAvailable: true } : user}
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
							<Translate value="global.profiles.entityProfile.main.editLayout" />
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
							setWidgetOrder={setWidgetOrder}
						/>
					</ErrorBoundary>
					{getWidgetStatus("details") && feedDisplayProps && (
						<DetailsWidget
							key={`${contextId}-details`}
							order={getWidgetStatus("details").index}
							enabled={getWidgetStatus("details").enabled}
							details={properties}
							displayProps={feedDisplayProps}
							timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
							dir={dir}
						/>
					)}
					{getWidgetStatus("marineTrafficParticulars") && (
						<ErrorBoundary>
							<MarineTrafficParticularsWidget
								entity={entity}
								order={getWidgetStatus("marineTrafficParticulars").index}
								enabled={getWidgetStatus("marineTrafficParticulars").enabled}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("cameras") && (
						<ErrorBoundary>
							<CamerasWidget
								key={`${contextId}-cameras`}
								cameras={camerasInRange}
								canLink={!readOnly && user.integrations
									&& user.integrations.find(int => int.intId === entity.feedId)
									&& user.integrations.find(int => int.intId === entity.feedId).permissions
									&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")}
								entityType={entityType}
								geometry={geometry}
								selectFloorPlanOn={selectFloorPlanOn}
								floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
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
					{getWidgetStatus("activities") && (
						<ErrorBoundary>
							<Activities
								locale={locale}
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
								updateActivityFilters={updateActivityFilters}
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
					{getWidgetStatus("files") && (
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
					{getWidgetStatus("rules") && rulesAppPermission && !isMarker && (
						<ErrorBoundary>
							<RulesWidget
								key={`${contextId}-rules`}
								order={getWidgetStatus("rules").index}
								enabled={getWidgetStatus("rules").enabled}
								canManage={
									!readOnly && user.applications
									&& user.applications.find(app => app.appId === "rules-app")
									&& user.applications.find(app => app.appId === "rules-app").permissions
									&& user.applications.find(app => app.appId === "rules-app").permissions.includes("manage")
								}
								canViewRules={
									!readOnly && user.applications
									&& user.applications.find(app => app.appId === "rules-app")
									&& user.applications.find(app => app.appId === "rules-app").config
									&& user.applications.find(app => app.appId === "rules-app").config.canView
								}
								contextId={contextId}
								context={context}
								entityType={entityType}
								rules={rules}
								collections={entityCollections}
								userId={userId}
								hasLinks={true}
								orgId={orgId}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef="profile"
								loadProfile={loadProfile}
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
						label: getTranslation("global.profiles.entityProfile.main.ok"),
						action: () => {
							dispatch(closeDialog("entity-profile-error"));
						}
					}}
					textContent={dialogData}
					dir={dir}
				/>
			</div>
		);
	} else {
		return <div />;
	}

};

// span instead of transaction
EntityProfile.propTypes = propTypes;
EntityProfile.defaultProps = defaultProps;
export default withSpan("entity-profile", "profile")(EntityProfile);
