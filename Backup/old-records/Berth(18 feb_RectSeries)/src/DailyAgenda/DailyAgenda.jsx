import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { List, ListItem } from "@material-ui/core";
import { default as DateControls } from "../DateControls/DateControlsContainer";
import { Translate, Localize } from "orion-components/i18n/I18nContainer";

const propTypes = {
	date: PropTypes.object.isRequired,
	vesselAssignmentsInPort: PropTypes.array.isRequired,
	dailyAssignments: PropTypes.array.isRequired,
	berths: PropTypes.array.isRequired,
	editAssignment: PropTypes.func.isRequired,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const defaultProps = {};

const DailyAgenda = ({
	date,
	vesselAssignmentsInPort,
	dailyAssignments,
	berths,
	editAssignment,
	dir,
	locale
}) => {
	const getAssignmentsForBerth = useCallback((berthId) => {
		// -- filter out for berth
		return vesselAssignmentsInPort.filter(assignment => assignment.berth.id === berthId);
	}, [vesselAssignmentsInPort]);

	const styles = {
		wrapper: {
			width: "1000px",
			margin: "0 auto",
			paddingTop: "48px"
		},
		sectionHeader: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			color: "white"
		},
		list: {
			padding: "0"
		},
		dailyAgenda: {
			body: {
				borderTop: "1px solid #717171",
				color: "white",
				marginBottom: "144px"
			},
			listItem: {
				display: "flex",
				width: "100%",
				padding: "8px 0"
			}
		},
		inPort: {
			body: {
				paddingTop: "10px",
				color: "white",
				marginBottom: "72px"
			},
			listItem: {
				display: "flex",
				justifyContent: "space-between",
				width: "100%",
				padding: "8px 0px",
				opacity: "0.5"
			}
		}
	};

	const now = moment();
	return (
		<div style={styles.wrapper}>
			{/* Daily Agenda Section */}
			<div style={{ ...styles.sectionHeader, marginBottom: "24px" }}>
				<p style={{ width: "108px" }}><Translate value="dailyAgenda.dailyAgendaTtl" /></p>
				<div style={{ display: "flex" }}>
					<p style={dir == "rtl" ? { paddingLeft: "16px" } : { paddingRight: "16px" }}><Translate value={`days.long.${moment(date).format("dddd")}`} /></p>
					<p><b><Localize value={moment(date).format("MMMM D, YYYY")} dateFormat="date.long" /></b></p>
				</div>
				<div style={{ width: "217px" }}>
					<DateControls dir={dir} locale={locale} />
				</div>
			</div>
			<div style={styles.dailyAgenda.body}>
				<List style={styles.list}>
					{dailyAssignments.map((assignment, index) => {
						let units = "minutes";
						let timeDiff = assignment.relevantTime.diff(now, units);

						// -- switch to hours if greater than 60 minutes or days if greater than 47 hours
						if (Math.abs(timeDiff) > 47 * 60) {
							units = "days";
							timeDiff = assignment.relevantTime.diff(now, units);
						}
						else if (Math.abs(timeDiff) > 60) {
							units = "hours";
							timeDiff = assignment.relevantTime.diff(now, units);
						}

						// -- display time ago based on actual current date
						const timeDiffString = timeDiff < 0 ? `${Math.abs(timeDiff)} ${units} ago` : `In ${Math.abs(timeDiff)} ${units}`;
						return (
							<ListItem button key={index} onClick={() => editAssignment(assignment)}>
								<div key={index} style={styles.dailyAgenda.listItem}>
									<p style={{ width: "160px", textAlign: dir === "rtl" ? "right" : "left", color: `${assignment.overdue ? "#E85858" : "white"}` }}>
										{/* Display time/date based on selected date */}
										{moment(assignment.relevantTime).isSame(date, "day") ? assignment.relevantTime.format("HH:mm") : assignment.relevantTime.format("MMMM DD")}
									</p>
									<p style={{
										flexGrow: "1",
										textDecoration: `${assignment.action === "arrived" || assignment.action === "departed" ? "line-through" : ""}`,
										opacity: `${assignment.action === "arrived" || assignment.action === "departed" ? "0.5" : "1"}`,
										color: `${assignment.overdue ? "#E85858" : "white"}`,
										textAlign: dir === "rtl" ? "right" : "left"
									}}>
										{`${assignment.vessel.name} ${assignment.action} ${assignment.berth.name}`}
									</p>
									<p style={{ width: "128px" }}>{timeDiffString}</p>
								</div>
							</ListItem>
						);
					})}
				</List>
			</div>
			{/* In-Port Vessels Section */}
			<div style={{ ...styles.sectionHeader, marginBottom: "16px" }}>
				<p style={{ width: "108px" }}><Translate value="dailyAgenda.inPortVessel" /></p>
				<div style={{ display: "flex" }}>
					<p style={dir == "rtl" ? { paddingLeft: "16px" } : { paddingRight: "16px" }}><Translate value={`days.long.${moment(date).format("dddd")}`} /></p>
					<p><b><Localize value={moment(date).format("MMMM D, YYYY")} dateFormat="date.long" /></b></p>
				</div>
				<div style={{ width: "217px" }}>{/* Placeholder */}</div>
			</div>
			<div style={styles.inPort.body}>
				{berths.map(berth => {
					const berthAssignments = getAssignmentsForBerth(berth.id);
					if (berthAssignments.length > 0) {
						return (
							<div key={berth.id} style={{ marginBottom: "48px" }}>
								<div style={{ width: "100%", backgroundColor: "#27282B", padding: "8px" }}>{berth.name}</div>
								<List style={styles.list}>
									{berthAssignments.map(assignment => {
										const arrivalTime = moment(assignment.schedule.ata);
										let arrivalUnits = "minutes";
										let arrivalTimeDiff = Math.abs(arrivalTime.diff(now, arrivalUnits));
										// -- switch to years, days, or hours if appropriate
										if (arrivalTimeDiff > 365 * 24 * 60) {
											arrivalUnits = "years";
											arrivalTimeDiff = Math.abs(arrivalTime.diff(now, arrivalUnits));
										}
										else if (arrivalTimeDiff > 47 * 60) {
											arrivalUnits = "days";
											arrivalTimeDiff = Math.abs(arrivalTime.diff(now, arrivalUnits));
										}
										else if (arrivalTimeDiff > 60) {
											arrivalUnits = "hours";
											arrivalTimeDiff = Math.abs(arrivalTime.diff(now, arrivalUnits));
										}
										const arrivalString = `arrived ${arrivalTimeDiff} ${arrivalUnits} ago`;

										const departureTime = moment(assignment.schedule.atd || assignment.schedule.etd);
										let departureUnits = "minutes";
										let departureTimeDiff = departureTime.diff(now, departureUnits);
										// -- switch to years, days, or hours if appropriate
										if (Math.abs(departureTimeDiff) > 365 * 24 * 60) {
											departureUnits = "years";
											departureTimeDiff = departureTime.diff(now, departureUnits);
										}
										else if (Math.abs(departureTimeDiff) > 47 * 60) {
											departureUnits = "days";
											departureTimeDiff = departureTime.diff(now, departureUnits);
										}
										else if (Math.abs(departureTimeDiff) > 60) {
											departureUnits = "hours";
											departureTimeDiff = departureTime.diff(now, departureUnits);
										}
										const departureString = departureTimeDiff < 0 ?
											`departed ${Math.abs(departureTimeDiff)} ${departureUnits} ago` :
											`departing in ${Math.abs(departureTimeDiff)} ${departureUnits}`;

										return (
											<ListItem button key={assignment.id} onClick={() => editAssignment(assignment)}>
												<div style={styles.inPort.listItem}>
													<p style={{ width: "25%" }}>{assignment.vessel.name}</p>
													<p style={{ width: "20%" }}>{arrivalString}</p>
													<p style={{ width: "35%" }}>{assignment.primaryActivtyId}</p>
													<p style={{ width: "20%", textAlign: "end" }}>{departureString}</p>
												</div>
											</ListItem>
										);
									})}
								</List>
							</div>
						);
					}
					else {
						// -- hide berth if no assignments available
						return null;
					}
				})}
			</div>
		</div>
	);
};

DailyAgenda.propTypes = propTypes;
DailyAgenda.defaultProps = defaultProps;

export default memo(DailyAgenda);
