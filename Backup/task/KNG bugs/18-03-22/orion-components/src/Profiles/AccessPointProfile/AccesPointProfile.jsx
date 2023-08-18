import React, { PureComponent } from "react";
import ErrorBoundary from "../../ErrorBoundary";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { facilityService } from "client-app-core";
import $ from "jquery";
import PinToDialog from "../../SharedComponents/PinToDialog";
import AccessPointEditDialog from "./components/AccessPointEditDialog";
import FileWidget from "../Widgets/File/FileWidget";
import Activities from "../Widgets/Activities/Activities";
import LinkedItemsWidget from "../Widgets/LinkedItems/LinkedItemsWidget";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import _ from "lodash";

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
			scrolledUp: false,
			hiding: false,
			layoutControlsOpen: false,
			anchorEl: null,
			facilityHidden: true
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	componentWillMount() {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.accessPointProfile.files")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.accessPointProfile.activities")
			},
			{
				enabled: true,
				id: "linked_items",
				name: getTranslation("global.profiles.accessPointProfile.linkedItems")
			},
			{
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.accessPointProfile.cameras")
			},
		];
	}

	componentDidMount() {
		const {
			startActivityStream,
			startAttachmentStream,
			contextId,
			disableLinkedItems,
			startCamerasLinkedItemsStream,
			accessPoint,
			forReplay,
			startCamerasInRangeStream,
			entityType
		} = this.props;

		if (!forReplay) {
			startCamerasInRangeStream(contextId, entityType, "profile");
			if (!disableLinkedItems && this.getWidgetStatus("linked_items")) {
				startCamerasLinkedItemsStream(contextId, "profile");
			}
			if (this.getWidgetStatus("activities"))
				startActivityStream(contextId, "accessPoint", "profile");
			if (this.getWidgetStatus("files"))
				startAttachmentStream(contextId, "profile");
			if (accessPoint && accessPoint.entityData.displayTargetId && accessPoint.entityData.displayType && accessPoint.entityData.displayType.toLowerCase() === "facility") {
				facilityService.getFloorPlan(accessPoint.entityData.displayTargetId, (err, res) => {
					if (err) {
						this.setState({
							facilityHidden: true
						});
					} else if (res.success) {
						this.setState({
							facilityHidden: false
						});
					}
				});
			}
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}

		this.handleScroll();
	}

	getWidgetStatus = widgetId => {
		const widgetConfig = this.getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
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
			captureUserInteraction("AccessPointProfile Track History On");
			removeSubscriber(contextId, "trackHistory", "map");
			unsubscribeFromFeed(contextId, "trackHistory", "profile");
		} else {
			startTrackHistoryStream(id, "profile", trackHistDuration, forReplay);
		}
	}



	handleExpand = () => {
		this.setState({
			scrolledUp: false
		});
		$
			(".cb-profile-wrapper").scrollTop(0);
	};


	getWidgetConfig = () => {
		const { widgetState, widgetsExpandable } = this.props;
		const defaultTypes = ["files", "activities", "linked_items", "cameras"];
		if (widgetsExpandable) defaultTypes.push("map");

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter(widget =>
			defaultTypes.includes(widget.id)
		);

		const filteredState = widgetState ? widgetState.filter(widget =>
			defaultTypes.includes(widget.id)
		) : [];

		const widgetConfig = widgetState
			? _.unionBy(filteredState, filteredDefault, "id")
			: filteredDefault;
		return widgetConfig;
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

	render() {
		const {
			context,
			contextId,
			user,
			readOnly,
			accessPoint,
			openDialog,
			mapVisible,
			setWidgetOrder,
			appId,
			dir,
			facilityOption,
			ignoreEntity,
			appData,
			closeDialog,
			addRemoveFromCollections,
			addRemoveFromEvents,
			createCollection,
			dialog,
			updateAccesspoint,
			view,
			selectWidget,
			attachFilesToAccessPoint,
			widgetsLaunchable,
			unsubscribeFromFeed,
			widgetsExpandable,
			forReplay,
			locale,
			updateActivityFilters,
			activityFilters,
			isPrimary,
			endDate,
			timeFormatPreference,
			disableLinkedItems,
			linkEntities,
			unlinkEntities,
			disabledLinkedItemTypes,
			feeds,
			loadProfile,
			sidebarOpen,
			dockedCameras,
			addCameraToDockMode,
			setCameraPriority,
			fullscreenCamera,
			removeDockedCameraAndState

		} = this.props;
		const { scrolledUp, hiding, facilityHidden, anchorEl, layoutControlsOpen } = this.state;
		if (context) {
			const { entityType, entityData, feedId } = accessPoint;
			const { properties, geometry } = entityData;
			const { name, description, type, subtype } = properties;
			const { attachments, activities, camerasInRange } = context;
			const userId = user.id;
			// Height of summary-info (consistent between scrolled and not scrolled state) + padding
			const scrollOffset = scrolledUp ? 167 : 0;
			// Dynamic offset for widget container when SummaryWidget is collapsed
			const widgetsContainerStyle = {
				top: scrollOffset
			};
			const widgets = this.getWidgetConfig();
			let actions = [];
			if (entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId && facilityOption && !facilityHidden) {
				actions.push({
					name: getTranslation("global.profiles.accessPointProfile.facility"),
					nameText: "Facility",
					action: () => window.location.replace(`/facilities-app/#/?${entityData.displayTargetId}`)
				});
			}
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.accessPointProfile.pinTo"),
					nameText: "Pin To",
					action: () => openDialog("pinToDialog")
				}];


			const canManageAccessPoint = user.integrations
				&& user.integrations.find(int => int.intId === accessPoint.feedId)
				&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
				&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage");

			// can we edit a access point?
			if (canManageAccessPoint) {
				actions = [
					...actions,
					{
						name: getTranslation("global.profiles.accessPointProfile.edit"),
						nameText: "Edit",
						action: () => openDialog("accessPointEditDialog")
					}];
			}
			return (
				<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
					<ErrorBoundary>
						<SummaryWidget
							id={contextId}
							readOnly={readOnly}
							user={user}
							context={context}
							name={name}
							type="accessPoint"
							geometry={entityData.displayTargetId ? true : geometry}
							description={description}
							scrolledUp={scrolledUp}
							handleExpand={this.handleExpand}
							mapVisible={mapVisible}
							appId={appId}
							actions={[
								...actions,
								{
									name: getTranslation("global.profiles.accessPointProfile.hide"),
									nameText: "Hide",
									action: () => {
										this.setState({ hiding: true });
										ignoreEntity(contextId, entityType, feedId, appData);
									},
									debounce: hiding
								}
							]}
							dir={dir}
						/>
					</ErrorBoundary>
					{!scrolledUp && (
						<div className="layout-control-button">
							<a className="cb-font-link" onClick={this.handleEditLayout}>
								<Translate value="global.profiles.accessPointProfile.editProfileLayout" />
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
								profile="accessPoint"
								setWidgetOrder={setWidgetOrder}
							/>
						</ErrorBoundary>
						{this.getWidgetStatus("files") && context.attachments && (
							<ErrorBoundary>
								<FileWidget
									key={`${contextId}-files`}
									order={this.getWidgetStatus("files").index}
									enabled={this.getWidgetStatus("files").enabled}
									canDelete={
										!readOnly && user && user.integrations
										&& user.integrations.find(int => int.intId === accessPoint.feedId)
										&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
										&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage")
									}
									hasAccess={!readOnly
										&& user
										&& user.integrations
										&& user.integrations.find(int => int.intId === accessPoint.feedId)
										&& user.integrations.find(int => int.intId === accessPoint.feedId).config
										&& user.integrations.find(int => int.intId === accessPoint.feedId).config.canView}
									attachments={attachments}
									selected={view === "Files"}
									selectWidget={selectWidget}
									attachFiles={attachFilesToAccessPoint}
									widgetsExpandable={widgetsExpandable}
									widgetsLaunchable={widgetsLaunchable}
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
						{this.getWidgetStatus("activities") && (activities || forReplay) && (
							<ErrorBoundary>
								<Activities
									locale={locale}
									key={`${contextId}-activities`}
									entity={accessPoint}
									canManage={user.integrations
										&& user.integrations.find(int => int.intId === accessPoint.feedId)
										&& user.integrations.find(int => int.intId === accessPoint.feedId).config
										&& user.integrations.find(int => int.intId === accessPoint.feedId).config.canView}
									order={this.getWidgetStatus("activities").index}
									enabled={this.getWidgetStatus("activities").enabled}
									selected={view === "Activity Timeline"}
									pageSize={5}
									selectWidget={selectWidget}
									activities={activities}
									updateActivityFilters={updateActivityFilters}
									activityFilters={activityFilters}
									widgetsExpandable={widgetsExpandable}
									widgetsLaunchable={widgetsLaunchable}
									unsubscribeFromFeed={unsubscribeFromFeed}
									contextId={contextId}
									entityType={entityType}
									subscriberRef="profile"
									openDialog={openDialog}
									closeDialog={closeDialog}
									dialog={dialog}
									isPrimary={isPrimary}
									userId={userId}
									readOnly={readOnly}
									forReplay={forReplay}
									endDate={endDate}
									timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{!disableLinkedItems && this.getWidgetStatus("linked_items") && (
							<ErrorBoundary>
								<LinkedItemsWidget
									order={this.getWidgetStatus("linked_items").index}
									enabled={this.getWidgetStatus("linked_items").enabled}
									dialog={dialog}
									openDialog={openDialog}
									linkEntities={linkEntities}
									unlinkEntities={unlinkEntities}
									entity={accessPoint}
									closeDialog={closeDialog}
									selected={view === "Linked Items"}
									expanded={false} // for styling differences between profile and expanded widget views
									items={[...(context.linkedEntities || [])]}
									canLink={canManageAccessPoint}
									events={context.fovEvents || []}
									disabledTypes={disabledLinkedItemTypes}
									selectWidget={selectWidget}
									feeds={feeds}
									view={view}
									loadProfile={loadProfile}
									widgetsExpandable={widgetsExpandable}
									widgetsLaunchable={widgetsLaunchable}
									contextId={contextId}
									entityType={entityType}
									subscriberRef={"profile"}
									unsubscribeFromFeed={unsubscribeFromFeed}
									isPrimary={isPrimary}
									autoFocus={true}
									dir={dir}
								/>
							</ErrorBoundary>
						)}

						{this.getWidgetStatus("cameras") && camerasInRange && (
							<ErrorBoundary>
								<CamerasWidget
									key={`${contextId}-cameras`}
									cameras={camerasInRange}
									canLink={!readOnly && user.integrations
										&& user.integrations.find(int => int.intId === accessPoint.feedId)
										&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions
										&& user.integrations.find(int => int.intId === accessPoint.feedId).permissions.includes("manage")}
									entityType={entityType}
									geometry={geometry}
									order={this.getWidgetStatus("cameras").index}
									enabled={this.getWidgetStatus("cameras").enabled}
									loadProfile={loadProfile}
									sidebarOpen={sidebarOpen}
									entity={accessPoint}
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

						<AccessPointEditDialog
							open={dialog === "accessPointEditDialog"}
							accessPoint={accessPoint}
							close={() => closeDialog("accessPointEditDialog")}
							update={updateAccesspoint}
							dir={dir}
						/>
						<PinToDialog
							open={dialog === "pinToDialog"}
							close={() => closeDialog("pinToDialog")}
							entity={accessPoint}
							addRemoveFromCollections={addRemoveFromCollections}
							addRemoveFromEvents={addRemoveFromEvents}
							createCollection={createCollection}
							dialog={dialog}
							openDialog={openDialog}
							closeDialog={closeDialog}
							canManageEvents={user.applications &&
								user.applications.find(app => app.appId === "events-app") &&
								user.applications.find(app => app.appId === "events-app").permissions &&
								user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
							canPinToCollections={user.applications &&
								user.applications.find(app => app.appId === "map-app") &&
								user.applications.find(app => app.appId === "map-app").permissions &&
								user.applications.find(app => app.appId === "map-app").permissions.includes("manage")}
							userId={userId}
							dir={dir}
						/>
					</div>
				</div>
			)
		}
		else {
			return <div />;
		}
	}
}

AccessPointProfile.propTypes = propTypes;
AccessPointProfile.defaultProps = defaultProps;
export default AccessPointProfile;
