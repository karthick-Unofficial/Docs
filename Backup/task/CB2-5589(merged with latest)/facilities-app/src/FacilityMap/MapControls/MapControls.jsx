import React from "react";
import { ToolTray, DrawingTool, FloorPlanTool } from "orion-components/Map/Tools";
import FacilityMenu from "./FacilityMenu/FacilityMenu";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const MapControls = () => {
	const mapState = useSelector((state) => state.mapState);
	const floorPlan = useSelector((state) => state.floorPlan);
	const { dockData } = useSelector((state) => state.appState.dock);
	const { type } = mapState.mapTools;
	const dockOpen = dockData.isOpen;
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const dir = useSelector((state) => getDir(state));

	return (
		<ToolTray dockOpen={dockOpen} WavCamOpen={WavCamOpen} dir={dir}>
			<FacilityMenu type={type} />
			{(type === "camera" || type === "facility" || type === "accessPoint") && <DrawingTool />}
			{type === "floor-plan" && floorPlan.coordinates && <FloorPlanTool />}
		</ToolTray>
	);
};

export default MapControls;
