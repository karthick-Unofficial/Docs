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
	CamerasWidget,
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
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { selectedContextSelector, contextPanelState } from "orion-components/ContextPanel/Selectors";
import { eventTypesSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

import {
	unsubscribeFromFeed,
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startEventCameraStream
} from "orion-components/ContextualData/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";

import { setCameraPriority } from "orion-components/Dock/Actions/index.js";
import {
	publishEvent,
	shareEvent,
	toggleFavoriteTemplate,
	updateEventNotes
} from "../../SharedActions/eventProfileActions";
import { canManageByApplication } from "orion-components/Profiles/Selectors";
import { eventProfileWidgetConfig } from "orion-components/Profiles/Selectors/EventProfileSelectors";
import { getGlobalWidgetState } from "../Widgets/Selectors";

const propTypes = {
	forReplay: PropTypes.bool,
	selectWidget: PropTypes.func,
	updateListCheckbox: PropTypes.func,
	deleteEvent: PropTypes.func,
	readOnly: PropTypes.bool,
	replayEndDate: PropTypes.date,
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacFeed: PropTypes.bool,
	widgetsExpandable: PropTypes.bool,
	widgetsLaunchable: PropTypes.bool
};
const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { },
	widgetsExpandable: false
};

const EventProfile = ({
	forReplay,
	selectWidget,
	updateListCheckbox,
	deleteEvent,
	readOnly,
	replayEndDate,
	selectFloorPlanOn,
	floorPlansWithFacFeed,
	widgetsExpandable
}) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session?.user?.profile);
	const context = useSelector((state) => selectedContextSelector(state));
	const { entity } = context;
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog);
	const { userAppState } = useSelector((state) => state);
	const view = entity && userAppState ? userAppState?.eventView : null;
	const contextId = entity.id;
	const types = useSelector((state) => eventTypesSelector(state));
	const widgetState = useSelector((state) => widgetStateSelector(state));
	const event = entity;
	const timeFormatPreference = useSelector((state) => state.appState?.global?.timeFormat);
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state.i18n?.locale);
	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData?.floorPlanWithFacilityFeedId?.floorPlans : null
	);

	const secondaryExpanded = useSelector((state) => contextPanelState(state).secondaryExpanded);

	const { attachments, activities, pinnedItems, lists, eventCameras } = context ?? {};
	const { entityData, name, desc, type, endDate, entityType } = event ?? {};
	const additionalProperties = event?.additionalProperties || {};
	const eventType = types[type];
	const { geometry } = entityData ?? {};
	const { respondingUnits, status, address } = additionalProperties ?? {};
	const appId = useSelector((state) => state.appId);

	const canManage = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canShare =
		!event.isTemplate &&
		useSelector((state) => canManageByApplication(state)("events-app", "share")) &&
		user.orgId === event.ownerOrg;
	const canViewEvents =
		!readOnly && useSelector((state) => canManageByApplication(state)("events-app", "canView", "config"));
	const layoutWidgetState = useSelector((state) => getGlobalWidgetState(state)("layoutControls")) || {};

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(layoutWidgetState?.autoExpand);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [editing, setEditing] = useState(false);
	const [notes, setNotes] = useState({});

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevEvent = usePrevious(event);

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

	const getWidgetConfig = useSelector((state) => eventProfileWidgetConfig(state)(event, widgetsExpandable));

	const getWidgetStatus = (widgetId) => {
		const widgetConfig = getWidgetConfig;
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	const renderActions = () => {
		const { name, isTemplate } = event;

		const canViewReports = user.applications && user.applications.find((app) => app.appId === "reports-app");
		const actions = [];

		if (isTemplate) {
			const favTemplate = {
				name: getTranslation("global.profiles.eventProfile.main.favorite"),
				nameText: "Favorite",
				action: () => {
					dispatch(toggleFavoriteTemplate(event.id));
				}
			};
			actions.push(favTemplate);
		}

		if (!isTemplate && canViewReports) {
			const reportAction = {
				name: getTranslation("global.profiles.eventProfile.main.report"),
				nameText: "Report",
				action: () =>
					window.location.replace(
						`/reports-app/#/report-builder/sitrep?id=sitrep&event=${name}&eventId=${event.id}`
					)
			};
			actions.push(reportAction);
		}

		if (canShare) {
			const shareAction = {
				name: getTranslation("global.profiles.eventProfile.main.share"),
				nameText: "Share",
				action: () => dispatch(openDialog("eventShareDialog"))
			};
			actions.push(shareAction);
		}
		if (canManage) {
			const editAction = {
				name: getTranslation("global.profiles.eventProfile.main.edit"),
				nameText: "Edit",
				action: () => {
					handleEditMode(true);
					dispatch(openDialog("eventEditDialog"));
				}
			};
			actions.push(editAction);
			const deleteAction = {
				name: getTranslation("global.profiles.eventProfile.main.delete"),
				nameText: "Delete",
				action: () => {
					dispatch(openDialog("eventDeleteDialog"));
				}
			};
			if (appId !== "events-app") {
				const LaunchAction = {
					name: getTranslation("global.profiles.eventProfile.main.launch"),
					nameText: "Launch",
					action: () => window.open(`/events-app/#/entity/${contextId}/widget/map`)
				};

				actions.push(LaunchAction);
			}
			if (event.ownerOrg === user.orgId) {
				actions.push(deleteAction);
			}
		}
		return actions;
	};

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
				return <MapWidget id={widgetName} selectWidget={selectWidget} entityType={entityType} />;
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
					<CamerasWidget
						id={widgetName}
						key={`${contextId}-cameras`}
						isEventProfile={true}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef="profile"
						setCameraPriority={setCameraPriority}
						readOnly={readOnly}
						disableSlew={readOnly}
						eventEnded={endDate && moment().diff(endDate) >= 0}
						selectFloorPlanOn={selectFloorPlanOn}
						floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
					/>
				);
			case "gate_runner_response":
				return (
					<GateRunnerResponseWidget
						id={widgetName}
						subscriberRef={"profile"}
						selectWidget={selectWidget}
						contextId={contextId}
						widgetsExpandable={widgetsExpandable}
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
						notes={notes && notes.html ? notes : { html: "<p><br></p>" }}
						contextId={contextId}
						deleteNotes={deleteNotes}
						openDialog={(widget) => dispatch(openDialog(widget))}
						closeDialog={(widget) => dispatch(closeDialog(widget))}
						widgetsExpandable={widgetsExpandable}
					/>
				);
			case "pinned_items":
				return (
					<PinnedItemsWidget
						id={widgetName}
						selected={view === "Pinned Items"}
						selectWidget={selectWidget}
						canManage={!readOnly && canManage}
						view={view}
						contextId={contextId}
						subscriberRef="profile"
						readOnly={readOnly}
						eventEnded={endDate && moment().diff(endDate) >= 0}
						selectFloor={selectFloorPlanOn}
						floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						widgetsExpandable={widgetsExpandable}
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
							user?.integrations?.find((feed) => feed?.entityType === "list") && canManage
						}
						selectWidget={selectWidget}
						updateListCheckbox={updateListCheckbox}
						contextId={contextId}
						subscriberRef={"profile"}
						widgetsExpandable={widgetsExpandable}
					/>
				);
			case "activities":
				return (
					<Activities
						id={widgetName}
						key={`${contextId}-activities`}
						selected={view === "Activity Timeline"}
						pageSize={5}
						selectWidget={selectWidget}
						canManage={canViewEvents}
						contextId={contextId}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef={"profile"}
						readOnly={readOnly}
						forReplay={forReplay}
						endDate={replayEndDate}
						widgetsExpandable={widgetsExpandable}
					/>
				);
			case "files":
				return (
					<FileWidget
						id={widgetName}
						selected={view === "Files"}
						selectWidget={selectWidget}
						canDelete={!readOnly && canManage}
						hasAccess={canViewEvents}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef={"profile"}
						contextId={contextId}
						widgetsExpandable={widgetsExpandable}
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
						expandable={widgetsExpandable}
					/>
				);
			case "proximity":
				return (
					<ProximityWidget
						id={widgetName}
						selected={view === "Proximity"}
						expanded={false} // for styling differences between profile and expanded widget views
						selectWidget={selectWidget}
						canManage={!readOnly && canManage}
						view={view}
						contextId={contextId}
						subscriberRef={"profile"}
						eventEnded={endDate && moment().diff(endDate) >= 0}
						forReplay={forReplay}
						widgetsExpandable={widgetsExpandable}
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
						canManage={!readOnly && canManage}
						expandable={widgetsExpandable}
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
						contextId={contextId}
						canManage={!readOnly && canManage}
						expandable={widgetsExpandable}
					/>
				);
			default:
				return null;
		}
	};

	if (context) {
		const scrollOffset = scrolledUp ? 167 : 0;
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig;

		console.log(">>>", layoutControlsOpen);

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<div style={{ display: layoutControlsOpen ? "block" : "none" }}>
					<ErrorBoundary>
						<LayoutControls
							close={handleCloseEditLayout}
							widgetOrder={widgetState?.length > 0 ? widgetState : widgets}
							profile="event"
							expandedWidget={view}
							widgetState={layoutWidgetState}
						/>
					</ErrorBoundary>
				</div>
				<div style={{ display: layoutControlsOpen ? "none" : "block" }}>
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
						{(widgetState?.length > 0 ? widgetState : widgets)
							.filter((element) => getWidgetStatus(element.id))
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
			</div>
		);
	} else {
		return <div />;
	}
};

EventProfile.propTypes = propTypes;
EventProfile.defaultProps = defaultProps;

export default EventProfile;
