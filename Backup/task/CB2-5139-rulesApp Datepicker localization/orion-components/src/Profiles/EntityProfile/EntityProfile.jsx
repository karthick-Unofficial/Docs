import React, { PureComponent } from "react";
import { withSpan, captureUserInteraction } from "../../Apm";
import {
	associationService,
	authExclusionService
} from "client-app-core";

// components
import { Dialog } from "../../CBComponents";
import FileWidget from "../Widgets/File/FileWidget";
import RulesWidget from "../Widgets/Rules/RulesWidget";
import EntityDelete from "./components/EntityDelete";
import EntityShare from "./components/EntityShare";
import ShapeAssociation from "./components/ShapeAssociation";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import { DetailsWidget } from "../Widgets/Details/DetailsWidget"; // get action
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import AlertWidget from "../Widgets/Alert/AlertWidget";
import PinToDialog from "../../SharedComponents/PinToDialog";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import ImageViewer from "../../SharedComponents/ImageViewer";
import MarineTrafficParticularsWidget from "../Widgets/MarineTrafficParticulars/MarineTrafficParticularsWidget";
import Activities from "../Widgets/Activities/Activities";
import { integrationService } from "client-app-core";

// error boundary
import ErrorBoundary from "../../ErrorBoundary";

// utility
import $ from "jquery";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

import PropTypes from "prop-types";

const propTypes = {
	locale: PropTypes.string
};

const defaultProps = {
	locale: "en"
};

let DEFAULT_WIDGET_CONFIG = [];

