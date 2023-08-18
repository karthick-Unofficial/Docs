import React, { useEffect, createRef, useState, useRef } from "react";
import moment from "moment";
import { eventService } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import EventsMap from "../EventsMap/EventsMap";
import {
	PinnedItemsWidget,
	Activities,
	ListWidget,
	FileWidget,
	PhoenixDropzone,
	NotesWidget,
	SGSettings,
	ProximityWidget,
	ResourceWidget,
	EquipmentWidget
} from "orion-components/Profiles/Widgets";

import { Button } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	updateListCheckbox,
	getContextListCategory,
	updateActivityFilters,
	attachFilesToEvent,
	updateEventNotes,
	deleteEventNotes,
	downloadEventNotes,
	selectWidget,
	loadProfile,
	openDialog,
	closeDialog,
	updateEvent,
	getLookupValues,
	unsubscribeFromFeed,
	startProximityEntitiesStream
} from "./eventViewActions.js";

import { persistedState } from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import $ from "jquery";
import _ from "lodash";



function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

const EventView = ({
	updateNotesStatus
}) => {

	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user.profile);
	const orgId = useSelector(state => state.session.user.profile.orgId);
	const clientConfig = useSelector(state => state.clientConfig);
	const contextualData = useSelector(state => state.contextualData);
	const primaryId = useSelector(state => primaryContextSelector(state));
	const context = contextualData[primaryId];
	const view = useSelector(state => context ? state.userAppState.eventView : "map-view");
	const isLoaded = _.isObject(context) && context.entity;
	const activityFilters = useSelector(state => persistedState(state).activityFilters);
	let lookupData = {};
	lookupData = useSelector(state => state.globalData && state.globalData.listLookupData ? state.globalData.listLookupData : {});

	let event;
	let fromOrg;
	let fromEco;
	let contextId;
	let isPrimary;
	let feeds;

	if (isLoaded) {
		const entity = context.entity;
		const ownerOrg = entity.ownerOrg;
		event = entity;
		contextId = entity.id;
		//isPrimary = contextId === contextPanelState(state).selectedContext.primary;
		// Check which org created event
		fromOrg = ownerOrg === orgId;
		fromEco = ownerOrg !== orgId;
	}

	isPrimary = useSelector(state => isLoaded && contextId === contextPanelState(state).selectedContext.primary);
	feeds = useSelector(state => isLoaded && userFeedsSelector(state));

	let viewWidth;
	const primaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.primaryOpen);
	const secondaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.secondaryOpen);
	const secondaryExpanded = useSelector(state => state.appState.contextPanel.contextPanelData.secondaryExpanded);

	// Set view width based on which panels are open
	if (view === "map-view") {
		viewWidth = "full";
	} else if (!primaryOpen) {
		if (secondaryOpen && secondaryExpanded) {
			viewWidth = "onlySecondaryExpanded";
		} else if (secondaryOpen) {
			viewWidth = "onlySecondary";
		} else {
			viewWidth = "wide";
		}
	} else if (secondaryOpen && secondaryExpanded) {
		viewWidth = "secondaryExpanded";
	} else if (secondaryOpen) {
		viewWidth = "narrow";
	} else if (primaryOpen) {
		viewWidth = "normal";
	}

	const defaultListPagination = useSelector(state => state.clientConfig.defaultListPagination);
	const listPaginationOptions = useSelector(state => state.clientConfig.listPaginationOptions);
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const mobile = $(window).width() <= 1023;
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));

	const dynamicWidget = createRef();

	const [notesChanged, setNotesChanged] = useState(false);
	const [Event, setEvent] = useState({});
	const [notes, setNotes] = useState({});
	const [currentHtml, setCurrentHtml] = useState({});
	const prevEvent = usePrevious(event);

	useEffect(() => {
		if (event) {
			setEvent(event);
			setNotes({});
			//setNotesChanged(false);
		}
	}, [event]);

	const UpdateNotesStatus = value => {
		if (value !== notesChanged) {
			setNotesChanged(value);
		}
	};

	useEffect(() => {
		if (event && event.notes) {
			retrieveHTML(event.notes);
		}
	}, []);

	useEffect(() => {
		if (event) {
			const { id, type, notes } = event;
			if (!prevEvent) {
				if (notes) {
					retrieveHTML(notes);
				}
			}
			if (prevEvent) {
				if (
					(id !== prevEvent.id && notes) ||
					(!prevEvent.notes && notes) ||
					prevEvent.notes !== notes
				) {
					retrieveHTML(notes);
				}
			}

			if (view === "SecureShare Settings" && type !== "sc_thread") {
				dispatch(selectWidget("map-view"));
			}
		}
	}, [event]);

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
		await deleteEventNotes(eventId, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				setEvent(result);
				setNotes({});
			}
		});
	};

	const handleOpenDialog = (dialog) => {
		dispatch(openDialog(dialog));
	};

	const handleCloseDialog = (dialog) => {
		dispatch(closeDialog(dialog));
	};

	const getEventView = view => {
		if (view === "map-view") {
			return <EventsMap />;
		} else if (context) {
			const { attachments, activities, pinnedItems, lists, listCategories } = context;
			const { endDate, additionalProperties } = event;
			const canManage = user.applications
				&& user.applications.find(app => app.appId === "events-app")
				&& user.applications.find(app => app.appId === "events-app").permissions
				&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
			switch (view) {
				case "Notes":
					return (
						<ErrorBoundary>
							<NotesWidget
								ref={dynamicWidget}
								expanded={true}
								enabled={true}
								dialog={dialog}
								openDialog={handleOpenDialog}
								closeDialog={handleCloseDialog}
								event={Event}
								activities={activities}
								canContribute={canManage}
								notes={
									notes && notes.html
										? notes
										: currentHtml && currentHtml.html ? currentHtml : { html: "<p><br></p>" }
								}
								updateNotes={(event, notes) => dispatch(updateEventNotes(event, notes))}
								updateNotesStatus={UpdateNotesStatus}
								deleteNotes={deleteNotes}
								dir={dir}
								setHtml={setCurrentHtml}
							/>
						</ErrorBoundary>
					);
				case "Pinned Items":
					return (
						pinnedItems && (
							<ErrorBoundary>
								<PinnedItemsWidget
									ref={dynamicWidget}
									expanded={true}
									enabled={true}
									items={pinnedItems}
									canManage={canManage}
									event={event}
									loadProfile={loadProfile}
									contextId={contextId}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef="profile"
									dialog={dialog}
									openDialog={handleOpenDialog}
									closeDialog={handleCloseDialog}
									isPrimary={isPrimary}
									eventEnded={endDate && moment().diff(endDate) >= 0}
									feeds={feeds}
									dir={dir}
								/>
							</ErrorBoundary>
						)
					);

				case "Activity Timeline":
					return (
						activities && (
							<ErrorBoundary>
								<Activities
									ref={dynamicWidget}
									expanded={true}
									enabled={true}
									canManage={canManage}
									pageSize={5}
									activities={activities}
									entity={event}
									updateActivityFilters={updateActivityFilters}
									activityFilters={activityFilters}
									contextId={contextId}
									isPrimary={isPrimary}
									dir={dir}
									dialog={dialog}
									openDialog={openDialog}
									closeDialog={closeDialog}
								/>
							</ErrorBoundary>
						)
					);
				case "Event Lists":
					return (
						lists && (
							<ErrorBoundary>
								<ListWidget
									ref={dynamicWidget}
									expanded={true}
									enabled={true}
									canRemoveLists={
										canManage
									}
									canAddEditLists={canManage}
									updateListCheckbox={updateListCheckbox}
									defaultListPagination={defaultListPagination}
									listPaginationOptions={listPaginationOptions}
									retrieveListCategory={getContextListCategory}
									lists={lists}
									listCategories={listCategories}
									lookupData={lookupData}
									getLookupValues={getLookupValues}
									user={user}
									contextId={contextId}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef={"profile"}
									openDialog={handleOpenDialog}
									closeDialog={handleCloseDialog}
									dialog={dialog}
									isPrimary={isPrimary}
									dir={dir}
								/>
							</ErrorBoundary>
						)
					);

				case "Files":
					return (
						attachments && (
							<ErrorBoundary>
								<FileWidget
									ref={dynamicWidget}
									id="files"
									expanded={true}
									enabled={true}
									attachments={attachments}
									canDelete={
										canManage
									}
									hasAccess={user.applications
										&& user.applications.find(app => app.appId === "events-app")
										&& user.applications.find(app => app.appId === "events-app").config
										&& user.applications.find(app => app.appId === "events-app").config.canView}
									attachFiles={attachFilesToEvent}
									isPrimary={isPrimary}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef={"profile"}
									contextId={contextId}
									entityType="event"
									dir={dir}
								/>
							</ErrorBoundary>
						)
					);

				case "SecureShare Settings": {
					return (
						<SGSettings
							enabled={true}
							selected={true}
							canContribute={canManage}
							expanded={true}
							updateEvent={updateEvent}
							contextId={contextId}
							settings={additionalProperties}
							pinnedItems={pinnedItems}
							isPublic={event.isPublic}
							dir={dir}
						/>
					);
				}


				case "Proximity":
					return (
						<ErrorBoundary>
							<ProximityWidget
								ref={dynamicWidget}
								expanded={true}
								enabled={true}
								event={event}
								canManage={canManage}
								loadProfile={loadProfile}
								contextId={contextId}
								context={context}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef={"profile"}
								dialog={dialog}
								openDialog={handleOpenDialog}
								closeDialog={handleCloseDialog}
								isPrimary={isPrimary}
								eventEnded={endDate && moment().diff(endDate) >= 0}
								feeds={feeds}
								startProximityEntitiesStream={startProximityEntitiesStream}
								dir={dir}
							/>
						</ErrorBoundary>
					);
				case "Resources":
					return (
						<ErrorBoundary>
							<ResourceWidget
								ref={dynamicWidget}
								id="resources"
								enabled={true}
								expanded={true}
								contextId={contextId}
								settings={additionalProperties}
								canManage={canManage}
							/>
						</ErrorBoundary>
					);
				case "Equipment":
					return (
						<ErrorBoundary>
							<EquipmentWidget
								ref={dynamicWidget}
								id="equipments"
								enabled={true}
								expanded={true}
								contextId={contextId}
								settings={additionalProperties}
								canManage={canManage}
							/>
						</ErrorBoundary>
					);


				default:
					break;
			}
		}
	};

	const getViewAction = view => {
		const { endDate } = event;
		const eventEnded = endDate && moment().diff(endDate) >= 0;
		const canManage = user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
		const canView = user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").config
			&& user.applications.find(app => app.appId === "events-app").config.canView;

		switch (view) {
			case "Pinned Items": {
				return canManage ? (
					<div className="widget-option-button">
						{!eventEnded && (
							<Button
								variant="text"
								onClick={() => dispatch(openDialog("pinnedItemDialog"))}
							>
								{getTranslation("eventView.pinItem")}
							</Button>
						)}
					</div>
				) : (
					<div />
				);
			}

			case "Files": {
				return canView ? (
					<div className="widget-option-button">
						<PhoenixDropzone
							targetEntityId={event.id}
							targetEntityType={"event"}
							attachAction={attachFilesToEvent}
						/>
					</div>
				) : (
					<div />
				);
			}

			case "Event Lists": {
				return (
					<div className="widget-option-button">
						{canManage ? (
							<Button
								variant="text"
								onClick={() => dynamicWidget.current.openListDialog()}
							>
								{getTranslation("eventView.addList")}
							</Button>
						) : (
							<div />
						)}
					</div>
				);
			}

			case "Notes": {
				return (
					<div>
						{notesChanged ? (
							<div className={"widget-option-button"}>
								<Button
									variant="text"
									onClick={() => dynamicWidget.current.cancelEdit()}
								>
									{getTranslation("eventView.cancel")}
								</Button>
								<Button
									variant="text"
									onClick={() => dynamicWidget.current.saveEdit()}
								>
									{getTranslation("eventView.save")}
								</Button>
							</div>
						) : (
							<div />
						)
						}
					</div >
				);
			}

			case "Proximity": {
				return canManage ? (
					<div className="widget-option-button">
						{!eventEnded && (
							<Button
								variant="text"
								onClick={() => dispatch(openDialog("proximityDialog"))}
							>
								{getTranslation("eventView.createProxZone")}
							</Button>
						)}
					</div>
				) : (
					<div />
				);
			}
			default:
				return;
		}
	};

	const getViewHeaderTranslation = view => {
		switch (view) {
			case "Pinned Items":
				return "global.profiles.widgets.pinnedItems.main.title";
			case "Files":
				return "global.profiles.widgets.files.title";
			case "Linked Items":
				return "global.profiles.widgets.linkedItems.title";
			case "Activity Timeline":
				return "global.profiles.widgets.activities.main.activityTimeline";
			case "Live Camera":
				return "global.profiles.widgets.liveCam.title";
			case "Notes":
				return "global.profiles.widgets.notes.title";
			case "Resources":
				return "global.profiles.widgets.hrms.resourcesWidget.resources";
			case "Proximity":
				return "global.profiles.widgets.proximity.main.title";
			case "Equipment":
				return "global.profiles.widgets.hrms.equipmentsWidget.equipment";
			case "Event Lists":
				return "global.profiles.widgets.list.main.eventLists";
			default:
				return view;
		}
	};

	const showHeader = view !== "map-view";

	return !mobile ? (
		<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="view-wrapper">
			<div style={{
				left: dir === "rtl" ? 0 : null,
				right: dir === "rtl" ? null : 0,
				height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
			}} className={`view-content ${viewWidth} ${view === "Notes" ? "notes-view" : ""}`}
			>
				{event && view && showHeader && (
					<div
						className={`view-header cb-font-b1 ${viewWidth} ${view === "map-view" ? "map-view" : "normal-view"} ${dir}`}
					>
						<Translate value={getViewHeaderTranslation(view)} />
						{/* Portal node for actions */}
						{getViewAction(view)}
						<div id="widget-actions" />
					</div>
				)}
				{getEventView(event ? view : "map-view")}
			</div>
		</div>
	) : (
		<div />
	);
};

export default EventView;
