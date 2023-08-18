import React, { useEffect, useState } from "react";
import ErrorBoundary from "../../ErrorBoundary";
import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n";
import { facilityService } from "client-app-core";
import $ from "jquery";
import PinToDialog from "../../SharedComponents/PinToDialog";
import AccessPointEditDialog from "./components/AccessPointEditDialog";
import FileWidget from "../Widgets/File/FileWidget";
import Activities from "../Widgets/Activities/Activities";
import LinkedItemsWidget from "../Widgets/LinkedItems/LinkedItemsWidget";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import AccessControlWidget from "../Widgets/AccessControl/AccessControlWidget";
import { useSelector, useDispatch } from "react-redux";
import {
	mapState,
	persistedState,
	widgetStateSelector,
	fullscreenCameraOpen
} from "orion-components/AppState/Selectors";
import { contextPanelState, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import isObject from "lodash/isObject";
import unionBy from "lodash/unionBy";
//actions
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	startActivityStream,
	startAttachmentStream,
	unsubscribeFromFeed,
	startCamerasInRangeStream
} from "orion-components/ContextualData/Actions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import {
	addRemoveFromCollections,
	addRemoveFromEvents,
	attachFilesToAccessPoint,
	unlinkEntities,
	createCollection,
	updateAccesspoint
} from "orion-components/SharedActions/accessPointProfileActions";
import { defaultAccessPointProfileWidgets } from "orion-components/Profiles/Utils/AccessPointProfileWidgets";

const propTypes = {
	readOnly: PropTypes.bool,
	facilityOption: PropTypes.bool,
	appData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	view: PropTypes.string,
	selectWidget: PropTypes.func,
	widgetsLaunchable: PropTypes.bool,
	widgetsExpandable: PropTypes.bool,
	forReplay: PropTypes.bool,
	endDate: PropTypes.date,
	disableLinkedItems: PropTypes.bool,
	disabledLinkedItemTypes: PropTypes.bool,
	floorPlansWithFacFeed: PropTypes.bool,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	selectFloorPlanOn: () => { }
};

let DEFAULT_WIDGET_CONFIG = [];

