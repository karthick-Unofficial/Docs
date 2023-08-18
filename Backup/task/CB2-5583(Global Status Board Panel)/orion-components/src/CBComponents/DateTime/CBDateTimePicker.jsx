import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { TextField } from "@mui/material";
import DateTimePickerActionBar from "./CustomComponents/DateTimePicker/DateTimePickerActionBar";
import HijriUtils from "@date-io/hijri";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';





const propTypes = {
	id: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
	handleChange: PropTypes.func.isRequired,
	format: PropTypes.string,
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	disabled: PropTypes.bool,
	margin: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string,
	theme: PropTypes.string
};

const darkThemeSx = {
	'& .MuiPickersDay-dayWithMargin': {
		color: '#fff',
		backgroundColor: '#2C2C2E',
	},
	'& .MuiCalendarPicker-root': {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},
	'& .MuiTabs-flexContainer': {
		backgroundColor: "#2C2C2E"
	},
	'& .MuiTabs-indicator': {
		border: '1px solid #1688BD',
		backgroundColor: '#1688BD',
	},
	'& .MuiTypography-subtitle1': {
		fontSize: "1.5rem"
	},
	'& .MuiTypography-h3': {
		fontSize: "2rem"
	},
	'& .MuiTypography-h4': {
		fontSize: "1rem"
	},
	'& .MuiPickersToolbar-penIconButton': {
		display: "none !important"
	}
};
const lightThemeSx = {
	'& .MuiTypography-subtitle1': {
		fontSize: "1.5rem"
	},
	'& .MuiTypography-h3': {
		fontSize: "2rem"
	},
	'& .MuiTypography-h4': {
		fontSize: "1rem"
	},
	'& .MuiPickersToolbar-penIconButton': {
		display: "none !important"
	},
	'& .MuiTabs-indicator': {
		border: '1px solid #F50057',
		backgroundColor: '#F50057',
	},
}



const defaultProps = {
	id: "date-time-picker",
	label: "",
	format: "full_12-hour",
	value: null,
	minDate: "1900-01-01",
	maxDate: "2100-01-01",
	disabled: false,
	margin: "normal",
	dir: "ltr",
	locale: "en",
	theme: "dark"
};


const CBDateTimePicker = ({
	id,
	label,
	value,
	handleChange,
	format,
	minDate,
	maxDate,
	disabled,
	margin,
	dir,
	locale,
	okLabel,
	cancelLabel,
	clearLabel,
	clearable,
	theme
}) => {

	const styles = {
		inputLabelProps: {
			...(dir === "ltr" && { transformOrigin: "top left" }),
			...(dir === "rtl" && { transformOrigin: "top right", left: "unset", textAlign: "right" }),
		}
	}

	const formatDateTime = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
				? timeConversion.convertToUserTime(date, format, locale)
				: invalidLabel;
	};

	let clearableValue;
	if (clearable === undefined) {
		clearableValue = true;
	}
	else {
		clearableValue = clearable;
	}
	moment.locale(locale);// supports date picker localization like calendar date translation and toolbar
	const twelveHourFormat = !format.includes("24-hour") || format.toLowerCase().includes("hh:mm a");

	let tempDate = null;
	const [tab, setTab] = useState("date");
	const [dateTime, setDateTime] = useState(value);
	const [ok, setOk] = useState(false);

	useEffect(() => {
		setDateTime(value)
	}, [value]);

	const resetDateTime = () => {
		if (tempDate === null && dateTime === null) {
			setDateTime(null);
		} else {
			setDateTime(dateTime);
		}
	}

	const setActualDate = () => {
		setOk(!ok)
		tempDate = dateTime;
		handleChange(dateTime);
	}


	return (

		<LocalizationProvider dateAdapter={locale === "ar" ? HijriUtils : MomentUtils} localeText={locale} adapterLocale={locale}>
			<MobileDateTimePicker
				id={id || "date-time-picker"}
				label={label}
				closeOnSelect={false}
				value={dateTime}
				onChange={(val) => {
					setDateTime(val)
					handleChange(val);
				}}
				onOpen={() => {
					if (value === null && dateTime === null) {
						setDateTime(new Date());
					}
					else {
						setDateTime(moment(dateTime));
					}
				}}
				minDate={moment(minDate)}
				showToolbar={true}
				maxDate={moment(maxDate)}
				disabled={disabled}
				dayOfWeekFormatter={(val) => {
					return <div style={{ color: theme === "dark" ? "#fff" : "black" }}>{val}</div>
				}}
				DialogProps={{
					disableEnforceFocus: true,
					sx: theme === "dark" ? darkThemeSx : lightThemeSx,
					style: { direction: "ltr" },
					className: theme === "dark" ? 'cbDateTimePicker' : 'lightcbDateTimePicker'
				}}
				dateRangeIcon={<DateRangeIcon
					style={{ color: tab === "date" ? "#ACDAF5" : "#fff" }}
					onClick={() => setTab("date")}
				/>}
				timeIcon={<AccessTimeIcon
					style={{ color: tab === "time" ? "#ACDAF5" : "#fff" }}
					onClick={() => setTab("time")}
				/>}
				hideTabs={false}
				toolbarTitle={<div />}
				toolbarPlaceholder={null}
				componentsProps={{
					actionBar: {
						actions: [clearableValue ? clearLabel : null, cancelLabel, okLabel],
						resetDateTime: resetDateTime,
						submit: setActualDate
					},
				}}
				components={{
					ActionBar: DateTimePickerActionBar
				}}
				ampm={twelveHourFormat}
				renderInput={(params) => {
					params.inputProps.value = formatDateTime(dateTime, "Invalid Date", format);
					return (
						<TextField
							{...params}
							defaultValue={null}
							error={value === null ? false : params.error}
							fullWidth
							margin={margin}
							variant="standard"
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
						/>)
				}}
			/>
		</LocalizationProvider>

	);

};

CBDateTimePicker.propTypes = propTypes;
CBDateTimePicker.defaultProps = defaultProps;

export default CBDateTimePicker;
