import React, { useEffect, memo, useState } from "react";
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
import { getDir } from "orion-components/i18n/Config/selector";
import uniqBy from "lodash/uniqBy";
//actions
import { addRemoveFromCollections, addRemoveFromEvents } from "orion-components/SharedActions/cameraProfileActions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import {
	startActivityStream,
	unsubscribeFromFeed,
	startCamerasInRangeStream
} from "orion-components/ContextualData/Actions";
import { createCollection } from "orion-components/SharedActions/commonActions";
import { setMapTools } from "orion-components/Map/Tools/Actions";
import { deleteFacility } from "orion-components/SharedActions/facilityProfileActions";
import { checkPermissionBasedOnFeedId, canManageByApplication } from "orion-components/Profiles/Selectors";
import { facilityWidgetConfig, getCustomWidgetConfig } from "orion-components/Profiles/Selectors/FacilityProfileSelectors";

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
	dir: "ltr",
	//The `readonly` and `forReplay` props are exclusively provided to this component by the `replay-app`. To ensure the proper functionality of other apps, it is necessary to set both `readonly` and `forReplay` to `false`.
	readOnly: false,
	forReplay: false
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
	const view = useSelector((state) => entity && state.userAppState?.facilityView);
	const floorPlans = useSelector((state) => state.globalData?.floorPlans);
	const orgId = entity && useSelector((state) => state.session?.user?.profile?.orgId);
	const ownerOrg = entity?.ownerOrg;
	const appId = useSelector((state) => entity && state.appId);

	const fromOrg = entity && ownerOrg === orgId;
	const fromEco = entity && ownerOrg !== orgId;
	const integrations = useSelector((state) => state.session?.user?.profile?.integrations || []);
	const widgetState = useSelector((state) => (entity ? facilityWidgetConfig(state)(fullContext, disableCameras) : []));
	const facilityConditions = getCustomWidgetConfig("facility-condition", fullContext, integrations);

	const context = fullContext;
	const facilityId = entity.id;

	const dir = useSelector((state) => getDir(state));
	const { selectedFloor } = useSelector((state) => floorPlanSelector(state) || {});
	const camerasWidgetContext = useSelector((state) => selectedContextSelector(state));
	const cameras = uniqBy(
		[...(camerasWidgetContext.floorPlanCameras || []), ...(camerasWidgetContext.camerasInRange || [])],
		"id"
	);
	const hasAccess =
		!readOnly && useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "config"));
	const canManageFacility =
		!readOnly &&
		useSelector((state) => checkPermissionBasedOnFeedId(state)(entity?.feedId, "permissions", "manage"));
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


	const getWidgetStatus = (widgetId) => {
		const widgetConfig = widgetState;
		const widget = widgetConfig.find((widget, index) => {
			widget.index = index;
			return widget.id === widgetId;
		});

		return widget;
	};

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
		const { attachments } = context;
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
					case "launch":
						if (appId !== "facilities-app") {
							actions.push({
								name: getTranslation("global.profiles.facilityProfile.main.launch"),
								nameText: "Launch",
								action: () => window.location.replace(`/facilities-app/#/entity/${facilityId}/`)
							});
						}
						break;
					case "pinTo":
						actions.push({
							name: getTranslation("global.profiles.facilityProfile.main.pinTo"),
							nameText: "Pin To",
							action: () => dispatch(openDialog("pinToDialog"))
						});
						break;
					default:
						return null;
				}
			});
		}


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
							handleSelect={selectFloorPlan}
							setFloorPlans={setFloorPlans}
							clearFloorPlan={clearFloorPlan}
							contextId={context.entity.id}
							getSelectedFloorPlan={getSelectedFloorPlan}
						/>
					);

				case "activities":
					return (
						<Activities
							id={widgetName}
							key={`${context.entity.id}-activities`}
							selected={view === widgetName}
							canManage={hasAccess}
							pageSize={5}
							selectWidget={selectWidget}
							fromOrg={fromOrg}
							fromEco={fromEco}
							contextId={context.entity.id}
							subscriberRef={"profile"}
							readOnly={readOnly}
							forReplay={forReplay}
							endDate={endDate}
							widgetsExpandable={false}
						/>
					);

				case "files":
					return (
						<FileWidget
							id={widgetName}
							selected={view === widgetName}
							selectWidget={selectWidget}
							hasAccess={hasAccess}
							canDelete={canManageFacility}
							subscriberRef={"profile"}
							contextId={context.entity.id}
							widgetsExpandable={false}
						/>
					);

				case "cameras":
					return (
						<CamerasWidget
							id={widgetName}
							key={`${context.entity.id}-cameras`}
							isFloorPlan={true}
							secondaryLoadProfile={true}
							subscriberRef="profile"
							disableSlew={true}
							readOnly={readOnly}
							contextId={context.entity.id}
							useCameraGeometry={true}
							otherCameras={cameras}
							selectWidget={selectWidget}
						/>
					);

				case "accessPoints":
					return <AccessPointWidget id={widgetName} accessPoints={floorPlanAccessPoints} />;

				case "facility-condition":
					return <FacilityConditionWidget id={widgetName} facilityId={facilityId} />;

				default:
					return null;
			}
		};

		const widgetRenderFilters = {
			activities: !(context?.activities || forReplay),
			files: !attachments
		};

		widgetRenderFilters["facility-condition"] = facilityConditions.length === 0;

		return (
			<div className="cb-profile-wrapper" style={{ height: "100%", overflow: "scroll" }}>
				<div style={{ display: state.layoutControlsOpen ? "block" : "none" }}>
					<ErrorBoundary>
						<LayoutControls
							close={() => setState({ layoutControlsOpen: false })}
							widgetOrder={widgetState}
							profile="facility"
							layoutControlsOpen={state.layoutControlsOpen}
						/>
					</ErrorBoundary>
				</div>
				<div style={{ display: state.layoutControlsOpen ? "none" : "block" }}>
					<SummaryWidget
						id={id}
						context={context}
						name={name}
						geometry={geometry}
						description={description}
						readOnly={readOnly}
						mapVisible={true}
						type="Facility"
						actions={actions}
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
						{(widgetState)
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
				</div>
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
