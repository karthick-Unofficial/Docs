import React, { Fragment, memo, useCallback } from "react";
import {
	DrawingTool,
	DistanceTool,
	ToolTray,
	ShapeSelect,
	SpotlightTool,
	ChipTray,
	DistanceChips,
	SpotlightChips
} from "orion-components/Map/Tools";
import { SaveCancel } from "orion-components/CBComponents";
import { getDir } from "orion-components/i18n/Config/selector";
import { setActivePath, setMapTools, setSpotlight, updatePath } from "./mapControlsActions";
import { useDispatch, useSelector } from "react-redux";

const MapControls = () => {
	const { mapTools } = useSelector((state) => state.mapState);
	const dockOpen = useSelector((state) => state.appState.dock.dockData.open);
	const { activePath } = useSelector((state) => state.mapState.distanceTool);
	const canCreateShapes = useSelector(
		(state) =>
			state.session.user.profile.integrations &&
			state.session.user.profile.integrations.find(
				(int) => int.intId === state.session.user.profile.orgId + "_shapes"
			) &&
			state.session.user.profile.integrations.find(
				(int) => int.intId === state.session.user.profile.orgId + "_shapes"
			).permissions &&
			state.session.user.profile.integrations
				.find((int) => int.intId === state.session.user.profile.orgId + "_shapes")
				.permissions.includes("manage")
	);
	const dir = useSelector((state) => getDir(state));

	const dispatch = useDispatch();

	const { feature, type } = mapTools;
	const handleCancel = useCallback(() => {
		if (type === "distance") {
			dispatch(setActivePath(null));
		}
		dispatch(setMapTools({ type: null }));
	}, []);
	const handleConfirm = useCallback(() => {
		if (type === "distance") {
			dispatch(updatePath(activePath));
			dispatch(setActivePath(null));
		}
		if (type === "spotlight") {
			dispatch(setSpotlight(feature));
		}
		dispatch(setMapTools({ type: null }));
	}, [activePath, feature]);
	return (
		<Fragment>
			<ChipTray buttonCount={2}>
				<SpotlightChips />
				<DistanceChips />
			</ChipTray>
			<ToolTray dockOpen={dockOpen} dir={dir}>
				<DistanceTool before="---ac2-distance-tool-position-end" />
				<Fragment>
					{!type && canCreateShapes && <ShapeSelect handleSelect={setMapTools} dir={dir} />}
					{type === "drawing" && <DrawingTool />}
					{type === "spotlight" && <SpotlightTool />}
				</Fragment>
				{type && type !== "drawing" && <SaveCancel handleCancel={handleCancel} handleConfirm={handleConfirm} />}
			</ToolTray>
		</Fragment>
	);
};

export default memo(MapControls);
