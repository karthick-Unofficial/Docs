import React, { memo, useEffect, useState, useRef } from "react";

import ErrorBoundary from "../../ErrorBoundary";

import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import FileWidget from "../Widgets/File/FileWidget";
import Activities from "../Widgets/Activities/Activities";
import MapWidget from "../Widgets/Map/MapWidget";
import LinkedItemsWidget from "../Widgets/LinkedItems/LinkedItemsWidget";
import LiveCameraWidget from "../Widgets/LiveCamera/LiveCameraWidget";
import CameraDialog from "./components/CameraDialog";
import PinToDialog from "../../SharedComponents/PinToDialog";
import { facilityService } from "client-app-core";
import isEqual from "react-fast-compare";
import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { mapState, persistedState, widgetStateSelector, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { contextPanelState, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import isObject from "lodash/isObject";
import includes from "lodash/includes";
import keys from "lodash/keys";
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

const CameraProfile = ({
	startActivityStream,
	startAttachmentStream,
	startFOVItemStream,
	disableLinkedItems,
	startLiveCameraStream,
	startCamerasLinkedItemsStream,
	forReplay,
	floorPlansWithFacFeed,
	selectFloorPlanOn,
	setWidgetOrder,
	selectWidget,
	facilityOption,
	attachFilesToCamera,
	updateActivityFilters,
	loadProfile,
	linkEntities,
	unlinkEntities,
	disabledLinkedItemTypes,
	addRemoveFromCollections,
	addRemoveFromEvents,
	createCollection,
	updateCamera,
	widgetsExpandable,
	widgetsLaunchable,
	showFOV,
	hideFOV,
	removeDockedCameraAndState,
	unsubscribeFromFeed,
	openDialog,
	closeDialog,
	addCameraToDockMode,
	setCameraPriority,
	ignoreEntity,
	appData,
	readOnly,
	endDate,
	facilityFeedId,
	mapstatus
}) => {
	const dispatch = useDispatch();

	const session = useSelector(state => state.session);
	const appState = useSelector(state => state.appState);
	const userAppState = useSelector(state => state.userAppState);
	const mapstate = useSelector(state => state.mapState);
	const mapStatus = useSelector(state => mapState(state));
	const user = session.user.profile;
	const context = useSelector(state => selectedContextSelector(state));
	const { entity } = context;
	const isLoaded = isObject(context) && !!entity;
	const activityFilters = useSelector(state => isLoaded && persistedState(state).activityFilters);
	const dialog = isLoaded && appState.dialog.openDialog;
	const view = isLoaded && userAppState ? userAppState.cameraView : null;
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
	const dir = useSelector(state => isLoaded && getDir(state));
	const camera = isLoaded && entity;
	const cameraPriority = isLoaded && appState.dock.cameraDock.cameraPriority;
	const sidebarOpen = isLoaded && appState.dock.dockData.isOpen;
	const dockedCameras = isLoaded && appState.dock.cameraDock.dockedCameras;
	const mapVisible = mapstatus ? mapStatus.visible : isLoaded && mapstate.baseMap.visible;
	const fullscreenCamera = useSelector(state => isLoaded && fullscreenCameraOpen(state));
	const appId = useSelector(state => isLoaded && state.appId);
	const timeFormatPreference = useSelector(state => isLoaded && state.appState.global.timeFormat);
	const activeFOV = isLoaded && (appId === "map-app" || appId === "events-app") ? includes(keys(useSelector(state => state.globalData.fovs.data)), contextId) : undefined;
	const floorPlansWithFacilityFeed = useSelector(state => floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null);


	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [facilityHidden, setFacilityHidden] = useState(true);
	const [mounted, setMounted] = useState(false);

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "linked_items",
				name: getTranslation("global.profiles.cameraProfile.linkedItems")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.cameraProfile.activities")
			},
			{
				enabled: true,
				id: "live_camera",
				name: getTranslation("global.profiles.cameraProfile.liveCam")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.cameraProfile.files")
			},
			{
				enabled: true,
				id: "map",
				name: getTranslation("global.profiles.cameraProfile.map")
			}
		];
		setMounted(true);
	}

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	useEffect(() => {
		if (!forReplay) {
			if (!disableLinkedItems && getWidgetStatus("linked_items")) {
				dispatch(startCamerasLinkedItemsStream(contextId, "profile"));
				if (context.entity.fov) {
					dispatch(startFOVItemStream(contextId, "profile"));
				}
			}
			if (getWidgetStatus("activities"))
				dispatch(startActivityStream(contextId, "camera", "profile"));
			if (getWidgetStatus("files"))
				dispatch(startAttachmentStream(contextId, "profile"));
			if (getWidgetStatus("live_camera"))
				dispatch(startLiveCameraStream(contextId, "camera", "profile"));
			if (camera && camera.entityData.displayTargetId && camera.entityData.displayType && camera.entityData.displayType.toLowerCase() === "facility") {
				facilityService.getFloorPlan(camera.entityData.displayTargetId, (err, res) => {
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

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevContext = usePrevious(context);

	useEffect(() => {
		if (
			!forReplay &&
			context &&
			!disableLinkedItems &&
			prevContext &&
			!prevContext.entity.fov &&
			context.entity.fov &&
			getWidgetStatus("linked_items")
		) {
			dispatch(startFOVItemStream(contextId, "profile"));
		}
	}, [context]);


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

	const getWidgetConfig = () => {
		const defaultTypes = ["linked_items", "activities", "live_camera", "files"];
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

	const getWidgetStatus = widgetId => {
		const widgetConfig = getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	const showFloorPlanOnTargetClick = () => {
		const { entityData } = camera;
		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
			}
		}
	};

	if (context) {
		const { attachments, activities } = context;
		const userId = user.id;
		const { entityType, entityData, feedId } = camera;
		camera.activeFOV = activeFOV;
		const { properties, geometry } = entityData;
		const { name, description, type, subtype } = properties;
		const canManageCamera = !readOnly && user.integrations
			&& user.integrations.find(int => int.intId === camera.feedId)
			&& user.integrations.find(int => int.intId === camera.feedId).permissions
			&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("manage");
		const canControlCamera = !readOnly && user.integrations
			&& user.integrations.find(int => int.intId === camera.feedId)
			&& user.integrations.find(int => int.intId === camera.feedId).permissions
			&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control");
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
				name: getTranslation("global.profiles.cameraProfile.facility"),
				nameText: "Facility",
				action: () => window.location.replace(`/facilities-app/#/?${entityData.displayTargetId}`)
			});
		}
		actions = [
			...actions,
			{
				name: activeFOV ? getTranslation("global.profiles.cameraProfile.hideFOV") : getTranslation("global.profiles.cameraProfile.showFOV"),
				nameText: activeFOV ? "Hide FOV" : "Show FOV",
				action: activeFOV
					? () => dispatch(hideFOV(camera.id))
					: () => dispatch(showFOV(camera.id))
			},
			{
				name: getTranslation("global.profiles.cameraProfile.pinTo"),
				nameText: "Pin To",
				action: () => dispatch(openDialog("pinToDialog"))
			}];
		// can we edit a camera?
		if (canManageCamera) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.cameraProfile.edit"),
					nameText: "Edit",
					action: () => dispatch(openDialog("cameraEditDialog"))
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
						type={subtype ? subtype : type}
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
								name: getTranslation("global.profiles.cameraProfile.hide"),
								nameText: "Hide",
								action: () => {
									setHiding(true);
									dispatch(ignoreEntity(contextId, entityType, feedId, appData));
								},
								debounce: hiding
							}
						]}
						dir={dir}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.cameraProfile.editProfileLayout" />
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
							profile="camera"
							setWidgetOrder={setWidgetOrder}
						/>
					</ErrorBoundary>
					{$(window).width() > 1023 && getWidgetStatus("map") && (
						<MapWidget
							order={getWidgetStatus("map").index}
							enabled={getWidgetStatus("map").enabled}
							selectWidget={selectWidget}
							title={getTranslation("global.profiles.cameraProfile.mapLocationFOV")}
							expanded={mapVisible}
							dir={dir}
						/>
					)}
					{getWidgetStatus("files") && context.attachments && (
						<ErrorBoundary>
							<FileWidget
								key={`${contextId}-files`}
								order={getWidgetStatus("files").index}
								enabled={getWidgetStatus("files").enabled}
								canDelete={
									!readOnly && user && user.integrations
									&& user.integrations.find(int => int.intId === camera.feedId)
									&& user.integrations.find(int => int.intId === camera.feedId).permissions
									&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("manage")
								}
								hasAccess={!readOnly
									&& user
									&& user.integrations
									&& user.integrations.find(int => int.intId === camera.feedId)
									&& user.integrations.find(int => int.intId === camera.feedId).config
									&& user.integrations.find(int => int.intId === camera.feedId).config.canView}
								attachments={attachments}
								selected={view === "Files"}
								selectWidget={selectWidget}
								attachFiles={attachFilesToCamera}
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
								entity={camera}
								canManage={user.integrations
									&& user.integrations.find(int => int.intId === camera.feedId)
									&& user.integrations.find(int => int.intId === camera.feedId).config
									&& user.integrations.find(int => int.intId === camera.feedId).config.canView}
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
								entity={camera}
								closeDialog={closeDialog}
								selected={view === "Linked Items"}
								expanded={false} // for styling differences between profile and expanded widget views
								items={[...(context.fovItems || []), ...(context.linkedEntities || [])]}
								canLink={canManageCamera}
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
								selectFloor={selectFloorPlanOn}
								facilityFeedId={facilityFeedId}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("live_camera") && context.liveCamera && (
						<ErrorBoundary>
							<LiveCameraWidget
								key="camera-profile-view"
								order={getWidgetStatus("live_camera").index}
								enabled={getWidgetStatus("live_camera").enabled}
								selected={view === "Live Camera"}
								expanded={false} // for styling differences between profile and expanded widget views
								canControl={canControlCamera}
								selectWidget={selectWidget}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable}
								contextId={contextId}
								entityType={entityType}
								camera={camera}
								sidebarOpen={sidebarOpen}
								dockedCameras={dockedCameras}
								subscriberRef={"profile"}
								unsubscribeFromFeed={unsubscribeFromFeed}
								addCameraToDockMode={addCameraToDockMode}
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								setCameraPriority={setCameraPriority}
								fullscreenCamera={fullscreenCamera}
								readOnly={readOnly}
								user={user}
								removeDockedCamera={removeDockedCameraAndState}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					<CameraDialog
						open={dialog === "cameraEditDialog"}
						camera={camera}
						close={() => dispatch(closeDialog("cameraEditDialog"))}
						update={updateCamera}
						dir={dir}
					/>
					<PinToDialog
						open={dialog === "pinToDialog"}
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={camera}
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
	} else {
		return <div />;
	}

};

CameraProfile.propTypes = propTypes;
CameraProfile.defaultProps = defaultProps;

export default memo(CameraProfile, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
});
