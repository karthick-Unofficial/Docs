import React, { useState, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas } from "orion-components/CBComponents";
import { Grid } from "@mui/material";

import CameraSlot from "./CameraSlot";

const propTypes = {
	user: PropTypes.object.isRequired,
	cameras: PropTypes.array.isRequired,
	sendMessage: PropTypes.func.isRequired
};

const defaultProps = {
	user: {},
	cameras: [],
	sendMessage: () => {}
};

const CameraGrid = ({ user, cameras, sendMessage }) => {
	const [camerasAndSlots, setCamerasAndSlots] = useState([]);
	const [gridHeight, setGridHeight] = useState(null);
	const container = useRef(null);

	// Set empty slots and grid space height
	useLayoutEffect(() => {
		let cams = [...cameras];
		let slotsNeeded = 0;

		// Create correct number of empty slots
		if (cams.length < 4) {
			slotsNeeded = 4 - cams.length;
		} else if (cams.length === 5) {
			slotsNeeded = 1;
		} else if (6 < cams.length && cams.length < 9) {
			slotsNeeded = 9 - cams.length;
		} else {
			// If more than 9 cameras were passed in, trim off all cameras after the 9th
			cams = cams.slice(0, 9);
		}

		const slots = new Array(slotsNeeded).fill(null);
		const camsAndSlots = [...cams, ...slots];

		const gHeight = !container.current
			? null
			: camsAndSlots.length <= 6
			? container.current.clientHeight / 2 - 16
			: container.current.clientHeight / 3 - 16;

		setCamerasAndSlots(camsAndSlots);
		setGridHeight(gHeight);
	}, [cameras]);

	return (
		<Canvas xOffset={0}>
			<div ref={container} style={{ height: "calc(100% - 44px)" }}>
				<Grid alignContent="center" alignItems="center" container justify="center" spacing={3}>
					{container.current &&
						camerasAndSlots.map((cam, index) => {
							return (
								<Grid
									key={index}
									item
									xs={12}
									md={camerasAndSlots.length <= 4 ? 6 : 4}
									xl={camerasAndSlots.length <= 4 ? 6 : 4}
								>
									<CameraSlot
										key={index}
										user={user}
										camera={cam}
										length={camerasAndSlots.length}
										isEmpty={!cam}
										sendMessage={sendMessage}
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

CameraGrid.propTypes = propTypes;
CameraGrid.defaultProps = defaultProps;

export default CameraGrid;
