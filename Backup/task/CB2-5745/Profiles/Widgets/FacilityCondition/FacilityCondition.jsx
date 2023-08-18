import React, { useState } from "react";
import { Translate, getTranslation } from "orion-components/i18n";
import {
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	Grid,
	MenuItem,
	TextField,
	Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SetScheduleDialog from "orion-components/Profiles/Widgets/FacilityCondition/components/setScheduleDialog";
import { useEffect } from "react";
import moment from "moment/moment";
import { useCallback } from "react";
import { facilityService } from "client-app-core";
import MomentTZ from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "orion-components/CBComponents";
import { closeDialog } from "orion-components/AppState/Actions";

const FacilityCondition = ({
	enabled,
	order,
	dir,
	facilityId,
	context,
	locale,
	priorityOptions,
	initialDefaultPriority
}) => {
	const [criticalTarget, setCriticalTarget] = useState(false);
	const [defaultPriority, setDefaultPriority] = useState(
		initialDefaultPriority
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [schedule, setSchedule] = useState([]);
	const [priorityScheduleRow, setPriorityScheduleRow] = useState([]);
	const [editing, setEditing] = useState(false);
	const [removeDialog, setRemoveDialog] = useState(false);
	let defPriorityVal = defaultPriority;
	const dispatch = useDispatch();

	moment.locale(locale);
	const timeFormatPreference = useSelector(
		(state) => state.appState.global.timeFormat
	);
	const timeZoneName = moment
		.tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
		.format("z");
	const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";

	const getDestructuredKeys = useCallback((type) => {
		const valuesArr = [];
		let values;
		switch (type) {
			case "week":
				values = getTranslation(
					"global.profiles.widgets.facilityCondition.weekDays"
				);
				break;
			default:
				values = [];
		}
		for (const key in values) {
			valuesArr.push(values[key]);
		}

		return valuesArr;
	}, []);

	const priorityValues = priorityOptions;
	const weekDays = getDestructuredKeys("week");

	const openScheduleDialog = (value) => {
		setEditing(!editing);
		setDialogOpen(!dialogOpen);
		setPriorityScheduleRow(value);
	};

	useEffect(() => {
		if (context) {
			if (context.conditions) {
				setCriticalTarget(context.conditions.critical);
				setDefaultPriority(context.conditions.defaultPriority);
				setSchedule(context.conditions.prioritySchedules);
			}
		}
	}, [context]);

	const convertUtcTime = (time) => {
		return MomentTZ.utc(time, "h:mm A")
			.tz(MomentTZ.tz.guess())
			.format(timeFormat);
	};

	const closeScheduleDialog = () => {
		setDialogOpen(!dialogOpen);
		setEditing(editing ? !editing : editing);
	};

	const toggleConditions = (control) => {
		const data = {
			defaultPriority: defPriorityVal
		};
		if (control === "criticalTarget") data["critical"] = !criticalTarget;
		facilityService.toggleConditions(facilityId, data, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const removePrioritySchedule = () => {
		facilityService.removePrioritySchedule(
			facilityId,
			priorityScheduleRow.id,
			(err, response) => {
				if (err) {
					console.log("ERROR:", err, response);
				}
			}
		);
	};

	const updatePriority = (prioritySchedules, priority) => {
		prioritySchedules.priority = priority;
		facilityService.updatePrioritySchedule(
			facilityId,
			prioritySchedules,
			prioritySchedules.id,
			(err, response) => {
				if (err) {
					console.log("ERROR:", err, response);
				}
			}
		);
	};

	return !enabled ? (
		<div />
	) : (
		<div>
			<div className={`widget-wrapper collapsed ${"index-" + order} `}>
				<div className="widget-header" style={{ direction: dir }}>
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.facilityCondition.title" />
					</div>
				</div>

				<div
					className="widget-content"
					style={{
						display: "flex",
						padding: "0px 6px",
						direction: dir
					}}
				>
					<FormControlLabel
						control={
							<Checkbox
								style={{
									transform: "scale(1.1)"
								}}
								checked={criticalTarget}
								onChange={() => {
									setCriticalTarget(!criticalTarget);
									toggleConditions("criticalTarget");
								}}
							/>
						}
						style={{ fontSize: "14px" }}
						label={getTranslation(
							"global.profiles.widgets.facilityCondition.criticalTarget"
						)}
					/>
					{criticalTarget ? (
						<div>
							<div style={{ marginTop: "15px", display: "flex" }}>
								<Typography
									fontSize={11}
									style={{ padding: "12px 0px" }}
								>
									{getTranslation(
										"global.profiles.widgets.facilityCondition.prioritySchedules"
									)}
								</Typography>

								<Button
									variant="text"
									size="small"
									startIcon={
										dir === "ltr" ? (
											<AddIcon
												fontSize="11px"
												style={{
													marginRight:
														"-1px !important"
												}}
											/>
										) : null
									}
									endIcon={
										dir === "rtl" ? (
											<AddIcon
												fontSize="11px"
												style={{
													marginLeft:
														"-1px !important"
												}}
											/>
										) : null
									}
									style={{
										fontSize: "11px",
										textTransform: "none"
									}}
									onClick={() => {
										setDialogOpen(!dialogOpen);
										setEditing(
											editing ? !editing : editing
										);
									}}
								>
									<Translate value="global.profiles.widgets.facilityCondition.addNew" />
								</Button>
							</div>

							<Grid container style={{ marginTop: "15px" }}>
								<Grid item xs={4} sm={4} md={4} lg={4}>
									<TextField
										select
										value={defaultPriority}
										onChange={(e) => {
											setDefaultPriority(e.target.value);
											defPriorityVal = e.target.value;
											toggleConditions("defaultPriority");
										}}
										variant="standard"
										label={getTranslation(
											"global.profiles.widgets.facilityCondition.priority"
										)}
									>
										{priorityValues &&
											priorityValues.map(
												(priorityValue) => {
													return (
														<MenuItem
															key={`priority-value-${priorityValue.value}-menu-item`}
															value={
																priorityValue.value
															}
														>
															{
																priorityValue.label
															}
														</MenuItem>
													);
												}
											)}
									</TextField>
								</Grid>
								<Grid item xs={8} sm={8} md={8} lg={8}>
									<Typography
										fontSize={11}
										style={{ padding: "12px" }}
									>
										<Translate value="global.profiles.widgets.facilityCondition.defaultPriorityLabel" />
									</Typography>
								</Grid>
							</Grid>

							{schedule && schedule.length > 0 ? (
								<Divider
									style={{
										background: "#626466",
										marginTop: "20px"
									}}
								/>
							) : null}
							{/*schedule list*/}
							{schedule &&
								schedule.map((element) => {
									return (
										<div
											style={{ position: "relative" }}
											key={`${element.priority}-schedule-list-div`}
										>
											<Grid
												container
												style={{ marginTop: "15px" }}
											>
												<Grid
													item
													xs={3}
													sm={3}
													md={3}
													lg={3}
												>
													<TextField
														select
														value={element.priority}
														onChange={(e) => {
															updatePriority(
																element,
																e.target.value
															);
														}}
														variant="standard"
														label={getTranslation(
															"global.profiles.widgets.facilityCondition.priority"
														)}
														style={{
															marginTop: "12px"
														}}
													>
														{priorityValues &&
															priorityValues.map(
																(
																	priorityValue
																) => {
																	return (
																		<MenuItem
																			key={`priority-value-${priorityValue.value}-menu-item`}
																			value={
																				priorityValue.value
																			}
																		>
																			{
																				priorityValue.label
																			}
																		</MenuItem>
																	);
																}
															)}
													</TextField>
												</Grid>
												<Grid
													item
													xs={6}
													sm={6}
													md={6}
													lg={6}
												>
													<div>
														<Button
															variant="text"
															size="small"
															style={{
																fontSize:
																	"11px",
																marginLeft:
																	"-10px",
																textTransform:
																	"none"
															}}
															onClick={() =>
																openScheduleDialog(
																	element
																)
															}
														>
															{getTranslation(
																"global.profiles.widgets.facilityCondition.setScheduleLabel"
															)}
														</Button>

														<div
															style={{
																marginTop:
																	"-12px"
															}}
														>
															{element.schedule
																.anyTimeOfDay ? (
																<Typography>
																	{getTranslation(
																		"global.profiles.widgets.facilityCondition.allDay"
																	)}
																</Typography>
															) : (
																<Typography
																	fontSize={
																		11
																	}
																>
																	{convertUtcTime(
																		element
																			.schedule
																			.startTime
																	)}{" "}
																	{
																		timeZoneName
																	}{" "}
																	to{" "}
																	{convertUtcTime(
																		element
																			.schedule
																			.endTime
																	)}{" "}
																	{
																		timeZoneName
																	}
																</Typography>
															)}

															<Typography
																fontSize={11}
															>
																{element.schedule.weekdays.map(
																	(
																		day,
																		index
																	) => (
																		<span
																			key={`weekdays-${index}-span`}
																		>
																			{
																				weekDays[
																					day
																				]
																			}
																			{element
																				.schedule
																				.weekdays
																				.length -
																				1 !==
																			index
																				? ", "
																				: ""}
																		</span>
																	)
																)}
															</Typography>
														</div>
													</div>
												</Grid>
												<Grid
													item
													xs={3}
													sm={3}
													md={3}
													lg={3}
												>
													<Button
														variant="text"
														size="small"
														style={{
															fontSize: "11px",
															position:
																"absolute",
															bottom: 0,
															textTransform:
																"none"
														}}
														onClick={() => {
															setRemoveDialog(
																"scheduleDeletionDialog"
															);
															setPriorityScheduleRow(
																element
															);
														}}
													>
														{getTranslation(
															"global.profiles.widgets.facilityCondition.remove"
														)}
													</Button>
												</Grid>
											</Grid>
										</div>
									);
								})}
						</div>
					) : null}
				</div>
				<SetScheduleDialog
					dir={dir}
					isOpen={dialogOpen}
					defaultPriority={defaultPriority}
					closeDialog={closeScheduleDialog}
					editing={editing}
					priorityScheduleRow={priorityScheduleRow}
					facilityId={facilityId}
				/>

				<Dialog
					open={removeDialog === "scheduleDeletionDialog"}
					title={getTranslation(
						"global.profiles.widgets.facilityCondition.removeDialog.title"
					)}
					textContent={getTranslation(
						"global.profiles.widgets.facilityCondition.removeDialog.confirmationText"
					)}
					confirm={{
						action: () => {
							dispatch(closeDialog("scheduleDeletionDialog"));
							setRemoveDialog("");
							removePrioritySchedule();
						},
						label: getTranslation(
							"global.profiles.widgets.facilityCondition.removeDialog.confirm"
						)
					}}
					abort={{
						action: () => {
							dispatch(closeDialog("scheduleDeletionDialog"));
							setRemoveDialog("");
						},
						label: getTranslation(
							"global.profiles.widgets.facilityCondition.removeDialog.cancel"
						)
					}}
				/>
			</div>
		</div>
	);
};
export default FacilityCondition;
