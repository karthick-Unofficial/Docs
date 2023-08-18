import React, { Fragment, useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import { SummaryWidget, FileWidget, Activities, FloorPlanWidget } from "../Widgets";
import { CircularProgress } from "@mui/material";
import { facilityService, cameraService, accessPointService } from "client-app-core";
import PinToDialog from "../../SharedComponents/PinToDialog";
import ErrorBoundary from "../../ErrorBoundary";
import $ from "jquery";
import isEqual from "react-fast-compare";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import { Dialog } from "../../CBComponents/index";
import { Translate, getTranslation } from "orion-components/i18n";
import AccessPointWidget from "../Widgets/AccessPoint/AccessPointWidget";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { useSelector, useDispatch } from "react-redux";
import { selectedFacilitySelector, contextPanelState, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { widgetStateSelector, persistedState } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import unionBy from "lodash/unionBy";
import isObject from "lodash/isObject";
import uniqBy from "lodash/uniqBy";
import { addRemoveFromCollections, addRemoveFromEvents } from "orion-components/SharedActions/cameraProfileActions"

let DEFAULT_WIDGET_CONFIG = [];

const propTypes = {
	context: PropTypes.object,
	setMapTools: PropTypes.func.isRequired,
	selectFloorPlan: PropTypes.func.isRequired,
	selectedFloorId: PropTypes.string,
	setFloorPlans: PropTypes.func.isRequired,
	actionOptions: PropTypes.array,
	disableCameras: PropTypes.bool,
	deleteFacility: PropTypes.func,
	dir: PropTypes.string
};

const defaultProps = {
	context: null,
	selectedFloorId: null,
	dir: "ltr"
};

const handleScroll = (scrolledUp, updateState) => {
	$(".cb-profile-wrapper").on("resize scroll", () => {
		const elementTop = $(".summary-wrapper").offset().top;
		const elementBottom =
			elementTop + $(".summary-wrapper").outerHeight() + 120; // offset for app/navigation bar
		const viewportTop = $(".cb-profile-wrapper").scrollTop();
		const viewportBottom = viewportTop + $(".cb-profile-wrapper").height();
		if (
			!(elementBottom > viewportTop && elementTop < viewportBottom) &&
			!scrolledUp
		) {
			updateState({
				scrolledUp: true
			});
			$(".cb-profile-wrapper").scrollTop(0);
		}
	});
};


const getWidgetConfig = (widgetState) => {
	const defaultTypes = [
		"activities",
		"files",
		"cameras",
		"floorPlans",
		"accessPoints"
	];

	const filteredDefault = DEFAULT_WIDGET_CONFIG.filter(widget =>
		defaultTypes.includes(widget.id)
	);

	const filteredState = widgetState
		? widgetState.filter(widget => defaultTypes.includes(widget.id))
		: [];

	const widgetConfig = widgetState
		? unionBy(filteredState, filteredDefault, "id")
		: filteredDefault;
	return widgetConfig;
};

const getWidgetStatus = (widgetId, widgetState) => {
	const widgetConfig = getWidgetConfig(widgetState);
	const widget = widgetConfig.find((widget, index) => {
		widget.index = index;
		return widget.id === widgetId;
	});

	return widget;
};

const FacilityProfile = ({
	actionOptions,
	attachFilesToFacility,
	appData,
	createCollection,
	ignoreFacility,
	disableCameras,
	setMapTools,
	selectFloorPlan,
	setFloorPlans,
	clearFloorPlan,
	startFloorPlanCameraStream,
	startFloorPlanAccessPointsStream,
	startCamerasInRangeStream,
	unsubscribeFromFeed,
	removeFloorPlanCameraSub,
	removeFloorPlanAccessPointsSub,
	startActivityStream,
	startAttachmentStream,	
	loadProfile,
	openDialog,
	closeDialog,
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState,
	selectWidget,	
	widgetsLaunchable,
	deleteFacility,
	readOnly,
	forReplay,
	endDate
}) => {
	const dispatch = useDispatch();

	const fullContext = useSelector(state => selectedFacilitySelector(state));
	const session = useSelector(state => state.session);
	const globalData = useSelector(state => state.globalData);
	const user = session.user.profile;
	const entity = fullContext ? fullContext.entity : null;
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const isLoaded = isObject(fullContext) && entity;
	const view = useSelector(state => isLoaded && state.userAppState && state.userAppState.facilityView);
	const { floorPlans } = globalData;
	const orgId = isLoaded && user.orgId;
	const ownerOrg = isLoaded && entity;
	const activityFilters = useSelector(state => isLoaded && persistedState(state).activityFilters);
	const contextId = entity.id;
	const isPrimary = useSelector(state => isLoaded && contextId === contextPanelState(state).selectedContext.primary);
	const fromOrg = isLoaded && ownerOrg === orgId;
	const fromEco = isLoaded && ownerOrg !== orgId;
	const widgetState = useSelector(state => isLoaded ? widgetStateSelector(state) : []);
	const context = fullContext;
	const sidebarOpen = useSelector(state => state.appState.dock.dockData.isOpen);
	const dockedCameras = useSelector(state => state.appState.dock.cameraDock.dockedCameras);
	const facilityId = entity.id;
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state) || {});

	const camerasWidgetContext = useSelector(state => selectedContextSelector(state));
	const floorPlan = useSelector(state => state.floorPlan);
	const camerasWidgetSelectedFloor = floorPlan || {};
	const cameras = uniqBy([...(camerasWidgetContext.floorPlanCameras || []), ...(camerasWidgetContext.camerasInRange || [])], "id");
	const key = camerasWidgetSelectedFloor ? `${camerasWidgetSelectedFloor.id}-cameras` : "";
	const geometry = camerasWidgetSelectedFloor ? camerasWidgetSelectedFloor.geometry : {};

	const [hiding, setHiding] = useState(false);
	const [floorPlanAccessPoints, setFloorPlanAccessPoints] = useState([]);
	const [state, setState] = useState({
		layoutControlsOpen: false,
		anchorEl: null,
		scrolledUp: false,
		editing: false,
		hiding: false
	});
	const [mounted, setMounted] = useState(false);
	const scrollOffset = state.scrolledUp ? 74 : 0;
	const widgetsContainerStyle = {
		top: scrollOffset
	};
	const [facilityDeleteTitle, setFacilityDeleteTitle] = useState("");

	const handleCloseDeleteDialog = () => {
		dispatch(closeDialog("facilityDeleteDialog"));
	};

	const handleCloseCannotDeleteDialog = () => {
		dispatch(closeDialog("facilityCannotDeleteDialog"));
	};

	const handleConfirmDelete = () => {

		dispatch(deleteFacility(context.entity.id));

		handleCloseDeleteDialog();
	};

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = [
			{
				enabled: true,
				id: "floorPlans",
				name: getTranslation("global.profiles.facilityProfile.main.floorPlans")
			},
			{
				enabled: true,
				id: "activities",
				name: getTranslation("global.profiles.facilityProfile.main.activities")
			},
			{
				enabled: true,
				id: "files",
				name: getTranslation("global.profiles.facilityProfile.main.files")
			},
			{
				enabled: true,
				id: "accessPoints",
				name: getTranslation("global.profiles.facilityProfile.main.accessPoints")
			}
		];

		if (!disableCameras) {
			DEFAULT_WIDGET_CONFIG.push({
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.facilityProfile.main.cameras")
			});
		}
		setMounted(true);
	}
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (facilityId) {
			facilityService.getFacilityFloorplans(
				context.entity.id,
				(err, response) => {
					if (err) {
						console.log("ERROR:", err);
					} else {
						const { success, result } = response;
						if (success && result.length) {
							dispatch(setFloorPlans(result));

						} else if (success && !result.length) {
							dispatch(selectFloorPlan(null));
						}
					}
				}
			);
			if (!forReplay) {
				if (getWidgetStatus("files")) {
					dispatch(startAttachmentStream(facilityId, "profile"));
				}
				if (getWidgetStatus("activities")) {
					dispatch(startActivityStream(facilityId, "facility", "profile"));
				}
				if (getWidgetStatus("cameras")) {
					dispatch(startCamerasInRangeStream(facilityId, "facility", "profile"));
				}
			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}

		return () => {
			dispatch(unsubscribeFromFeed(facilityId, "camerasInRange", "profile"));
		};
	}, [facilityId, selectFloorPlan, setFloorPlans, startAttachmentStream]);

	// useEffect(() => {
	// 	handleScroll(state.scrolledUp, setState);
	// }, []);
	if (facilityId) {
		const { attachments, activities, entity } = context;
		const { entityData } = context.entity;
		const { geometry } = entityData;
		const { id } = context.entity;
		const { name, description } = entityData.properties;
		const hasAccess = !readOnly && user.integrations
			&& user.integrations.find(int => int.intId === entity.feedId)
			&& user.integrations.find(int => int.intId === entity.feedId).config
			&& user.integrations.find(int => int.intId === entity.feedId).config.canView;
		const canManageFacility = !readOnly && user.integrations
			&& user.integrations.find(int => int.intId === entity.feedId)
			&& user.integrations.find(int => int.intId === entity.feedId).permissions
			&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage");
		const floorPlanIds = Object.keys(floorPlans);
		const checkEntitiesOnFloorPlan = () => {
			if (floorPlanIds.length > 0) {
				const promises = [];

				floorPlanIds.forEach(floorPlanId => {
					promises.push(
						new Promise(function (resolve, reject) {
							cameraService.getByDisplayTargetId(floorPlanId, (err, res) => {
								if (err) {
									reject(err);
								} else {
									if (res.length > 0) {
										resolve("camera");
									} resolve(false);
								}
							});
						})
					);
					promises.push(
						new Promise(function (resolve, reject) {
							accessPointService.getByDisplayTargetId(floorPlanId, (err, res) => {
								if (err) {
									reject(err);
								} else {
									if (res.length > 0) {
										resolve("accessPoint");
									} resolve(false);
								}
							});
						})
					);
				});


				return Promise.all(promises).then((data) => {
					if (data.includes("camera")) {
						dispatch(openDialog("facilityCannotDeleteDialog"));
						setFacilityDeleteTitle(getTranslation("global.profiles.facilityProfile.main.cantDelete"));

					}
					else if (data.includes("accessPoint")) {
						dispatch(openDialog("facilityCannotDeleteDialog"));
						setFacilityDeleteTitle(getTranslation("global.profiles.facilityProfile.main.cantDeleteAccessPoint"));

					}
					else {
						dispatch(openDialog("facilityDeleteDialog"));
					}

				})
					.catch((error) => {
						console.log("Error", error);
					});

			} else {
				dispatch(openDialog("facilityDeleteDialog"));
			}
		}
		const actions = [];
		if (actionOptions) {
			actionOptions.forEach(action => {
				switch (action) {
					case "edit":
						if (canManageFacility) {
							actions.push(
								{
									name: getTranslation("global.profiles.facilityProfile.main.edit"),
									nameText: "Edit",
									action: () =>
										dispatch(setMapTools({
											type: "facility",
											mode: "simple_select",
											feature: { id, geometry, properties: entityData.properties }
										}))
								});
						}
						break;
					case "hide":
						actions.push(
							{
								name: getTranslation("global.profiles.facilityProfile.main.hide"),
								nameText: "Hide",
								action: () => {
									setHiding(true);
									dispatch(ignoreFacility(context.entity, appData));
								},
								debounce: hiding
							}
						);
						break;
					case "delete":
						if (canManageFacility) {
							actions.push(
								{
									name: getTranslation("global.profiles.facilityProfile.main.delete"),
									nameText: "Delete",
									action: () => {
										checkEntitiesOnFloorPlan();
									}
								});
						}
						break;
					default:
						break;
				}
			});
		}

		const widgets = getWidgetConfig(widgetState);

		const getSelectedFloorPlan = (floorPlan) => {
			if (floorPlan && floorPlan.id) {
				accessPointService.getByDisplayTargetId(floorPlan.id, (err, result) => {
					if (err) {
						console.log("ERROR:", err);
					} else {
						setFloorPlanAccessPoints(result);
					}
				});
			}
			else {
				setFloorPlanAccessPoints(null);
			}

		}
		useEffect(() => {
			if (selectedFloor) {
				getSelectedFloorPlan(selectedFloor);
			}
		}, [selectedFloor]);

		return (
			<div
				className="cb-profile-wrapper"
				style={{ height: "100%", overflow: "scroll" }}
			>
				<Fragment>
					<SummaryWidget
						id={id}
						user={user}
						context={context}
						name={name}
						geometry={geometry}
						description={description}
						readOnly={readOnly}
						mapVisible={true}
						type="Facility"
						actions={
							[
								{
									name: getTranslation("global.profiles.facilityProfile.main.pinTo"),
									nameText: "Pin To",
									action: () => dispatch(openDialog("pinToDialog"))
								},
								...actions
							]
						}
						dir={dir}
					/>
					{!state.scrolledUp && (
						<div className="layout-control-button">
							<a className="cb-font-link" onClick={e => {
								e.preventDefault();
								setState({
									layoutControlsOpen: true,
									anchorEl: e.currentTarget
								});
							}}>
								<Translate value="global.profiles.facilityProfile.main.editProfileLayout" />
							</a>
						</div>
					)}
					<div className="widgets-container" style={widgetsContainerStyle}>
						<ErrorBoundary>
							<LayoutControls
								open={state.layoutControlsOpen}
								anchor={state.anchorEl}
								close={() => setState({ layoutControlsOpen: false })}
								widgetOrder={widgets}								
								profile="facility"
							/>
						</ErrorBoundary>
						{getWidgetStatus("floorPlans", widgetState) && (
							<FloorPlanWidget
								floorPlans={floorPlans}
								handleSelect={selectFloorPlan}
								setFloorPlans={setFloorPlans}
								facilityFeedId={context.entity.feedId}
								facilityId={context.entity.id}
								clearFloorPlan={clearFloorPlan}
								removeFloorPlanCameraSub={removeFloorPlanCameraSub}
								removeFloorPlanAccessPointsSub={removeFloorPlanAccessPointsSub}
								startFloorPlanCameraStream={startFloorPlanCameraStream}
								startFloorPlanAccessPointsStream={startFloorPlanAccessPointsStream}
								cameras={getWidgetStatus("cameras", widgetState) && getWidgetStatus("cameras", widgetState).enabled}
								order={getWidgetStatus("floorPlans", widgetState).index}
								enabled={getWidgetStatus("floorPlans", widgetState).enabled}
								widgetsLaunchable={widgetsLaunchable}
								contextId={context.entity.id}
								getSelectedFloorPlan={getSelectedFloorPlan}
							/>
						)}
						{getWidgetStatus("activities", widgetState) && (activities || forReplay) && (
							<ErrorBoundary>
								<Activities
									key={`${context.entity.id}-activities`}
									entity={context.entity}
									order={getWidgetStatus("activities", widgetState).index}
									enabled={getWidgetStatus("activities", widgetState).enabled}
									selected={view === "Activity Timeline"}
									canManage={hasAccess}
									pageSize={5}
									selectWidget={selectWidget}
									activities={activities}
									fromOrg={fromOrg}
									fromEco={fromEco}									
									activityFilters={activityFilters}
									widgetsExpandable={false}
									contextId={context.entity.id}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef={"profile"}
									openDialog={openDialog}
									closeDialog={closeDialog}
									dialog={dialog}
									isPrimary={isPrimary}
									userId={user.id}
									widgetsLaunchable={widgetsLaunchable}
									entityType={context.entity.entityType}
									readOnly={readOnly}
									forReplay={forReplay}
									endDate={endDate}
									timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
									dir={dir}
									locale={locale}
								/>
							</ErrorBoundary>
						)}
						{getWidgetStatus("files", widgetState) && attachments && (
							<ErrorBoundary>
								<FileWidget
									id="files"
									order={getWidgetStatus("files", widgetState).index}
									enabled={getWidgetStatus("files", widgetState).enabled}
									selected={view === "Files"}
									selectWidget={selectWidget}
									attachments={attachments}
									hasAccess={hasAccess}
									canDelete={canManageFacility}
									attachFiles={attachFilesToFacility}
									widgetsExpandable={false}
									entityType={"facility"}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef={"profile"}
									contextId={context.entity.id}
									isPrimary={isPrimary}
									widgetsLaunchable={widgetsLaunchable}
									dir={dir}
								/>
							</ErrorBoundary>
						)}
						{getWidgetStatus("cameras", widgetState) && (
							<ErrorBoundary>
								<CamerasWidget
									key={`${context.entity.id}-cameras`}
									entityType={"floorplan"}
									order={getWidgetStatus("cameras", widgetState).index}
									enabled={getWidgetStatus("cameras", widgetState).enabled}
									loadProfile={(entityId, entityName, entityType, profileRef) => loadProfile(entityId, entityName, entityType, profileRef, "secondary")}
									// unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef="profile"
									dialog={dialog}
									openDialog={openDialog}
									closeDialog={closeDialog}
									sidebarOpen={sidebarOpen}
									dockedCameras={dockedCameras}
									addCameraToDockMode={addCameraToDockMode}
									setCameraPriority={setCameraPriority}
									disableSlew={true}
									readOnly={readOnly}
									contextId={context.entity.id}
									widgetsLaunchable={widgetsLaunchable}
									entity={entity}
									user={user}
									removeDockedCamera={removeDockedCameraAndState}
									useCameraGeometry={true}
									cameras={cameras}
									geometry={geometry}
									dir={dir}
								/>
							</ErrorBoundary>
						)}

						{getWidgetStatus("accessPoints", widgetState) && (
							<ErrorBoundary>
								<AccessPointWidget
									order={getWidgetStatus("accessPoints", widgetState).index}
									accessPoints={floorPlanAccessPoints}
									loadProfile={loadProfile}
								/>
							</ErrorBoundary>
						)}
						<PinToDialog
							open={dialog === "pinToDialog"}
							close={() => dispatch(closeDialog("pinToDialog"))}
							entity={context.entity}
							addRemoveFromCollections={addRemoveFromCollections}
							addRemoveFromEvents={addRemoveFromEvents}
							canManageEvents={user.applications &&
								user.applications.find(app => app.appId === "events-app") &&
								user.applications.find(app => app.appId === "events-app").permissions &&
								user.applications.find(app => app.appId === "events-app").permissions.includes("manage")}
							canPinToCollections={user.applications &&
								user.applications.find(app => app.appId === "map-app") &&
								user.applications.find(app => app.appId === "map-app").permissions &&
								user.applications.find(app => app.appId === "map-app").permissions.includes("manage")}
							createCollection={createCollection}
							dialog={dialog}
							openDialog={openDialog}
							closeDialog={closeDialog}
							userId={user.id}
							dir={dir}
						/>
						{/* Delete Facility */}
						<Dialog
							open={dialog === "facilityDeleteDialog"}
							confirm={{ label: getTranslation("global.profiles.facilityProfile.main.confirm"), action: handleConfirmDelete }}
							abort={{
								label: getTranslation("global.profiles.facilityProfile.main.cancel"),
								action: handleCloseDeleteDialog
							}}
							title={getTranslation("global.profiles.facilityProfile.main.confirmationText")}
							dir={dir}
						/>
						<Dialog
							open={dialog === "facilityCannotDeleteDialog"}
							abort={{
								label: getTranslation("global.profiles.facilityProfile.main.close"),
								action: handleCloseCannotDeleteDialog
							}}
							title={facilityDeleteTitle}
							dir={dir}
						/>
					</div>
				</Fragment>
			</div>
		);
	} else {
		return <CircularProgress />;
	}
};
FacilityProfile.propTypes = propTypes;
FacilityProfile.defaultProps = defaultProps;

export default memo(FacilityProfile, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
});
