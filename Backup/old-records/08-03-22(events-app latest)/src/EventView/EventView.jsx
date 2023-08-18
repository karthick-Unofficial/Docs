import React, { Component } from "react";
import moment from "moment";
import { eventService } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import EventsMapContainer from "../EventsMap/EventsMapContainer";
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

import { FlatButton } from "material-ui";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

class EventView extends Component {

	constructor(props) {
		super(props);

		this.dynamicWidget = React.createRef();

		this.state = {
			notesChanged: false,
			event: {}
		};

		this.updateNotesStatus = this.updateNotesStatus.bind(this);
	}


	/* IMPORTANT: This is causing more trouble than it's worth. Due to the fact we have so many widgets that can be
	 *  shown in this view, there is a lot of data we have to account for. More and more bugs of things not updating,
	 *  not displaying correctly, etc. are found every day. This component, at least here in events-app, doesn't rerender
	 *  all that much anyway. When we find a better solution in the future, we may want to reenable this to save a few renders.
	 *  -- bcarson
	 */
	// shouldComponentUpdate(nextProps, nextState) {
	// 	const {
	// 		view,
	// 		isLoaded,
	// 		activities,
	// 		dialog,
	// 		activityFilters,
	// 		attachments,
	// 		items
	// 	} = this.props;

	// 	return (																				// RERENDER IF ANY ARE TRUE:
	// 		(view !== nextProps.view || isLoaded !== nextProps.isLoaded) || 					// 1. view is different or isLoaded changes
	// 		(attachments && (attachments !== nextProps.attachments)) ||							// 2. attachments are different
	// 		dialog !== nextProps.dialog ||														// 3. a dialog should open
	// 		activityFilters.length !== nextProps.activityFilters.length ||						// 4. activity filters change
	// 		(items !== undefined && (items.length !== nextProps.items.length)) ||				// 5. an item is pinned or removed
	// 		(activities !== undefined && (activities.length !== nextProps.activities.length))	// 6. more activities come in
	// 	);
	// }

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.event && nextProps.event.id !== prevState.event.id) {
			return {
				event: nextProps.event,
				notes: {},
				notesChanged: false
			};
		}
		return null;
	}

	updateNotesStatus = value => {
		if (value !== this.state.notesChanged) {
			this.setState({
				notesChanged: value
			});
		}
	};

	componentDidMount() {
		if (this.props.event && this.props.event.notes) {
			this.retrieveHTML(this.props.event.notes);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { event, view, selectWidget } = this.props;

		if (event) {
			const { id, type, notes } = event;
			if (!prevProps.event) {
				if (notes) {
					this.retrieveHTML(notes);
				}
			}
			if (prevProps.event) {
				if (
					(id !== prevProps.event.id && notes) ||
					(!prevProps.event.notes && notes) ||
					prevProps.event.notes !== notes
				) {
					this.retrieveHTML(notes);
				}
			}

			if (view === "SecureShare Settings" && type !== "sc_thread") {
				selectWidget("Map Planner");
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

	getEventView = view => {
		const {
			event,
			activityFilters,
			updateActivityFilters,
			updateListCheckbox,
			attachFilesToEvent,
			context,
			contextId,
			getLookupValues,
			defaultListPagination,
			listPaginationOptions,
			getContextListCategory,
			lookupData,
			unsubscribeFromFeed,
			openDialog,
			closeDialog,
			dialog,
			loadProfile,
			isPrimary,
			user,
			updateEvent,
			feeds,
			startProximityEntitiesStream,
			dir
		} = this.props;
		if (view === "Map Planner") {
			return <EventsMapContainer />;
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
								ref={this.dynamicWidget}
								expanded={true}
								enabled={true}
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								event={this.state.event}
								activities={activities}
								canContribute={canManage}
								notes={
									this.state.notes && this.state.notes.html
										? this.state.notes
										: { html: "<p><br></p>" }
								}
								updateNotes={this.props.updateEventNotes}
								updateNotesStatus={this.updateNotesStatus}
								deleteNotes={this.deleteNotes}
								dir={dir}
							/>
						</ErrorBoundary>
					);
				case "Pinned Items":
					return (
						pinnedItems && (
							<ErrorBoundary>
								<PinnedItemsWidget
									ref={this.dynamicWidget}
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
									openDialog={openDialog}
									closeDialog={closeDialog}
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
									ref={this.dynamicWidget}
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
								/>
							</ErrorBoundary>
						)
					);
				case "Event Lists":
					return (
						lists && (
							<ErrorBoundary>
								<ListWidget
									ref={this.dynamicWidget}
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
									openDialog={openDialog}
									closeDialog={closeDialog}
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
									ref={this.dynamicWidget}
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
								ref={this.dynamicWidget}
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
								openDialog={openDialog}
								closeDialog={closeDialog}
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
								ref={this.dynamicWidget}
								id="resources"
								enabled={true}
								expanded={true}
								contextId={contextId}
								settings={additionalProperties}
							/>
						</ErrorBoundary>
					);
				case "Equipment":
					return (
						<ErrorBoundary>
							<EquipmentWidget
								ref={this.dynamicWidget}
								id="equipments"
								enabled={true}
								expanded={true}
								contextId={contextId}
								settings={additionalProperties}
							/>
						</ErrorBoundary>
					);


				default:
					break;
			}
		}
	};

	getViewAction = view => {
		const {
			openDialog,
			event,
			attachFilesToEvent,
			user,
			dir
		} = this.props;
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
							<FlatButton
								label={<Translate value="eventView.pinItem" />}
								primary={true}
								onClick={() => openDialog("pinnedItemDialog")}
							/>
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
							<FlatButton
								label={<Translate value="eventView.addList" />}
								primary={true}
								onClick={() => this.dynamicWidget.current.openListDialog()}
							/>
						) : (
							<div />
						)}
					</div>
				);
			}

			case "Notes": {
				return (
					<div>
						{this.state.notesChanged ? (
							<div className={"widget-option-button"}>
								<FlatButton
									label={<Translate value="eventView.cancel" />}
									secondary={true}
									onClick={() => this.dynamicWidget.current.cancelEdit()}
								/>
								<FlatButton
									label={<Translate value="eventView.save" />}
									primary={true}
									onClick={() => this.dynamicWidget.current.saveEdit()}
								/>
							</div>
						) : (
							<div />
						)}
					</div>
				);
			}

			case "Proximity": {
				return canManage ? (
					<div className="widget-option-button">
						{!eventEnded && (
							<FlatButton
								label={<Translate value="eventView.createProxZone" />}
								primary={true}
								onClick={() => openDialog("proximityDialog")}
							/>
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

	placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	render() {
		const { viewWidth, view, mobile, event, WavCamOpen, dir } = this.props;
		const showHeader = view !== "Map Planner";
		return !mobile ? (
			<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="view-wrapper">
				<div style={{ left: dir === "rtl" ? 0 : null, right: dir === "rtl" ? null : 0, height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className={`view-content ${viewWidth} ${view === "Notes" ? "notes-view" : ""}`}
				>
					{event && view && showHeader && (
						<div
							className={`view-header cb-font-b1 ${viewWidth} ${view === "Map Planner" ? "map-view" : "normal-view"}`}
						>
							{view}
							{/* Portal node for actions */}
							{this.getViewAction(view)}
							<div id="widget-actions" />
						</div>
					)}
					{this.getEventView(event ? view : "Map Planner")}
				</div>
			</div>
		) : (
			<div />
		);
	}
}

export default EventView;
