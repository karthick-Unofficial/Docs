import React, { memo } from "react";
import PropTypes from "prop-types";
import { Drawer, IconButton, Typography } from "@material-ui/core";
import {
	FlexibleXYPlot,
	HorizontalGridLines,
	YAxis,
	VerticalRectSeries,
	LabelSeries
} from "react-vis";

import {
	parseBerthData,
	getPrimaryLabels,
	getSecondaryLabels,
	handleTickFormat,
	getIncrements
} from "./helpers";
import { Reorder } from "@material-ui/icons";

const propTypes = {
	berths: PropTypes.array,
	group: PropTypes.object.isRequired,
	openDialog: PropTypes.func.isRequired
};
const defaultProps = { berths: [] };

const BerthColumn = ({ berths, group, openDialog }) => {
	const firstBerth = berths[0];
	const lastBerth = berths[berths.length - 1];
	const footMarks = berths.length
		? [
			...berths.map(berth => berth.beginningFootmark),
			...berths.map(berth => berth.endFootmark)
		  ]
		: [];
	const handleReorder = () => {
		openDialog("group-order");
	};
	return (
		<Drawer
			anchor="left"
			variant="permanent"
			style={{
				zIndex: 99,
				width: 250,
				boxShadow: "-63px 75px 10px 67px rgba(0, 0, 0, 0.75)"
			}}
			PaperProps={{
				style: {
					width: 250,
					position: "relative"
				}
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "6px 16px",
					backgroundColor: "#212121"
				}}
			>
				<Typography variant="h6">{group.name}</Typography>
				<IconButton
					onClick={handleReorder}
					style={{ padding: 0, color: "#FFF" }}
				>
					<Reorder />
				</IconButton>
			</div>
			{!!berths.length && (
				<FlexibleXYPlot
					animation
					xDomain={[0, 100]}
					yDomain={[firstBerth.beginningFootmark, lastBerth.endFootmark]}
					margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
				>
					<VerticalRectSeries color="#2C2D2F" data={parseBerthData(berths)} />
					<YAxis
						orientation="right"
						tickValues={[...footMarks, ...getIncrements(berths)]}
						tickFormat={v => handleTickFormat(v, berths)}
						style={{
							ticks: { stroke: "#B5B9BE" }
						}}
					/>
					<HorizontalGridLines
						style={{ stroke: "#B5B9BE" }}
						tickValues={berths.map(berth => berth.endFootmark)}
					/>
					<LabelSeries
						animation
						style={{ fill: "#FFF" }}
						data={getPrimaryLabels(berths)}
						labelAnchorX="start"
						labelAnchorY="start"
					/>
					<LabelSeries
						animation
						style={{ fill: "#FFF", opacity: 0.75 }}
						data={getSecondaryLabels(berths)}
						labelAnchorX="start"
						labelAnchorY="start"
					/>
				</FlexibleXYPlot>
			)}
		</Drawer>
	);
};

BerthColumn.propTypes = propTypes;
BerthColumn.defaultProps = defaultProps;

export default memo(BerthColumn);
