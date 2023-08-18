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

const MapControls = ({
	activePath,
	canCreateShapes,
	setActivePath,
	setMapTools,
	setSpotlight,
	mapTools,
	updatePath,
	dockOpen,
	dir
}) => {
	const { feature, type } = mapTools;
	const handleCancel = useCallback(() => {
		if (type === "distance") {
			setActivePath(null);
		}
		setMapTools({ type: null });
	}, []);
	const handleConfirm = useCallback(() => {
		if (type === "distance") {
			updatePath(activePath);
			setActivePath(null);
		}
		if (type === "spotlight") {
			setSpotlight(feature);
		}
		setMapTools({ type: null });
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
					{!type && canCreateShapes && <ShapeSelect handleSelect={setMapTools} dir={dir}/>}
					{type === "drawing" && <DrawingTool />}
					{type === "spotlight" && <SpotlightTool />}
				</Fragment>
				{type && type !== "drawing" && (
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
