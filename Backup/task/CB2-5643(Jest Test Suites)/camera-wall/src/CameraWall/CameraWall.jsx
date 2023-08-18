import React, { memo, useRef } from "react";
import CameraSlot from "./CameraSlot/CameraSlot";
import Toolbar from "./Toolbar/Toolbar";
import { Canvas } from "orion-components/CBComponents";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const CameraWall = () => {
	const State = useSelector((state) => state);
	const primaryOpen = useSelector((state) => state.appState.contextPanel.contextPanelData.primaryOpen);
	const selectedPinnedItem = useSelector((state) => state.appState.persisted.selectedPinnedItem);
	const stagedItem = useSelector((state) => state.cameraWall.stagedItem);
	let cameras = [];
	if (selectedPinnedItem) {
		cameras = State.camerasByContext[selectedPinnedItem.id];
	} else if (stagedItem) {
		cameras = State.camerasByContext[stagedItem.id];
	}
	const dir = useSelector((state) => getDir(state));

	const container = useRef(null);
	const cameraSlots = new Array(9);
	if (cameras) {
		for (let i = 0; i < 9; i++) {
			//cameraSlots will be the ids from cameras, plus nulls to fill in up to 9
			cameraSlots[i] = i < cameras.length ? cameras[i] : null;
		}
	}
	const gridHeight = container.current ? (container.current.clientHeight - 6) / 3 : null;
	return (
		<Canvas xOffset={primaryOpen ? 360 : 60} dir={dir}>
			<Toolbar primaryOpen={primaryOpen} />
			<div
				ref={container}
				className={primaryOpen ? "sidebar-open" : "sidebar-closed"}
				style={{ height: "calc(100% - 50px)" }}
			>
				<Grid
					className="camera-wall-grid"
					alignContent="flex-start"
					alignItems="flex-start"
					container
					justifyContent="center"
					spacing={0}
					style={{ height: "100%" }}
				>
					{container.current &&
						cameraSlots.map((id, index) => {
							return (
								<Grid
									key={index}
									item
									className="camera-wall-grid-item"
									xs={12}
									md={6}
									lg={4}
									style={{ padding: 1 }}
								>
									<CameraSlot id={id} index={index.toString()} gridHeight={gridHeight} />
								</Grid>
							);
						})}
				</Grid>
			</div>
		</Canvas>
	);
};

export default memo(CameraWall);
