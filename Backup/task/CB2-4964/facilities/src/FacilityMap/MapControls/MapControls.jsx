import React from "react";
import PropTypes from "prop-types";
import {
	ToolTray,
	DrawingTool,
	FloorPlanTool
} from "orion-components/Map/Tools";
import FacilityMenuContainer from "./FacilityMenu/FacilityMenuContainer";

const propTypes = {
	type: PropTypes.string,
	floorPlan: PropTypes.object.isRequired,
	dockOpen: PropTypes.bool,
	WavCamOpen: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	type: null,
	dockOpen: false,
	dir: "ltr"
};

const MapControls = ({ type, floorPlan, dockOpen, WavCamOpen, dir }) => {
	return (
		<ToolTray dockOpen={dockOpen} WavCamOpen={WavCamOpen} dir={dir}>
			<FacilityMenuContainer type={type} />
			{(type === "camera" || type === "facility") && <DrawingTool />}
			{type === "floor-plan" && floorPlan.coordinates && <FloorPlanTool />}
		</ToolTray>
	);
};

MapControls.propTypes = propTypes;
MapControls.defaultProps = defaultProps;

export default MapControls;
