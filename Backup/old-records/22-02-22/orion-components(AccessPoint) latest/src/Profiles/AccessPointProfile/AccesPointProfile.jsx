import React, { PureComponent } from "react";
import { withSpan, captureUserInteraction } from "../../Apm";
import {
	associationService,	
} from "client-app-core";
// components
import FileWidget from "../Widgets/File/FileWidget";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import { DetailsWidget } from "../Widgets/Details/DetailsWidget"; // get action
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import Activities from "../Widgets/Activities/Activities";

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

class AccessPointProfile extends PureComponent {
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
				id: "activities",
				name: getTranslation("global.profiles.AccessPointProfile.main.activities")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.AccessPointProfile.main.files")
			},
			{
				enabled: true,
				id: "details",
				name: getTranslation("global.profiles.AccessPointProfile.main.details")
			},			
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.AccessPointProfile.main.cameras")
			}
		];
	}
	
	componentDidMount() {
		const {
			contextId,			
			entityType,			
			startActivityStream,
			startCamerasInRangeStream,			
			forReplay
		} = this.props;
		

		if (contextId) {
			if (!forReplay) {
				startActivityStream(contextId, entityType, "profile");				
				startCamerasInRangeStream(contextId, entityType, "profile");											
				
			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}

		this.handleScroll();
	}
	

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
			captureUserInteraction("AccessPointProfile Track History On");
			removeSubscriber(contextId, "trackHistory", "map");
			unsubscribeFromFeed(contextId, "trackHistory", "profile");
		} else {
			startTrackHistoryStream(id, "profile", trackHistDuration, forReplay);
		}
	}


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
				openDialog("entity-profile-error", getTranslation("global.profiles.AccessPointProfile.main.problemOccured"));
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
			linkEntities,
			unlinkEntities,			
			sidebarOpen,
			dockedCameras,
			addCameraToDockMode,
			removeDockedCameraAndState,
			context,
			contextId,
			dialog,			
			unsubscribeFromFeed,
			openDialog,
			closeDialog,
			loadProfile,
			setMapTools,
			user,			
			updateActivityFilters,
			activityFilters,
			mapVisible,
			setCameraPriority,
			fullscreenCamera,			
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
			const userId = user.id;
			const {
				attachments,				
				camerasInRange,
				activities
			} = context;
			const entity = forReplay && replayEntity ? replayEntity : context.entity;
			const { entityType, entityData, feedId } = entity;
			const { properties, geometry } = entityData;
			const { name, description, type, subtype } = properties;						

			// Height of summary-info (consistent between scrolled and not scrolled state) + padding
			const scrollOffset = scrolledUp ? 167 : 0;
			// Dynamic offset for widget container when SummaryWidget is collapsed
			const widgetsContainerStyle = {
				top: scrollOffset
			};			
			const widgets = this.getWidgetConfig();
			let actions = [];

			
			
			actions = [...actions,
				{
					name: getTranslation("global.profiles.AccessPointProfile.main.trackHistory"),
					nameText: "Track History",
					action: () => this.toggleTrackHistory(contextId)
				}];
			if (user.integrations
				&& user.integrations.find(int => int.intId === entity.feedId)
				&& user.integrations.find(int => int.intId === entity.feedId).permissions
				&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")) {
				actions = [...actions,
					{
						name: getTranslation("global.profiles.AccessPointProfile.main.edit"),
						nameText: "Edit",
						action: () => setMapTools({ type: "drawing", mode: geometry.type === "Point" ? "simple_select" : "direct_select", feature: { id: contextId, ...entity.entityData } })
					}					
				];
			}			
			const hasAccessToFeed = user.integrations
				&& user.integrations.find(int => int.intId === entity.feedId)
				&& user.integrations.find(int => int.intId === entity.feedId).config
				&& user.integrations.find(int => int.intId === entity.feedId).config.canView;
			return (
				<div
					className="cb-profile-wrapper"
					style={{ height: "100%", overflow: "scroll" }}
				>
					
					<ErrorBoundary>
						<SummaryWidget
							id={contextId}
							user={user}
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
								<Translate value="global.profiles.AccessPointProfile.main.editLayout" />
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
						
						{this.getWidgetStatus("cameras") && camerasInRange && (
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
						
						{this.getWidgetStatus("activities") && (activities || forReplay) && (
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
						{this.getWidgetStatus("files") && attachments && (
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
												
					</div>

				</div>
			);
		} else {
			return <div />;
		}
	}
}

// span instead of transaction
AccessPointProfile.propTypes = propTypes;
AccessPointProfile.defaultProps = defaultProps;
export default withSpan("entity-profile", "profile")(AccessPointProfile);
