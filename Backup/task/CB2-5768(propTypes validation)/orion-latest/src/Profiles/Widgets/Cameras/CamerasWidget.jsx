import React, { Fragment, useState, useEffect } from "react";
import { withSpan } from "../../../Apm";
import { cameraService } from "client-app-core";
import { IconButton, Button, Typography } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import CameraCard from "./components/CameraCard";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { getDir } from "orion-components/i18n/Config/selector";
import { removeDockedCameraAndState as removeDockedCamera } from "orion-components/Dock/Actions/index.js";
import { addCameraToDockMode } from "orion-components/Dock/Actions/index.js";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";
import { fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { loadProfile } from "orion-components/ContextPanel/Actions";

const propTypes = {
	id: PropTypes.string,
	unsubscribeFromFeed: PropTypes.func,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object,
	readOnly: PropTypes.bool,
	entity: PropTypes.object,
	entityType: PropTypes.string,
	selectWidget: PropTypes.func,
	selected: PropTypes.bool,
	canLink: PropTypes.bool,
	useCameraGeometry: PropTypes.bool,
	contextId: PropTypes.string,
	subscriberRef: PropTypes.any,
	disableSlew: PropTypes.bool,
	disableLock: PropTypes.bool,
	unlinkCameras: PropTypes.func,
	eventEnded: PropTypes.bool,
	isAlertProfile: PropTypes.bool,
	otherCameras: PropTypes.array,
	isFloorPlan: PropTypes.bool,
	secondaryLoadProfile: PropTypes.bool
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null,
	otherCameras: [],
	isFloorPlan: false
};

const CamerasWidget = ({
	id,
	contextId,
	unsubscribeFromFeed,
	subscriberRef,
	selectWidget,
	selected,
	canLink,
	useCameraGeometry,
	readOnly,
	disableSlew,
	disableLock,
	unlinkCameras,
	eventEnded,
	isAlertProfile,
	selectFloorPlanOn,
	floorPlansWithFacilityFeed,
	otherCameras, // robot cameras widget,
	isFloorPlan,
	secondaryLoadProfile
}) => {
	const [open, setOpen] = useState(null);
	const [camerasLoaded, setCamerasLoaded] = useState(false);

	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};
	let entityType = "";
	if (isFloorPlan) {
		entityType = "floorplan";
	} else if (entity) {
		entityType = entity.entityType;
	}
	const { geometry } = entity?.entityData ?? {};

	const enabled = useSelector((state) => isAlertProfile || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const user = useSelector((state) => state?.session?.user?.profile);
	const sidebarOpen = useSelector((state) => state.appState.dock.dockData.isOpen);
	const fullscreenCamera = useSelector((state) => entity && fullscreenCameraOpen(state));
	const dockedCameras = useSelector((state) => state.appState.dock?.cameraDock?.dockedCameras);
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const cameras = useSelector((state) => [
		...(getSelectedContextData(state)(contextId, "camerasInRange") || []),
		...otherCameras
	]);

	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable } = launchableAndExpandable;
	let { widgetsLaunchable: launchable } = launchableAndExpandable;
	if (!readOnly && launchable && (entityType == "accessPoint" || entityType === "entity" || entityType === "robot")) {
		launchable = true;
	} else if (!(entityType == "accessPoint" || entityType === "entity" || entityType === "robot") && launchable) {
		launchable = true;
	} else {
		launchable = false;
	}

	const dispatch = useDispatch();

	useEffect(() => {
		if (!camerasLoaded && cameras) {
			if (cameras.length === 1) {
				handleCardExpand(cameras[0].id);
			}
			setCamerasLoaded(true);
		}
	}, [cameras]);

	useEffect(() => {
		return () => {
			if (unsubscribeFromFeed) {
				// Event profile uses a different stream that includes both cameras in range and pinned cameras
				dispatch(
					unsubscribeFromFeed(
						contextId,
						entityType === "event" ? "eventCameras" : "camerasInRange",
						subscriberRef
					)
				);
			}
		};
	}, [unsubscribeFromFeed, entityType, contextId, subscriberRef]);

	const handleExpand = () => {
		dispatch(selectWidget("Cameras"));
	};

	const handleLaunch = () => {
		// -- camera-wall expects entityType of "shape", but entityType on all shape properties is set to "shapes"
		const et = entityType === "shapes" ? "shape" : entityType;

		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (et === "floorplan") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		} else {
			// -- build out properties based on how the Camera-Wall App does it
			const edProps = entity.entityData.properties;
			const name = entity.name || (edProps ? edProps.name : "Unknown");
			const backupType = et.charAt(0).toUpperCase() + et.slice(1);
			const type = edProps ? edProps.subtype || edProps.type || backupType : backupType;
			const displayName = (name ? name.replace("/", "%2F") : contextId).toUpperCase();

			window.open(
				`/camera-wall-app/#/entityId/${contextId}/entityName/${displayName}/entityType/${et}/type/${type}`
			);
		}
	};

	const handleCardExpand = (id) => {
		setOpen(open === id ? null : id);
	};

	const handleSlewAll = () => {
		const { coordinates } = geometry;
		cameras.forEach((camera) => {
			// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
			// -- don't slew virtual ptz cams (i.e. wavcam) as they are already locked to target
			if (!(camera.entityData.properties.features && camera.entityData.properties.features.includes("ribbon"))) {
				cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
			}
		});
	};

	const styles = {
		label: {
			textTransform: "none"
		},
		cameraButton: {
			display: "flex",
			alignItems: "center",
			backgroundColor: "lighten($darkGray, 2 %)"
		},
		widgetOptionButton: {
			...(dir === "rtl" && {
				marginRight: "auto"
			}),
			...(dir === "ltr" && {
				marginLeft: "auto"
			})
		},
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && {
				paddingLeft: 0
			}),
			...(dir === "ltr" && {
				paddingRight: 0
			})
		}
	};
	const showFloorPlanOnTargetClick = (entity) => {
		const { entityData } = entity;
		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
			}
		}
	};
	const canSlewAll =
		cameras &&
		cameras.findIndex((camera) => {
			return camera.entityData.properties.features && camera.entityData.properties.features.includes("auto-slew");
		}) > -1;

	return selected || !enabled ? (
		<Fragment />
	) : (
		<div className="widget-wrapper collapsed">
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.cameras.main.title" />
					</div>
					{["camera", "shapes", "track", "accessPoint"].includes(entityType) && canLink && (
						<div className="widget-option-button" style={{ marginLeft: "auto" }}>
							<Button
								onClick={() => dispatch(openDialog("link-entity-dialog"))}
								style={styles.label}
								color="primary"
							>
								<Translate value="global.profiles.widgets.cameras.main.linkCamera" />
							</Button>
						</div>
					)}
					{canSlewAll && !readOnly && !disableSlew && (
						<div className="widget-option-button" style={styles.widgetOptionButton}>
							<Button
								style={styles.label}
								color="primary"
								onClick={handleSlewAll}
								disabled={!(geometry && geometry.coordinates)}
							>
								<Translate value="global.profiles.widgets.cameras.main.slewAll" />
							</Button>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						)}
						{launchable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleLaunch}>
									<LaunchIcon />
								</IconButton>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="widget-content" style={{ display: "flex" }}>
				{cameras && cameras.length > 0 ? (
					cameras.map((camera, index) => {
						const cameraDisabled = camera.isDeleted || eventEnded;
						return (
							<CameraCard
								contextId={contextId}
								cameraIndex={index}
								canUnlink={canLink}
								canControl={
									!readOnly &&
									user.integrations &&
									user.integrations.find((int) => int.intId === camera.feedId) &&
									user.integrations.find((int) => int.intId === camera.feedId).permissions &&
									user.integrations
										.find((int) => int.intId === camera.feedId)
										.permissions.includes("control")
								}
								entityType={entityType}
								useCameraGeometry={useCameraGeometry}
								geometry={geometry}
								key={camera.id}
								loadProfile={loadProfile}
								secondaryLoadProfile={secondaryLoadProfile}
								unlinkCameras={unlinkCameras}
								camera={camera}
								canExpand={!cameraDisabled}
								handleCardExpand={handleCardExpand}
								canTarget={!cameraDisabled}
								hasMenu={open === camera.id && !cameraDisabled}
								expanded={open === camera.id}
								disableSlew={disableSlew}
								disableLock={disableLock}
								sidebarOpen={sidebarOpen}
								dockedCameras={dockedCameras}
								addCameraToDockMode={addCameraToDockMode}
								removeDockedCamera={removeDockedCamera}
								dialog={dialog}
								readOnly={readOnly}
								subscriberRef={subscriberRef}
								setCameraPriority={setCameraPriority}
								fullscreenCamera={fullscreenCamera}
								dir={dir}
								selectFloorPlanOn={showFloorPlanOnTargetClick}
							/>
						);
					})
				) : (
					<Typography style={{ margin: "12px auto", color: "#fff" }} align="center" variant="caption">
						<Translate value="global.profiles.widgets.cameras.main.noCamsAvailable" />
					</Typography>
				)}
			</div>
			{["camera", "shapes", "track", "accessPoint"].includes(entityType) && (
				<LinkDialog
					dialog={dialog || ""}
					title={getTranslation("global.profiles.widgets.cameras.main.linkCams")}
					closeDialog={closeDialog}
					entity={entity}
					dir={dir}
				></LinkDialog>
			)}
		</div>
	);
};

CamerasWidget.propTypes = propTypes;
CamerasWidget.defaultProps = defaultProps;

export default withSpan("cameras-widget", "profile-widget")(CamerasWidget);
