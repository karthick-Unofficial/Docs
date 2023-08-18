import React from "react";
import { Drawer } from "@mui/material";
import FacilityForm from "./FacilityForm/FacilityForm";
import CameraForm from "./CameraForm/CameraForm";
import AccessPointForm from "./AccessPointForm/AccessPointForm";
import FloorPlanForm from "./FloorPlanForm/FloorPlanForm";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";


const DrawingPanel = () => {

	const { mode, type } = useSelector(state => state.mapState.mapTools);
	const dir = useSelector(state => getDir(state));

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
				{type === "facility" && <FacilityForm />}
				{type === "floor-plan" && <FloorPlanForm />}
				{type === "camera" && <CameraForm />}
				{type === "accessPoint" && <AccessPointForm />}
			</div>
		</Drawer>
	);
};

export default DrawingPanel;
