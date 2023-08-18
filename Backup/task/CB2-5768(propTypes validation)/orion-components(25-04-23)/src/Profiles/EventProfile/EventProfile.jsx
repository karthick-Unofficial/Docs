import React, { useEffect, useState, useRef } from "react";
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
	EquipmentWidget,
	GateRunnerResponseWidget
} from "../Widgets";

import $ from "jquery";
import EventShareDialog from "./components/EventShareDialog";
import PropTypes from "prop-types";
import { eventService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { widgetStateSelector, mapState } from "orion-components/AppState/Selectors";
import { selectedContextSelector, contextPanelState } from "orion-components/ContextPanel/Selectors";
import { eventTypesSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import unionBy from "lodash/unionBy";

import {
	unsubscribeFromFeed,
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startEventCameraStream,
	startProximityEntitiesStream
} from "orion-components/ContextualData/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { getLookupValues } from "orion-components/GlobalData/Actions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";
import { publishEvent, shareEvent, updateEventNotes } from "../../SharedActions/eventProfileActions";
import { defaultEventProfileWidgets } from "orion-components/Profiles/Utils/EventProfileWidgets";
import { isWidgetLaunchableAndExpandable, canManageByApplication } from "orion-components/Profiles/Selectors";

const propTypes = {
	forReplay: PropTypes.bool,
	selectWidget: PropTypes.func,
	updateListCheckbox: PropTypes.func,
	deleteEvent: PropTypes.func,
	readOnly: PropTypes.bool,
	replayEndDate: PropTypes.date,
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacFeed: PropTypes.bool
};
const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { }
};

let DEFAULT_WIDGET_CONFIG = [];

const EventProfile = ({
	forReplay,
	selectWidget,
	updateListCheckbox,
	deleteEvent,
	readOnly,
	replayEndDate,
	selectFloorPlanOn,
	floorPlansWithFacFeed
}) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user.profile);
	const externalSystems = useSelector((state) => state.session.organization.externalSystems);
	const context = useSelector((state) => selectedContextSelector(state));
	const clientConfig = useSelector((state) => state.clientConfig);
	const { entity } = context;
	const dialog = useSelector((state) => state.appState.dialog.openDialog);
	const mapStatus = useSelector((state) => mapState(state));
	const { userAppState } = useSelector((state) => state);
	const view = entity && userAppState ? userAppState.eventView : null;
	const contextId = entity.id;
	const lookupData = useSelector((state) =>
		state.globalData && state.globalData.listLookupData ? state.globalData.listLookupData : {}
	);
	const isPrimary = useSelector((state) => contextId === contextPanelState(state).selectedContext.primary);
	const types = useSelector((state) => eventTypesSelector(state));
	const widgetState = useSelector((state) => widgetStateSelector(state));
	const event = entity;
	const defaultListPagination = clientConfig.defaultListPagination;
	const listPaginationOptions = clientConfig.listPaginationOptions;
	const mapVisible = mapStatus.visible;
	const appId = useSelector((state) => state.appId);
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state.i18n.locale);
	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null
	);
	const appState = useSelector((state) => state.appState);
	const sidebarOpen = appState.dock.dockData.isOpen;
	const secondaryExpanded = useSelector((state) => contextPanelState(state).secondaryExpanded);
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable } = launchableAndExpandable;
	const canManage = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canShare = !event.isTemplate && useSelector((state) => canManageByApplication(state)("events-app", "share")) && user.orgId === event.ownerOrg;
	const canViewEvents = !readOnly && useSelector((state) => canManageByApplication(state)("events-app", "canView", "config"));

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [editing, setEditing] = useState(false);
	const [notes, setNotes] = useState({});
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
		DEFAULT_WIDGET_CONFIG = defaultEventProfileWidgets;
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

	const retrieveHTML = async (handle) => {
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

	const deleteNotes = async (eventId) => {
		await eventService.deleteEventNotes(eventId, (err, result) => {
			if (err) {
				console.log(err, result);
			} else {
				setNotes({});
			}
		});
	};

	const handleScroll = () => {
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
	};

	const handleEditLayout = (event) => {
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

	const handleEditMode = (editing) => {
		setEditing(editing);
	};

	const getWidgetConfig = () => {
		const { type } = event;
		const { isTemplate } = event;
		const eventType = types[type];
		let defaultTypes = ["notes", "pinned_items", "files", "cameras"];

		const viewLists = user.integrations && user.integrations.find((feed) => feed.entityType === "list");

		if (viewLists) defaultTypes.push("event_lists");

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

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter((widget) => defaultTypes.includes(widget.id));

		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = widgetState ? unionBy(filteredState, filteredDefault, "id") : filteredDefault;
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

	const renderActions = () => {
		const { name } = event;

		const canViewReports = user.applications && user.applications.find((app) => app.appId === "reports-app");
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
		const { attachments, activities, pinnedItems, lists, eventCameras } = context;
		const userId = user.id;
		const { entityData, name, desc, isPublic, type, endDate, entityType } = event;
		const additionalProperties = event.additionalProperties || {};
		const eventType = types[type];
		const { geometry } = entityData;
		const { respondingUnits, status, address } = additionalProperties;
		const scrollOffset = scrolledUp ? 167 : 0;
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig();
		const widgetRenderFilters = {
			map: $(window).width() < 1023,
			cameras: !eventCameras,
			pinned_items: !pinnedItems,
			event_lists: !lists,
			activities: !(activities || forReplay),
			files: !attachments
		};
		const renderWidgets = (widgetName) => {
			switch (widgetName) {
				case "map":
					return (
						<MapWidget
							id={widgetName}
							expanded={mapVisible}
							selectWidget={selectWidget}
							title={getTranslation("global.profiles.eventProfile.main.mapPlanner")}
						/>
					);
				case "cad_details":
					return (
						// TODO: There's no need to pass down a hard-coded array to a widget if it can be handled in the widget
						<CADDetailsWidget
							id={widgetName}
							expanded={false}
							steps={["Dispatched", "En Route", "On-Scene", "Closed"]}
							address={address}
							activeStep={[
								"dispatched",
								"enroute", // cSpell:ignore enroute
								"onScene",
								"closed"
							].indexOf(status)}
						/>
					);
				case "cameras":
					return (
						<CameraWidget
							id={widgetName}
							key={`${contextId}-cameras`}
							cameras={eventCameras}
							entityType={entityType}
							geometry={geometry}
							user={user}
							loadProfile={loadProfile}
							sidebarOpen={sidebarOpen}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							setCameraPriority={setCameraPriority}
							readOnly={readOnly}
							disableSlew={readOnly}
							entity={event}
							eventEnded={endDate && moment().diff(endDate) >= 0}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
					);
				case "gate_runner_response":
					return (
						<GateRunnerResponseWidget
							id={widgetName}
							event={event}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef={"profile"}
							selectWidget={selectWidget}
							activities={activities}
						/>
					);
				case "responding_units":
					return (
						<RespondingUnitsWidget
							id={widgetName}
							expanded={false}
							respondingUnits={respondingUnits}
							title={getTranslation("global.profiles.eventProfile.main.respondingUnits")}
						/>
					);
				case "notes":
					return (
						<NotesWidget
							id={widgetName}
							enabled={getWidgetStatus("notes").enabled}
							selectWidget={(widget) => dispatch(selectWidget(widget))}
							selected={view === "Notes"}
							expanded={false}
							secondaryExpanded={secondaryExpanded}
							canContribute={!readOnly && canManage}
							updateNotes={(event, notes) => dispatch(updateEventNotes(event, notes))}
							event={event}
							notes={notes && notes.html ? notes : { html: "<p><br></p>" }}
							contextId={contextId}
							entityType={entityType}
							deleteNotes={deleteNotes}
							activities={activities}
							dir={dir}
							openDialog={(widget) => dispatch(openDialog(widget))}
							closeDialog={(widget) => dispatch(closeDialog(widget))}
						/>
					);
				case "pinned_items":
					return (
						<PinnedItemsWidget
							id={widgetName}
							selected={view === "Pinned Items"}
							items={pinnedItems}
							selectWidget={selectWidget}
							canManage={!readOnly && canManage}
							view={view}
							contextId={contextId}
							entityType={entityType}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							isPrimary={isPrimary}
							readOnly={readOnly}
							eventEnded={endDate && moment().diff(endDate) >= 0}
							selectFloor={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
					);
				case "event_lists":
					return (
						<ListWidget
							id={widgetName}
							selected={view === "Event Lists"}
							expanded={false} // for styling differences between profile and expanded widget views
							canRemoveLists={!readOnly && canManage}
							canAddEditLists={!readOnly && canManage}
							listAccessAndEventsManage={
								user.integrations &&
								user.integrations.find((feed) => feed.entityType === "list") &&
								canManage
							}
							selectWidget={selectWidget}
							updateListCheckbox={updateListCheckbox}
							defaultListPagination={defaultListPagination}
							listPaginationOptions={listPaginationOptions}
							lists={lists}
							lookupData={lookupData}
							contextId={contextId}
							getLookupValues={getLookupValues}
							user={user}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef={"profile"}
							isPrimary={isPrimary}
							secondaryExpanded={secondaryExpanded}
						/>
					);
				case "activities":
					return (
						<Activities
							id={widgetName}
							key={`${contextId}-activities`}
							entity={event}
							selected={view === "Activity Timeline"}
							pageSize={5}
							selectWidget={selectWidget}
							activities={activities}
							canManage={canViewEvents}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef={"profile"}
							userId={userId}
							entityType={entityType}
							readOnly={readOnly}
							forReplay={forReplay}
							endDate={replayEndDate}
						/>
					);
				case "files":
					return (
						<FileWidget
							id={widgetName}
							selected={view === "Files"}
							selectWidget={selectWidget}
							attachments={attachments}
							canDelete={!readOnly && canManage}
							hasAccess={canViewEvents}
							entityType={entityType}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef={"profile"}
							contextId={contextId}
						/>
					);
				case "secure_share":
					return (
						<SGSettings
							id={widgetName}
							key={contextId}
							selectWidget={selectWidget}
							selected={view === "SecureShare Settings"}
							expanded={false}
							contextId={contextId}
							settings={additionalProperties}
							pinnedItems={pinnedItems}
							isPublic={isPublic}
							type={type}
						/>
					);
				case "proximity":
					return (
						<ProximityWidget
							id={widgetName}
							selected={view === "Proximity"}
							expanded={false} // for styling differences between profile and expanded widget views
							selectWidget={selectWidget}
							event={event}
							canManage={!readOnly && canManage}
							view={view}
							loadProfile={loadProfile}
							contextId={contextId}
							context={context}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef={"profile"}
							isPrimary={isPrimary}
							eventEnded={endDate && moment().diff(endDate) >= 0}
							startProximityEntitiesStream={startProximityEntitiesStream}
							forReplay={forReplay}
						/>
					);
				case "resources":
					return (
						<ResourceWidget
							id={widgetName}
							key={contextId}
							contextId={contextId}
							selectWidget={selectWidget}
							selected={view === "Resources"}
							expanded={false}
							settings={additionalProperties}
							canManage={!readOnly && canManage}
						/>
					);
				case "equipments":
					return (
						<EquipmentWidget
							id={widgetName}
							key={contextId}
							selectWidget={selectWidget}
							selected={view === "Equipment"}
							expanded={false}
							settings={additionalProperties}
							contextId={contextId}
							canManage={!readOnly && canManage}
						/>
					);
				default:
					return null;
			}
		};
		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						readOnly={readOnly}
						context={context}
						name={name}
						displayType={eventType ? eventType.name : ""}
						type={event.isTemplate ? "Template" : endDate ? "Planned" : "Emergent"}
						geometry={geometry}
						description={desc}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						actions={renderActions()}
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
							profile="event"
							expandedWidget={view}
						/>
					</ErrorBoundary>

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

					{/* Share to user's org */}
					<EventShareDialog
						event={event}
						user={user}
						openDialog={openDialog}
						closeDialog={closeDialog}
						publishEvent={publishEvent}
						shareEvent={shareEvent}
						dir={dir}
					/>
					{/* Delete Event */}
					<Dialog
						open={dialog === "eventDeleteDialog"}
						confirm={{
							label: getTranslation("global.profiles.eventProfile.main.confirm"),
							action: handleConfirmDelete
						}}
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
