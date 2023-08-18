import React, { useCallback, useEffect, useState } from "react";
import TimeInput from "./TimeInput";
import MomentTZ from "moment-timezone";

import { TextField, MenuItem, Select, Button, Dialog, Radio, RadioGroup, DialogTitle, DialogActions, FormControlLabel } from "@mui/material";
import { useStyles } from "../../../shared/styles/overrides";
import { DatePicker } from "orion-components/CBComponents";


import moment from "moment";

import { timeConversion } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";

const parseDate = date => {
	return moment(date).set({ hour: 0, minute: 0, second: 0 })._d;
};

const ConditionDialog = ({
	timeFormatPreference,
	closeDialog,
	entityCollections,
	availableConditions,
	editing,
	conditions,
	updateCondition,
	addCondition,
	isOpen,
	landUnitSystem,
	editingIndex,
	dir,
	locale
}) => {
	const classes = useStyles();

	const endOfYear = new Date();
	endOfYear.setMonth(11);
	endOfYear.setDate(31);
	const [conditionTypeValue, setConditionTypeValue] = useState([]);
	const [dialogError, setDialogError] = useState("");
	const [minSpeedValue, setMinSpeedValue] = useState("");
	const [durationValue, setDurationValue] = useState(0);
	const [maxSpeedValue, setMaxSpeedValue] = useState("");
	const [collectionValue, setCollectionValue] = useState("");
	const [conditionIndefiniteValue, setConditionIndefiniteValue] = useState(true);
	const [conditionAnyTimeValue, setConditionAnyTimeValue] = useState(true);
	const [startDateValue, setStartDateValue] = useState(parseDate(new Date()));
	const [endDateValue, setEndDateValue] = useState(endOfYear);
	const [weekdaysValue, setWeekdaysValue] = useState([1, 2, 3, 4, 5]);
	const [beforeTimeValue, setBeforeTimeValue] = useState(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
	const [afterTimeValue, setAfterTimeValue] = useState(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
	const [speedUnit, setSpeedUnit] = useState("kn");
	const [conditionIndefiniteState, setConditionIndefiniteState] = useState("");
	const [conditionAnyTimeState, setConditionAnyTimeState] = useState("");
	const [trigger, setTrigger] = useState("");
	const [conditionDialogIsOpen, setConditionDialogIsOpen] = useState("");
	const [mounted, setMounted] = useState(false);

	// Enter to submit
	const _handleKeyDown = event => {
		if (event.key === "Enter" && conditionTypeValue !== null) {
			handleCondition();
		}
	};

	useEffect(() => {
		setMounted(true);
		return () => {
			document.removeEventListener("keydown", _handleKeyDown);
		};
	}, []);

	if (!mounted) {
		document.addEventListener("keydown", _handleKeyDown);
		setMounted(true);
	}

	useCallback(() => {
		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);
		const editingCondition = conditions[editingIndex];
		const type = editingCondition.type;

		// Handle timezone conversion
		let startTime = "6:00",
			endTime = "18:00";
		if (type === "time") {
			const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
			if (editingCondition.startTime) {
				startTime = MomentTZ.utc(editingCondition.startTime, "h:mm A")
					.tz(MomentTZ.tz.guess())
					.format(timeFormat);
			}
			if (editingCondition.endTime)
				endTime = MomentTZ.utc(editingCondition.endTime, "h:mm A")
					.tz(MomentTZ.tz.guess())
					.format(timeFormat);
		}

		// These properties will only exist on the existing condition object depending on the type
		setConditionTypeValue(editingCondition.type);
		setDialogError("");
		setMinSpeedValue(type === "speed" ? editingCondition.minSpeed : "");
		setMaxSpeedValue(type === "speed" ? editingCondition.maxSpeed : "");
		setCollectionValue(type === "in-collection" || "not-in-collection" ? editingCondition.id : "");
		setConditionIndefiniteValue(type === "time" ? (conditionIndefiniteState != "set-range" && editingCondition.indefinite == true ? true : false) : true);
		setConditionAnyTimeValue(type === "time" ? (conditionAnyTimeState != "set-period" && editingCondition.anyTimeOfDay == true ? true : false) : true);
		// Dates and times can get saved as null, so we need a fallback value
		setStartDateValue(type === "time" ? editingCondition.startDate || parseDate(new Date()) : parseDate(new Date()));
		setEndDateValue(type === "time" ? editingCondition.endDate || endOfYear : endOfYear);
		setBeforeTimeValue(startTime);
		setAfterTimeValue(endTime);
		setWeekdaysValue(type === "time" ? editingCondition.weekdays : [1, 2, 3, 4, 5]);
		setDurationValue(type === "duration" ? editingCondition.duration : 0);
		setSpeedUnit(editingCondition.unit || "kn");
	}, [editing]);

	const _capitalize = string => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const handleConditionDialogClose = () => {

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);

		setConditionTypeValue("");
		setDialogError("");
		setMinSpeedValue("");
		setMaxSpeedValue("");
		setCollectionValue("");
		setConditionIndefiniteValue(true);
		setConditionAnyTimeValue(true);
		setStartDateValue(parseDate(new Date()));
		setEndDateValue(endOfYear);
		setBeforeTimeValue(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
		setAfterTimeValue(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
		setWeekdaysValue([1, 2, 3, 4, 5]);
		setDurationValue(0);
		setConditionIndefiniteState("");
		setConditionAnyTimeState("");

		closeDialog();
	};

	const selectConditionType = (e) => {
		if (e.target.value === conditionTypeValue) {
			return;
		}

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);

		setConditionTypeValue(e.target.value);
		setDialogError("");
		setMinSpeedValue("");
		setMaxSpeedValue("");
		setCollectionValue("");
		setConditionIndefiniteValue(true);
		setConditionAnyTimeValue(true);
		setStartDateValue(parseDate(new Date()));
		setEndDateValue(endOfYear);
		setBeforeTimeValue(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
		setAfterTimeValue(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
		setWeekdaysValue([1, 2, 3, 4, 5]);
		setConditionIndefiniteState("");
		setConditionAnyTimeState("");
	};

	// Speed condition

	const handleMinSpeedInput = e => {
		let newValue = e.target.value;
		while (newValue.length > 0 && isNaN(newValue)) {
			newValue = newValue.substring(0, newValue.length - 1);
		}
		setMinSpeedValue(newValue);
	};

	const handleMaxSpeedInput = e => {
		let newValue = e.target.value;
		while (newValue.length > 0 && isNaN(newValue)) {
			newValue = newValue.substring(0, newValue.length - 1);
		}
		setMaxSpeedValue(newValue);
	};

	// Collection Condition

	const selectCollection = (e) => {
		setCollectionValue(e.target.value);
	};

	// Time Condition

	const checkIndefinite = value => {
		setConditionIndefiniteValue(value === "indefinite" ? true : false);
		setConditionIndefiniteState(value);
	};

	const checkAnyTime = value => {
		setConditionAnyTimeValue(value === "all-day" ? true : false);
		setConditionAnyTimeState(value);
	};

	const handleStartDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		setStartDateValue(parseDate(value));
	};

	const handleEndDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		setEndDateValue(parseDate(value));
	};

	const handleDurationInput = (event) => {
		let newValue = parseFloat(event.target.value);
		if (!event.target.value || event.target.value < 1) {
			newValue = 1;
		}
		setDurationValue(newValue);
	};

	const toggleWeekday = value => {
		let newState = [...weekdaysValue];
		if (newState.includes(value)) {
			newState = newState.filter(item => item !== value);
		} else {
			newState = [...newState, value].sort((a, b) => a - b);
		}
		setWeekdaysValue(newState);
	};

	const handleBeforeTimeChange = newValue => {
		setBeforeTimeValue(newValue);
	};

	const handleAfterTimeChange = newValue => {
		setAfterTimeValue(newValue);
	};

	const handleCondition = () => {

		switch (conditionTypeValue) {
			case "time": {
				const timeRuleExists = !editing
					? conditions.filter(item => item.type === "time")[0]
					: false;

				const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
				const beforeTime = MomentTZ.tz(beforeTimeValue, timeFormat, MomentTZ.tz.guess());
				const afterTime = MomentTZ.tz(afterTimeValue, timeFormat, MomentTZ.tz.guess());

				if (timeRuleExists) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.onlyOneAllowed"));
				} else if (!afterTime || !beforeTime) {
					// Check to see if user entered a valid time
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.validTimeValue"));
				} else if (!conditionAnyTimeValue && afterTime._i === beforeTime._i) {
					//Check to see if times are different.
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.startEndTimeDiff"));
				} else if (weekdaysValue.length === 1 && beforeTime.isAfter(afterTime)) {
					//Check to see if start time is before the end time value, if there is only 1 day selected.
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.startBeforeEndTime"));
				} else if (
					!conditionIndefiniteValue &&
					moment(startDateValue).unix() > moment(endDateValue).unix()
				) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.fallAfterStart"));
				} else if (weekdaysValue.length === 0) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.atleastOneDay"));
				} else if (
					weekdaysValue.length === 7 &&
					conditionAnyTimeValue &&
					conditionIndefiniteValue
				) {
					// Your condition does nothing
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.atleastOneLimitingFactor"));
				} else {
					const newCondition = {
						type: "time",
						indefinite: conditionIndefiniteValue,
						anyTimeOfDay: conditionAnyTimeValue,
						startDate: conditionIndefiniteValue
							? null
							: startDateValue,
						endDate: conditionIndefiniteValue
							? null
							: endDateValue,
						weekdays: weekdaysValue,
						// -- not updating time format here because we want to store the times in a consistent format
						startTime: conditionAnyTimeValue
							? null
							: beforeTime.tz("UTC").format("h:mm A"),
						endTime: conditionAnyTimeValue
							? null
							: afterTime.tz("UTC").format("h:mm A")
					};
					if (editing) {
						updateCondition(newCondition);
					} else {
						addCondition(newCondition);
					}
					const endOfYear = new Date();
					endOfYear.setMonth(11);
					endOfYear.setDate(31);

					setConditionTypeValue("");
					setDialogError("");
					setConditionIndefiniteValue(true);
					setConditionAnyTimeValue(true);
					setStartDateValue(new Date());
					setEndDateValue(endOfYear);
					setBeforeTimeValue(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
					setAfterTimeValue(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
					setWeekdaysValue([1, 2, 3, 4, 5]);
					setConditionIndefiniteState("");
					setConditionAnyTimeState("");
				}
				break;
			}

			case "speed": {
				if (
					minSpeedValue === "" &&
					maxSpeedValue === ""
				) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.slowerFasterThanVal"));
				} else if (
					+maxSpeedValue > 0 &&
					+minSpeedValue > 0 &&
					+minSpeedValue >= +maxSpeedValue
				) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.fasterThanGreater"));
				} else {
					const newCondition = {
						type: "speed",
						minSpeed: +minSpeedValue,
						maxSpeed: +maxSpeedValue,
						unit: speedUnit
					};
					if (editing) {
						updateCondition(newCondition);
					} else {
						addCondition(newCondition);
					}
					setConditionTypeValue("");
					setDialogError("");
					setConditionDialogIsOpen(false);
					setMinSpeedValue("");
					setMaxSpeedValue("");
				}
				break;
			}

			case "in-collection": {
				if (!collectionValue) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.selectAColl"));
				} else {
					const newCondition = {
						type: "in-collection",
						id: collectionValue
					};
					if (editing) {
						updateCondition(newCondition);
					} else {
						addCondition(newCondition);
					}
					setConditionTypeValue("");
					setDialogError("");
					setCollectionValue("");
					setConditionDialogIsOpen(false);
				}
				break;
			}

			case "not-in-collection": {
				if (!collectionValue) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.selectAColl"));
				} else {
					const newCondition = {
						type: "not-in-collection",
						id: collectionValue
					};
					if (editing) {
						updateCondition(newCondition);
					} else {
						addCondition(newCondition);
					}
					setConditionTypeValue("");
					setDialogError("");
					setCollectionValue("");
					setConditionDialogIsOpen(false);
				}
				break;
			}

			case "duration": {
				const durationRuleExists = !editing
					? conditions.filter(item => item.type === "duration")[0]
					: false;

				if (durationRuleExists) {
					setDialogError(getTranslation("createEditRule.conditions.conditionDialog.dialogError.onlyOneDuration"));
				} else {
					const newCondition = {
						type: "duration",
						duration: durationValue
					};
					if (editing) {
						updateCondition(newCondition);
					} else {
						addCondition(newCondition);
					}
					setConditionTypeValue("");
					setDialogError("");
					setDurationValue("");
					setConditionDialogIsOpen(false);
				}
				break;
			}

			default:
				handleConditionDialogClose();
				break;
		}
	};

	const getConditionText = condition => {
		switch (condition) {
			case "time":
				return <Translate value="createEditRule.conditions.conditionDialog.time" />;
			case "speed":
				return <Translate value="createEditRule.conditions.conditionDialog.speed" />;
			case "duration":
				return <Translate value="createEditRule.conditions.conditionDialog.duration" />;
			case "in-collection":
				return <Translate value="createEditRule.conditions.conditionDialog.inCollection" />;
			case "not-in-collection":
				return <Translate value="createEditRule.conditions.conditionDialog.notInCollection" />;
			default:
				return null;
		}
	};

	const handleChangeTrigger = (event, index, value) => {
		setTrigger(value);
	};

	const handleChangeSpeedUnit = (e) => {
		setSpeedUnit(e.target.value);
	};

	const isMobile = window.matchMedia("(max-width: 600px)").matches;
	const buttonStyles = isMobile
		? {
			fontSize: "13px"
		}
		: {};

	const datePickerStyles = {
		display: "inline-block",
		margin: "16px 6px"
	};

	const inputStyles = {
		fontSize: 11,
		backgroundColor: "rgb(31, 31, 33)",
		width: 90,
		height: 34,
		padding: "0 10px",
		letterSpacing: 1,
		fontFamily: "Roboto, sans-serif",
		display: "inline-block",
		position: "relative",
		cursor: "pointer"
	};

	const datePickerTextStyles = {
		cursor: "pointer",
		height: "34px",
		width: "90px",
		letterSpacing: "1px",
		fontSize: "11px",
		padding: "0 10px"
	};

	const datePickerTextStylesDisabled = {
		cursor: "default",
		height: "34px",
		width: "90px",
		fontSize: "11px",
		padding: "0 10px"
	};

	const dialogStyles = {
		border: "none",
		maxWidth: "500px"
	};

	const conditionsAddActions = [

		<Button
			className="themedButton"
			variant="text"
			style={buttonStyles}
			onClick={handleConditionDialogClose}>
			{getTranslation("createEditRule.conditions.conditionDialog.cancel")}
		</Button>,
		<Button
			className="themedButton"
			variant="text"
			style={{ ...buttonStyles, margin: 0 }}
			disabled={conditionTypeValue === null}
			onClick={handleCondition}>
			{editing ? getTranslation("createEditRule.conditions.conditionDialog.update") : getTranslation("createEditRule.conditions.conditionDialog.add")}
		</Button>
	];

	let entityCollection = [];

	if (entityCollections) {
		entityCollection = Object.keys(entityCollections).map(
			key => {
				return entityCollections[key];
			}
		);
	}

	const conditionIds = conditions.map(item => {
		return item.id;
	});
	// Prevent conflicting collection conditions
	const filteredCollections = entityCollection.filter(item => {
		return !conditionIds.includes(item.id);
	});
	const unitOptions = [
		{ id: "kn", value: "kn", label: getTranslation("createEditRule.conditions.conditionDialog.kn") },
		{
			id: landUnitSystem === "metric" ? "kph" : "mph",
			value: landUnitSystem === "metric" ? "kph" : "mph",
			label: landUnitSystem === "metric" ? getTranslation("createEditRule.conditions.conditionDialog.kph") : getTranslation("createEditRule.conditions.conditionDialog.mph")
		}
	];

	const overrides = {
		paperProps: {
			width: "100%",
			borderRadius: "2px",
			...(dialogStyles)
		},
		dialogTitle: {
			padding: "24px 24px 20px",
			color: "rgb(255, 255, 255)",
			fontSize: "22px",
			lineHeight: "32px",
			fontWeight: 400,
			letterSpacing: "unset"
		},
		menuItem: {
			padding: "6px 24px",
			fontSize: "15px",
			height: "32px",
			letterSpacing: "unset",
			"&:hover": {
				backgroundColor: "rgba(255, 255, 255, 0.1)"
			}
		}
	};

	return (
		<Dialog
			PaperProps={{ sx: overrides.paperProps }}
			open={isOpen}
			onClose={handleConditionDialogClose}
			classes={{ scrollPaper: classes.scrollPaper }}
			sx={{ zIndex: "1200" }}
		>
			<DialogTitle
				sx={overrides.dialogTitle}
			// disableTypography={true}
			>
				{getTranslation("createEditRule.conditions.conditionDialog.addCondition")}
			</DialogTitle>
			<div className="condition-dialog-wrapper">
				<div className="condition-dialog">
					<Select
						displayEmpty
						value={conditionTypeValue}
						onChange={selectConditionType}
						className={`condition-select disableOutlined ${dir == "rtl" && "rtlIcon"}`}
						sx={{ marginBottom: "12px" }}
						classes={{ select: classes.conditionSelect }}
						renderValue={(selected) => {
							if (selected.length === 0) {
								return <span className="selectPlaceholder">{getTranslation("createEditRule.conditions.conditionDialog.selectCondition")}</span>;
							}
							return <span>{getConditionText(conditionTypeValue)}</span>;
						}}
						MenuProps={{
							anchorOrigin: {
								vertical: "top",
								horizontal: "left"
							},
							transformOrigin: {
								vertical: "top",
								horizontal: "left"
							},
							classes: {
								paper: classes.paper
							}
						}}
					>
						{availableConditions.map(condition => {
							return (
								<MenuItem
									value={condition}
									classes={{ selected: classes.selected }}
									sx={overrides.menuItem}
								>
									{getConditionText(condition)}
								</MenuItem>
							);
						})}
					</Select>

					{/*Speed Condition*/}

					{conditionTypeValue === "speed" && (
						<div className="speed-condition">
							<div className="speed-wrapper">
								<h4 style={{ width: 136 }}><Translate value="createEditRule.conditions.conditionDialog.travellingSlowerThan" /></h4>
								<TextField
									className="disableOutlined"
									value={minSpeedValue}
									onChange={handleMinSpeedInput}
									style={{
										height: 48,
										width: "70px",
										padding: "0 8px",
										margin: "0 8px",
										display: "inline-block",
										background: "rgb(31, 31, 33)"
									}}
									inputProps={{
										style: {
											padding: 0,
											height: 48,
											color: "#fff"
										}
									}}
								/>
								<Select
									displayEmpty
									className={`disableOutlined ${dir == "rtl" && "rtlIcon"}`}
									value={speedUnit}
									onChange={handleChangeSpeedUnit}
									sx={{ width: "auto" }}
									classes={{ select: classes.conditionSelect }}
									renderValue={(selected) => {
										if (selected.length === 0) {
											return <span className="selectPlaceholder">{getTranslation("createEditRule.conditions.conditionDialog.unit")}</span>;
										}
										return <span style={{ paddingRight: "23px" }}>{speedUnit}</span>;
									}}
									MenuProps={{
										anchorOrigin: {
											vertical: "top",
											horizontal: "left"
										},
										transformOrigin: {
											vertical: "top",
											horizontal: "left"
										},
										classes: {
											paper: classes.paper
										}
									}}
								>
									{unitOptions.map(option => {
										return (
											<MenuItem
												key={option.id}
												value={option.value}
												classes={{ selected: classes.selected }}
												sx={overrides.menuItem}
											>
												{option.label}
											</MenuItem>
										);
									})}
								</Select>
							</div>
							<div className="speed-wrapper">
								<h4 style={{ width: 136 }}><Translate value="createEditRule.conditions.conditionDialog.travellingFasterThan" /></h4>
								<TextField
									className="disableOutlined"
									value={maxSpeedValue}
									onChange={handleMaxSpeedInput}
									style={{
										height: 48,
										width: "70px",
										padding: "0 8px",
										margin: "0 8px",
										display: "inline-block",
										background: "rgb(31, 31, 33)"
									}}
									inputProps={{
										style: {
											padding: 0,
											height: 48,
											color: "#fff"
										}
									}}
								/>
								<Select
									displayEmpty
									className={`disableOutlined ${dir == "rtl" && "rtlIcon"}`}
									value={speedUnit}
									onChange={handleChangeSpeedUnit}
									sx={{ width: "auto" }}
									classes={{ select: classes.conditionSelect }}
									renderValue={(selected) => {
										if (selected.length === 0) {
											return <span className="selectPlaceholder">{getTranslation("createEditRule.conditions.conditionDialog.unit")}</span>;
										}
										return <span style={{ paddingRight: "23px" }}>{speedUnit}</span>;
									}}
									MenuProps={{
										anchorOrigin: {
											vertical: "top",
											horizontal: "left"
										},
										transformOrigin: {
											vertical: "top",
											horizontal: "left"
										},
										classes: {
											paper: classes.paper
										}
									}}
								>
									{unitOptions.map(option => {
										return (
											<MenuItem
												key={option.id}
												value={option.value}
												classes={{ selected: classes.selected }}
												sx={overrides.menuItem}
											>
												{option.label}
											</MenuItem>
										);
									})}
								</Select>
							</div>
						</div>
					)}

					{/*Time Condition*/}

					{conditionTypeValue === "time" && (
						<div className="time-condition">
							<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.dateRange" /></h3>
							<RadioGroup
								row
								name="date-range"
								onChange={e => checkIndefinite(e.target.value)}
								defaultValue={
									conditionIndefiniteValue
										? "indefinite"
										: "set-range"
								}
								style={{ display: "flex", flexWrap: "wrap" }}
							>
								<FormControlLabel
									className="rulesRadio"
									value="indefinite"
									control={<Radio />}
									label={getTranslation("createEditRule.conditions.conditionDialog.indefinite")}
									sx={{ minWidth: "150px" }}
								/>
								<FormControlLabel
									className="rulesRadio"
									value="set-range"
									control={<Radio />}
									label={getTranslation("createEditRule.conditions.conditionDialog.setRange")}
									sx={{ minWidth: "150px" }}
								/>
							</RadioGroup>

							<div className="date-pickers-wrapper">
								<div
									className={
										conditionIndefiniteValue
											? "disabled date-wrapper"
											: "date-wrapper"
									}
								>
									<DatePicker
										style={datePickerStyles}
										value={moment(startDateValue)._d}
										handleChange={date => handleStartDateSelect(moment(date).locale("en"))}
										minDate={new Date()}
										disabled={conditionIndefiniteValue}
										dir={dir}
										locale={locale}
										fullWidth={false}
										InputProps={{
											style: inputStyles,
											disableUnderline: true
										}}
										autoOk={true}
										okLabel={false}
										cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}>{getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}</span>}
										clearable={false}
									/>
									<span><Translate value="createEditRule.conditions.conditionDialog.to" /></span>
									<DatePicker
										style={datePickerStyles}
										value={moment(endDateValue)._d}
										handleChange={date => handleEndDateSelect(moment(date).locale("en"))}
										disabled={conditionIndefiniteValue}
										dir={dir}
										locale={locale}
										fullWidth={false}
										InputProps={{
											style: inputStyles,
											disableUnderline: true
										}}
										autoOk={true}
										okLabel={false}
										cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}>{getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}</span>}
										clearable={false}
									/>
								</div>
								<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.days" /></h3>
								<div className="weekday-selector">
									{["Su", "M", "T", "W", "Th", "F", "Sa"].map((day, index) => {
										return (
											<div
												key={index}
												className={
													weekdaysValue.includes(index)
														? "weekday toggled"
														: "weekday"
												}
												onClick={() => toggleWeekday(index)}
											>
												{day}
											</div>
										);
									})}
								</div>
								<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.timePeriod" /></h3>
								<RadioGroup
									row
									name="date-range"
									onChange={e => checkAnyTime(e.target.value)}
									defaultValue={
										conditionAnyTimeValue ? "all-day" : "set-period"
									}
									style={{ display: "flex", flexWrap: "wrap" }}
								>
									<FormControlLabel
										className="rulesRadio"
										value="all-day"
										control={<Radio />}
										label={getTranslation("createEditRule.conditions.conditionDialog.allDay")}
										sx={{ minWidth: "150px" }}
									/>
									<FormControlLabel
										className="rulesRadio"
										value="set-period"
										control={<Radio />}
										label={getTranslation("createEditRule.conditions.conditionDialog.setPeriod")}
										sx={{ minWidth: "150px" }}
									/>
								</RadioGroup>
								<div
									className={
										conditionAnyTimeValue
											? "disabled time-wrapper"
											: "time-wrapper"
									}
								>
									<TimeInput
										disabled={conditionAnyTimeValue}
										onChange={handleBeforeTimeChange}
										value={beforeTimeValue}
										timeFormatPreference={timeFormatPreference}
									/>
									<span><Translate value="createEditRule.conditions.conditionDialog.to" /></span>
									<TimeInput
										disabled={conditionAnyTimeValue}
										onChange={handleAfterTimeChange}
										value={afterTimeValue}
										timeFormatPreference={timeFormatPreference}
									/>
								</div>
							</div>
						</div>
					)}

					{/*Duration*/}

					{conditionTypeValue === "duration" && (
						<div className="duration-condition">
							<h4><Translate value="createEditRule.conditions.conditionDialog.timeAllowed" /></h4>
							<TextField
								className="disableOutlined"
								value={durationValue}
								onChange={handleDurationInput}
								style={{
									height: 40,
									width: "70px",
									padding: "0 8px",
									margin: "0 8px",
									display: "inline-block",
									background: "rgb(31, 31, 33)"
								}}
								inputProps={{
									style: {
										padding: 0,
										height: 48,
										color: "#fff"
									}
								}}
								type={"number"}
							/>
							<span className="speed-units">
								{parseFloat(durationValue) === 1
									? <Translate value="createEditRule.conditions.conditionDialog.minute" />
									: <Translate value="createEditRule.conditions.conditionDialog.minutes" />}
							</span>
						</div>
					)}

					{/*In Collection*/}

					{conditionTypeValue === "in-collection" && (
						<div className="collection-dialog">
							<Select
								displayEmpty
								className={`collection-select disableOutlined ${dir == "rtl" && "rtlIcon"}`}
								onChange={selectCollection}
								value={collectionValue}
								sx={{ marginBottom: "12px" }}
								classes={{ select: classes.conditionSelect }}
								renderValue={(selected) => {
									if (selected.length === 0) {
										return <span className="selectPlaceholder">{getTranslation("createEditRule.conditions.conditionDialog.selectCollection")}</span>;
									}
									const collectionName = filteredCollections.map((collection) => {
										if (collection.id === collectionValue) {
											return collection.name;
										}
									});
									return <span>{collectionName}</span>;
								}}
								MenuProps={{
									anchorOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									classes: {
										paper: classes.paper
									}
								}}
							>
								<MenuItem value={null} primaryText="" />
								{filteredCollections.map((collection, index) => {
									return (
										<MenuItem
											key={index}
											value={collection.id}
											classes={{ selected: classes.selected }}
											sx={overrides.menuItem}
										>
											{collection.name}
										</MenuItem>
									);
								})}
							</Select>
						</div>
					)}

					{/*Not In Collection*/}

					{conditionTypeValue === "not-in-collection" && (
						<div className="collection-dialog">
							<Select
								displayEmpty
								className={`collection-select disableOutlined ${dir == "rtl" && "rtlIcon"}`}
								hintText={getTranslation("createEditRule.conditions.conditionDialog.selectCollection")}
								onChange={selectCollection}
								value={collectionValue}
								sx={{ marginBottom: "12px" }}
								classes={{ select: classes.conditionSelect }}
								renderValue={(selected) => {
									if (selected.length === 0) {
										return <span className="selectPlaceholder">{getTranslation("createEditRule.conditions.conditionDialog.selectCollection")}</span>;
									}
									const collectionName = filteredCollections.map((collection) => {
										if (collection.id === collectionValue) {
											return collection.name;
										}
									});
									return <span>{collectionName}</span>;
								}}
								MenuProps={{
									anchorOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									classes: {
										paper: classes.paper
									}
								}}
							>
								<MenuItem value={null}></MenuItem>
								{filteredCollections.map((collection, index) => {
									return (
										<MenuItem
											key={index}
											value={collection.id}
											classes={{ selected: classes.selected }}
											sx={overrides.menuItem}
										>
											{collection.name}
										</MenuItem>
									);
								})}
							</Select>
						</div>
					)}

					<span className="dialog-error">{dialogError}</span>
				</div>
			</div>
			<DialogActions>{conditionsAddActions}</DialogActions>
		</Dialog>
	);
};

export default ConditionDialog;