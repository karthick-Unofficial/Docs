import React, { Fragment, memo, useCallback, useState } from "react";
import { accessPointService } from "client-app-core";
import {
	DistanceTool,
	DrawingTool,
	ToolTray,
	SpotlightTool,
	ChipTray,
	DistanceChips
} from "orion-components/Map/Tools";
import { SaveCancel } from "orion-components/CBComponents";
import AccessPointGeoMenu from "../components/AccessPointGeoMenu";
import { getSpotlight } from "orion-components/Map/helpers";

const MapControls = ({
	addFOV,
	updateFOV,
	removeFOV,
	canEdit,
	accessPoint,
	fov,
	setMapTools,
	spotlightProximity,
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
			case "accessPoint-edit":
			case "accessPoint-add":
				updateAccessPointLocation(accessPoint.id);
				break;
			case "fov-edit":
				updateFOV(fov.id);
				break;
			case "fov-add":
				{
					const { name } = accessPoint.entityData.properties;
					addFOV(accessPoint.id, `${name} FOV`);
				}
				break;
			case "fov-delete":
				removeFOV(accessPoint.id);
				break;
			case "spotlight":
				updateSpotlight(accessPoint.id);
				break;
			case "spotlight-reset":
				accessPointService.deleteSpotlightShape(accessPoint.id, err => {
					if (err) {
						console.log("ERROR", err);
					}
				});
				break;
			default:
				break;
		}
	}, [activeMode, activePath, accessPoint, fov, toolType]);
	const handleSelect = useCallback(
		type => {
			switch (type) {
				case "accessPoint-edit":
					setMapTools({
						type: "drawing",
						mode: "simple_select",
						feature: accessPoint.entityData
					});
					break;
				case "accessPoint-add":
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
						accessPoint.spotlightShape ||
							getSpotlight({ center: accessPoint.entityData, spotlightProximity })
					});
					break;
				default:
					break;
			}
			setActiveMode(type);
		},
		[accessPoint, fov]
	);
	return (
		<Fragment>
			<ChipTray buttonCount={accessPoint ? 2 : 1}>
				<DistanceChips />
			</ChipTray>
			<ToolTray dockOpen={dockOpen} dir={dir}>
				<DistanceTool />
				{canEdit && !!accessPoint && (
					<Fragment>
						{!toolType && (
							<AccessPointGeoMenu
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								accessPoint={accessPoint}
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
