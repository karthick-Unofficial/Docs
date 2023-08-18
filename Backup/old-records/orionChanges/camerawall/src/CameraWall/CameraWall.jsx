import React, { memo, useRef } from "react";
import PropTypes from "prop-types";
import { default as CameraSlot } from "./CameraSlot/CameraSlotContainer";
import { default as Toolbar } from "./Toolbar/ToolbarContainer";
import { Canvas } from "orion-components/CBComponents";
import { Grid } from "@material-ui/core";

const propTypes = {
	cameras: PropTypes.array,
	primaryOpen: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	cameras: [],
	primaryOpen: false
};
const CameraWall = ({ cameras, primaryOpen, dir }) => {
	const container = useRef(null);
	const cameraSlots = new Array(9);
	for (let i = 0; i < 9; i++) {
		//cameraSlots will be the ids from cameras, plus nulls to fill in up to 9
		cameraSlots[i] = i < cameras.length ? cameras[i] : null;
	}
	const gridHeight = container.current
		? container.current.clientHeight / 3 - 24
		: null;
	return (
		<Canvas xOffset={primaryOpen ? 360 : 60} dir={dir}>
			<Toolbar />
			<div 
				ref={container} 
				className={(primaryOpen ? "sidebar-open" : "sidebar-closed")}
				style={{ height: "calc(100% - 64px)" }}
			>
				<Grid
					className="camera-wall-grid"
					alignContent="center"
					alignItems="center"
					container
					justifyContent="center"
					spacing={3}
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
								>
									<CameraSlot
										id={id}
										index={index.toString()}
										gridHeight={gridHeight}
									/>
								</Grid>
							);
						})}
				</Grid>
			</div>
		</Canvas>
	);
};

CameraWall.propTypes = propTypes;
CameraWall.defaultProps = defaultProps;

export default memo(CameraWall);
