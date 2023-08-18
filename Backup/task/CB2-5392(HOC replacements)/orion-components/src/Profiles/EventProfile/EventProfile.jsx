import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import moment from "moment";
import ErrorBoundary from "../../ErrorBoundary";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import EventDialog from "./components/EventDialog";
import { Dialog } from "../../CBComponents/index";
import {
	SGSettings,
	MapWidget,
	NotesWidget,
	SummaryWidget,
	PinnedItemsWidget,
	Activities,
	ListWidget,
	FileWidget,
	CADDetailsWidget,
	RespondingUnitsWidget,
	CameraWidget,
	ProximityWidget,
	ResourceWidget,
	EquipmentWidget
} from "../Widgets";

import $ from "jquery";
import EventShareDialog from "./components/EventShareDialog";
import PropTypes from "prop-types";
import { eventService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { widgetStateSelector, mapState, persistedState, fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { selectedContextSelector, contextPanelState } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector, eventTypesSelector } from "orion-components/GlobalData/Selectors";
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

const EventProfile = ({
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startEventCameraStream,
	forReplay,
	deleteEventNotes,
	closeDialog,
	deleteEvent,
	openDialog,
	selectWidget,
	updateActivityFilters,
	setWidgetOrder,
	getLookupValues,
	updateListCheckbox,
	attachFilesToEvent,
	widgetsLaunchable,
	unsubscribeFromFeed,
	loadProfile,
	publishEvent,
	shareEvent,
	addCameraToDockMode,
	removeDockedCameraAndState,
	setCameraPriority,
	updateEventNotes,
	startProximityEntitiesStream,
	readOnly,
	replayEndDate,
	selectFloorPlanOn,
	floorPlansWithFacFeed
}) => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user.profile);
	const externalSystems = useSelector(state => state.session.organization.externalSystems);
	const context = useSelector(state => selectedContextSelector(state));
	const clientConfig = useSelector(state => state.clientConfig);
	const { entity } = context;
	const isLoaded = _.isObject(context) && entity;
	const { activityFilters } = useSelector(state => persistedState(state));
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const mapStatus = useSelector(state => mapState(state));
	const { userAppState } = useSelector(state => state);
	const view = isLoaded && userAppState ? userAppState.eventView : null;
	const { orgId } = user;
	const { ownerOrg } = entity;
	const contextId = entity.id;
	const lookupData = useSelector(state => state.globalData && state.globalData.listLookupData ? state.globalData.listLookupData : {});
	const isPrimary = useSelector(state => contextId === contextPanelState(state).selectedContext.primary);
	const fromOrg = ownerOrg === orgId;
	const fromEco = ownerOrg !== orgId;
	const types = useSelector(state => eventTypesSelector(state));
	const widgetState = useSelector(state => widgetStateSelector(state));
	const feeds = useSelector(state => userFeedsSelector(state));
	const mobile = $(window).width() <= 1023;
	const event = entity;
	const defaultListPagination = clientConfig.defaultListPagination;
	const listPaginationOptions = clientConfig.listPaginationOptions;
	const mapVisible = mapStatus.visible;
	const widgetsExpandable = !mobile;
	const appId = useSelector(state => state.appId);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	const floorPlansWithFacilityFeed = useSelector(state => floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null);
	const appState = useSelector(state => state.appState);
	const sidebarOpen = appState.dock.dockData.isOpen;
	const dockedCameras = appState.dock.cameraDock.dockedCameras;
	const fullscreenCamera = useSelector(state => fullscreenCameraOpen(state));
	const secondaryExpanded = useSelector(state => contextPanelState(state).secondaryExpanded);

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [editing, setEditing] = useState(false);
	const [notes, setNotes] = useState({});
	const [eventState, setEvent] = useState({});
	const [mounted, setMounted] = useState(false);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevEvent = usePrevious(event);

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.eventProfile.main.activities")
			},
			{
				enabled: true,
				id: "map",
				name: getTranslation("global.profiles.eventProfile.main.map")
			},
			{
				enabled: true,
				id: "notes",
				name: getTranslation("global.profiles.eventProfile.main.notes")
			},
			{
				enabled: true,
				id: "event_lists",
				name: getTranslation("global.profiles.eventProfile.main.eventLists")
			},
			{
				enabled: true,
				id: "pinned_items",
				name: getTranslation("global.profiles.eventProfile.main.pinnedItems")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.eventProfile.main.files")
			},
			{
				enabled: true,
				id: "secure_share",
				name: getTranslation("global.profiles.eventProfile.main.secureShare")
			},
			{
				enabled: true,
				id: "cad_details",
				name: getTranslation("global.profiles.eventProfile.main.cadDetails")
			},
			{
				enabled: true,
				id: "responding_units",
				name: getTranslation("global.profiles.eventProfile.main.respondingUnits")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.eventProfile.main.cameras")
			},
			{
				enabled: true,
				id: "proximity",
				name: getTranslation("global.profiles.eventProfile.main.proximity")
			},
			{
				enabled: true,
				id: "resources",
				name: getTranslation("global.profiles.eventProfile.main.resources")
			},
			{
				enabled: true,
				id: "equipments",
				name: getTranslation("global.profiles.eventProfile.main.equipments")
			}
		];
		setMounted(true);
	}

	useEffect(() => {
		const { id } = event;
		if (!forReplay) {
			if (getWidgetStatus("event_lists")) {
				dispatch(startListStream(id, "profile"));
			}
			if (getWidgetStatus("activities")) {
				dispatch(startEventActivityStream(id, "profile"));
			}
			if (getWidgetStatus("files")) {
				dispatch(startAttachmentStream(id, "profile"));
			}
			if (getWidgetStatus("pinned_items")) {
				dispatch(startEventPinnedItemsStream(id, "profile"));
			}
			if (getWidgetStatus("cameras")) {
				dispatch(startEventCameraStream(id, "profile"));
			}
			if (event && event.notes) {
				retrieveHTML(event.notes);
			}
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}
		setMounted(true);
	}, []);

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	useEffect(() => {
		if (event && prevEvent) {
			if (prevEvent.notes !== event.notes) {
				retrieveHTML(event.notes);
			}

		}
	}, [event.notes]);

	const retrieveHTML = async handle => {
		if (handle) {
			await eventService.downloadEventNotes(handle, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					setNotes(result);
				}
			});
		} else {
			setNotes({});
		}
	};

	const deleteNotes = async eventId => {
		await dispatch(deleteEventNotes(eventId, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				setEvent(result);
				setNotes({});
			}
		}));
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

	const handleCloseDeleteDialog = () => {
		dispatch(closeDialog("eventDeleteDialog"));
	};

	const handleConfirmDelete = () => {
		dispatch(deleteEvent(event.id));
		handleCloseDeleteDialog();
	};

	const handleEditMode = editing => {
		setEditing(editing);
	};

	const getWidgetConfig = () => {
		const { type } = event;
		const { isTemplate } = event;
		const eventType = types[type];
		let defaultTypes = [
			"notes",
			"event_lists",
			"pinned_items",
			"files",
			"cameras"
		];

		// Don't allow proximity widget in cameras app
		if (appId !== "cameras-app") defaultTypes.push("proximity");

		// Only allow activities widget if not a template
		if (!isTemplate) defaultTypes.push("activities");

		// Only allow map widget if the widgets are expandable
		if (widgetsExpandable) defaultTypes.push("map");

		// Add additional widgets based on event type
		if (eventType) defaultTypes = [...defaultTypes, ...eventType.widgets];

		// Add resources & equipment widgets if user has HRMS external system
		if (externalSystems.indexOf("hrms") > -1) {
			defaultTypes = [...defaultTypes, "resources", "equipments"];
		}

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter(widget =>
			defaultTypes.includes(widget.id)
		);

		const filteredState = widgetState
			? widgetState.filter(widget => defaultTypes.includes(widget.id))
			: [];

		const widgetConfig = widgetState
			? _.unionBy(filteredState, filteredDefault, "id")
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

	const renderActions = () => {
		const { name } = event;
		const canManage = user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
		const canShare = !event.isTemplate
			&& user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("share")
			&& user.orgId === event.ownerOrg;
		const canViewReports = user.applications
			&& user.applications.find(app => app.appId === "reports-app");
		const actions = [];
		const reportAction = {
			name: getTranslation("global.profiles.eventProfile.main.report"),
			nameText: "Report",
			action: () =>
				window.location.replace(
					`/reports-app/#/report-builder/sitrep?id=sitrep&event=${name}&eventId=${event.id}`
				)
		};
		const shareAction = {
			name: getTranslation("global.profiles.eventProfile.main.share"),
			nameText: "Share",
			action: () => dispatch(openDialog("eventShareDialog"))
		};
		const editAction = {
			name: getTranslation("global.profiles.eventProfile.main.edit"),
			nameText: "Edit",
			action: () => {
				handleEditMode(true);
				dispatch(openDialog("eventEditDialog"));
			}
		};
		const deleteAction = {
			name: getTranslation("global.profiles.eventProfile.main.delete"),
			nameText: "Delete",
			action: () => {
				dispatch(openDialog("eventDeleteDialog"));
			}
		};

		if (!event.isTemplate && canViewReports) {
			actions.push(reportAction);
		}

		if (canShare) {
			actions.push(shareAction);
		}
		if (canManage) {
			actions.push(editAction);
			if (event.ownerOrg === user.orgId) {
				actions.push(deleteAction);
			}
		}
		return actions;
	};

	if (context) {
		const {
			attachments,
			activities,
			pinnedItems,
			lists,
			eventCameras
		} = context;
		const userId = user.id;
		const {
			entityData,
			name,
			desc,
			isPublic,
			type,
			endDate,
			additionalProperties,
			entityType
		} = event;
		const eventType = types[type];
		const { geometry } = entityData;
		const canManageEvent = !readOnly && user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
		const { respondingUnits, address, status } = additionalProperties;
		const scrollOffset = scrolledUp ? 167 : 0;
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig();
		return (
			<div
				className="cb-profile-wrapper"
				style={{ height: "100%", overflow: "scroll" }}
			>
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						readOnly={readOnly}
						user={user}
						context={context}
						name={name}
						displayType={eventType ? eventType.name : ""}
						type={endDate ? "Planned" : "Emergent"}
						geometry={geometry}
						description={desc}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						mapVisible={mapVisible}
						appId={appId}
						actions={renderActions()}
						dir={dir}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.eventProfile.main.editProfileLayout" />
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
							setWidgetOrder={setWidgetOrder}
							profile="event"
							expandedWidget={view}
						/>
					</ErrorBoundary>

					{$(window).width() > 1023 && getWidgetStatus("map") && (
						<MapWidget
							order={getWidgetStatus("map").index}
							enabled={getWidgetStatus("map").enabled}
							expanded={mapVisible}
							selectWidget={selectWidget}
							title={getTranslation("global.profiles.eventProfile.main.mapPlanner")}
							dir={dir}
						/>
					)}
					{getWidgetStatus("cad_details") && (
						// TODO: There's no need to pass down a hard-coded array to a widget if it can be handled in the widget
						<ErrorBoundary>
							<CADDetailsWidget
								order={getWidgetStatus("cad_details").index}
								enabled={getWidgetStatus("cad_details").enabled}
								expanded={false}
								steps={["Dispatched", "En Route", "On-Scene", "Closed"]}
								address={address}
								activeStep={[
									"dispatched",
									"enroute",
									"onScene",
									"closed"
								].indexOf(status)}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("cameras") && eventCameras && (
						<ErrorBoundary>
							<CameraWidget
								key={`${contextId}-cameras`}
								cameras={eventCameras}
								entityType={entityType}
								geometry={geometry}
								user={user}
								order={getWidgetStatus("cameras").index}
								enabled={getWidgetStatus("cameras").enabled}
								loadProfile={loadProfile}
								sidebarOpen={sidebarOpen}
								dockedCameras={dockedCameras}
								addCameraToDockMode={addCameraToDockMode}
								contextId={contextId}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef="profile"
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								setCameraPriority={setCameraPriority}
								readOnly={readOnly}
								disableSlew={readOnly}
								fullscreenCamera={fullscreenCamera}
								widgetsLaunchable={widgetsLaunchable}
								entity={event}
								eventEnded={endDate && moment().diff(endDate) >= 0}
								removeDockedCamera={removeDockedCameraAndState}
								dir={dir}
								selectFloorPlanOn={selectFloorPlanOn}
								floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("responding_units") && (
						<ErrorBoundary>
							<RespondingUnitsWidget
								order={getWidgetStatus("responding_units").index}
								enabled={getWidgetStatus("responding_units").enabled}
								expanded={false}
								loadProfile={loadProfile}
								respondingUnits={respondingUnits}
								title={getTranslation("global.profiles.eventProfile.main.respondingUnits")}
								dir={dir}
							/>
						</ErrorBoundary>
					)}

					{getWidgetStatus("notes") && (
						<ErrorBoundary>
							<NotesWidget
								order={getWidgetStatus("notes").index}
								enabled={getWidgetStatus("notes").enabled}
								selectWidget={selectWidget}
								selected={view === "Notes"}
								expanded={false}
								widgetsExpandable={widgetsExpandable}
								secondaryExpanded={secondaryExpanded}
								canContribute={canManageEvent}
								updateNotes={updateEventNotes}
								event={event}
								notes={
									notes && notes.html
										? notes
										: { html: "<p><br></p>" }
								}
								widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
								contextId={contextId}
								entityType={entityType}
								deleteNotes={deleteNotes}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("pinned_items") && pinnedItems && (
						<ErrorBoundary>
							<PinnedItemsWidget
								order={getWidgetStatus("pinned_items").index}
								enabled={getWidgetStatus("pinned_items").enabled}
								selected={view === "Pinned Items"}
								items={pinnedItems}
								selectWidget={selectWidget}
								canManage={canManageEvent}
								event={event}
								view={view}
								loadProfile={loadProfile}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
								contextId={contextId}
								entityType={entityType}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef="profile"
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								isPrimary={isPrimary}
								readOnly={readOnly}
								eventEnded={endDate && moment().diff(endDate) >= 0}
								feeds={feeds}
								dir={dir}
								selectFloor={selectFloorPlanOn}
								floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("event_lists") && lists && (
						<ErrorBoundary>
							<ListWidget
								order={getWidgetStatus("event_lists").index}
								enabled={getWidgetStatus("event_lists").enabled}
								selected={view === "Event Lists"}
								expanded={false} // for styling differences between profile and expanded widget views
								canRemoveLists={!readOnly &&
									user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").permissions
									&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage")
								}
								canAddEditLists={!readOnly &&
									user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").permissions
									&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage")
								}
								selectWidget={selectWidget}
								updateListCheckbox={updateListCheckbox}
								defaultListPagination={defaultListPagination}
								listPaginationOptions={listPaginationOptions}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
								lists={lists}
								lookupData={lookupData}
								contextId={contextId}
								getLookupValues={getLookupValues}
								user={user}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef={"profile"}
								openDialog={openDialog}
								closeDialog={closeDialog}
								dialog={dialog}
								isPrimary={isPrimary}
								secondaryExpanded={secondaryExpanded}
								dir={dir}
								locale={locale}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("activities") && (activities || forReplay) && (
						<ErrorBoundary>
							<Activities
								key={`${contextId}-activities`}
								entity={event}
								order={getWidgetStatus("activities").index}
								enabled={getWidgetStatus("activities").enabled}
								selected={view === "Activity Timeline"}
								pageSize={5}
								selectWidget={selectWidget}
								activities={activities}
								canManage={user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").config
									&& user.applications.find(app => app.appId === "events-app").config.canView}
								updateActivityFilters={updateActivityFilters}
								activityFilters={activityFilters}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
								contextId={contextId}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef={"profile"}
								openDialog={openDialog}
								closeDialog={closeDialog}
								dialog={dialog}
								isPrimary={isPrimary}
								userId={userId}
								entityType={entityType}
								readOnly={readOnly}
								forReplay={forReplay}
								endDate={replayEndDate}
								timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
								dir={dir}
								locale={locale}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("files") && attachments && (
						<ErrorBoundary>
							<FileWidget
								id="files"
								order={getWidgetStatus("files").index}
								enabled={getWidgetStatus("files").enabled}
								selected={view === "Files"}
								selectWidget={selectWidget}
								attachments={attachments}
								canDelete={!readOnly && user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").permissions
									&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
								hasAccess={!readOnly && user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").config
									&& user.applications.find(app => app.appId === "events-app").config.canView}
								attachFiles={attachFilesToEvent}
								widgetsExpandable={widgetsExpandable}
								widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
								entityType={entityType}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef={"profile"}
								contextId={contextId}
								isPrimary={isPrimary}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("secure_share") && (
						<SGSettings
							key={contextId}
							selectWidget={selectWidget}
							selected={view === "SecureShare Settings"}
							expanded={false}
							order={getWidgetStatus("secure_share").index}
							enabled={getWidgetStatus("secure_share").enabled}
							contextId={contextId}
							settings={additionalProperties}
							expandable={widgetsExpandable}
							pinnedItems={pinnedItems}
							isPublic={isPublic}
							type={type}
							dir={dir}
						/>
					)}
					{getWidgetStatus("proximity") && (
						<ErrorBoundary>
							<ProximityWidget
								order={getWidgetStatus("proximity").index}
								enabled={getWidgetStatus("proximity").enabled}
								selected={view === "Proximity"}
								expanded={false} // for styling differences between profile and expanded widget views
								selectWidget={selectWidget}
								event={event}
								canManage={!readOnly && user.applications
									&& user.applications.find(app => app.appId === "events-app")
									&& user.applications.find(app => app.appId === "events-app").permissions
									&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
								view={view}
								loadProfile={loadProfile}
								widgetsExpandable={widgetsExpandable}
								contextId={contextId}
								context={context}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef={"profile"}
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								isPrimary={isPrimary}
								eventEnded={endDate && moment().diff(endDate) >= 0}
								feeds={feeds}
								startProximityEntitiesStream={startProximityEntitiesStream}
								dir={dir}
							/>
						</ErrorBoundary>
					)}
					{getWidgetStatus("resources") && (
						<ErrorBoundary>
							<ResourceWidget
								key={contextId}
								contextId={contextId}
								selectWidget={selectWidget}
								selected={view === "Resources"}
								expanded={false}
								order={getWidgetStatus("resources").index}
								enabled={getWidgetStatus("resources").enabled}
								expandable={widgetsExpandable}
								settings={additionalProperties}
								dir={dir}
								canManage={canManageEvent}
							/>
						</ErrorBoundary>
					)}

					{getWidgetStatus("equipments") && (
						<ErrorBoundary>
							<EquipmentWidget
								key={contextId}
								selectWidget={selectWidget}
								selected={view === "Equipment"}
								expanded={false}
								order={getWidgetStatus("equipments").index}
								enabled={getWidgetStatus("equipments").enabled}
								expandable={widgetsExpandable}
								settings={additionalProperties}
								contextId={contextId}
								dir={dir}
								canManage={canManageEvent}
							/>
						</ErrorBoundary>
					)}

					{/* Share to user's org */}
					<EventShareDialog
						event={event}
						user={user}
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						publishEvent={publishEvent}
						shareEvent={shareEvent}
						dir={dir}
					/>
					{/* Delete Event */}
					<Dialog
						open={dialog === "eventDeleteDialog"}
						confirm={{ label: getTranslation("global.profiles.eventProfile.main.confirm"), action: handleConfirmDelete }}
						abort={{
							label: getTranslation("global.profiles.eventProfile.main.cancel"),
							action: handleCloseDeleteDialog
						}}
						title={getTranslation("global.profiles.eventProfile.main.confirmationText")}
						dir={dir}
					/>
					<ErrorBoundary>
						<EventDialog
							editing={editing}
							handleEditMode={handleEditMode}
							open={dialog === "eventEditDialog"}
							selectedEvent={event}
							closeDialog={closeDialog}
							types={types}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
							locale={locale}
						/>
					</ErrorBoundary>
				</div>
			</div>
		);
	} else {
		return <div />;
	}
};


EventProfile.propTypes = propTypes;
EventProfile.defaultProps = defaultProps;

export default EventProfile;
