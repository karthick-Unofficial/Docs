import React, { Component } from "react";
import tNearestPoint from "@turf/nearest-point";

import CameraDockModule from "./components/CameraDockModule";

export default class CamerasDock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			findNearestToIndex: null
		};
	}
	// we need to set our map event handler here, so it won't get set multiple times per our module
	componentDidMount() {
		const { map } = this.props;
		if (map) {
			map.on("click", e => this.handleFindNearestCamera(e));
		}
	}

	handleFindNearestCamera = e => {
		const {
			userCameras,
			addToDock,
			findNearestPosition,
			dockedCameras,
			findNearestMode,
			clearFindNearestMode
		} = this.props;
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
			addToDock(
				nearestCamera.properties.id,
				findNearestPosition,
				dockedCameras
			);
			// reset state and buttons
			clearFindNearestMode();
		}
	};

	render() {
		const {
			sidebarOpen,
			removeDockedCameraAndState,
			userCameras,
			dockedCameras,
			addToDock,
			cameraView,
			setCameraPriority,
			cameraPriority,
			setFindNearestMode,
			findNearestMode,
			user,
			findNearestPosition,
			cameraReplaceMode,
			clearCameraReplaceMode,
			permissions,
			dialog,
			openDialog,
			closeDialog,
			hasProfile,
			loadProfile,
			fullscreenCameraOpen,
			readOnly,
			dir
		} = this.props;

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
						fullscreenCameraOpen={fullscreenCameraOpen}
						user={user}
						readOnly={readOnly}
						dir={dir}
					/>
				</div>
			);
		});

		return (
			<div style={{ overflow: "scroll", height: "calc(100% - 80px)" }}>
				<div className="camera-dock">{cameraModules}</div>
			</div>
		);
	}
}
