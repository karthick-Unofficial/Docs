import React, { useEffect, useState } from "react";
import ErrorBoundary from "../../ErrorBoundary";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n";
import { facilityService } from "client-app-core";
import $ from "jquery";
import PinToDialog from "../../SharedComponents/PinToDialog";
import AccessPointEditDialog from "./components/AccessPointEditDialog";
import FileWidget from "../Widgets/File/FileWidget";
import Activities from "../Widgets/Activities/Activities";
import LinkedItemsWidget from "../Widgets/LinkedItems/LinkedItemsWidget";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import AccessControlWidget from "../Widgets/AccessControl/AccessControlWidget";
import { useSelector, useDispatch } from "react-redux";
import { mapState, persistedState, widgetStateSelector, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { contextPanelState, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import isObject from "lodash/isObject";
import unionBy from "lodash/unionBy";

const propTypes = {
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { }
};

let DEFAULT_WIDGET_CONFIG = [];

const AccessPointProfile = ({
	startActivityStream,
	startAttachmentStream,
	startCamerasInRangeStream,
	readOnly,
	openDialog,
	setWidgetOrder,
	facilityOption,
	ignoreEntity,
	appData,
	closeDialog,
	addRemoveFromCollections,
	addRemoveFromEvents,
	createCollection,
	updateAccesspoint,
	view,
	selectWidget,
	attachFilesToAccessPoint,
	widgetsLaunchable,
	unsubscribeFromFeed,
	widgetsExpandable,
	forReplay,
	updateActivityFilters,
	endDate,
	disableLinkedItems,
	linkEntities,
	unlinkEntities,
	disabledLinkedItemTypes,
	loadProfile,
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState,
	floorPlansWithFacFeed,
	selectFloorPlanOn
}) => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user.profile);
	const context = useSelector(state => selectedContextSelector(state));
	const { entity } = context;
	const isLoaded = isObject(context) && entity;
	const activityFilters = useSelector(state => isLoaded && persistedState(state).activityFilters);
	const dialog = useSelector(state => isLoaded && state.appState.dialog.openDialog);
	const mapStatus = useSelector(state => mapState(state));
	const locale = useSelector(state => isLoaded && state.i18n.locale);
	const { orgId } = user;
	const ownerOrg = isLoaded && entity.ownerOrg;
	const entityType = isLoaded && entity.entityType;
	const contextId = isLoaded && entity.id;
	const widgetState = useSelector(state => isLoaded && widgetStateSelector(state));
	// Check if camera is the primary context
	const isPrimary = useSelector(state => isLoaded && contextId === contextPanelState(state).selectedContext.primary);
	const fromOrg = isLoaded && ownerOrg === orgId;
	const fromEco = isLoaded && ownerOrg !== orgId;
	const feeds = useSelector(state => isLoaded && userFeedsSelector(state));
	const cameraPriority = useSelector(state => isLoaded && state.appState.dock.cameraDock.cameraPriority);
	const sidebarOpen = useSelector(state => isLoaded && state.appState.dock.dockData.isOpen);
	const dockedCameras = useSelector(state => isLoaded && state.appState.dock.cameraDock.dockedCameras);
	const fullscreenCamera = useSelector(state => isLoaded && fullscreenCameraOpen(state));
	const appId = useSelector(state => isLoaded && state.appId);
	const dir = useSelector(state => isLoaded && getDir(state));
	const accessPoint = isLoaded && entity;
	const mapVisible = isLoaded && mapStatus.visible;
	const timeFormatPreference = useSelector(state => isLoaded && state.appState.global.timeFormat);

	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [facilityHidden, setFacilityHidden] = useState(true);
	const [mounted, setMounted] = useState(false);
	const floorPlansWithFacilityFeed = useSelector(state => floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null);
	const canManageAccessPoint = user.integrations
		&& user.integrations.find(int => int.intId === accessPoint.feedId)
		&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
		&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage");
	const canControlAccessPoint = !readOnly && user.integrations
		&& user.integrations.find(int => int.intId === accessPoint.feedId)
		&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
		&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("control");


	useEffect(() => {
		if (!forReplay) {
			dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));

			if (getWidgetStatus("activities"))
				dispatch(startActivityStream(contextId, "accessPoint", "profile"));
			if (getWidgetStatus("files"))
				dispatch(startAttachmentStream(contextId, "profile"));
			if (accessPoint && accessPoint.entityData.displayTargetId && accessPoint.entityData.displayType && accessPoint.entityData.displayType.toLowerCase() === "facility") {
				facilityService.getFloorPlan(accessPoint.entityData.displayTargetId, (err, res) => {
					if (err) {
						setFacilityHidden(true);
					} else if (res.success) {
						setFacilityHidden(false);
					}
				});
			}
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}
		setMounted(true);
	}, []);

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "access_control",
				name: getTranslation("global.profiles.accessPointProfile.accessControlWidget.title")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.accessPointProfile.files")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.accessPointProfile.activities")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.accessPointProfile.cameras")
			}
		];
		setMounted(true);
	}

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	const getWidgetStatus = widgetId => {
		const widgetConfig = getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
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


	const handleExpand = () => {
		setScrolledUp(false);
		$
			(".cb-profile-wrapper").scrollTop(0);
	};


	const getWidgetConfig = () => {
		const defaultTypes = ["files", "activities", "linked_items", "cameras"];
		if (canControlAccessPoint) {
			defaultTypes.unshift("access_control");
		}
		if (widgetsExpandable) defaultTypes.push("map");

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter(widget =>
			defaultTypes.includes(widget.id)
		);

		const filteredState = widgetState ? widgetState.filter(widget =>
			defaultTypes.includes(widget.id)
		) : [];

		const widgetConfig = widgetState
			? unionBy(filteredState, filteredDefault, "id")
			: filteredDefault;
		return widgetConfig;
	};


	const handleEditLayout = event => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEl(event.currentTarget);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const showFloorPlanOnTargetClick = () => {
		const { entityData } = accessPoint;
		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
			}
		}
	};

	if (context) {
		const { entityType, entityData, feedId } = accessPoint;
		const { properties, geometry } = entityData;
		const { name, description, type, subtype } = properties;
		const { attachments, activities, camerasInRange } = context;
		const userId = user.id;
		// Height of summary-info (consistent between scrolled and not scrolled state) + padding
		const scrollOffset = scrolledUp ? 167 : 0;
		// Dynamic offset for widget container when SummaryWidget is collapsed
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig();

		let actions = [];
		if (entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId && facilityOption && !facilityHidden) {
			actions.push({
				name: getTranslation("global.profiles.accessPointProfile.facility"),
				nameText: "Facility",
				action: () => window.location.replace(`/facilities-app/#/?${entityData.displayTargetId}`)
			});
		}
		actions = [
			...actions,
			{
				name: getTranslation("global.profiles.accessPointProfile.pinTo"),
				nameText: "Pin To",
				action: () => dispatch(openDialog("pinToDialog"))
			}];


		// can we edit a access point?
		if (canManageAccessPoint) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.accessPointProfile.edit"),
					nameText: "Edit",
					action: () => dispatch(openDialog("accessPointEditDialog"))
				}];
		}
		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						readOnly={readOnly}
						user={user}
						context={context}
						name={name}
						type="accessPoint"
						geometry={entityData.displayTargetId ? true : geometry}
						description={description}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						mapVisible={mapVisible}
						appId={appId}
						selectFloor={showFloorPlanOnTargetClick}
						actions={[
							...actions,
							{
								name: getTranslation("global.profiles.accessPointProfile.hide"),
								nameText: "Hide",
								action: () => {
									setHiding(true);
									dispatch(ignoreEntity(contextId, entityType, feedId, appData));
								},
								debounce: hiding
							}
						]}
						dir={dir}
						displayType={type === "Radar" ? type : "Access Point"}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.accessPointProfile.editProfileLayout" />
						</a>
					</div>
				)}
				<div className="widgets-container" style={widgetsContainerStyle}>
					<ErrorBoundary>
						<LayoutControls
							open={layoutControlsOpen}
							anchor={anchorEl}
							close={handleCloseEditLayout}
							widgetOrder={widgets}
							profile="accessPoint"
							setWidgetOrder={setWidgetOrder}
						/>
					</ErrorBoundary>
					{getWidgetStatus("access_control") && canControlAccessPoint && (
						<ErrorBoundary>
							<AccessControlWidget
								readOnly={readOnly}
								key={`${contextId}-access_control`}
								order={getWidgetStatus("access_control").index}
								enabled={getWidgetStatus("access_control").enabled}
								accessPoint={accessPoint}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("files") && context.attachments && (
						<ErrorBoundary>
							<FileWidget
								key={`${contextId}-files`}
								order={getWidgetStatus("files").index}
								enabled={getWidgetStatus("files").enabled}
								canDelete={
									!readOnly && user && user.integrations
									&& user.integrations.find(int => int.intId === accessPoint.feedId)
									&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
									&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage")
								}
								hasAccess={!readOnly
									&& user
									&& user.integrations
									&& user.integrations.find(int => int.intId === accessPoint.feedId)
									&& user.integrations.find(int => int.intId === accessPoint.feedId).config
									&& user.integrations.find(int => int.intId === accessPoint.feedId).config.canView}
								attachments={attachments}
								selected={view === "Files"}
								selectWidget={selectWidget}
								attachFiles={attachFilesToAccessPoint}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable}
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
					{getWidgetStatus("activities") && (activities || forReplay) && (
						<ErrorBoundary>
							<Activities
								locale={locale}
								key={`${contextId}-activities`}
								entity={accessPoint}
								canManage={user.integrations
									&& user.integrations.find(int => int.intId === accessPoint.feedId)
									&& user.integrations.find(int => int.intId === accessPoint.feedId).config
									&& user.integrations.find(int => int.intId === accessPoint.feedId).config.canView}
								order={getWidgetStatus("activities").index}
								enabled={getWidgetStatus("activities").enabled}
								selected={view === "Activity Timeline"}
								pageSize={5}
								selectWidget={selectWidget}
								activities={activities}
								updateActivityFilters={updateActivityFilters}
								activityFilters={activityFilters}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable}
								unsubscribeFromFeed={unsubscribeFromFeed}
								contextId={contextId}
								entityType={entityType}
								subscriberRef="profile"
								openDialog={openDialog}
								closeDialog={closeDialog}
								dialog={dialog}
								isPrimary={isPrimary}
								userId={userId}
								readOnly={readOnly}
								forReplay={forReplay}
								endDate={endDate}
								timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
								dir={dir}
								displayType={type === "Radar" ? type : "AccessPoint"}
							/>
						</ErrorBoundary>
					)}
					{!disableLinkedItems && getWidgetStatus("linked_items") && (
						<ErrorBoundary>
							<LinkedItemsWidget
								order={getWidgetStatus("linked_items").index}
								enabled={getWidgetStatus("linked_items").enabled}
								dialog={dialog}
								openDialog={openDialog}
								linkEntities={linkEntities}
								unlinkEntities={unlinkEntities}
								entity={accessPoint}
								closeDialog={closeDialog}
								selected={view === "Linked Items"}
								expanded={false} // for styling differences between profile and expanded widget views
								items={[...(context.linkedEntities || [])]}
								canLink={canManageAccessPoint}
								events={context.fovEvents || []}
								disabledTypes={disabledLinkedItemTypes}
								selectWidget={selectWidget}
								feeds={feeds}
								view={view}
								loadProfile={loadProfile}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable}
								contextId={contextId}
								entityType={entityType}
								subscriberRef={"profile"}
								unsubscribeFromFeed={unsubscribeFromFeed}
								isPrimary={isPrimary}
								autoFocus={true}
								dir={dir}
							/>
						</ErrorBoundary>
					)}

					{getWidgetStatus("cameras") && camerasInRange && (
						<ErrorBoundary>
							<CamerasWidget
								key={`${contextId}-cameras`}
								cameras={camerasInRange}
								canLink={!readOnly && user.integrations
									&& user.integrations.find(int => int.intId === accessPoint.feedId)
									&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
									&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage")}
								entityType={entityType}
								geometry={geometry}
								order={getWidgetStatus("cameras").index}
								enabled={getWidgetStatus("cameras").enabled}
								loadProfile={loadProfile}
								sidebarOpen={sidebarOpen}
								entity={accessPoint}
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
								selectFloorPlanOn={selectFloorPlanOn}
								floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
								widgetsLaunchable={!readOnly && widgetsLaunchable}
								user={user}
								removeDockedCamera={removeDockedCameraAndState}
								dir={dir}
							/>
						</ErrorBoundary>
					)}

					<AccessPointEditDialog
						open={dialog === "accessPointEditDialog"}
						accessPoint={accessPoint}
						close={() => dispatch(closeDialog("accessPointEditDialog"))}
						update={(accessPointId, entityData) => dispatch(updateAccesspoint(accessPointId, entityData))}
						dir={dir}
					/>
					<PinToDialog
						open={dialog === "pinToDialog"}
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={accessPoint}
						addRemoveFromCollections={addRemoveFromCollections}
						addRemoveFromEvents={addRemoveFromEvents}
						createCollection={createCollection}
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canManageEvents={user.applications &&
							user.applications.find(app => app.appId === "events-app") &&
							user.applications.find(app => app.appId === "events-app").permissions &&
							user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
						canPinToCollections={user.applications &&
							user.applications.find(app => app.appId === "map-app") &&
							user.applications.find(app => app.appId === "map-app").permissions &&
							user.applications.find(app => app.appId === "map-app").permissions.includes("manage")}
						userId={userId}
						dir={dir}
					/>
				</div>
			</div>
		);
	}
	else {
		return <div />;
	}
};

AccessPointProfile.propTypes = propTypes;
AccessPointProfile.defaultProps = defaultProps;
export default AccessPointProfile;