const AccessPointProfile = ({
	readOnly,
	facilityOption,
	appData,
	view,
	selectWidget,
	widgetsLaunchable,
	widgetsExpandable,
	forReplay,
	endDate,
	disableLinkedItems,
	disabledLinkedItemTypes,
	floorPlansWithFacFeed,
	selectFloorPlanOn
}) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user.profile);
	const context = useSelector((state) => selectedContextSelector(state));
	const { entity } = context;
	const isLoaded = isObject(context) && entity;
	const activityFilters = useSelector((state) => isLoaded && persistedState(state).activityFilters);
	const dialog = useSelector((state) => isLoaded && state.appState.dialog.openDialog);
	const mapStatus = useSelector((state) => mapState(state));
	const entityType = isLoaded && entity.entityType;
	const contextId = isLoaded && entity.id;
	const widgetState = useSelector((state) => (isLoaded ? widgetStateSelector(state) : []));
	// Check if camera is the primary context
	const isPrimary = useSelector(
		(state) => isLoaded && contextId === contextPanelState(state).selectedContext.primary
	);
	const feeds = useSelector((state) => isLoaded && userFeedsSelector(state));
	const fullscreenCamera = useSelector((state) => isLoaded && fullscreenCameraOpen(state));
	const appId = useSelector((state) => isLoaded && state.appId);
	const dir = useSelector((state) => isLoaded && getDir(state));
	const accessPoint = isLoaded && entity;
	const mapVisible = isLoaded && mapStatus.visible;

	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [facilityHidden, setFacilityHidden] = useState(true);
	const [mounted, setMounted] = useState(false);
	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null
	);
	const canManageAccessPoint =
		user.integrations &&
		user.integrations.find((int) => int.intId === accessPoint.feedId) &&
		user.integrations.find((int) => int.intId === accessPoint.feedId).permissions &&
		user.integrations.find((int) => int.intId === accessPoint.feedId).permissions.includes("manage");
	const canControlAccessPoint =
		!readOnly &&
		user.integrations &&
		user.integrations.find((int) => int.intId === accessPoint.feedId) &&
		user.integrations.find((int) => int.intId === accessPoint.feedId).permissions &&
		user.integrations.find((int) => int.intId === accessPoint.feedId).permissions.includes("control");

	useEffect(() => {
		if (!forReplay) {
			dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));

			if (getWidgetStatus("activities")) dispatch(startActivityStream(contextId, "accessPoint", "profile"));
			if (getWidgetStatus("files")) dispatch(startAttachmentStream(contextId, "profile"));
			if (
				accessPoint &&
				accessPoint.entityData.displayTargetId &&
				accessPoint.entityData.displayType &&
				accessPoint.entityData.displayType.toLowerCase() === "facility"
			) {
				facilityService.getFloorPlan(accessPoint.entityData.displayTargetId, (err, res) => {
					if (err) {
						setFacilityHidden(true);
					} else if (res.success) {
						setFacilityHidden(false);
					}
				});
			}
		} else {
			// do we need to do something else here, or leave it up to the widgets to pull in the static data
		}
		setMounted(true);
	}, []);

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = defaultAccessPointProfileWidgets;
		setMounted(true);
	}

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	const getWidgetStatus = (widgetId) => {
		const widgetConfig = getWidgetConfig();
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
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

	const handleExpand = () => {
		setScrolledUp(false);
		$(".cb-profile-wrapper").scrollTop(0);
	};

	const getWidgetConfig = () => {
		const defaultTypes = ["files", "activities", "linked_items", "cameras"];
		if (canControlAccessPoint) {
			defaultTypes.unshift("access_control");
		}
		if (widgetsExpandable) defaultTypes.push("map");

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter((widget) => defaultTypes.includes(widget.id));

		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = widgetState ? unionBy(filteredState, filteredDefault, "id") : filteredDefault;
		return widgetConfig;
	};

	useEffect(() => {
		if (!forReplay) {
			const retryCamera = widgetState.find((element) => element.id === "cameras");
			const { camerasInRange } = context;
			if (retryCamera.enabled && !camerasInRange) {
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));
			}
		}
	}, [widgetState, forReplay]);

	const handleEditLayout = (event) => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEl(event.currentTarget);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const showFloorPlanOnTargetClick = () => {
		const { entityData } = accessPoint;
		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
			}
		}
	};

	if (context) {
		const { entityType, entityData, feedId } = accessPoint;
		const { properties, geometry } = entityData;
		const { name, description, type } = properties;
		const { attachments, activities, camerasInRange } = context;
		const userId = user.id;
		// Height of summary-info (consistent between scrolled and not scrolled state) + padding
		const scrollOffset = scrolledUp ? 167 : 0;
		// Dynamic offset for widget container when SummaryWidget is collapsed
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig();

		let actions = [];
		if (
			entityData.displayType &&
			entityData.displayType.toLowerCase() === "facility" &&
			entityData.displayTargetId &&
			facilityOption &&
			!facilityHidden
		) {
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
				action: () => dispatch(openDialog("pinToDialog"))
			}
		];

		// can we edit a access point?
		if (canManageAccessPoint) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.accessPointProfile.edit"),
					nameText: "Edit",
					action: () => dispatch(openDialog("accessPointEditDialog"))
				}
			];
		}

		const renderWidgets = (widgetName) => {
			switch (widgetName) {
				case "access_control":
					return (
						<AccessControlWidget
							id={widgetName}
							readOnly={readOnly}
							key={`${contextId}-access_control`}
							accessPoint={accessPoint}
						/>
					);

				case "files":
					return (
						<FileWidget
							id={widgetName}
							key={`${contextId}-files`}
							canDelete={
								!readOnly &&
								user &&
								user.integrations &&
								user.integrations.find((int) => int.intId === accessPoint.feedId) &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).permissions &&
								user.integrations
									.find((int) => int.intId === accessPoint.feedId)
									.permissions.includes("manage")
							}
							hasAccess={
								!readOnly &&
								user &&
								user.integrations &&
								user.integrations.find((int) => int.intId === accessPoint.feedId) &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).config &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).config.canView
							}
							attachments={attachments}
							selected={view === "Files"}
							selectWidget={selectWidget}
							attachFiles={attachFilesToAccessPoint}
							widgetsExpandable={widgetsExpandable}
							widgetsLaunchable={widgetsLaunchable}
							entityType={entityType}
							contextId={contextId}
							dialog={dialog}
							subscriberRef="profile"
						/>
					);

				case "activities":
					return (
						<Activities
							id={widgetName}
							key={`${contextId}-activities`}
							entity={accessPoint}
							canManage={
								user.integrations &&
								user.integrations.find((int) => int.intId === accessPoint.feedId) &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).config &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).config.canView
							}
							selected={view === "Activity Timeline"}
							pageSize={5}
							selectWidget={selectWidget}
							activities={activities}
							activityFilters={activityFilters}
							widgetsExpandable={widgetsExpandable}
							widgetsLaunchable={widgetsLaunchable}
							contextId={contextId}
							entityType={entityType}
							subscriberRef="profile"
							dialog={dialog}
							isPrimary={isPrimary}
							userId={userId}
							readOnly={readOnly}
							forReplay={forReplay}
							endDate={endDate}
							displayType={type === "Radar" ? type : "AccessPoint"}
						/>
					);

				case "linked_items":
					return (
						<LinkedItemsWidget
							id={widgetName}
							dialog={dialog}
							entity={accessPoint}
							selected={view === "Linked Items"}
							expanded={false} // for styling differences between profile and expanded widget views
							items={[...(context.linkedEntities || [])]}
							canLink={canManageAccessPoint}
							events={context.fovEvents || []}
							disabledTypes={disabledLinkedItemTypes}
							selectWidget={selectWidget}
							feeds={feeds}
							view={view}
							widgetsExpandable={widgetsExpandable}
							widgetsLaunchable={widgetsLaunchable}
							contextId={contextId}
							entityType={entityType}
							subscriberRef={"profile"}
							isPrimary={isPrimary}
							autoFocus={true}
						/>
					);

				case "cameras":
					return (
						<CamerasWidget
							id={widgetName}
							key={`${contextId}-cameras`}
							cameras={camerasInRange}
							canLink={
								!readOnly &&
								user.integrations &&
								user.integrations.find((int) => int.intId === accessPoint.feedId) &&
								user.integrations.find((int) => int.intId === accessPoint.feedId).permissions &&
								user.integrations
									.find((int) => int.intId === accessPoint.feedId)
									.permissions.includes("manage")
							}
							entityType={entityType}
							geometry={geometry}
							loadProfile={loadProfile}
							entity={accessPoint}
							unlinkCameras={unlinkEntities}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							dialog={dialog}
							fullscreenCamera={fullscreenCamera}
							readOnly={readOnly}
							disableSlew={readOnly}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
							widgetsLaunchable={!readOnly && widgetsLaunchable}
							user={user}
						/>
					);

				default:
					return null;
			}
		};

		const widgetRenderFilters = {
			activities: !(activities || forReplay),
			files: !context.attachments,
			access_control: !canControlAccessPoint,
			linked_items: disableLinkedItems,
			cameras: !camerasInRange
		};

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
						handleExpand={handleExpand}
						mapVisible={mapVisible}
						appId={appId}
						selectFloor={showFloorPlanOnTargetClick}
						actions={[
							...actions,
							{
								name: getTranslation("global.profiles.accessPointProfile.hide"),
								nameText: "Hide",
								action: () => {
									setHiding(true);
									dispatch(ignoreEntity(contextId, entityType, feedId, appData));
								},
								debounce: hiding
							}
						]}
						dir={dir}
						displayType={type === "Radar" ? type : "Access Point"}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.accessPointProfile.editProfileLayout" />
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
							profile="accessPoint"
						/>
					</ErrorBoundary>

					{widgetState?.length > 0 &&
						widgetState
							.filter((element) => getWidgetStatus(element.id, widgetState))
							.map((element, index) => {
								const { id, enabled } = element;
								if (widgetRenderFilters[id]) {
									return false;
								}
								if (!enabled) {
									return false;
								}
								return <ErrorBoundary key={id}>{renderWidgets(id, index)}</ErrorBoundary>;
							})}

					<AccessPointEditDialog
						open={dialog === "accessPointEditDialog"}
						accessPoint={accessPoint}
						close={() => dispatch(closeDialog("accessPointEditDialog"))}
						update={(accessPointId, entityData) => dispatch(updateAccesspoint(accessPointId, entityData))}
						dir={dir}
					/>
					<PinToDialog
						open={dialog === "pinToDialog"}
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={accessPoint}
						addRemoveFromCollections={addRemoveFromCollections}
						addRemoveFromEvents={addRemoveFromEvents}
						createCollection={createCollection}
						dialog={dialog}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canManageEvents={
							user.applications &&
							user.applications.find((app) => app.appId === "events-app") &&
							user.applications.find((app) => app.appId === "events-app").permissions &&
							user.applications.find((app) => app.appId === "events-app").permissions.includes("manage")
						}
						canPinToCollections={
							user.applications &&
							user.applications.find((app) => app.appId === "map-app") &&
							user.applications.find((app) => app.appId === "map-app").permissions &&
							user.applications.find((app) => app.appId === "map-app").permissions.includes("manage")
						}
						userId={userId}
						dir={dir}
					/>
				</div>
			</div>
		);
	} else {
		return <div />;
	}
};

AccessPointProfile.propTypes = propTypes;
AccessPointProfile.defaultProps = defaultProps;
export default AccessPointProfile;
