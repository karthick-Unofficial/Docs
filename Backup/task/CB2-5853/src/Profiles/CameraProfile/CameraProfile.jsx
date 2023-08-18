import React, { memo, useEffect, useState, useRef } from "react";

import ErrorBoundary from "../../ErrorBoundary";

import SummaryWidget from "../Widgets/Summary/SummaryWidget";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import FileWidget from "../Widgets/File/FileWidget";
import Activities from "../Widgets/Activities/Activities";
import MapWidget from "../Widgets/Map/MapWidget";
import LinkedItemsWidget from "../Widgets/LinkedItems/LinkedItemsWidget";
import LiveCameraWidget from "../Widgets/LiveCamera/LiveCameraWidget";
import CameraDialog from "./components/CameraDialog";
import PinToDialog from "../../SharedComponents/PinToDialog";
import { facilityService } from "client-app-core";
import isEqual from "react-fast-compare";
import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import includes from "lodash/includes";
import keys from "lodash/keys";

import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	startLiveCameraStream,
	startActivityStream,
	startAttachmentStream,
	startFOVItemStream,
	startCamerasLinkedItemsStream,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";

import { ignoreEntity } from "orion-components/GlobalData/Actions";
import {
	showFOV,
	hideFOV,
	addRemoveFromEvents,
	addRemoveFromCollections
} from "orion-components/SharedActions/cameraProfileActions";
import { createCollection } from "orion-components/SharedActions/commonActions";
import { cameraProfileConfig } from "orion-components/Profiles/Selectors/CameraProfileSelectors";
import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";

const propTypes = {
	disableLinkedItems: PropTypes.bool,
	floorPlansWithFacFeed: PropTypes.bool,
	updateCamera: PropTypes.func,
	selectWidget: PropTypes.func,
	facilityOption: PropTypes.bool,
	disabledLinkedItemTypes: PropTypes.bool,
	widgetsExpandable: PropTypes.bool,
	appData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	endDate: PropTypes.date,
	facilityFeedId: PropTypes.string,
	mapstatus: PropTypes.string,
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => {}
};

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

// cSpell:ignore mapstate mapstatus

