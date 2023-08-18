import React, { Fragment, useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import { SummaryWidget, FileWidget, Activities, FloorPlanWidgetContainer } from "../Widgets";
import { CircularProgress } from "@material-ui/core";
import { facilityService, cameraService } from "client-app-core";
import PinToDialog from "../../SharedComponents/PinToDialog";
import ErrorBoundary from "../../ErrorBoundary";
import $ from "jquery";
import _ from "lodash";
import isEqual from "react-fast-compare";
import CameraWidgetContainer from "./WidgetContainers/CameraWidgetContainer";
import { Dialog } from "../../CBComponents/index";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

let DEFAULT_WIDGET_CONFIG = [];

const propTypes = {
	context: PropTypes.object,
	setMapTools: PropTypes.func.isRequired,
	selectFloorPlan: PropTypes.func.isRequired,
	selectedFloorId: PropTypes.string,
	setFloorPlans: PropTypes.func.isRequired,
	actionOptions: PropTypes.array,
	disableCameras: PropTypes.bool,
	deleteFacility: PropTypes.func.isRequired,
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
		"floorPlans"
	];

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
	addRemoveFromCollections,
	addRemoveFromEvents,
	activityFilters,
	attachFilesToFacility,
	appData,
	createCollection,
	facilityId,
	ignoreFacility,
	context,
	disableCameras,
	user,
	setMapTools,
	selectFloorPlan,
	setFloorPlans,
	floorPlans,
	isPrimary,
	clearFloorPlan,
	fromEco,
	fromOrg,
	startFloorPlanCameraStream,
	startCamerasInRangeStream,
	unsubscribeFromFeed,
	removeFloorPlanCameraSub,
	startActivityStream,
	startAttachmentStream,
	updateActivityFilters,
	loadProfile,
	widgetState,
	view,
	openDialog,
	closeDialog,
	sidebarOpen,
	addCameraToDockMode,
	setCameraPriority,
	dockedCameras,
	removeDockedCameraAndState,
	dialog,
	selectWidget,
	setWidgetOrder,
	widgetsLaunchable,
	deleteFacility,
	readOnly,
	timeFormatPreference,
	forReplay,
	endDate,
	dir
}) => {
	const [hiding, setHiding] = useState(false);
	const [state, setState] = useState({
		layoutControlsOpen: false,
		anchorEl: null,
		scrolledUp: false,
		editing: false,
		hiding: false
	});
	const scrollOffset = state.scrolledUp ? 74 : 0;
	const widgetsContainerStyle = {
		top: scrollOffset
	};

	const handleCloseDeleteDialog = () => {
		closeDialog("facilityDeleteDialog");
	};
 
	const handleCloseCannotDeleteDialog = () => {
		closeDialog("facilityCannotDeleteDialog");
	};
	
	const handleConfirmDelete = () => {
	
		deleteFacility(context.entity.id);
	
		handleCloseDeleteDialog();
	};

	useEffect(() => {
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
			}
		];

		if (!disableCameras) {
			DEFAULT_WIDGET_CONFIG.push({
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.facilityProfile.main.cameras")
			});
		}
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
							setFloorPlans(result);

						} else if (success && !result.length) {
							selectFloorPlan(null);
						}
					}
				}
			);
			if (!forReplay) {
				if (getWidgetStatus("files")) {
					startAttachmentStream(facilityId, "profile");
				}
				if (getWidgetStatus("activities")) {
					startActivityStream(facilityId, "facility", "profile");
				}
				if (getWidgetStatus("cameras")) {
					startCamerasInRangeStream(facilityId, "facility", "profile");
				}
			} else {
				// do we need to do something else here, or leave it up to the widgets to pull in the static data
			}
		}

		return () => {
			unsubscribeFromFeed(facilityId, "camerasInRange", "profile");
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
		const actions = [];
		if(actionOptions) {
			actionOptions.forEach(action => {
				switch (action) {
					case "edit":
						if (canManageFacility) {
							actions.push(
								{
									name: getTranslation("global.profiles.facilityProfile.main.edit"),
									nameText: "Edit",
									action: () =>
										setMapTools({
											type: "facility",
											mode: "simple_select",
											feature: { id, geometry, properties: entityData.properties }
										})
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
									ignoreFacility(context.entity, appData);
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
										if(floorPlanIds.length > 0){
											const promises = [];
											floorPlanIds.forEach(floorPlanId => {
												promises.push(
													new Promise(function(resolve, reject){
														cameraService.getByDisplayTargetId(floorPlanId, (err, res) => {
															if(err) {
																reject(err);
															} else {
																if(res.length > 0){
																	resolve(true);
																}resolve(false);
															}
														});
													})
												);
											});

											return Promise.all(promises).then((cameras) => {
												if(cameras.includes(true)) {
													openDialog("facilityCannotDeleteDialog");
												} else {
													openDialog("facilityDeleteDialog");
												}
											})
												.catch ((error) => {
													console.log("Error", error);
												});
										} else {
											openDialog("facilityDeleteDialog");
										}
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
									action: () => openDialog("pinToDialog")
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
								<Translate value="global.profiles.facilityProfile.main.editProfileLayout"/>
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
								setWidgetOrder={setWidgetOrder}
								profile="facility"
							/>
						</ErrorBoundary>
						{getWidgetStatus("floorPlans", widgetState) && (
							<FloorPlanWidgetContainer
								floorPlans={floorPlans}
								handleSelect={selectFloorPlan}
								setFloorPlans={setFloorPlans}
								facilityFeedId={context.entity.feedId}
								facilityId={context.entity.id}
								clearFloorPlan={clearFloorPlan}
								removeFloorPlanCameraSub={removeFloorPlanCameraSub}
								startFloorPlanCameraStream={startFloorPlanCameraStream}
								cameras={getWidgetStatus("cameras", widgetState).enabled}
								order={getWidgetStatus("floorPlans", widgetState).index}
								enabled={getWidgetStatus("floorPlans", widgetState).enabled}
								widgetsLaunchable={widgetsLaunchable}
								contextId={context.entity.id}
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
									updateActivityFilters={updateActivityFilters}
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
								<CameraWidgetContainer
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
								/>
							</ErrorBoundary>
						)}
						<PinToDialog
							open={dialog === "pinToDialog"}
							close={() => closeDialog("pinToDialog")}
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
							title={getTranslation("global.profiles.facilityProfile.main.cantDelete")}
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
