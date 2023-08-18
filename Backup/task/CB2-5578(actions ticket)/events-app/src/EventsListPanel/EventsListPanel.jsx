import React, { Component, useEffect, useState } from "react";
import { ContextPanel } from "orion-components/ContextPanel";
import { EventDialog } from "orion-components/Profiles";
import ErrorBoundary from "orion-components/ErrorBoundary";
import FilterDialog from "./components/FilterDialog";
import { EventCard } from "orion-components/Events";
import { SearchField, TabPanel } from "orion-components/CBComponents";
import {
	List,
	IconButton,
	CircularProgress,
	Typography,
	Fab,
	Tab,
	Tabs
} from "@mui/material";
import { Settings, Add } from "@mui/icons-material";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import {
	openDialog,
	setMapOffset,
	openPrimary,
	closePrimary,
	closeSecondary,
	updateEventSearch,
	updateEventTemplateSearch,
	viewPrevious,
	loadProfile,
	selectWidget,
	closeDialog,
	updateEventFilters,
	updateTemplateFilters,
	hideEventProfile,
	closePublishDialog,
	publishEvent,
	shareEvent,
	updateWidgetLaunchData
} from "./eventsListPanelActions.js";
import {
	eventsSelector,
	currentOwnedEventsSelector,
	sharedEventsSelector,
	ownedTemplatesSelector,
	sharedTemplatesSelector,
	usedEventTemplatesSelector,
	availableTemplatesSelector
} from "orion-components/GlobalData/Selectors";
import { eventFiltersSelector, eventTemplateFiltersSelector } from "orion-components/AppState/Selectors";
import {
	eventSearchSelector,
	eventTemplateSearchSelector,
	selectedEntityState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";

import {
	AccessPointProfile,
	CameraProfile,
	EntityProfile,
	EventProfile,
	FacilityProfile
} from "orion-components/Profiles";

import * as cameraProfileActions from "./CameraProfile/cameraProfileActions";
import * as entityProfileActions from "./EntityProfile/entityProfileActions";
import * as eventProfileActions from "./EventProfile/eventProfileActions";
import * as facilityProfileActions from "./FacilityProfile/facilityProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import $ from "jquery";
import { makeStyles } from "@mui/styles";

const styles = {
	contentContainerStyle: {
		backgroundColor: "transparent",
		marginRight: 16,
		width: "100%",
		height: "100%"
	},
	progress: {
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	button: {
		marginTop: 16,
		marginBottom: 8
	},
	contentContainerStyleRTL: {
		backgroundColor: "transparent",
		marginLeft: 16,
		width: "100%",
		height: "100%"
	},
	tabStyle: {
		color: "#fff!important",
		opacity: 0.7,
		width: "50%",
		fontSize: 14,
		letterSpacing: "normal",
		padding: 0,
		"&:hover": {
			opacity: 1
		}
	}
};

const useStyles = makeStyles({
	selected: {
		color: "#fff!important",
		opacity: 1
	},
	root: {
		"&.Mui-disabled": {
			background: "#3F3F40 !important"

		}
	}
});

const EventsListPanel = () => {

	const dispatch = useDispatch();
	const classes = useStyles();

	const eventFilters = useSelector(state => eventFiltersSelector(state));
	const selectedEntity = useSelector(state => selectedEntityState(state));
	const profileLoaded = useSelector(state => !state.appState.loading.profileLoading && Boolean(selectedContextSelector(state)));
	const ownedEvents = useSelector(state => currentOwnedEventsSelector(state));
	const sharedEvents = useSelector(state => sharedEventsSelector(state));
	const ownedTemplates = useSelector(state => ownedTemplatesSelector(state));
	const sharedTemplates = useSelector(state => sharedTemplatesSelector(state));
	const availableTemplates = useSelector(state => availableTemplatesSelector(state));
	const eventFiltering = _.size(_.filter(eventFilters, filter => _.size(filter)));
	const events = useSelector(state => eventsSelector(state));
	const appState = useSelector(state => state.appState);
	const mapState = useSelector(state => state.mapState);
	const eventSearch = useSelector(state => eventSearchSelector(state));
	const eventTemplateSearch = useSelector(state => eventTemplateSearchSelector(state));
	const user = useSelector(state => state.session.user.profile);
	const profileMode = selectedEntity ? selectedEntity.type : null;
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const dialogData = appState.dialog.dialogData;
	const drawingToolsActive = !!mapState.mapTools.type;
	const widgetLaunchData = useSelector(state => state.userAppState.widgetLaunchData);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	const [tab, setTab] = useState("events");
	const mobile = $(window).width() <= 1023;

	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId, widget } = widgetLaunchData;
			if (entityId) {
				const entity = events[entityId];
				if (entity) {
					// -- load profile if entityId is present in widgetLaunchData (passed in through URL)
					dispatch(loadProfile(
						entity.id,
						entity.name,
						entity.entityType,
						"profile",
						"primary"
					));

					// -- remove entityId from widgetLaunchData
					const data = { widget };
					dispatch(updateWidgetLaunchData(data));
				}
				else if (Object.keys(events).length > 0 /*&& events === prevProps.events*/) {
					// -- if events list has been populated and no matching entity found, drop launch data
					dispatch(updateWidgetLaunchData(null));
				}
			}
			else if (widget && profileLoaded) {
				// -- load profile if widget is present in widgetLaunchData (passed in through URL) and profile is already loaded
				let selectedWidget = "map-view";
				switch (widget.toLowerCase()) {
					case "notes":
						selectedWidget = "Notes";
						break;
					case "pinned-items":
						selectedWidget = "Pinned Items";
						break;
					case "activity-timeline":
						selectedWidget = "Activity Timeline";
						break;
					case "event-lists":
						selectedWidget = "Event Lists";
						break;
					case "files":
						selectedWidget = "Files";
						break;
					case "cameras":
					// selectedWidget = "Cameras";
					case "linked-items":
					// selectedWidget = "Linked Items";
					case "live-camera":
					// selectedWidget = "Live Camera";
					case "secureshare-settings":
					//selectedWidget = "SecureShare Settings";
					default:
				}
				dispatch(selectWidget(selectedWidget));

				// -- remove all data from widgetLaunchData
				dispatch(updateWidgetLaunchData(null));
			}
			else if (!entityId && !widget) {
				// -- empty entityId and widget data, reset widgetLaunchData
				dispatch(updateWidgetLaunchData(null));
			}
		}
	}, [widgetLaunchData, profileLoaded, events]);

	const handleCreateEvent = () => {
		dispatch(openDialog("eventCreateDialog"));
	};

	const handleCreateTemplate = () => {
		dispatch(openDialog("eventCreateDialog", { isTemplate: true }));
	};

	const handleTabSelect = (event, tab) => {
		setTab(tab);
		dispatch(openPrimary());
	};

	const renderProfile = mode => {
		switch (mode) {
			case "facility": {
				return (
					<ErrorBoundary>
						<FacilityProfile
							{...facilityProfileActions}
							actionOptions={["hide"]}
							widgetsLaunchable={true}
							disableCameras={true}
						/>
					</ErrorBoundary>
				);
			}
			case "event":
				return (
					<ErrorBoundary>
						<EventProfile
							{...eventProfileActions}
							widgetsLaunchable={true}
							shareEvent={shareEvent}
							publishEvent={publishEvent}
							widgetsExpandable={!mobile}
						/>
					</ErrorBoundary>
				);
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfile {...cameraProfileActions} disableLinkedItems={true} widgetsExpandable={false} widgetsLaunchable={true} />
					</ErrorBoundary>
				);

			case "entity":
			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfile {...entityProfileActions} widgetsLaunchable={true} />
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfile selectFloorPlan={facilityProfileActions.selectFloorPlan} widgetsExpandable={true} widgetsLaunchable={true} />
					</ErrorBoundary>
				);
			default:
				break;
		}
	};

	const handleEventSearch = e => {
		dispatch(updateEventSearch(e.target.value));
	};

	const handleEventClear = () => {
		dispatch(updateEventSearch(""));
	};

	const handleTemplateSearch = e => {
		dispatch(updateEventTemplateSearch(e.target.value));
	};

	const handleTemplateClear = () => {
		dispatch(updateEventTemplateSearch(""));
	};

	const templatesArr = [];
	for (const [key, value] of Object.entries(events)) {
		if (value.template) {
			templatesArr.push({ "id": value.template, "name": value.templateName });
		}
	}
	const usedTemplates = _.uniqWith(templatesArr, _.isEqual);

	//Creates "Blank" in template select menu.
	const availableTemplatesArr = Object.values(availableTemplates);

	const hasEvents = Boolean(_.size(ownedEvents) + _.size(sharedEvents));
	const hasTemplates = Boolean(_.size(ownedTemplates) + _.size(sharedTemplates));
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "events-app")
		&& user.applications.find(app => app.appId === "events-app").permissions
		&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");

	const handleCloseDialog = (dialog) => {
		dispatch(closeDialog(dialog));
	};
	const dirStyles = {
		newTemplate: {
			...(dir === "rtl" && { marginLeft: 0, marginRight: "1rem" })
		}
	};
	return (
		<div>
			<ContextPanel
				hidden={drawingToolsActive}
				className="events-list-panel"
				secondaryClassName="event-profile"
				style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
				dir={dir}
			>
				<div className="tabWrapper">
					<Tabs
						value={tab || 0}
						TabIndicatorProps={{
							sx: {
								backgroundColor: "rgb(53, 183, 243)"
							}
						}}
						// tabItemContainerStyle={dir == "rtl" ? styles.contentContainerStyleRTL : styles.contentContainerStyle}
						// inkBarStyle={dir == "rtl" ? { right: tab == "events" ? 0 : "50%", transition: "right 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms" } : {}}
						onChange={handleTabSelect}
					>
						<Tab
							label={getTranslation("eventListPanel.main.events")}
							value="events"
							sx={styles.tabStyle}
							classes={{ selected: classes.selected }}
						/>
						<Tab
							label={getTranslation("eventListPanel.main.templates")}
							value="templates"
							sx={styles.tabStyle}
							classes={{ selected: classes.selected }}
						/>
					</Tabs>
					<TabPanel value={"events"} selectedTab={tab}>
						{tab === "events" && (
							<div style={{ height: `calc(100vh - ${WavCamOpen ? "332px" : "96px"})` }} className="events-list-wrapper">
								<div className="button-create-new">
									<Fab
										onClick={handleCreateEvent}
										color="primary"
										size="small"
										disabled={!canManage}
										classes={{ root: classes.root }}
									>
										<Add style={{ color: "#FFF" }} />
									</Fab>
									<p className="cb-font-b2" style={dirStyles.newTemplate}><Translate value="eventListPanel.main.newEvent" /></p>
								</div>
								<div className="events-list">
									<div style={{ display: "flex", alignItems: "center" }}>
										<SearchField
											id="events-search"
											value={eventSearch}
											handleChange={handleEventSearch}
											handleClear={handleEventClear}
											placeholder={getTranslation("eventListPanel.main.searchItems")}
											dir={dir}
										/>
										<IconButton
											style={styles.button}
											onClick={() => dispatch(openDialog("filterDialog"))}
										>
											<Settings style={{ color: eventFiltering ? "#35b7f3" : "" }} />
										</IconButton>
									</div>
									{!hasEvents ? (
										<div className="cb-font-b2 empty-message">
											<Translate value="eventListPanel.main.clickToCreate" />
										</div>
									) : (
										<div className="event-list">
											<section>
												<Typography variant="h6"><Translate value="eventListPanel.main.myEvents" /></Typography>
												<List>
													{_.map(
														_.orderBy(ownedEvents, "startDate", "desc"),
														event => {
															return (
																<ErrorBoundary key={event.id}>
																	<EventCard
																		event={event}
																		expandable={false}
																	/>
																</ErrorBoundary>
															);
														}
													)}
												</List>
												<Typography variant="h6"><Translate value="eventListPanel.main.eventsShared" /></Typography>
												<List>
													{_.map(
														_.orderBy(sharedEvents, "startDate", "desc"),
														event => {
															return (
																<ErrorBoundary key={event.id}>
																	<EventCard
																		event={event}
																		expandable={false}
																	/>
																</ErrorBoundary>
															);
														}
													)}
												</List>
											</section>
										</div>
									)}
								</div>
								{dialog === "filterDialog" && (
									<FilterDialog
										open={dialog === "filterDialog"}
										filters={eventFilters}
										closeDialog={handleCloseDialog}
										updateFilters={updateEventFilters}
										activeTab="Events"
										usedTemplates={usedTemplates}
										dir={dir}
									/>
								)}
							</div>
						)}
					</TabPanel>
					<TabPanel value={"templates"} selectedTab={tab}>
						{tab === "templates" && (
							<div style={{ height: `calc(100vh - ${WavCamOpen ? "332px" : "96px"})` }} className="templates-list-wrapper">
								<div className="button-create-new">
									<Fab disabled={!canManage} onClick={handleCreateTemplate} color="primary" classes={{ root: classes.root }} size="small">
										<Add style={{ color: "#FFF" }} />
									</Fab>
									<p className="cb-font-b2" style={dirStyles.newTemplate}><Translate value="eventListPanel.main.newTemplate" /></p>
								</div>
								<div className="templates-list">
									<div style={{ display: "flex", alignItems: "center" }}>
										<SearchField
											id="templates-search"
											value={eventTemplateSearch}
											handleChange={handleTemplateSearch}
											handleClear={handleTemplateClear}
											placeholder={getTranslation("eventListPanel.main.searchTemplates")}
											dir={dir}
										/>
									</div>
									{!hasTemplates ? (
										<div className="cb-font-b2 empty-message">
											<Translate value="eventListPanel.main.clickToCreateTemplate" />
										</div>
									) : (
										<div className="template-list">
											<section>
												<Typography variant="h6"><Translate value="eventListPanel.main.eventTemplates" /></Typography>
												<List>
													{_.map(
														_.orderBy(ownedTemplates, "name", "asc"),
														event => {
															return (
																<ErrorBoundary key={event.id}>
																	<EventCard
																		event={event}
																		expandable={false}
																	/>
																</ErrorBoundary>
															);
														}
													)}
												</List>
												<Typography variant="h6"><Translate value="eventListPanel.main.templatesShared" /></Typography>
												<List>
													{_.map(
														_.orderBy(sharedTemplates, "name", "asc"),
														event => {
															return (
																<ErrorBoundary key={event.id}>
																	<EventCard
																		event={event}
																		expandable={false}
																	/>
																</ErrorBoundary>
															);
														}
													)}
												</List>
											</section>
										</div>
									)}
								</div>
							</div>

						)}

					</TabPanel>
				</div>

				{
					profileLoaded ? (
						renderProfile(profileMode)
					) : (
						<div style={styles.progress}>
							<CircularProgress color="primary" size={200} />
						</div>
					)
				}
			</ContextPanel >
			<ErrorBoundary>
				<EventDialog
					editing={false}
					open={dialog === "eventCreateDialog"}
					closeDialog={handleCloseDialog}
					isTemplate={(dialogData !== null && dialogData.isTemplate !== null) ? dialogData.isTemplate : false}
					allTemplates={availableTemplatesArr}
					dir={dir}
					locale={locale}
				/>
			</ErrorBoundary>
		</div >
	);
};

export default EventsListPanel;
