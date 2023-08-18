import React, { Fragment, useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import LayoutControls from "../Widgets/LayoutControls/LayoutControls";
import { SummaryWidget, FileWidget, Activities, FloorPlanWidget, FacilityConditionWidget } from "../Widgets";
import { CircularProgress } from "@mui/material";
import { facilityService, cameraService, accessPointService } from "client-app-core";
import PinToDialog from "../../SharedComponents/PinToDialog";
import ErrorBoundary from "../../ErrorBoundary";
import isEqual from "react-fast-compare";
import CamerasWidget from "../Widgets/Cameras/CamerasWidget";
import { Dialog } from "../../CBComponents/index";
import { Translate, getTranslation } from "orion-components/i18n";
import AccessPointWidget from "../Widgets/AccessPoint/AccessPointWidget";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { useSelector, useDispatch } from "react-redux";
import { selectedFacilitySelector, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import unionBy from "lodash/unionBy";
import uniqBy from "lodash/uniqBy";
//actions
import { addRemoveFromCollections, addRemoveFromEvents } from "orion-components/SharedActions/cameraProfileActions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	startActivityStream,
	unsubscribeFromFeed,
	startCamerasInRangeStream
} from "orion-components/ContextualData/Actions";
import { createCollection } from "orion-components/SharedActions/commonActions";
import { setMapTools } from "orion-components/Map/Tools/Actions";
import { deleteFacility } from "orion-components/SharedActions/facilityProfileActions";
import { defaultFacilityProfileWidgets } from "orion-components/Profiles/Utils/FacilityProfileWidgets";
import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";

let DEFAULT_WIDGET_CONFIG = [];
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const propTypes = {
	context: PropTypes.object,
	selectFloorPlan: PropTypes.func.isRequired,
	selectedFloorId: PropTypes.string,
	setFloorPlans: PropTypes.func.isRequired,
	actionOptions: PropTypes.array,
	disableCameras: PropTypes.bool,
	dir: PropTypes.string,
	appData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	clearFloorPlan: PropTypes.func,
	selectWidget: PropTypes.func,
	readOnly: PropTypes.bool,
	forReplay: PropTypes.bool,
	endDate: PropTypes.instanceOf(Date),
	startAttachmentStream: PropTypes.func,
	ignoreFacility: PropTypes.func
};

const defaultProps = {
	selectedFloorId: null,
	dir: "ltr"
};

const FacilityProfile = ({
	actionOptions,
	appData,
	ignoreFacility,
	disableCameras,
	selectFloorPlan,
	setFloorPlans,
	clearFloorPlan,
	selectWidget,
	readOnly,
	forReplay,
	endDate,
	startAttachmentStream
}) => {
	const dispatch = useDispatch();

	const fullContext = useSelector((state) => selectedFacilitySelector(state));
	const entity = fullContext ? fullContext.entity : null;
	const dialog = useSelector((state) => state.appState.dialog.openDialog);
	const view = useSelector((state) => entity && state?.userAppState?.facilityView);
	const floorPlans = useSelector((state) => state?.globalData?.floorPlans);
	const orgId = entity && useSelector((state) => state?.session?.user?.profile?.orgId);
	const integrations = entity && useSelector((state) => state?.session?.user?.profile?.integrations);
	const ownerOrg = entity?.ownerOrg;

	const fromOrg = entity && ownerOrg === orgId;
	const fromEco = entity && ownerOrg !== orgId;
	const widgetState = useSelector((state) => (entity ? widgetStateSelector(state) : []));

	const context = fullContext;
	const facilityId = entity.id;

	const dir = useSelector((state) => getDir(state));
	const { selectedFloor } = useSelector((state) => floorPlanSelector(state) || {});
	const camerasWidgetContext = useSelector((state) => selectedContextSelector(state));
	const cameras = uniqBy(
		[...(camerasWidgetContext.floorPlanCameras || []), ...(camerasWidgetContext.camerasInRange || [])],
		"id"
	);
	const hasAccess = !readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "config"));
	const canManageFacility = !readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "permissions", "manage"));
	const canManageEvents = useSelector((state) => canManageByApplication(state)("events-app", "manage"));
	const canPinToCollections = useSelector((state) => canManageByApplication(state)("map-app", "manage"));

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

	const getCustomWidgetConfig = (widgetName) => {
		const widgetArr = [];
		const { entity } = context;
		integrations.filter((customWidget) => {
			if (entity.feedId === customWidget.feedId && hasOwn(customWidget, "widgets")) {
				const { widgets } = customWidget;
				for (let i = 0; i < widgets.length; i++) {
					if (widgets[i].id === widgetName) {
						widgetArr.push(widgets[i]);
						break;
					}
				}
			}
		});
		return widgetArr;
	};

	const getWidgetConfig = (widgetState, widgetId = "") => {
		const defaultTypes = ["activities", "files", "cameras", "floorPlans", "accessPoints", "facility-condition"];

		if (widgetId === "facility-condition") {
			const facilityConditionWidget = getCustomWidgetConfig(widgetId);

			//If the widget array for the facility feed doesn't contain facility-condition, remove it from the DEFAULT_WIDGET_CONFIG.
			if (facilityConditionWidget.length === 0) {
				DEFAULT_WIDGET_CONFIG = DEFAULT_WIDGET_CONFIG.filter((widget) => widget.id !== "facility-condition");
			}
		}

		const filteredDefault = DEFAULT_WIDGET_CONFIG.filter((widget) => defaultTypes.includes(widget.id));

		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = widgetState ? unionBy(filteredState, filteredDefault, "id") : filteredDefault;
		return widgetConfig;
	};

	const getWidgetStatus = (widgetId, widgetState) => {
		const widgetConfig = getWidgetConfig(widgetState, widgetId);
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

	if (!mounted) {
		DEFAULT_WIDGET_CONFIG = defaultFacilityProfileWidgets;

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
			facilityService.getFacilityFloorplans(context.entity.id, (err, response) => {
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
			});
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
		const floorPlanIds = Object.keys(floorPlans);
		const checkEntitiesOnFloorPlan = () => {
			if (floorPlanIds.length > 0) {
				const promises = [];

				floorPlanIds.forEach((floorPlanId) => {
					promises.push(
						new Promise(function (resolve, reject) {
							cameraService.getByDisplayTargetId(floorPlanId, (err, res) => {
								if (err) {
									reject(err);
								} else {
									if (res.length > 0) {
										resolve("camera");
									}
									resolve(false);
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
									}
									resolve(false);
								}
							});
						})
					);
				});

				return Promise.all(promises)
					.then((data) => {
						if (data.includes("camera")) {
							dispatch(openDialog("facilityCannotDeleteDialog"));
							setFacilityDeleteTitle(getTranslation("global.profiles.facilityProfile.main.cantDelete"));
						} else if (data.includes("accessPoint")) {
							dispatch(openDialog("facilityCannotDeleteDialog"));
							setFacilityDeleteTitle(
								getTranslation("global.profiles.facilityProfile.main.cantDeleteAccessPoint")
							);
						} else {
							dispatch(openDialog("facilityDeleteDialog"));
						}
					})
					.catch((error) => {
						console.log("Error", error);
					});
			} else {
				dispatch(openDialog("facilityDeleteDialog"));
			}
		};
		const actions = [];
		if (actionOptions) {
			actionOptions.forEach((action) => {
				switch (action) {
					case "edit":
						if (canManageFacility) {
							actions.push({
								name: getTranslation("global.profiles.facilityProfile.main.edit"),
								nameText: "Edit",
								action: () =>
									dispatch(
										setMapTools({
											type: "facility",
											mode: "simple_select",
											feature: {
												id,
												geometry,
												properties: entityData.properties
											}
										})
									)
							});
						}
						break;
					case "hide":
						actions.push({
							name: getTranslation("global.profiles.facilityProfile.main.hide"),
							nameText: "Hide",
							action: () => {
								setHiding(true);
								dispatch(ignoreFacility(context.entity, appData));
							},
							debounce: hiding
						});
						break;
					case "delete":
						if (canManageFacility) {
							actions.push({
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
			} else {
				setFloorPlanAccessPoints(null);
			}
		};
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (selectedFloor) {
				getSelectedFloorPlan(selectedFloor);
			}
		}, [selectedFloor]);

		const renderWidgets = (widgetName) => {
			switch (widgetName) {
				case "floorPlans":
					return (
						<FloorPlanWidget
							id={widgetName}
							floorPlans={floorPlans}
							handleSelect={selectFloorPlan}
							setFloorPlans={setFloorPlans}
							facilityFeedId={context.entity.feedId}
							facilityId={context.entity.id}
							clearFloorPlan={clearFloorPlan}
							contextId={context.entity.id}
							getSelectedFloorPlan={getSelectedFloorPlan}
						/>
					);

				case "activities":
					return (
						<ErrorBoundary>
							<Activities
								id={widgetName}
								key={`${context.entity.id}-activities`}
								entity={context.entity}
								selected={view === "Activity Timeline"}
								canManage={hasAccess}
								pageSize={5}
								selectWidget={selectWidget}
								activities={activities}
								fromOrg={fromOrg}
								fromEco={fromEco}
								contextId={context.entity.id}
								subscriberRef={"profile"}
								entityType={context.entity.entityType}
								readOnly={readOnly}
								forReplay={forReplay}
								endDate={endDate}
							/>
						</ErrorBoundary>
					);

				case "files":
					return (
						<ErrorBoundary>
							<FileWidget
								id={widgetName}
								selected={view === "Files"}
								selectWidget={selectWidget}
								attachments={attachments}
								hasAccess={hasAccess}
								canDelete={canManageFacility}
								entityType={"facility"}
								subscriberRef={"profile"}
								contextId={context.entity.id}
								entity={entity}
							/>
						</ErrorBoundary>
					);

				case "cameras":
					return (
						<ErrorBoundary>
							<CamerasWidget
								id={widgetName}
								key={`${context.entity.id}-cameras`}
								entityType={"floorplan"}
								loadProfile={(entityId, entityName, entityType, profileRef) =>
									loadProfile(entityId, entityName, entityType, profileRef, "secondary")
								}
								subscriberRef="profile"
								disableSlew={true}
								readOnly={readOnly}
								contextId={context.entity.id}
								entity={entity}
								useCameraGeometry={true}
								cameras={cameras}
								geometry={geometry}
							/>
						</ErrorBoundary>
					);

				case "accessPoints":
					return (
						<ErrorBoundary>
							<AccessPointWidget id={widgetName} accessPoints={floorPlanAccessPoints} />
						</ErrorBoundary>
					);

				case "facility-condition":
					return (
						<ErrorBoundary>
							<FacilityConditionWidget id={widgetName} facilityId={facilityId} />
						</ErrorBoundary>
					);

				default:
					return null;
			}
		};

		const widgetRenderFilters = {
			activities: !(activities || forReplay),
			files: !attachments
		};

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<Fragment>
					<SummaryWidget
						id={id}
						context={context}
						name={name}
						geometry={geometry}
						description={description}
						readOnly={readOnly}
						mapVisible={true}
						type="Facility"
						actions={[
							{
								name: getTranslation("global.profiles.facilityProfile.main.pinTo"),
								nameText: "Pin To",
								action: () => dispatch(openDialog("pinToDialog"))
							},
							...actions
						]}
					/>
					{!state.scrolledUp && (
						<div className="layout-control-button">
							<a
								className="cb-font-link"
								onClick={(e) => {
									e.preventDefault();
									setState({
										layoutControlsOpen: true,
										anchorEl: e.currentTarget
									});
								}}
							>
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

						<PinToDialog
							close={() => dispatch(closeDialog("pinToDialog"))}
							entity={context.entity}
							addRemoveFromCollections={addRemoveFromCollections}
							addRemoveFromEvents={addRemoveFromEvents}
							canManageEvents={canManageEvents}
							canPinToCollections={canPinToCollections}
							createCollection={createCollection}
							openDialog={openDialog}
							closeDialog={closeDialog}
							dir={dir}
						/>
						{/* Delete Facility */}
						<Dialog
							open={dialog === "facilityDeleteDialog"}
							confirm={{
								label: getTranslation("global.profiles.facilityProfile.main.confirm"),
								action: handleConfirmDelete
							}}
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
