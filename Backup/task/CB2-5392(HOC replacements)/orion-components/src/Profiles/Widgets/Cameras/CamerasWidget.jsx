import React, { Fragment, useState, useEffect } from "react";
import { withSpan } from "../../../Apm";
import { cameraService } from "client-app-core";
import { IconButton, Button, Typography } from "@material-ui/core";
import Expand from "@material-ui/icons/ZoomOutMap";
import LaunchIcon from "@material-ui/icons/Launch";
import CameraCard from "./components/CameraCard";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";


const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null
};

const CamerasWidget = ({
	cameras,
	contextId,
	unsubscribeFromFeed,
	subscriberRef,
	entity,
	entityType,
	selectWidget,
	geometry,
	selected,
	order,
	canLink,
	enabled,
	widgetsExpandable,
	widgetsLaunchable,
	loadProfile,
	sidebarOpen,
	dockedCameras,
	addCameraToDockMode,
	removeDockedCamera,
	useCameraGeometry,
	readOnly,
	dialog,
	openDialog,
	closeDialog,
	setCameraPriority,
	fullscreenCamera,
	disableSlew,
	disableLock,
	linkEntities,
	unlinkCameras,
	user,
	eventEnded,
	isAlertProfile,
	dir,
	selectFloorPlanOn,
	floorPlansWithFacilityFeed
}) => {
	const [open, setOpen] = useState(null);
	const [camerasLoaded, setCamerasLoaded] = useState(false);

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
				dispatch(unsubscribeFromFeed(contextId, entityType === "event" ? "eventCameras" : "camerasInRange", subscriberRef));
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
		}
		else {
			// -- build out properties based on how the Camera-Wall App does it
			const edProps = entity.entityData.properties;
			const name = entity.name || (edProps ? edProps.name : "Unknown");
			const backupType = et.charAt(0).toUpperCase() + et.slice(1);
			const type = edProps ? (edProps.subtype || edProps.type || backupType) : backupType;
			const displayName = (name ? name.replace("/", "%2F") : contextId).toUpperCase();

			window.open(`/camera-wall-app/#/entityId/${contextId}/entityName/${displayName}/entityType/${et}/type/${type}`);
		}
	};

	const handleCardExpand = id => {
		setOpen(open === id ? null : id);
	};

	const handleSlewAll = () => {
		const { coordinates } = geometry;
		cameras.forEach(camera => {
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
		cameras && cameras.findIndex(camera => {
			return camera.entityData.properties.features &&
				camera.entityData.properties.features.includes("auto-slew");
		}) > -1;

	return selected || !enabled ? (
		<Fragment />
	) : (
		<div className={`widget-wrapper collapsed ${"index-" + order} `}>
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.cameras.main.title" />
					</div>
					{["camera", "shapes", "track", "accessPoint"].includes(entityType) && canLink && (
						<div className="widget-option-button" style={{ marginLeft: "auto" }}>
							<Button onClick={() => dispatch(openDialog("link-entity-dialog"))} style={styles.label} color="primary">
								<Translate value="global.profiles.widgets.cameras.main.linkCamera" />
							</Button>
						</div>
					)}
					{canSlewAll && !readOnly && !disableSlew && (
						<div
							className="widget-option-button"
							style={dir && dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}
						>
							<Button style={styles.label} color="primary" onClick={handleSlewAll} disabled={!(geometry && geometry.coordinates)}>
								<Translate value="global.profiles.widgets.cameras.main.slewAll" />
							</Button>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton
									style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton
									style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleLaunch}
								>
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
								canControl={!readOnly && user.integrations
									&& user.integrations.find(int => int.intId === camera.feedId)
									&& user.integrations.find(int => int.intId === camera.feedId).permissions
									&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control")}
								entityType={entityType}
								useCameraGeometry={useCameraGeometry}
								geometry={geometry}
								key={camera.id}
								loadProfile={loadProfile}
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
								openDialog={openDialog}
								closeDialog={closeDialog}
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
					<Typography style={{ margin: "12px auto" }} align="center" variant="caption">
						<Translate value="global.profiles.widgets.cameras.main.noCamsAvailable" />
					</Typography>
				)}
			</div>
			{["camera", "shapes", "track", "accessPoint"].includes(entityType) &&
				<LinkDialog
					dialog={dialog || ""}
					title={getTranslation("global.profiles.widgets.cameras.main.linkCams")}
					closeDialog={closeDialog}
					entity={entity}
					linkEntities={linkEntities}
					dir={dir}
				>
				</LinkDialog>
			}
		</div>
	);
};

CamerasWidget.propTypes = propTypes;
CamerasWidget.defaultProps = defaultProps;

export default withSpan("cameras-widget", "profile-widget")(CamerasWidget);