import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, Typography } from "@material-ui/core";
import {
	FlexibleWidthXYPlot,
	VerticalRectSeries,
	LineSeries,
	VerticalGridLines,
	HorizontalGridLines,
	LabelSeries,
	PolygonSeries
} from "react-vis";
import {
	getPrimaryLabels,
	getSecondaryLabels,
	getShapeData,
	getTimeGrid,
	getTimeSpan,
	parseData
} from "./helpers";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	assignments: PropTypes.array,
	berths: PropTypes.array,
	selectedId: PropTypes.string,
	date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
	editAssignment: PropTypes.func.isRequired,
	openBerthManager: PropTypes.func.isRequired,
	setNextDay: PropTypes.func.isRequired,
	setPreviousDay: PropTypes.func.isRequired, 
	dir: PropTypes.string
};
const defaultProps = { assignments: [], berths: [], selectedId: "", dir: "ltr" };

const BerthTimeline = ({
	assignments,
	berths,
	selectedId,
	date,
	editAssignment,
	openBerthManager,
	setNextDay,
	setPreviousDay,
	dir
}) => {
	const [time, setTime] = useState(new Date());
	useEffect(() => {
		// one-time call to force update after "chart-wrapper" has loaded
		setTime(new Date());

		const interval = setInterval(() => {
			setTime(new Date());
		}, 60000);
		return () => {
			clearInterval(interval);
		};
	}, [setNextDay, setPreviousDay]);
	const firstBerth = berths[0];
	const lastBerth = berths[berths.length - 1];
	return (
		<Fragment>
			<div
				id="chart-wrapper"
				style={{
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				{berths.length && document.getElementById("chart-wrapper") ? (
					<FlexibleWidthXYPlot
						height={document.getElementById("chart-wrapper").offsetHeight}
						animation
						xType="time"
						xDomain={getTimeSpan(date)}
						yDomain={[
							firstBerth.beginningFootmark,
							lastBerth.endFootmark + lastBerth.endFootmark / 20
						]}
						margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
					>
						<VerticalGridLines
							style={{ stroke: "#B5B9BE" }}
							tickValues={getTimeGrid(date)}
						/>
						<HorizontalGridLines
							style={{ stroke: "#B5B9BE" }}
							tickValues={berths.map(berth => berth.beginningFootmark)}
						/>
						{assignments.map(assignment => {
							const { id } = assignment;
							return (
								<VerticalRectSeries
									key={id}
									style={{ rx: 5, margin: 6 }}
									color={id === selectedId ? "#1688bd" : "#727881"}
									data={parseData(assignment)}
									onValueMouseOver={() =>
										(document.body.style.cursor = "pointer")
									}
									onValueMouseOut={() => (document.body.style.cursor = "")}
									onValueClick={editAssignment}
									stroke="#FFF"
								/>
							);
						})}
						{assignments
							.filter(assignment => assignment.approved)
							.map(assignment => {
								const { id } = assignment;
								return (
									<PolygonSeries
										style={{ opacity: 0.25 }}
										key={id}
										color="#FFF"
										data={getShapeData(assignment)}
									/>
								);
							})}
						<LabelSeries
							animation
							style={{ fill: "#FFF" }}
							data={getPrimaryLabels(assignments)}
							labelAnchorX={dir == "rtl" ? "end" : "start"}
							labelAnchorY="start"
						/>
						<LabelSeries
							animation
							style={{ fill: "#FFF", opacity: 0.75 }}
							data={getSecondaryLabels(assignments)}
							labelAnchorX={dir == "rtl" ? "end" : "start"}
							labelAnchorY="start"
						/>
						<LineSeries
							color="#E85858"
							data={[
								{ x: time, y: firstBerth.beginningFootmark },
								{
									x: time,
									y: lastBerth.endFootmark + lastBerth.endFootmark / 20
								}
							]}
						/>
					</FlexibleWidthXYPlot>
				) : (
					<div style={{ display: "flex", alignItems: "center" }}>
						<Typography variant="h5"><Translate value="berthGroup.berthTimeline.noData"/></Typography>
						<Link
							component="button"
							onClick={openBerthManager}
							style={{ padding: "0px 4px 0px 4px" }}
							variant="h5"
						>
							<Translate value="berthGroup.berthTimeline.clickHere"/>
						</Link>
						<Typography variant="h5"><Translate value="berthGroup.berthTimeline.toManage"/></Typography>
					</div>
				)}
			</div>
		</Fragment>
	);
};

BerthTimeline.propTypes = propTypes;
BerthTimeline.defaultProps = defaultProps;

export default memo(BerthTimeline);
