import React from "react";
import PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
import FacilityFormContainer from "./FacilityForm/FacilityFormContainer";
import FloorPlanFormContainer from "./FloorPlanForm/FloorPlanFormContainer";
import CameraFormContainer from "./CameraForm/CameraFormContainer";
import AccessPointFormContainer from "./AccessPointForm/AccessPointFormContainer";

const propTypes = {
	mode: PropTypes.string,
	type: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {
	mode: null,
	type: null
};

const DrawingPanel = ({ mode, type, dir }) => {
	return (
		<Drawer
			open={!!mode}
			anchor={dir === "ltr" ? "left" : "right"}
			variant="persistent"
			PaperProps={{
				style: {
					width: 350,
					height: "calc(100vh - 48px)",
					top: 48
				}
			}}
		>
			<div style={{ padding: 16 }}>
				{type === "facility" && <FacilityFormContainer />}
				{type === "floor-plan" && <FloorPlanFormContainer />}
				{type === "camera" && <CameraFormContainer />}
				{type === "access point" && <AccessPointFormContainer/>}
			</div>
		</Drawer>
	);
};

DrawingPanel.propTypes = propTypes;
DrawingPanel.defaultProps = defaultProps;

export default DrawingPanel;
