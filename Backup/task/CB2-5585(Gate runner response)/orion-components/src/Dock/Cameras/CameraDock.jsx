import React, { useEffect, useState } from "react";
import tNearestPoint from "@turf/nearest-point";

import CameraDockModule from "./components/CameraDockModule";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./actions";
import { cameraDockSelector, dockDataSelector, dockedCamerasSelector } from "./selectors";
import { mapState, fullscreenCameraOpen } from "../../AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null

};

const CamerasDock = ({
	map,
	readOnly,
	selectFloorPlanOn,
	floorPlansWithFacilityFeed
}) => {
	const dispatch = useDispatch();

	const {
		addToDock,
		clearFindNearestMode,
		removeDockedCameraAndState,
		setCameraPriority,
		setFindNearestMode,
		clearCameraReplaceMode,
		openDialog,
		closeDialog,
		loadProfile
	} = actionCreators;

	const user = useSelector(state => state.session.user.profile);
	const cameraDock = useSelector(state => cameraDockSelector(state));
	const dockData = useSelector(state => dockDataSelector(state));
	const camerasView = useSelector(state => mapState(state));
	const dialog = useSelector(state => state.appState.dialog.openDialog || "");
	const hasProfile = useSelector(state => !!state.appState.contextPanel);
	// Check which org created camera

	const permissions = {};

	const camerasInt = user.integrations.filter(int => int.intId === "cameras")[0];
	if (camerasInt && camerasInt.permissions) {
		permissions.canControl = camerasInt.permissions.includes("control");
	}
	const userCameras = cameraDock.userCameras;
	const dockedCameras = useSelector(state => dockedCamerasSelector(state));
	const cameraView = camerasView ? camerasView.visible : false;
	const cameraPriority = cameraDock.cameraPriority;
	const sidebarOpen = dockData.isOpen;
	const findNearestMode = cameraDock.findNearestMode;
	const findNearestPosition = cameraDock.findNearestPosition;
	const cameraReplaceMode = cameraDock.cameraReplaceMode;
	const fullScreenCameraOpen = useSelector(state => fullscreenCameraOpen(state));
	const dir = useSelector(state => getDir(state));

	const [findNearestToIndex, setFindNearestToIndex] = useState(null);

	// we need to set our map event handler here, so it won't get set multiple times per our module
	useEffect(() => {
		if (map) {
			map.on("click", e => handleFindNearestCamera(e));
		}
	}, [findNearestMode]);

	const handleFindNearestCamera = e => {
		if (findNearestMode.includes(true)) {
			// Builds a GeoJSON FeatureCollection using data from available cameras
			const features = userCameras.map(camera => {
				const { entityData } = camera;
				const { geometry, properties } = entityData;
				return {
					type: "Feature",
					geometry,
					properties
				};
			});
			const cleanFeatures = features.filter((f) => {
				return f.geometry !== undefined && f.geometry !== null && f.geometry.type === "Point" &&
					Array.isArray(f.geometry.coordinates) && f.geometry.coordinates[0] !== null && f.geometry.coordinates[1] != null &&
					!isNaN(f.geometry.coordinates[0]) && !isNaN(f.geometry.coordinates[1]);
			});
			const coords = e.lngLat;
			const coordinate = [coords.lng, coords.lat];
			const featureCollection = {
				type: "FeatureCollection",
				features: cleanFeatures
			};
			// set nearest camera using turf
			const nearestCamera = tNearestPoint(coordinate, featureCollection);
			// add to dock
			dispatch(addToDock(
				nearestCamera.properties.id,
				findNearestPosition,
				dockedCameras
			));
			// reset state and buttons
			dispatch(clearFindNearestMode());
		}
	};

	const cameraModules = dockedCameras.map((id, index) => {
		const camera = userCameras.find(camera => camera.id === id);
		let fromOrg = false;
		let fromEco = false;
		if (camera) {
			fromOrg = camera.ownerOrg === user.orgId;
			fromEco = camera.ownerOrg !== user.orgId;
		}

		return (
			<div
				className={
					"docked-camera-wrapper " +
					(!camera && sidebarOpen ? "dashed-border" : "")
				}
				key={index}
			>
				<CameraDockModule
					sidebarOpen={sidebarOpen}
					removeDockedCamera={removeDockedCameraAndState}
					addToDock={addToDock} // method to add camera to dock
					cameraPosition={index}
					userCameras={userCameras}
					dockedCameras={dockedCameras} // array of docked cameras
					camera={camera || null}
					fromEco={fromEco}
					fromOrg={fromOrg}
					cameraView={cameraView}
					// Priority
					setCameraPriority={setCameraPriority}
					// Map
					setFindNearestMode={setFindNearestMode}
					findNearestMode={findNearestMode}
					findNearestPosition={findNearestPosition}
					// Replace on dock
					cameraReplaceMode={cameraReplaceMode}
					clearCameraReplaceMode={clearCameraReplaceMode}
					permissions={permissions}
					// Dialog
					dialog={dialog}
					openDialog={openDialog}
					closeDialog={closeDialog}
					// Profile
					hasProfile={hasProfile}
					loadProfile={loadProfile}
					fullscreenCameraOpen={fullScreenCameraOpen}
					user={user}
					readOnly={readOnly}
					dir={dir}
					selectFloorPlanOn={selectFloorPlanOn}
					floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
				/>
			</div>
		);
	});

	return (
		<div style={{ overflow: "scroll", height: "calc(100% - 80px)" }}>
			<div className="camera-dock">{cameraModules}</div>
		</div>
	);

};

CamerasDock.propTypes = propTypes;
CamerasDock.defaultProps = defaultProps;

export default CamerasDock;