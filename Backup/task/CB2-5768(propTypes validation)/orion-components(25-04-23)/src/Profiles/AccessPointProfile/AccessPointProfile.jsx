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
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
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
	unlinkEntities,
	createCollection,
	updateAccesspoint
} from "orion-components/SharedActions/accessPointProfileActions";
import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";
import { accessPointWidgetConfig } from "orion-components/Profiles/Selectors/AccessPointProfile";

const propTypes = {
	facilityOption: PropTypes.bool,
	appData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	view: PropTypes.string,
	selectWidget: PropTypes.func,
	widgetsExpandable: PropTypes.bool,
	endDate: PropTypes.date,
	disableLinkedItems: PropTypes.bool,
	disabledLinkedItemTypes: PropTypes.bool,
	floorPlansWithFacFeed: PropTypes.bool,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	selectFloorPlanOn: () => { }
};

const AccessPointProfile = ({
	facilityOption,
	appData,
	view,
	selectWidget,
	widgetsExpandable,
	endDate,
	disableLinkedItems,
	disabledLinkedItemTypes,
	floorPlansWithFacFeed,
	selectFloorPlanOn
}) => {
	const dispatch = useDispatch();

	const context = useSelector((state) => selectedContextSelector(state));
	const { entity, attachments, activities, camerasInRange } = context ?? {};

	const entityType = entity?.entityType;
	const contextId = entity?.id;
	const widgetState = useSelector((state) => (entity ? widgetStateSelector(state) : []));
	const dir = useSelector((state) => entity && getDir(state));

	const accessPoint = entity;
	const { entityData, feedId } = accessPoint ?? {};
	const { properties, geometry } = entityData ?? {};
	const { name, description, type } = properties ?? {};

	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null
	);
	const isReplayApp = useSelector((state) => {
		return state?.appId === "replay-app" ? true : false;
	});
	const readOnly = isReplayApp;
	const forReplay = isReplayApp;

	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [facilityHidden, setFacilityHidden] = useState(true);

	const canManageAccessPoint = useSelector((state) =>
		checkPermissionBasedOnFeedId(state)(accessPoint?.feedId, "permissions", "manage")
	);

	const canControlAccessPoint = useSelector((state) =>
		checkPermissionBasedOnFeedId(state)(accessPoint?.feedId, "permissions", "control")
	);

	const canAccess =
		!readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(accessPoint?.feedId, "config"));
	const canManageEvents = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canPinToCollections = useSelector((state) => canManageByApplication(state)("map-app", "manage"));
	const getWidgetConfig = useSelector((state) =>
		accessPointWidgetConfig(state)(widgetsExpandable, canControlAccessPoint)
	);

	useEffect(() => {
		if (!forReplay) {
			dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));

			if (getWidgetStatus("activities")) dispatch(startActivityStream(contextId, "accessPoint", "profile"));
			if (getWidgetStatus("files")) dispatch(startAttachmentStream(contextId, "profile"));
			if (
				accessPoint?.entityData?.displayTargetId &&
				accessPoint?.entityData?.displayType?.toLowerCase() === "facility"
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
	}, []);

	useEffect(() => {
		if (!forReplay && widgetState?.length > 0) {
			const retryCamera = widgetState.find((element) => element.id === "cameras");
			const { camerasInRange } = context;
			if (retryCamera.enabled && !camerasInRange) {
				dispatch(startCamerasInRangeStream(contextId, entityType, "profile"));
			}
		}
	}, [widgetState, forReplay]);

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	const getWidgetStatus = (widgetId) => {
		const widgetConfig = getWidgetConfig;
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

	const getSummaryWidgetActions = () => {
		let actions = [
			{
				name: getTranslation("global.profiles.accessPointProfile.hide"),
				nameText: "Hide",
				action: () => {
					setHiding(true);
					dispatch(ignoreEntity(contextId, entityType, feedId, appData));
				},
				debounce: hiding
			}
		];
		if (
			entityData?.displayType?.toLowerCase() === "facility" &&
			entityData?.displayTargetId &&
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
		return actions;
	};

	if (context) {
		// Height of summary-info (consistent between scrolled and not scrolled state) + padding
		const scrollOffset = scrolledUp ? 167 : 0;
		// Dynamic offset for widget container when SummaryWidget is collapsed
		const widgetsContainerStyle = {
			top: scrollOffset
		};
		const widgets = getWidgetConfig;

		const renderWidgets = (widgetName) => {
			switch (widgetName) {
				case "access_control":
					return (
						<AccessControlWidget
							id={widgetName}
							key={`${contextId}-access_control`}
							accessPoint={accessPoint}
						/>
					);

				case "files":
					return (
						<FileWidget
							id={widgetName}
							key={`${contextId}-files`}
							canDelete={!readOnly && canManageAccessPoint}
							hasAccess={canAccess}
							attachments={attachments}
							selected={view === "Files"}
							selectWidget={selectWidget}
							entityType={entityType}
							contextId={contextId}
							subscriberRef="profile"
						/>
					);

				case "activities":
					return (
						<Activities
							id={widgetName}
							key={`${contextId}-activities`}
							entity={accessPoint}
							canManage={canAccess}
							selected={view === "Activity Timeline"}
							pageSize={5}
							selectWidget={selectWidget}
							activities={activities}
							contextId={contextId}
							entityType={entityType}
							subscriberRef="profile"
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
							entity={accessPoint}
							selected={view === "Linked Items"}
							expanded={false} // for styling differences between profile and expanded widget views
							items={[...(context.linkedEntities || [])]}
							canLink={canManageAccessPoint}
							events={context.fovEvents || []}
							disabledTypes={disabledLinkedItemTypes}
							selectWidget={selectWidget}
							view={view}
							contextId={contextId}
							entityType={entityType}
							subscriberRef={"profile"}
							autoFocus={true}
						/>
					);

				case "cameras":
					return (
						<CamerasWidget
							id={widgetName}
							key={`${contextId}-cameras`}
							cameras={camerasInRange}
							canLink={!readOnly && canManageAccessPoint}
							entityType={entityType}
							geometry={geometry}
							loadProfile={loadProfile}
							entity={accessPoint}
							unlinkCameras={unlinkEntities}
							contextId={contextId}
							unsubscribeFromFeed={unsubscribeFromFeed}
							subscriberRef="profile"
							readOnly={readOnly}
							disableSlew={readOnly}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
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

		const summaryActions = getSummaryWidgetActions();

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						readOnly={readOnly}
						context={context}
						name={name}
						type="accessPoint"
						geometry={entityData?.displayTargetId ? true : geometry}
						description={description}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						selectFloor={showFloorPlanOnTargetClick}
						actions={summaryActions}
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
							widgetOrder={widgetState?.length > 0 ? widgetState : widgets}
							profile="accessPoint"
						/>
					</ErrorBoundary>

					{(widgetState?.length > 0 ? widgetState : widgets)
						.filter((element) => getWidgetStatus(element.id, widgetState))
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

					<AccessPointEditDialog
						accessPoint={accessPoint}
						close={() => dispatch(closeDialog("accessPointEditDialog"))}
						update={(accessPointId, entityData) => dispatch(updateAccesspoint(accessPointId, entityData))}
						dir={dir}
					/>
					<PinToDialog
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={accessPoint}
						addRemoveFromCollections={addRemoveFromCollections}
						addRemoveFromEvents={addRemoveFromEvents}
						createCollection={createCollection}
						openDialog={openDialog}
						closeDialog={closeDialog}
						canManageEvents={canManageEvents}
						canPinToCollections={canPinToCollections}
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
