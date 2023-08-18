import React, { Component } from "react";
import { ContextPanel } from "orion-components/ContextPanel";
import { EventDialog } from "orion-components/Profiles";
import ErrorBoundary from "orion-components/ErrorBoundary";
import FilterDialog from "./components/FilterDialog";
import EventCardContainer from "./EventCard/EventCardContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import AccessPointProfileContainer from "./AccessPointProfile/AccessPointProfileContainer";
import { SearchField } from "orion-components/CBComponents";
import {
	List,
	IconButton,
	CircularProgress,
	Typography,
	Fab
} from "@material-ui/core";
import Tabs, { Tab } from "material-ui/Tabs";
import { Settings, Add } from "@material-ui/icons";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

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
	}
};

class EventsListPanel extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			tab: "events"
		};
	}
	
	componentDidUpdate(prevProps, prevState) {
		const { widgetLaunchData, events, loadProfile, profileLoaded, updateWidgetLaunchData, selectWidget } = this.props;

		if (widgetLaunchData) {
			const { entityId, widget } = widgetLaunchData;
			if (entityId) {	
				const entity = events[entityId];
				if (entity) {
					// -- load profile if entityId is present in widgetLaunchData (passed in through URL)
					loadProfile(
						entity.id,
						entity.name,
						entity.entityType,
						"profile",
						"primary"
					);

					// -- remove entityId from widgetLaunchData
					const data = { widget };
					updateWidgetLaunchData(data);
				}
				else if (Object.keys(events).length > 0 && events === prevProps.events) {
					// -- if events list has been populated and no matching entity found, drop launch data
					updateWidgetLaunchData(null);
				}
			}
			else if (widget && profileLoaded) {
				// -- load profile if widget is present in widgetLaunchData (passed in through URL) and profile is already loaded
				let selectedWidget = "Map Planner";
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
				selectWidget(selectedWidget);

				// -- remove all data from widgetLaunchData
				updateWidgetLaunchData(null);
			}
			else if (!entityId && !widget) {
				// -- empty entityId and widget data, reset widgetLaunchData
				updateWidgetLaunchData(null);
			}
		}
	}

	handleCreateEvent = () => {
		const { openDialog } = this.props;
		openDialog("eventCreateDialog");
	};

	handleCreateTemplate = () => {
		const { openDialog } = this.props;
		openDialog("eventCreateDialog", { isTemplate: true} );
	};
	
	handleTabSelect = tab => {
		const { openPrimary } = this.props;
		
		this.setState({
			tab: tab
		});
		
		openPrimary();
	};

	renderProfile = mode => {
		const { deleteEvent, shareEvent, publishEvent } = this.props;
		switch (mode) {
			case "facility": {
				return (
					<ErrorBoundary>
						<FacilityProfileContainer />
					</ErrorBoundary>
				);
			}
			case "event":
				return (
					<ErrorBoundary>
						<EventProfileContainer
							deleteEvent={deleteEvent}
							shareEvent={shareEvent}
							publishEvent={publishEvent}
						/>
					</ErrorBoundary>
				);
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfileContainer />
					</ErrorBoundary>
				);

			case "entity":
			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfileContainer />
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfileContainer />
					</ErrorBoundary>
				);
			default:
				break;
		}
	};

	handleEventSearch = e => {
		const { updateEventSearch } = this.props;
		updateEventSearch(e.target.value);
	};

	handleEventClear = () => {
		const { updateEventSearch } = this.props;
		updateEventSearch("");
	};

	handleTemplateSearch = e => {
		const { updateEventTemplateSearch } = this.props;
		updateEventTemplateSearch(e.target.value);
	};

	handleTemplateClear = () => {
		const { updateEventTemplateSearch } = this.props;
		updateEventTemplateSearch("");
	};

	placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	render() {
		const {
			eventSearch,
			eventTemplateSearch,
			ownedEvents,
			sharedEvents,
			ownedTemplates,
			sharedTemplates,
			profileMode,
			profileLoaded,
			dialog,
			closeDialog,
			openDialog,
			dialogData,
			updateEventFilters,
			eventFiltering,
			eventFilters,
			drawingToolsActive,
			user, 
			WavCamOpen,
			availableTemplates,
			events,
			dir,
			locale
		} = this.props;	

		const templatesArr = [];
		for (const [key, value] of Object.entries(events)){
			if(value.template){
				templatesArr.push({"id": value.template, "name": value.templateName});
			}
		}
		const usedTemplates = _.uniqWith(templatesArr, _.isEqual);

		//Creates "Blank" in template select menu.
		const availableTemplatesArr = Object.values(availableTemplates);

		const { tab } = this.state;
		const hasEvents = Boolean(_.size(ownedEvents) + _.size(sharedEvents));
		const hasTemplates = Boolean(_.size(ownedTemplates) + _.size(sharedTemplates));
		const canManage = user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
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
							tabItemContainerStyle={dir == "rtl" ? styles.contentContainerStyleRTL : styles.contentContainerStyle}
							inkBarStyle= {dir == "rtl" ? {right: tab == "events" ? 0 : "50%", transition: "right 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms"} : {}}
						>
							<Tab
								label={<Translate value="eventListPanel.main.events"/>}
								value="events"
								onActive={() => this.handleTabSelect("events")}
							>
								{tab === "events" && (
									<div style={{ height: `calc(100vh - ${WavCamOpen ? "332px" : "96px"})` }} className="events-list-wrapper">
										<div className="button-create-new">
											<Fab disabled={!canManage} onClick={this.handleCreateEvent} color="primary" size="small">
												<Add style={{ color: "#FFF" }} />
											</Fab>
											<p className="cb-font-b2" style={dir == "rtl" ? {marginLeft: 0, marginRight: "1rem"} : {}}><Translate value="eventListPanel.main.newEvent"/></p>
										</div>
										<div className="events-list">
											<div style={{ display: "flex", alignItems: "center" }}>
												<SearchField
													id="events-search"
													value={eventSearch}
													handleChange={this.handleEventSearch}
													handleClear={this.handleEventClear}
													placeholder={this.placeholderConverter("eventListPanel.main.searchItems")}
													dir={dir}
												/>
												<IconButton
													style={styles.button}
													onClick={() => openDialog("filterDialog")}
												>
													<Settings style={{ color: eventFiltering ? "#35b7f3" : "" }} />
												</IconButton>
											</div>
											{!hasEvents ? (
												<div className="cb-font-b2 empty-message">
													<Translate value="eventListPanel.main.clickToCreate"/>
												</div>
											) : (
												<div className="event-list">
													<section>
														<Typography variant="h6"><Translate value="eventListPanel.main.myEvents"/></Typography>
														<List>
															{_.map(
																_.orderBy(ownedEvents, "startDate", "desc"),
																event => {
																	return (
																		<ErrorBoundary key={event.id}>
																			<EventCardContainer
																				event={event}
																				expandable={false}
																			/>
																		</ErrorBoundary>
																	);
																}
															)}
														</List>
														<Typography variant="h6"><Translate value="eventListPanel.main.eventsShared"/></Typography>
														<List>
															{_.map(
																_.orderBy(sharedEvents, "startDate", "desc"),
																event => {
																	return (
																		<ErrorBoundary key={event.id}>
																			<EventCardContainer
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
												closeDialog={closeDialog}
												updateFilters={updateEventFilters}
												activeTab="Events"
												usedTemplates={usedTemplates}
												dir={dir}
											/>
										)}
									</div>
								)}
							</Tab>
							<Tab
								label={<Translate value="eventListPanel.main.templates"/>}
								value="templates"
								onActive={() => this.handleTabSelect("templates")}
							>
								{tab === "templates" && (
									<div style={{ height: `calc(100vh - ${WavCamOpen ? "332px" : "96px"})` }} className="templates-list-wrapper">
										<div className="button-create-new">
											<Fab disabled={!canManage} onClick={this.handleCreateTemplate} color="primary" size="small">
												<Add style={{ color: "#FFF" }} />
											</Fab>
											<p className="cb-font-b2" style={dir == "rtl" ? {marginLeft: 0, marginRight: "1rem"} : {}}><Translate value="eventListPanel.main.newTemplate"/></p>
										</div>
										<div className="templates-list">
											<div style={{ display: "flex", alignItems: "center" }}>
												<SearchField
													id="templates-search"
													value={eventTemplateSearch}
													handleChange={this.handleTemplateSearch}
													handleClear={this.handleTemplateClear}
													placeholder={this.placeholderConverter("eventListPanel.main.searchTemplates")}
													dir={dir}
												/>
											</div>
											{!hasTemplates ? (
												<div className="cb-font-b2 empty-message">
													<Translate value="eventListPanel.main.clickToCreateTemplate"/>
												</div>
											) : (
												<div className="template-list">
													<section>
														<Typography variant="h6"><Translate value="eventListPanel.main.eventTemplates"/></Typography>
														<List>
															{_.map(
																_.orderBy(ownedTemplates, "name", "asc"),
																event => {
																	return (
																		<ErrorBoundary key={event.id}>
																			<EventCardContainer
																				event={event}
																				expandable={false}
																			/>
																		</ErrorBoundary>
																	);
																}
															)}
														</List>
														<Typography variant="h6"><Translate value="eventListPanel.main.templatesShared"/></Typography>
														<List>
															{_.map(
																_.orderBy(sharedTemplates, "name", "asc"),
																event => {
																	return (
																		<ErrorBoundary key={event.id}>
																			<EventCardContainer
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
							</Tab>
							
						</Tabs>
					</div>
					
					{profileLoaded ? (
						this.renderProfile(profileMode)
					) : (
						<div style={styles.progress}>
							<CircularProgress color="primary" size={200} />
						</div>
					)}
				</ContextPanel>
				<ErrorBoundary>
					<EventDialog
						editing={false}
						open={dialog === "eventCreateDialog"}
						closeDialog={closeDialog}
						isTemplate={(dialogData !== null && dialogData.isTemplate !== null) ? dialogData.isTemplate : false}
						allTemplates={availableTemplatesArr}
						dir={dir}
						locale={locale}
					/>
				</ErrorBoundary>
			</div>
		);
	}
}

export default EventsListPanel;
