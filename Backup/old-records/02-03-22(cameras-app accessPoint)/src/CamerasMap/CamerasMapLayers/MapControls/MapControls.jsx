import React, { Fragment, memo, useCallback, useState } from "react";
import { cameraService } from "client-app-core";
import {
	DistanceTool,
	DrawingTool,
	ToolTray,
	SpotlightTool,
	ChipTray,
	DistanceChips
} from "orion-components/Map/Tools";
import { SaveCancel } from "orion-components/CBComponents";
import CameraGeoMenu from "../components/CameraGeoMenu";
import { getSpotlight } from "orion-components/Map/helpers";

const MapControls = ({
	addFOV,
	updateFOV,
	removeFOV,
	canEdit,
	camera,
	fov,
	setMapTools,
	spotlightProximity,
	updateCameraLocation,
	toolType,
	updateSpotlight,
	setActivePath,
	updatePath,
	activePath,
	dialog,
	openDialog,
	closeDialog,
	dockOpen,
	dir
}) => {
	const [activeMode, setActiveMode] = useState(null);
	const handleCancel = useCallback(() => {
		if (toolType === "distance") {
			setActivePath(null);
		}
		setMapTools({ type: null });
	}, [toolType]);
	const handleConfirm = useCallback(() => {
		if (toolType === "distance") {
			updatePath(activePath);
			setActivePath(null);
			setMapTools({ type: null });
			return;
		}
		switch (activeMode) {
			case "camera-edit":
			case "camera-add":
				updateCameraLocation(camera.id);
				break;
			case "fov-edit":
				updateFOV(fov.id);
				break;
			case "fov-add":
				{
					const { name } = camera.entityData.properties;
					addFOV(camera.id, `${name} FOV`);
				}
				break;
			case "fov-delete":
				removeFOV(camera.id);
				break;
			case "spotlight":
				updateSpotlight(camera.id);
				break;
			case "spotlight-reset":
				cameraService.deleteSpotlightShape(camera.id, err => {
					if (err) {
						console.log("ERROR", err);
					}
				});
				break;
			default:
				break;
		}
	}, [activeMode, activePath, camera, fov, toolType]);
	const handleSelect = useCallback(
		type => {
			switch (type) {
				case "camera-edit":
					setMapTools({
						type: "drawing",
						mode: "simple_select",
						feature: camera.entityData
					});
					break;
				case "camera-add":
					setMapTools({
						type: "drawing",
						mode: "draw_point"
					});
					break;
				case "fov-edit":
					{
						const { geometry, properties } = fov.entityData;
						setMapTools({
							type: "drawing",
							mode: "direct_select",
							feature: { geometry, id: fov.id, properties }
						});
					}
					break;
				case "fov-add":
					setMapTools({ type: "drawing", mode: "draw_polygon" });
					break;
				case "spotlight":
					setMapTools({
						type: "spotlight",
						mode: "spotlight_mode",
						feature:
							camera.spotlightShape ||
							getSpotlight({ center: camera.entityData, spotlightProximity })
					});
					break;
				default:
					break;
			}
			setActiveMode(type);
		},
		[camera, fov]
	);
	return (
		<Fragment>
			<ChipTray buttonCount={camera ? 2 : 1}>
				<DistanceChips />
			</ChipTray>
			<ToolTray dockOpen={dockOpen} dir={dir}>
				<DistanceTool />
				{canEdit && !!camera && (
					<Fragment>
						{!toolType && (
							<CameraGeoMenu
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								camera={camera}
								handleSelect={handleSelect}
								handleConfirm={handleConfirm}
							/>
						)}
						{toolType === "drawing" && <DrawingTool />}
						{toolType === "spotlight" && <SpotlightTool />}
					</Fragment>
				)}
				{toolType && (
					<SaveCancel
						handleCancel={handleCancel}
						handleConfirm={handleConfirm}
					/>
				)}
			</ToolTray>
		</Fragment>
	);
};

export default memo(MapControls);