class EntityProfile extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			collectionDialogOpen: false,
			historyToggled: false,
			viewingHistory: [],
			layoutControlsOpen: false,
			scrolledUp: false,
			hasScrolled: false,
			hiding: false,
			zetronPhoneVisible: false
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	componentWillMount() {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "alerts",
				name: getTranslation("global.profiles.entityProfile.main.alerts")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.entityProfile.main.activities")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.entityProfile.main.files")
			},
			{
				enabled: true,
				id: "details",
				name: getTranslation("global.profiles.entityProfile.main.details")
			},
			{
				enabled: true,
				id: "rules",
				name: getTranslation("global.profiles.entityProfile.main.rules")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.entityProfile.main.cameras")
			},
			{
				enabled: false,
				id: "marineTrafficParticulars",
				name: getTranslation("global.profiles.entityProfile.main.marineTraffic")
			}
		];
	}
	
	componentDidMount() {
		const {
			contextId,
			context,
			entityType,
			startAttachmentStream,
			startActivityStream,
			startCamerasInRangeStream,
			startRulesStream,
			forReplay
		} = this.props;

		const serviceCallBackExternalSystem = (err, response) =>{
			if (err) {
				if (!this.state.zetronPhoneVisible){
					this.setState({ zetronPhoneVisible: false });
				}
			} else {
				if (response.clientInstalled){
					this.setState({ zetronPhoneVisible: true });
				}
			}
		};

		if (contextId) {
			if (!forReplay) {
				startActivityStream(contextId, entityType, "profile");
				startAttachmentStream(contextId, "profile");
				startCamerasInRangeStream(contextId, entityType, "profile");
				startRulesStream(contextId, "profile");

				const { entityData, feedId } = context.entity;
				
				if ((entityType === "track" && feedId === "zetron") && entityData && entityData.properties 
					&& entityData.properties.subtype && entityData.properties.subtype.toLowerCase() === "zetron"){
					
					/* Note:
						Suppose to get externalSystems [] from redux state (e.g. state.session.organization.externalSystems)
						but different apps profileContainer needs to be modified in order to pass it as props.
						therefore here fetching directly to avoid modifying multiple apps profile container.
					*/
					
					integrationService.getExternalSystem("zetron", (errExt, responseExt)=>{
						if (errExt) {
							console.log("An error has occurred to check external system is available to user.");
						} else {
							if (responseExt && responseExt.externalSystemId){
								integrationService.getExternalSystemLookup("zetron", "serviceAvailableToUser", serviceCallBackExternalSystem);
							}
						}
					});
				}
				
			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}

		this.handleScroll();
	}

	handleInitiateRadioCall = (radioUnitId) => {
		const dataToPost = {radioUnitId : radioUnitId};
		
		if (radioUnitId){
			//post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callRadio
			integrationService.postExternalSystemResource("zetron", "callRadio", dataToPost, function(err, response) {
				//Note : At present we just fire and forget and incase of error display standard error message in console.
				if (err) {
					console.log("An error has occurred sending command to zetron interface.");
				}
			});
		}
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

	toggleTrackHistory(id) {
		const {
			contextId,
			context,
			startTrackHistoryStream,
			unsubscribeFromFeed,
			removeSubscriber,
			trackHistDuration,
			forReplay
		} = this.props;

		if (context.trackHistory) {
			captureUserInteraction("EntityProfile Track History On");
			removeSubscriber(contextId, "trackHistory", "map");
			unsubscribeFromFeed(contextId, "trackHistory", "profile");
		} else {
			startTrackHistoryStream(id, "profile", trackHistDuration, forReplay);
		}
	}

	handleCloseEntityProfile = () => {
		this.props.hideInfo();
		this.props.updateViewingHistory([]);
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

	handleShareClick = entity => {
		const { unshareEntityToOrg, shareEntityToOrg, closeDialog } = this.props;

		entity.isPublic
			? unshareEntityToOrg(entity.id)
			: shareEntityToOrg(entity.id);

		closeDialog("shareEntityDialog");
	};

	getWidgetConfig = () => {
		const { context } = this.props;
		const { entityType } = context.entity;
		const { widgetState, marineTrafficVisible } = this.props;
		let widgetConfig = widgetState
			? _.unionBy(widgetState, DEFAULT_WIDGET_CONFIG, "id")
			: DEFAULT_WIDGET_CONFIG;

		// -- remove details from shapes
		widgetConfig = entityType === "shapes"
			? widgetConfig.filter(widget => widget.id !== "details")
			: widgetConfig;

		// -- remove marine traffic from irrelevant feeds
		widgetConfig = !marineTrafficVisible
			? widgetConfig.filter(widget => widget.id !== "marineTrafficParticulars")
			: widgetConfig;

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

	/**
	 * Check association before opening a dialog, throwing an error or failed association dialog if entity is associated
	 * @param {string} dialogId -- Id of dialog you'd like to open if association checks are passed
	 * @param {string} associationAction -- "delete" or "unshare"
	 */
	openDialogWithAssociation = (dialogId, associationAction) => {
		const { openDialog, contextId } = this.props;

		associationService.checkAssociations(contextId, (err, response) => {
			if (err || response.error) {
				openDialog("entity-profile-error", getTranslation("global.profiles.entityProfile.main.problemOccured"));
			} else if (response) {
				if (response.hasAssociations) {
					// Passing an action along so dialog knows what text to render
					openDialog("shape-association", {
						...response,
						action: associationAction
					});
				} else {
					openDialog(dialogId);
				}
			}
		});
	};

	render() {
		const {
			feedDisplayProps,
			setWidgetOrder,
			notifications,
			linkEntities,
			unlinkEntities,
			addRemoveFromCollections,
			addRemoveFromEvents,
			createCollection,
			entityCollections,
			sidebarOpen,
			dockedCameras,
			addCameraToDockMode,
			removeDockedCameraAndState,
			context,
			contextId,
			dialog,
			dialogData,
			unsubscribeFromFeed,
			openDialog,
			closeDialog,
			loadProfile,
			setMapTools,
			user,
			deleteShape,
			updateActivityFilters,
			activityFilters,
			mapVisible,
			setCameraPriority,
			fullscreenCamera,
			ignoreEntity,
			appData,
			appId,
			widgetsLaunchable,
			profileIconTemplate,
			timeFormatPreference,
			readOnly,
			forReplay,
			endDate,
			replayEntity,
			dir,
			locale
		} = this.props;
		const { scrolledUp, anchorEl, layoutControlsOpen, hiding, zetronPhoneVisible } = this.state;

		if (context) {
			const { orgId } = user;
			const userId = user.id;
			const {
				attachments,
				rules,
				camerasInRange,
				activities
			} = context;
			const entity = forReplay && replayEntity ? replayEntity : context.entity;
			const { entityType, entityData, feedId } = entity;
			const { properties, geometry } = entityData;
			const { name, description, type, subtype } = properties;
			const rulesAppPermission = user.applications.filter(application => {
				return application.appId === "rules-app" && application.config.canView;
			})[0];
			const imageAttachments = attachments
				? attachments.filter(attachment => {
					return /(jpg)|(png)|(jpeg)|(gif)|(svg)/.exec(attachment.mimeType);
				})
				: [];

			// Height of summary-info (consistent between scrolled and not scrolled state) + padding
			const scrollOffset = scrolledUp ? 167 : 0;
			// Dynamic offset for widget container when SummaryWidget is collapsed
			const widgetsContainerStyle = {
				top: scrollOffset
			};
			const isMarker = context && entityType === "shapes" && type === "Point";
			const widgets = this.getWidgetConfig();
			let actions = [];

			if (zetronPhoneVisible){
				actions = [...actions,
					{
						name: getTranslation("global.profiles.entityProfile.main.tetraRadioCall" ),
						nameText: "Zetron Call",
						action: () => this.handleInitiateRadioCall(properties.radioUnitId)
					}];
			}
			
			actions = [...actions,
				{
					name: getTranslation("global.profiles.entityProfile.main.trackHistory"),
					nameText: "Track History",
					action: () => this.toggleTrackHistory(contextId)
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.pinTo"),
					nameText: "Pin To",
					action: () => openDialog("pinToDialog")
				}];
			if (user.integrations
				&& user.integrations.find(int => int.intId === entity.feedId)
				&& user.integrations.find(int => int.intId === entity.feedId).permissions
				&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")) {
				actions = [...actions,
					{
						name: getTranslation("global.profiles.entityProfile.main.edit"),
						nameText: "Edit",
						action: () => setMapTools({ type: "drawing", mode: geometry.type === "Point" ? "simple_select" : "direct_select", feature: { id: contextId, ...entity.entityData } })
					},
					{
						name: getTranslation("global.profiles.entityProfile.main.delete"),
						nameText: "Delete",
						action: () =>
							this.openDialogWithAssociation(
								"shapeDeleteDialog",
								"delete"
							)
					}
				];
			}
			actions = [...actions,
				{
					name: getTranslation("global.profiles.entityProfile.main.hide"),
					nameText: "Hide",
					action: () => {
						if (context.trackHistory && rules.length === 0) {
						// If track history is on, toggle it off before removing
							this.toggleTrackHistory(contextId);
						}
						if (rules.length === 0) {
							this.setState({ hiding: true });
							ignoreEntity(contextId, entityType, feedId, appData);
						} else {
							this.openDialogWithAssociation(
								"shapeHideDialog",
								"hide"
							);
						}
					},
					debounce: hiding
				}
			];
			const hasAccessToFeed = user.integrations
				&& user.integrations.find(int => int.intId === entity.feedId)
				&& user.integrations.find(int => int.intId === entity.feedId).config
				&& user.integrations.find(int => int.intId === entity.feedId).config.canView;
			return (
				<div
					className="cb-profile-wrapper"
					style={{ height: "100%", overflow: "scroll" }}
				>
					{!scrolledUp && <ImageViewer images={imageAttachments} dir={dir} />}
					<ErrorBoundary>
						<SummaryWidget
							id={contextId}
							user={ zetronPhoneVisible ? {...user, zetronSystemAvailable : true} : user}
							context={context}
							name={name}
							type={subtype ? subtype : type}
							geometry={geometry}
							description={description}
							scrolledUp={scrolledUp}
							handleExpand={this.handleExpand}
							mapVisible={mapVisible}
							appId={appId}
							profileIconTemplate={profileIconTemplate}
							actions={actions}
							readOnly={readOnly}
							dir={dir}
						/>
					</ErrorBoundary>
					{!scrolledUp && (
						<div className="layout-control-button">
							<a className="cb-font-link" onClick={this.handleEditLayout}>
								<Translate value="global.profiles.entityProfile.main.editLayout" />
							</a>
						</div>
					)}
					<div className="widgets-container" style={widgetsContainerStyle}>
						<ErrorBoundary>
							<LayoutControls
								key={`${contextId}-layout-controls`}
								open={layoutControlsOpen}
								anchor={anchorEl}
								close={this.handleCloseEditLayout}
								widgetOrder={widgets}
								profile="entity"
								setWidgetOrder={setWidgetOrder}
							/>
						</ErrorBoundary>
						{this.getWidgetStatus("details") && feedDisplayProps && (
							<DetailsWidget
								key={`${contextId}-details`}
								order={this.getWidgetStatus("details").index}
								enabled={this.getWidgetStatus("details").enabled}
								details={properties}
								displayProps={feedDisplayProps}
								timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
								dir={dir}
							/>
						)}
						{this.getWidgetStatus("marineTrafficParticulars") && (
							<ErrorBoundary>
								<MarineTrafficParticularsWidget
									entity={entity}
									order={this.getWidgetStatus("marineTrafficParticulars").index}
									enabled={this.getWidgetStatus("marineTrafficParticulars").enabled}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("cameras") && (
							<ErrorBoundary>
								<CamerasWidget
									key={`${contextId}-cameras`}
									cameras={camerasInRange}
									canLink={!readOnly && user.integrations
										&& user.integrations.find(int => int.intId === entity.feedId)
										&& user.integrations.find(int => int.intId === entity.feedId).permissions
										&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")}
									entityType={entityType}
									geometry={geometry}
									order={this.getWidgetStatus("cameras").index}
									enabled={this.getWidgetStatus("cameras").enabled}
									loadProfile={loadProfile}
									sidebarOpen={sidebarOpen}
									entity={entity}
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
									widgetsLaunchable={!readOnly && widgetsLaunchable}
									user={user}
									removeDockedCamera={removeDockedCameraAndState}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("alerts") && notifications && (
							<ErrorBoundary>
								<AlertWidget
									key={`${contextId}-alerts`}
									order={this.getWidgetStatus("alerts").index}
									enabled={this.getWidgetStatus("alerts").enabled}
									contextId={contextId}
									loadProfile={loadProfile}
									notifications={notifications}
									closeNotification={this.props.closeNotification}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("activities") && (
							<ErrorBoundary>
								<Activities
									locale={locale}
									key={`${contextId}-activities`}
									entity={entity}
									order={this.getWidgetStatus("activities").index}
									enabled={this.getWidgetStatus("activities").enabled}
									pageSize={5}
									activities={activities}
									canManage={user.integrations
										&& user.integrations.find(int => int.intId === entity.feedId)
										&& user.integrations.find(int => int.intId === entity.feedId).config
										&& user.integrations.find(int => int.intId === entity.feedId).config.canView}
									updateActivityFilters={updateActivityFilters}
									activityFilters={activityFilters}
									unsubscribeFromFeed={unsubscribeFromFeed}
									contextId={contextId}
									userId={userId}
									subscriberRef="profile"
									openDialog={openDialog}
									closeDialog={closeDialog}
									dialog={dialog}
									readOnly={readOnly}
									forReplay={forReplay}
									endDate={endDate}
									timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{this.getWidgetStatus("files") && (
							<ErrorBoundary>
								<FileWidget
									key={`${contextId}-files`}
									order={this.getWidgetStatus("files").index}
									enabled={this.getWidgetStatus("files").enabled}
									attachments={attachments}
									canDelete={!readOnly && (entityType !== "track" ? user && user.integrations
										&& user.integrations.find(int => int.intId === entity.feedId)
										&& user.integrations.find(int => int.intId === entity.feedId).permissions
										&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage") :
										user && user.applications
										&& user.applications.find(app => app.appId === "map-app")
										&& user.applications.find(app => app.appId === "map-app").permissions
										&& user.applications.find(app => app.appId === "map-app").permissions.includes("manage"))}
									hasAccess={!readOnly && hasAccessToFeed}
									attachFiles={this.props.attachFilesToEntity}
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
						{this.getWidgetStatus("rules") && rulesAppPermission && !isMarker && (
							<ErrorBoundary>
								<RulesWidget
									key={`${contextId}-rules`}
									order={this.getWidgetStatus("rules").index}
									enabled={this.getWidgetStatus("rules").enabled}
									canManage={
										!readOnly && user.applications
										&& user.applications.find(app => app.appId === "rules-app")
										&& user.applications.find(app => app.appId === "rules-app").permissions
										&& user.applications.find(app => app.appId === "rules-app").permissions.includes("manage")
									}
									canViewRules={
										!readOnly && user.applications
										&& user.applications.find(app => app.appId === "rules-app")
										&& user.applications.find(app => app.appId === "rules-app").config
										&& user.applications.find(app => app.appId === "rules-app").config.canView
									}
									contextId={contextId}
									context={context}
									entityType={entityType}
									rules={rules}
									collections={entityCollections}
									userId={userId}
									hasLinks={true}
									orgId={orgId}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef="profile"
									loadProfile={loadProfile}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						<PinToDialog
							open={dialog === "pinToDialog"}
							close={() => closeDialog("pinToDialog")}
							entity={entity}
							canManageEvents={user.applications &&
								user.applications.find(app => app.appId === "events-app") &&
								user.applications.find(app => app.appId === "events-app").permissions &&
								user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
							canPinToCollections={user.applications &&
								user.applications.find(app => app.appId === "map-app") &&
								user.applications.find(app => app.appId === "map-app").permissions &&
								user.applications.find(app => app.appId === "map-app").permissions.includes("manage")}
							addRemoveFromCollections={addRemoveFromCollections}
							addRemoveFromEvents={addRemoveFromEvents}
							createCollection={createCollection}
							dialog={dialog}
							openDialog={openDialog}
							closeDialog={closeDialog}
							userId={userId}
							dir={dir}
						/>
					</div>

					<EntityDelete
						open={dialog === "shapeDeleteDialog"}
						closeDialog={closeDialog}
						userId={userId}
						deleteShape={deleteShape}
						id={contextId}
						name={name}
					/>
					<EntityShare
						handleClick={() => this.handleShareClick(entity, orgId)}
						open={dialog === "shareEntityDialog"}
						handleClose={() => closeDialog("shareEntityDialog")}
						shared={entity.isPublic}
					/>
					<ShapeAssociation
						open={dialog === "shape-association"}
						closeDialog={closeDialog}
						dialogData={dialogData}
						dir={dir}
					/>
					<Dialog
						key="entity-profile-error"
						open={dialog === "entity-profile-error"}
						confirm={{
							label: getTranslation("global.profiles.entityProfile.main.ok"),
							action: () => {
								closeDialog("entity-profile-error");
							}
						}}
						textContent={dialogData}
						dir={dir}
					/>
				</div>
			);
		} else {
			return <div />;
		}
	}
}

// span instead of transaction
EntityProfile.propTypes = propTypes;
EntityProfile.defaultProps = defaultProps;
export default withSpan("entity-profile", "profile")(EntityProfile);
