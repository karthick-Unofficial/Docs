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
import { getSpotlight, validateShape } from "orion-components/Map/helpers";

const MapControls = ({
	addFOV,
	updateFOV,
	removeFOV,
	canEdit,
	entity,
	fov,
	setMapTools,
	spotlightProximity,
	updateCameraLocation,
	updateAccessPointLocation,
	toolType,
	updateSpotlight,
	setActivePath,
	updatePath,
	activePath,
	dialog,
	openDialog,
	closeDialog,
	dockOpen,
	dir,
	feature
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
				updateCameraLocation(entity.id);
				break;
			case "accessPoint-edit":
				updateAccessPointLocation(entity.id);
				break;
			case "fov-edit":
				updateFOV(fov.id);
				break;
			case "fov-add":
				{
					const { name } = entity.entityData.properties;
					addFOV(entity.id, `${name} FOV`);
				}
				break;
			case "fov-delete":
				removeFOV(entity.id);
				break;
			case "spotlight":
				updateSpotlight(entity.id);
				break;
			case "spotlight-reset":
				cameraService.deleteSpotlightShape(entity.id, err => {
					if (err) {
						console.log("ERROR", err);
					}
				});
				break;
			default:
				break;
		}
	}, [activeMode, activePath, entity, fov, toolType]);
	const handleSelect = useCallback(
		type => {
			switch (type) {
				case "camera-edit":
					setMapTools({
						type: "drawing",
						mode: "simple_select",
						feature: entity.entityData
					});
					break;
				case "accessPoint-edit":
					setMapTools({
						type: "drawing",
						mode: "simple_select",
						feature: entity.entityData
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
							entity.spotlightShape ||
							getSpotlight({ center: entity.entityData, spotlightProximity })
					});
					break;
				default:
					break;
			}
			setActiveMode(type);
		},
		[entity, fov]
	);
	return (
		<Fragment>
			<ChipTray buttonCount={entity ? 2 : 1}>
				<DistanceChips />
			</ChipTray>
			<ToolTray dockOpen={dockOpen} dir={dir}>
				<DistanceTool />
				{canEdit && !!entity && (
					<Fragment>
						{!toolType && (
							<CameraGeoMenu
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								entity={entity}
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
						disabled={feature == null || !validateShape(feature.geometry) ? true : false}
					/>
				)}
			</ToolTray>
		</Fragment>
	);
};

export default memo(MapControls);
