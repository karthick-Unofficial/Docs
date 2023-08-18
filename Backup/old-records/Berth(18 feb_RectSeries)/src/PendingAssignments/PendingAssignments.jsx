import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Drawer, FormControl, MenuItem, Select } from "@material-ui/core";
import { default as DateControls } from "../DateControls/DateControlsContainer";
import { Alert } from "orion-components/CBComponents/Icons";
import {
	FlexibleWidthXYPlot,
	VerticalRectSeries,
	LabelSeries,
	LineSeries,
	VerticalGridLines,
	XAxis
} from "react-vis";
import {
	getTimeGrid,
	getTimeSpan,
	getPendingPrimaryLabels,
	getPendingSecondaryLabels
} from "../BerthGroup/BerthTimeline/helpers";
import { withStyles } from "@material-ui/core/styles";
import { Translate, Localize, getTranslation } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	canEdit: PropTypes.bool,
	data: PropTypes.object,
	date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
	editAssignment: PropTypes.func.isRequired,
	pendingAssignments: PropTypes.array,
	scheduled: PropTypes.object.isRequired,
	setDay: PropTypes.func.isRequired,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const defaultProps = {
	data: null,
	pendingAssignments: []
};

const styles = {
	icon: {
		right: "unset!important",
		left: "0!important"
	}
};

const handleTickFormat = (v, dir) => {
	const dateShort = renderToStaticMarkup(<Localize id="days" value={moment(v).format("MMM D")} dateFormat="date.min" />);
	const daysShort = renderToStaticMarkup(getTranslation(`days.short.${moment(v).format("ddd")}`));
	let dateString = dateShort.toString();
	let daysString = daysShort.toString();
	dateString = dateString.replace(/<\/?[^>]+(>|$)/g, "");
	daysString = daysString.replace(/<\/?[^>]+(>|$)/g, "");
	const isToday = moment(v).isSame(moment(), "day");
	return (
		<Fragment>
			{isToday && (
				<rect
					x={0}
					y={-48}
					width={"14.25%"}
					height={16}
					style={{ fill: "#1688bd" }}
				/>
			)}
			<text transform={dir == "rtl" ? "translate(120, -12)" : "translate(20, -12)"} style={{ fill: "#FFF" }}>
				{dateString}{" "}{daysString}
			</text>
		</Fragment>
	);
};

const PendingAssignments = ({
	canEdit,
	data,
	date,
	editAssignment,
	pendingAssignments,
	scheduled,
	setDay,
	dir,
	classes
}) => {
	const [time, setTime] = useState(new Date());
	useEffect(() => {
		setInterval(() => {
			setTime(new Date());
		}, 60000);
	}, []);
	const handlePendingClick = e => {
		const { value } = e.target;
		if (value !== "label") {
			editAssignment({ assignment: value });
			const { ata, eta } = value.schedule;
			if (eta || ata) {
				setDay(moment(ata || eta));
			}
		}
	};
	const { offset } = scheduled;
	const yDomain = [0, !offset ? 100 : 65 + (offset + 1) * 50];
	return (
		<div
			style={{
				height: !offset ? 135 : 100 + (offset + 1) * 50,
				backgroundColor: "#41454a",
				display: "flex"
			}}
		>
			<Drawer
				anchor={dir == "rtl" ? "right" : "left"}
				variant="permanent"
				style={{
					zIndex: 99,
					width: 250,
					boxShadow: dir == "rtl" ? "63px 0px 10px 67px rgba(0, 0, 0, 0.75)" : "-63px 0px 10px 67px rgba(0, 0, 0, 0.75)"
				}}
				PaperProps={{
					style: {
						width: 250,
						position: "relative"
					}
				}}
			>
				<DateControls dir={dir} />
				<div
					style={{
						padding: 12,
						height: "100%",
						display: "flex",
						alignItems: "center",
						backgroundColor: "#41454a"
					}}
				>
					{!!pendingAssignments.length && (
						<div style={{ marginRight: 16 }}>
							<Alert fontSize="large" dir={dir} />
						</div>
					)}
					<FormControl disabled={!pendingAssignments.length || !canEdit} fullWidth>
						<Select
							value="label"
							onChange={handlePendingClick}
							disableUnderline
							inputProps={{
								classes: (dir && dir == "rtl" ? { icon: classes.icon } : {})
							}}
						>
							<MenuItem value="label">{pendingAssignments.length === 1 ? <Translate value="pendingAssignment.pendingSingular" count={pendingAssignments.length} /> : <Translate value="pendingAssignment.pendingPlural" count={pendingAssignments.length} />}</MenuItem>
							{pendingAssignments.map(assignment => {
								const { id, vessel } = assignment;
								return (
									<MenuItem key={id} value={assignment}>
										{vessel.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
			</Drawer>
			<div
				style={{
					position: "absolute",
					height: 48,
					width: "100%",
					backgroundColor: "#2C2D2F"
				}}
			/>
			<div style={{ zIndex: 99, height: "fit-content", width: "100%" }}>
				<FlexibleWidthXYPlot
					animation
					xType="time"
					xDomain={getTimeSpan(date)}
					yDomain={yDomain}
					margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
					height={!offset ? 135 : 100 + (offset + 1) * 50}
				>
					<XAxis
						orientation="top"
						tickValues={getTimeGrid(date)}
						top={48}
						tickSize={1}
						tickFormat={v => handleTickFormat(v, dir)}
						style={{
							line: { stroke: "#B5B9BE" }
						}}
					/>
					<VerticalGridLines
						style={{ stroke: "#B5B9BE" }}
						tickValues={getTimeGrid(date)}
					/>
					{scheduled.assignments.map(assignment => {
						const { id, schedule } = assignment;
						const { ata, eta, atd, etd } = schedule;
						return (
							<VerticalRectSeries
								key={id}
								style={{ rx: 5, margin: 6 }}
								color={data && id === data.id ? "#1688bd" : "#bc9365"}
								data={[
									{
										key: id,
										x0: moment(ata || eta).toDate(),
										y0: 10 + 50 * assignment.offset,
										x: moment(atd || etd).toDate(),
										y: 55 + 50 * assignment.offset,
										assignment
									}
								]}
								onValueMouseOver={() =>
									(document.body.style.cursor = "pointer")
								}
								onValueMouseOut={() => (document.body.style.cursor = "")}
								onValueClick={editAssignment}
								stroke="#FFF"
							/>
						);
					})}
					<LabelSeries
						animation
						style={{ fill: "#FFF" }}
						data={getPendingPrimaryLabels(scheduled.assignments)}
						labelAnchorX={dir == "rtl" ? "end" : "start"}
						labelAnchorY="start"
					/>
					<LabelSeries
						animation
						style={{ fill: "#FFF", opacity: 0.75 }}
						data={getPendingSecondaryLabels(scheduled.assignments)}
						labelAnchorX={dir == "rtl" ? "end" : "start"}
						labelAnchorY="start"
					/>
					<LineSeries
						color="#E85858"
						data={[{ x: time, y: 0 }, { x: time, y: yDomain[1] }]}
					/>
				</FlexibleWidthXYPlot>
			</div>
		</div>
	);
};

PendingAssignments.propTypes = propTypes;
PendingAssignments.defaultProps = defaultProps;

export default memo(withStyles(styles)(PendingAssignments));
