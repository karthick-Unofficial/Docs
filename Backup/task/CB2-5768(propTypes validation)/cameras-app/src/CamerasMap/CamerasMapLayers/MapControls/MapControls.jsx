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
import { toast } from "react-toastify"; // cSpell:ignore toastify
import { useSelector, useDispatch } from "react-redux";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const MapControls = ({
	addFOV,
	updateFOV,
	removeFOV,
	setMapTools,
	updateCameraLocation,
	updateAccessPointLocation,
	updateSpotlight,
	setActivePath,
	updatePath,
	openDialog,
	closeDialog
}) => {
	const dispatch = useDispatch();

	const context = useSelector((state) => selectedContextSelector(state));
	const mapState = useSelector((state) => state.mapState);
	const session = useSelector((state) => state.session);
	const appState = useSelector((state) => state.appState);
	const { dockData } = appState.dock;
	const user = session.user.profile;
	const { mapTools, distanceTool } = mapState;
	const entityData = context ? { entity: context.entity, fov: context.fov } : {};
	const entity = context && entityData.entity;
	const fov = context && entityData.fov;
	let canEdit = false;
	const dialog = useSelector((state) => state.appState.dialog.openDialog);
	if (entityData.entity) {
		canEdit =
			user.integrations &&
			user.integrations.find((int) => int.intId === entityData.entity.feedId) &&
			user.integrations.find((int) => int.intId === entityData.entity.feedId).permissions &&
			user.integrations.find((int) => int.intId === entityData.entity.feedId).permissions.includes("manage");
	}
	const { spotlightProximity } = appState.global;
	const toolType = mapTools.type;
	const feature = mapTools.feature;
	const activePath = distanceTool.activePath;
	const dockOpen = dockData.isOpen;
	const dir = useSelector((state) => getDir(state));

	const [activeMode, setActiveMode] = useState(null);
	const handleCancel = useCallback(() => {
		toast.clearWaitingQueue();
		if (toolType === "distance") {
			dispatch(setActivePath(null));
		}
		dispatch(setMapTools({ type: null }));
	}, [dispatch, setActivePath, setMapTools, toolType]);
	const handleConfirm = useCallback(() => {
		toast.clearWaitingQueue();
		if (toolType === "distance") {
			dispatch(updatePath(activePath));
			dispatch(setActivePath(null));
			dispatch(setMapTools({ type: null }));
			return;
		}
		switch (activeMode) {
			case "camera-edit":
			case "camera-add":
				dispatch(updateCameraLocation(entity.id));
				break;
			case "accessPoint-edit":
				dispatch(updateAccessPointLocation(entity.id));
				break;
			case "fov-edit":
				dispatch(updateFOV(fov.id));
				break;
			case "fov-add":
				{
					const { name } = entity.entityData.properties;
					dispatch(addFOV(entity.id, `${name} FOV`));
				}
				break;
			case "fov-delete":
				dispatch(removeFOV(entity.id));
				break;
			case "spotlight":
				dispatch(updateSpotlight(entity.id));
				break;
			case "spotlight-reset":
				cameraService.deleteSpotlightShape(entity.id, (err) => {
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
		(type) => {
			switch (type) {
				case "camera-edit":
					dispatch(
						setMapTools({
							type: "drawing",
							mode: "simple_select",
							feature: entity.entityData
						})
					);
					break;
				case "accessPoint-edit":
					dispatch(
						setMapTools({
							type: "drawing",
							mode: "simple_select",
							feature: entity.entityData
						})
					);
					break;
				case "camera-add":
					dispatch(
						setMapTools({
							type: "drawing",
							mode: "draw_point"
						})
					);
					break;
				case "fov-edit":
					{
						const { geometry, properties } = fov.entityData;
						dispatch(
							setMapTools({
								type: "drawing",
								mode: "direct_select",
								feature: { geometry, id: fov.id, properties }
							})
						);
					}
					break;
				case "fov-add":
					dispatch(setMapTools({ type: "drawing", mode: "draw_polygon" }));
					break;
				case "spotlight":
					dispatch(
						setMapTools({
							type: "spotlight",
							mode: "spotlight_mode",
							feature:
								entity.spotlightShape ||
								getSpotlight({
									center: entity.entityData,
									spotlightProximity
								})
						})
					);
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
				<DistanceTool before="---ac2-distance-tool-position-end" />
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
