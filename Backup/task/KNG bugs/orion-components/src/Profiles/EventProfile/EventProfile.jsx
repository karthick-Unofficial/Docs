import React, { PureComponent } from "react";
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
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	locale: PropTypes.string
};
const defaultProps = {
	locale: "en"
};

let DEFAULT_WIDGET_CONFIG = [];

class EventProfile extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			layoutControlsOpen: false,
			anchorEl: null,
			scrolledUp: false,
			hasScrolled: false,
			scrollPct: null,
			editing: false,
			hiding: false
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	componentWillMount() {
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
	}
	
	componentDidMount() {
		const {
			event,
			startListStream,
			startEventActivityStream,
			startAttachmentStream,
			startEventPinnedItemsStream,
			startEventCameraStream,
			forReplay
		} = this.props;
		const { id } = event;

		if (!forReplay) {
			if (this.getWidgetStatus("event_lists")) {
				startListStream(id, "profile");
			}
			if (this.getWidgetStatus("activities")) {
				startEventActivityStream(id, "profile");
			}
			if (this.getWidgetStatus("files")) {
				startAttachmentStream(id, "profile");
			}
			if (this.getWidgetStatus("pinned_items")) {
				startEventPinnedItemsStream(id, "profile");
			}
			if (this.getWidgetStatus("cameras")) {
				startEventCameraStream(id, "profile");
			}
			if (this.props.event && this.props.event.notes) {
				this.retrieveHTML(this.props.event.notes);
			}
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}
		this.handleScroll();
	}

	componentDidUpdate(prevProps, prevState) {
		const { event } = this.props;
		if (event && prevProps.event) {
			if (prevProps.event.notes !== event.notes) {
				this.retrieveHTML(event.notes);
			}
		}
	}

	retrieveHTML = async handle => {
		if (handle) {
			await eventService.downloadEventNotes(handle, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						notes: result
					});
				}
			});
		} else {
			this.setState({
				notes: {}
			});
		}
	};

	deleteNotes = async eventId => {
		await this.props.deleteEventNotes(eventId, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				this.setState({
					event: result,
					notes: {}
				});
			}
		});
	};

	handleScroll = () => {
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
				!this.state.scrolledUp && pctScrolled > 1 &&
				widgetsHeight > profileHeight - 66
			) {
				this.setState({
					scrolledUp: true
				});
			}
			else if (
				this.state.scrolledUp && pctScrolled < 2
			) {
				this.setState({
					scrolledUp: false
				});
			}
		});
	};

	handleEditLayout = event => {
		event.preventDefault();
		this.setState({
			layoutControlsOpen: true,
			anchorEl: event.currentTarget
		});
	};

	handleCloseEditLayout = () => {
		this.setState({
			layoutControlsOpen: false
		});
	};

	handleExpand = () => {
		this.setState({
			scrolledUp: false
		});
		$(".cb-profile-wrapper").scrollTop(0);
	};

	handleCloseDeleteDialog = () => {
		this.props.closeDialog("eventDeleteDialog");
	};

	handleConfirmDelete = () => {
		const { event } = this.props;

		this.props.deleteEvent(event.id);

		this.handleCloseDeleteDialog();
	};

	handleEditMode = editing => {
		this.setState({ editing: editing });
	};

	getWidgetConfig = () => {
		const { event, types, widgetsExpandable, widgetState, appId, externalSystems } = this.props;
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

	getWidgetStatus = widgetId => {
		const widgetConfig = this.getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	renderActions = () => {
		const {
			event,
			openDialog,
			user
		} = this.props;
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
			action: () => openDialog("eventShareDialog")
		};
		const editAction = {
			name: getTranslation("global.profiles.eventProfile.main.edit"),
			nameText: "Edit",
			action: () => {
				this.handleEditMode(true);
				openDialog("eventEditDialog");
			}
		};
		const deleteAction = {
			name: getTranslation("global.profiles.eventProfile.main.delete"),
			nameText: "Delete",
			action: () => {
				openDialog("eventDeleteDialog");
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

	render() {
		const {
			event,
			selectWidget,
			view,
			updateActivityFilters,
			activityFilters,
			setWidgetOrder,
			getLookupValues,
			updateListCheckbox, // This is optimistically updating, hence why it has its own method
			attachFilesToEvent,
			widgetsExpandable,
			widgetsLaunchable,
			context,
			contextId,
			unsubscribeFromFeed,
			openDialog,
			closeDialog,
			dialog,
			isPrimary,
			loadProfile,
			lookupData,
			mapVisible,
			publishEvent,
			shareEvent,
			user,
			types,
			feeds,
			appId,
			defaultListPagination,
			listPaginationOptions,
			sidebarOpen,
			dockedCameras,
			addCameraToDockMode,
			removeDockedCameraAndState,
			setCameraPriority,
			fullscreenCamera,
			updateEventNotes,
			secondaryExpanded,
			startProximityEntitiesStream,
			timeFormatPreference,
			readOnly,
			forReplay,
			replayEndDate,
			dir,
			locale
		} = this.props;
		const { scrolledUp, anchorEl, layoutControlsOpen } = this.state;
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
			const widgets = this.getWidgetConfig();
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
							handleExpand={this.handleExpand}
							mapVisible={mapVisible}
							appId={appId}
							actions={this.renderActions()}
							dir={dir}
						/>
					</ErrorBoundary>
					{!scrolledUp && (
						<div className="layout-control-button">
							<a className="cb-font-link" onClick={this.handleEditLayout}>
								<Translate value="global.profiles.eventProfile.main.editProfileLayout" />
							</a>
						</div>
					)}
					<div className="widgets-container" style={widgetsContainerStyle}>
						<ErrorBoundary>
							<LayoutControls
								open={layoutControlsOpen}
								anchor={anchorEl}
								close={this.handleCloseEditLayout}
								widgetOrder={widgets}
								setWidgetOrder={setWidgetOrder}
								profile="event"
								expandedWidget={view}
							/>
						</ErrorBoundary>

						{$(window).width() > 1023 && this.getWidgetStatus("map") && (
							<MapWidget
								order={this.getWidgetStatus("map").index}
								enabled={this.getWidgetStatus("map").enabled}
								expanded={mapVisible}
								selectWidget={selectWidget}
								title={getTranslation("global.profiles.eventProfile.main.mapPlanner")}
								dir={dir}
							/>
						)}
						{this.getWidgetStatus("cad_details") && (
							// TODO: There's no need to pass down a hard-coded array to a widget if it can be handled in the widget
							<ErrorBoundary>
								<CADDetailsWidget
									order={this.getWidgetStatus("cad_details").index}
									enabled={this.getWidgetStatus("cad_details").enabled}
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
						{this.getWidgetStatus("cameras") && eventCameras && (
							<ErrorBoundary>
								<CameraWidget
									key={`${contextId}-cameras`}
									cameras={eventCameras}
									entityType={entityType}
									geometry={geometry}
									user={user}
									order={this.getWidgetStatus("cameras").index}
									enabled={this.getWidgetStatus("cameras").enabled}
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
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("responding_units") && (
							<ErrorBoundary>
								<RespondingUnitsWidget
									order={this.getWidgetStatus("responding_units").index}
									enabled={this.getWidgetStatus("responding_units").enabled}
									expanded={false}
									loadProfile={loadProfile}
									respondingUnits={respondingUnits}
									title={getTranslation("global.profiles.eventProfile.main.respondingUnits")}
									dir={dir}
								/>
							</ErrorBoundary>
						)}

						{this.getWidgetStatus("notes") && (
							<ErrorBoundary>
								<NotesWidget
									order={this.getWidgetStatus("notes").index}
									enabled={this.getWidgetStatus("notes").enabled}
									selectWidget={selectWidget}
									selected={view === "Notes"}
									expanded={false}
									widgetsExpandable={widgetsExpandable}
									secondaryExpanded={secondaryExpanded}
									canContribute={canManageEvent}
									updateNotes={updateEventNotes}
									event={event}
									notes={
										this.state.notes && this.state.notes.html
											? this.state.notes
											: { html: "<p><br></p>" }
									}
									widgetsLaunchable={widgetsLaunchable && appId !== "events-app"}
									contextId={contextId}
									entityType={entityType}
									deleteNotes={this.deleteNotes}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("pinned_items") && pinnedItems && (
							<ErrorBoundary>
								<PinnedItemsWidget
									order={this.getWidgetStatus("pinned_items").index}
									enabled={this.getWidgetStatus("pinned_items").enabled}
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
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("event_lists") && lists && (
							<ErrorBoundary>
								<ListWidget
									order={this.getWidgetStatus("event_lists").index}
									enabled={this.getWidgetStatus("event_lists").enabled}
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
						{this.getWidgetStatus("activities") && (activities || forReplay) && (
							<ErrorBoundary>
								<Activities
									key={`${contextId}-activities`}
									entity={event}
									order={this.getWidgetStatus("activities").index}
									enabled={this.getWidgetStatus("activities").enabled}
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
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("files") && attachments && (
							<ErrorBoundary>
								<FileWidget
									id="files"
									order={this.getWidgetStatus("files").index}
									enabled={this.getWidgetStatus("files").enabled}
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
						{this.getWidgetStatus("secure_share") && (
							<SGSettings
								key={contextId}
								selectWidget={selectWidget}
								selected={view === "SecureShare Settings"}
								expanded={false}
								order={this.getWidgetStatus("secure_share").index}
								enabled={this.getWidgetStatus("secure_share").enabled}
								contextId={contextId}
								settings={additionalProperties}
								expandable={widgetsExpandable}
								pinnedItems={pinnedItems}
								isPublic={isPublic}
								type={type}
								dir={dir}
							/>
						)}
						{this.getWidgetStatus("proximity") && (
							<ErrorBoundary>
								<ProximityWidget
									order={this.getWidgetStatus("proximity").index}
									enabled={this.getWidgetStatus("proximity").enabled}
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
						{this.getWidgetStatus("resources") && (
							<ErrorBoundary>
								<ResourceWidget
									key={contextId}
									contextId={contextId}
									selectWidget={selectWidget}
									selected={view === "Resources"}
									expanded={false}
									order={this.getWidgetStatus("resources").index}
									enabled={this.getWidgetStatus("resources").enabled}
									expandable={widgetsExpandable}
									settings={additionalProperties}
									dir={dir}
								/>
							</ErrorBoundary>
						)}

						{this.getWidgetStatus("equipments") && (
							<ErrorBoundary>
								<EquipmentWidget
									key={contextId}
									selectWidget={selectWidget}
									selected={view === "Equipment"}
									expanded={false}
									order={this.getWidgetStatus("equipments").index}
									enabled={this.getWidgetStatus("equipments").enabled}
									expandable={widgetsExpandable}
									settings={additionalProperties}
									contextId={contextId}
									dir={dir}
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
							confirm={{ label: getTranslation("global.profiles.eventProfile.main.confirm"), action: this.handleConfirmDelete }}
							abort={{
								label: getTranslation("global.profiles.eventProfile.main.cancel"),
								action: this.handleCloseDeleteDialog
							}}
							title={getTranslation("global.profiles.eventProfile.main.confirmationText")}
							dir={dir}
						/>
						<ErrorBoundary>
							<EventDialog
								editing={this.state.editing}
								handleEditMode={this.handleEditMode}
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
	}
}


EventProfile.propTypes = propTypes;
EventProfile.defaultProps = defaultProps;

export default EventProfile;
