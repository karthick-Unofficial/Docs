import React, { useEffect, useState } from "react";
import { TimeInput } from "orion-components/CBComponents";
import { Dialog, DialogActions, Radio, RadioGroup, DialogTitle, FormControlLabel, Button } from "@mui/material";
import { DatePicker } from "orion-components/CBComponents";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import MomentTZ from "moment-timezone";
import { facilityService } from "client-app-core";

const useStyles = makeStyles({
	scrollPaper: {
		width: "75%",
		margin: "0px auto"
	}
});


const parseDate = date => {
	return moment(date).set({ hour: 0, minute: 0, second: 0 })._d;
};

const SetScheduleDialog = ({
	closeDialog,
	isOpen,
	dir,
	editing,
	defaultPriority,
	priorityScheduleRow,
	facilityId
}) => {
	const classes = useStyles();
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const locale = useSelector(state => state.i18n.locale);


	const endOfYear = new Date();
	endOfYear.setMonth(11);
	endOfYear.setDate(31);
	const [dialogError, setDialogError] = useState("");
	const [conditionIndefiniteValue, setConditionIndefiniteValue] = useState(true);
	const [conditionAnyTimeValue, setConditionAnyTimeValue] = useState(true);
	const [startDateValue, setStartDateValue] = useState(parseDate(new Date()));
	const [endDateValue, setEndDateValue] = useState(endOfYear);
	const [weekdaysValue, setWeekdaysValue] = useState([0, 1, 2, 3, 4, 5, 6]);
	const [beforeTimeValue, setBeforeTimeValue] = useState(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
	const [afterTimeValue, setAfterTimeValue] = useState(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (editing) {
			if (priorityScheduleRow) {
				const { schedule } = priorityScheduleRow;
				if (schedule) {
					if (schedule.hasOwnProperty('indefinite')) {
						setConditionIndefiniteValue(schedule.indefinite);
					}
					if (schedule.startDate) {
						setStartDateValue(schedule.startDate);
					}
					if (schedule.endDate) {
						setEndDateValue(schedule.endDate);
					}
					setWeekdaysValue(schedule.weekdays);
					setConditionAnyTimeValue(schedule.anyTimeOfDay);
					const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
					if (!schedule.anyTimeOfDay) {
						if (schedule.startTime) {
							setBeforeTimeValue(MomentTZ.utc(schedule.startTime, "h:mm A")
								.tz(MomentTZ.tz.guess())
								.format(timeFormat));
						}
						if (schedule.endTime) {
							setAfterTimeValue(MomentTZ.utc(schedule.endTime, "h:mm A")
								.tz(MomentTZ.tz.guess())
								.format(timeFormat));
						}
					}
				}
			}
		}
	}, [editing, priorityScheduleRow]);

	const handleConditionDialogClose = () => {

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);

		setConditionIndefiniteValue(true);
		setConditionAnyTimeValue(true);
		setStartDateValue(parseDate(new Date()));
		setEndDateValue(endOfYear);
		setBeforeTimeValue(timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM");
		setAfterTimeValue(timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM");
		setWeekdaysValue([0, 1, 2, 3, 4, 5, 6]);
		closeDialog();
	};

	const checkIndefinite = value => {
		setConditionIndefiniteValue(value === "indefinite" ? true : false);
	};
	const handleStartDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		setStartDateValue(parseDate(value));
	};

	const handleEndDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		setEndDateValue(parseDate(value));
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

	const checkAnyTime = value => {
		setConditionAnyTimeValue(value === "all-day" ? true : false);
		if (value === "all-day") {
			setWeekdaysValue([0, 1, 2, 3, 4, 5, 6]);
		}
		else {
			setWeekdaysValue([1, 2, 3, 4, 5]);
		}
	};

	const handleBeforeTimeChange = newValue => {
		setBeforeTimeValue(newValue);
	};

	const handleAfterTimeChange = newValue => {
		setAfterTimeValue(newValue);
	};

	const handleSchedule = () => {

		const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
		const beforeTime = MomentTZ.tz(beforeTimeValue, timeFormat, MomentTZ.tz.guess());
		const afterTime = MomentTZ.tz(afterTimeValue, timeFormat, MomentTZ.tz.guess());

		if (!afterTime || !beforeTime) {
			// Check to see if user entered a valid time
			setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.validTimeValue"));
		} else if (!conditionAnyTimeValue && afterTime._i === beforeTime._i) {
			//Check to see if times are different.
			setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.startEndTimeDiff"));
		} else if (weekdaysValue.length === 1 && beforeTime.isAfter(afterTime)) {
			//Check to see if start time is before the end time value, if there is only 1 day selected.
			setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.startBeforeEndTime"));
		} else if (
			!conditionIndefiniteValue &&
			moment(startDateValue).unix() > moment(endDateValue).unix()
		) {
			setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.fallAfterStart"));
		} else if (weekdaysValue.length === 0) {
			setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.atleastOneDay"));
		}
		//else if (
		//	weekdaysValue.length === 7 &&
		//	conditionAnyTimeValue &&
		//	conditionIndefiniteValue
		//) {
		//	// Your condition does nothing
		//	setDialogError(getTranslation("global.profiles.widgets.facilityCondition.setSchedule.dialogError.atleastOneLimitingFactor"));
		//} 

		else {

			const newCondition = {
				indefinite: conditionIndefiniteValue,
				anyTimeOfDay: conditionAnyTimeValue,
				startDate: conditionIndefiniteValue ? null : startDateValue,
				endDate: conditionIndefiniteValue ? null : endDateValue,
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
				//send update object to facility json
				const { id } = priorityScheduleRow;
				newCondition.id = id;
				const prioritySchedules = {
					"priority": priorityScheduleRow.priority,
					"schedule": newCondition
				};
				facilityService.updatePrioritySchedule(
					facilityId,
					prioritySchedules,
					id,
					(err, response) => {
						if (err) {
							console.log("ERROR:", err);
						}
					}
				);
				handleConditionDialogClose();
			} else {
				//send new schedule object to facility json
				const prioritySchedules = {
					"priority": defaultPriority,
					"schedule": newCondition
				};
				facilityService.createPrioritySchedule(
					facilityId,
					prioritySchedules,
					(err, response) => {
						if (err) {
							console.log("ERROR:", err);
						}
					}
				);
				handleConditionDialogClose();
			}

		}
	};

	// Enter to submit
	const _handleKeyDown = event => {
		if (event.key === "Enter") {
			handleSchedule();
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

	const dialogStyles = {
		border: "none",
		maxWidth: "500px"
	};


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


	const dialogActions = [

		<Button
			className="themedButton"
			variant="text"
			style={buttonStyles}
			onClick={handleConditionDialogClose}>
			Cancel
		</Button>,
		<Button
			className="themedButton"
			variant="text"
			style={{ ...buttonStyles, margin: 0 }}
			onClick={handleSchedule}>
			{editing ? "Update" : "Save"}
		</Button>
	];

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
			>
				<Translate value="global.profiles.widgets.facilityCondition.setSchedule.title" />
			</DialogTitle>
			<div className="schedule-dialog-wrapper" style={{ padding: "0px 24px" }}>
				<div className="schedule-dialog">
					<h3 className="condition-subheader"><Translate value="global.profiles.widgets.facilityCondition.setSchedule.dateRange" /></h3>
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
							label={getTranslation("global.profiles.widgets.facilityCondition.setSchedule.indefinite")}
							sx={{ minWidth: "150px" }}
						/>
						<FormControlLabel
							className="rulesRadio"
							value="set-range"
							control={<Radio />}
							label={getTranslation("global.profiles.widgets.facilityCondition.setSchedule.setRange")}
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
								minDate={editing ? null : new Date()}
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
								cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}><Translate value="global.profiles.widgets.facilityCondition.setSchedule.cancel" /></span>}
								clearable={false}
							/>
							<span><Translate value="global.profiles.widgets.facilityCondition.setSchedule.to" /></span>
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
								cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}><Translate value="global.profiles.widgets.facilityCondition.setSchedule.cancel" /></span>}
								clearable={false}
							/>
						</div>
						<h3 className="condition-subheader"><Translate value="global.profiles.widgets.facilityCondition.setSchedule.days" /></h3>
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
						<h3 className="condition-subheader"><Translate value="global.profiles.widgets.facilityCondition.setSchedule.timePeriod" /></h3>
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
								label={getTranslation("global.profiles.widgets.facilityCondition.setSchedule.allDay")}
								sx={{ minWidth: "150px" }}
							/>
							<FormControlLabel
								className="rulesRadio"
								value="set-period"
								control={<Radio />}
								label={getTranslation("global.profiles.widgets.facilityCondition.setSchedule.setPeriod")}
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
							<span>To</span>
							<TimeInput
								disabled={conditionAnyTimeValue}
								onChange={handleAfterTimeChange}
								value={afterTimeValue}
								timeFormatPreference={timeFormatPreference}
							/>
						</div>
					</div>
					<span className="dialog-error">{dialogError}</span>
				</div>
			</div>
			<DialogActions>{dialogActions}</DialogActions>
		</Dialog>
	);
};

export default SetScheduleDialog;