const CameraProfile = ({
	disableLinkedItems,
	floorPlansWithFacFeed,
	selectFloorPlanOn,
	updateCamera,
	selectWidget,
	facilityOption,
	disabledLinkedItemTypes,
	appData,
	endDate,
	facilityFeedId,
	widgetsExpandable
}) => {
	const dispatch = useDispatch();

	const context = useSelector((state) => selectedContextSelector(state));
	const { entity } = context;
	const view = entity && useSelector((state) => state.userAppState?.cameraView);
	const contextId = entity?.id;
	const widgetState = useSelector((state) => entity && widgetStateSelector(state));
	const dir = useSelector((state) => entity && getDir(state));
	const camera = entity;
	const appId = useSelector((state) => entity && state.appId);
	const isReplayApp = appId === "replay-app" ? true : false;
	const readOnly = isReplayApp;
	const forReplay = isReplayApp;
	const canAccess =
		!readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "config"));
	const canManage =
		!readOnly &&
		useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "permissions", "manage"));
	const canControl =
		!readOnly &&
		useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "permissions", "control"));
	const canManageEvents = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canPinToCollections = useSelector((state) => canManageByApplication(state)("map-app", "manage"));

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const activeFOV =
		entity && (appId === "map-app" || appId === "events-app")
			? includes(keys(useSelector((state) => state.globalData.fovs.data)), contextId)
			: undefined;
	const floorPlansWithFacilityFeed = useSelector((state) =>
		floorPlansWithFacFeed ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null
	);
	const getWidgetConfig = useSelector((state) => cameraProfileConfig(state)(widgetsExpandable));

	const { liveCamera } = context ?? {};
	const { entityType, entityData, feedId } = camera ?? {};
	if (camera) {
		camera.activeFOV = activeFOV;
	}
	const { properties, geometry } = entityData ?? {};
	const { name, description, type, subtype } = properties ?? {};

	const [layoutControlsOpen, setLayoutControlsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [scrolledUp, setScrolledUp] = useState(false);
	const [hiding, setHiding] = useState(false);
	const [facilityHidden, setFacilityHidden] = useState(true);

	useEffect(() => {
		handleScroll();
	}, [scrolledUp]);

	useEffect(() => {
		if (!forReplay) {
			if (!disableLinkedItems && getWidgetStatus("linked_items")) {
				dispatch(startCamerasLinkedItemsStream(contextId, "profile"));
				if (context?.entity?.fov) {
					dispatch(startFOVItemStream(contextId, "profile"));
				}
			}
			if (getWidgetStatus("activities")) dispatch(startActivityStream(contextId, "camera", "profile"));
			if (getWidgetStatus("files")) dispatch(startAttachmentStream(contextId, "profile"));
			if (getWidgetStatus("live_camera")) dispatch(startLiveCameraStream(contextId, "camera", "profile"));
			if (camera?.entityData?.displayTargetId && camera?.entityData?.displayType?.toLowerCase() === "facility") {
				facilityService.getFloorPlan(camera.entityData.displayTargetId, (err, res) => {
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
			const retryLiveCamera = widgetState?.find((element) => element.id === "live_camera");
			if (retryLiveCamera.enabled && !context.liveCamera) {
				dispatch(startLiveCameraStream(contextId, "camera", "profile"));
			}
		}
	}, [widgetState]);

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

	const prevContext = usePrevious(context);

	useEffect(() => {
		if (
			!forReplay &&
			context &&
			!disableLinkedItems &&
			prevContext &&
			!prevContext.entity.fov &&
			context.entity.fov &&
			getWidgetStatus("linked_items")
		) {
			dispatch(startFOVItemStream(contextId, "profile"));
		}
	}, [context]);

	const handleEditLayout = (event) => {
		event.preventDefault();
		setLayoutControlsOpen(true);
		setAnchorEl(event.currentTarget);
	};

	const handleCloseEditLayout = () => {
		setLayoutControlsOpen(false);
	};

	const handleExpand = () => {
		setScrolledUp(false);
		$(".cb-profile-wrapper").scrollTop(0);
	};

	const getWidgetStatus = (widgetId) => {
		const widgetConfig = getWidgetConfig;
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	const showFloorPlanOnTargetClick = () => {
		const { entityData } = camera;
		if (entityData?.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData?.id === entityData?.displayTargetId) {
				dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
			}
		}
	};

	const getSummaryWidgetActions = () => {
		let actions = [];
		if (
			entityData?.displayType?.toLowerCase() === "facility" &&
			entityData?.displayTargetId &&
			facilityOption &&
			!facilityHidden
		) {
			actions.push({
				name: getTranslation("global.profiles.cameraProfile.facility"),
				nameText: "Facility",
				action: () => window.location.replace(`/facilities-app/#/?${entityData.displayTargetId}`)
			});
		}

		if (appId !== "cameras-app") {
			const LaunchAction = {
				name: getTranslation("global.profiles.cameraProfile.launch"),
				nameText: "Launch",
				action: () => window.location.replace(`/cameras-app/#/entity/${contextId}/widget/map`)
			};

			actions.push(LaunchAction);
		}

		actions = [
			...actions,
			{
				name: activeFOV
					? getTranslation("global.profiles.cameraProfile.hideFOV")
					: getTranslation("global.profiles.cameraProfile.showFOV"),
				nameText: activeFOV ? "Hide FOV" : "Show FOV",
				action: activeFOV ? () => dispatch(hideFOV(camera.id)) : () => dispatch(showFOV(camera.id))
			},
			{
				name: getTranslation("global.profiles.cameraProfile.pinTo"),
				nameText: "Pin To",
				action: () => dispatch(openDialog("pinToDialog"))
			},
			{
				name: getTranslation("global.profiles.cameraProfile.hide"),
				nameText: "Hide",
				action: () => {
					setHiding(true);
					dispatch(ignoreEntity(contextId, entityType, feedId, appData));
				},
				debounce: hiding
			}
		];
		// can we edit a camera?
		if (canManage) {
			actions = [
				...actions,
				{
					name: getTranslation("global.profiles.cameraProfile.edit"),
					nameText: "Edit",
					action: () => dispatch(openDialog("cameraEditDialog"))
				}
			];
		}
		return actions;
	};

	const widgetRenderFilters = {
		map: !($(window).width() > 1023),
		files: !context?.attachments,
		activities: !(context?.activities || forReplay),
		linked_items: disableLinkedItems,
		live_camera: !liveCamera
	};

	const renderWidgets = (widgetName) => {
		switch (widgetName) {
			case "map":
				return <MapWidget id={widgetName} selectWidget={selectWidget} entityType={entityType} />;

			case "files":
				return (
					<FileWidget
						key={`${contextId}-files`}
						id={widgetName}
						canDelete={canManage}
						hasAccess={canAccess}
						selected={view === "Files"}
						selectWidget={selectWidget}
						contextId={contextId}
						subscriberRef="profile"
						widgetsExpandable={widgetsExpandable}
					/>
				);

			case "activities":
				return (
					<Activities
						id={widgetName}
						key={`${contextId}-activities`}
						canManage={canAccess}
						selected={view === "Activity Timeline"}
						pageSize={5}
						selectWidget={selectWidget}
						unsubscribeFromFeed={unsubscribeFromFeed}
						contextId={contextId}
						subscriberRef="profile"
						readOnly={readOnly}
						forReplay={forReplay}
						endDate={endDate}
						widgetsExpandable={widgetsExpandable}
					/>
				);

			case "linked_items":
				return (
					<LinkedItemsWidget
						id={widgetName}
						selected={view === "Linked Items"}
						expanded={false} // for styling differences between profile and expanded widget views
						canLink={canManage}
						disabledTypes={disabledLinkedItemTypes}
						selectWidget={selectWidget}
						view={view}
						contextId={contextId}
						subscriberRef={"profile"}
						unsubscribeFromFeed={unsubscribeFromFeed}
						selectFloor={selectFloorPlanOn}
						facilityFeedId={facilityFeedId}
						widgetsExpandable={widgetsExpandable}
					/>
				);

			case "live_camera":
				return (
					<LiveCameraWidget
						id={widgetName}
						key="camera-profile-view"
						selected={view === "Live Camera"}
						expanded={false} // for styling differences between profile and expanded widget views
						canControl={canControl}
						selectWidget={selectWidget}
						contextId={contextId}
						subscriberRef={"profile"}
						readOnly={readOnly}
						widgetsExpandable={widgetsExpandable}
					/>
				);

			default:
				return null;
		}
	};

	if (context) {
		const widgets = getWidgetConfig;

		// Height of summary-info (consistent between scrolled and not scrolled state) + padding
		const scrollOffset = scrolledUp ? 167 : 0;
		// Dynamic offset for widget container when SummaryWidget is collapsed
		const widgetsContainerStyle = {
			top: scrollOffset
		};

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<ErrorBoundary>
					<SummaryWidget
						id={contextId}
						readOnly={readOnly}
						context={context}
						name={name}
						type={subtype ? subtype : type}
						geometry={entityData.displayTargetId ? true : geometry}
						description={description}
						scrolledUp={scrolledUp}
						handleExpand={handleExpand}
						selectFloor={showFloorPlanOnTargetClick}
						actions={getSummaryWidgetActions()}
					/>
				</ErrorBoundary>
				{!scrolledUp && (
					<div className="layout-control-button">
						<a className="cb-font-link" onClick={handleEditLayout}>
							<Translate value="global.profiles.cameraProfile.editProfileLayout" />
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
							profile="camera"
						/>
					</ErrorBoundary>
					{(widgetState?.length > 0 ? widgetState : widgets)
						.filter((element) => getWidgetStatus(element.id))
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
					<CameraDialog
						camera={camera}
						close={() => dispatch(closeDialog("cameraEditDialog"))}
						update={updateCamera}
						dir={dir}
					/>
					<PinToDialog
						close={() => dispatch(closeDialog("pinToDialog"))}
						entity={camera}
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

CameraProfile.propTypes = propTypes;
CameraProfile.defaultProps = defaultProps;

export default memo(CameraProfile, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
});
