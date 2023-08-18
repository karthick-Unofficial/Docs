import React, { useState } from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, MobileDatePicker, } from "@mui/x-date-pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { timeConversion } from "client-app-core";
import "moment/locale/ar";
import { TextField } from "@mui/material";
import DatePickerActionBar from "./CustomComponents/DatePicker/DatePickerActionBar";


const darkThemeSx = {
	'& .MuiPickersDay-dayWithMargin': {
		color: '#fff',
		backgroundColor: '#2C2C2E',
	},
	'& .MuiCalendarPicker-root': {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},
	'& .MuiTypography-h4': {
		fontSize: "1.5rem"
	},
	'& .MuiPickersToolbar-penIconButton': {
		display: "none !important"
	}
};
const lightThemeSx = {
	'& .MuiTypography-h4': {
		fontSize: "1.5rem"
	},
	'& .MuiPickersToolbar-penIconButton': {
		display: "none !important"
	}
}

const propTypes = {
	id: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	handleChange: PropTypes.func.isRequired,
	format: PropTypes.string,
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	margin: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string,
	theme: PropTypes.string
};

const defaultProps = {
	id: "date-picker",
	label: "",
	format: "MM/DD/YYYY",
	value: null,
	minDate: "1900-01-01",
	clearable: true,
	disabled: false,
	margin: "normal",
	dir: "ltr",
	locale: "en",
	theme: "dark"
};




const CBDatePicker = ({
	id,
	label,
	fullWidth,
	InputProps,
	value,
	handleChange,
	format,
	minDate,
	clearable,
	disabled,
	margin,
	inputVariant,
	options,
	dir,
	locale,
	okLabel,
	cancelLabel,
	clearLabel,
	autoOk,
	theme
}) => {


	const formatDateLabel = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
				? timeConversion.convertToUserTime(date, format, locale)
				: invalidLabel;
	};

	moment.locale(locale);// supports date picker localization like calendar date translation and toolbar


	let tempDate = null;
	
	const [dateTime, setDateTime] = useState(value);
	const [ok, setOk] = useState(false);

	const resetDateTime = () => {
		if (tempDate === null) {
			setDateTime(null);
		} else {
			setDateTime(tempDate);
		}
	}

	const setActualDate = () => {
		setOk(!ok)
		tempDate = dateTime;
	}
	return (
		<LocalizationProvider dateAdapter={MomentUtils} localeText={locale} adapterLocale={locale} >

			<MobileDatePicker
				{...options}
				id={id}
				label={label}
				onChange={(val) => {
					setDateTime(val)
					handleChange(val);
				}}
				value={dateTime}
				onOpen={() => {
					if (value === null && dateTime === null) {
						setDateTime(new Date());
					}
					else {
						setDateTime(moment(dateTime));
					}
				}}
				minDate={moment(minDate)}
				disabled={disabled}
				DialogProps={{
					style: { direction: "ltr" },
					className: 'cbDateTimePicker',
					sx: theme === "dark" ? darkThemeSx : lightThemeSx
				}}
				dayOfWeekFormatter={(val) => {

					return <div style={{ color: theme === "dark" ? "#fff" : "black" }}>{val}</div>

				}}
				toolbarTitle={<div>&nbsp;</div>}
				closeOnSelect={autoOk}
				showToolbar={true}
				componentsProps={{
					actionBar: {
						actions: [clearable ? clearLabel : null, cancelLabel, okLabel],
						resetDateTime: resetDateTime,
						submit: setActualDate
					},
				}}
				components={{
					ActionBar: DatePickerActionBar
				}}
				renderInput={(params) =>
					<TextField {...params}
						variant="standard"
						value={moment(value).format("MM/D/YYYY")}
						fullWidth={fullWidth === undefined ? true : fullWidth}
						error={value === null ? false : params.error}
						margin={margin}
						////inputProps={InputProps}						
						InputLabelProps={{
							style: {
								transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
								textAlign: (dir && dir == "rtl" ? "right" : "left"),
								left: (dir && dir == "rtl" ? "unset" : "")
							}
						}}

					/>
				}
			/>
		</LocalizationProvider>


	);

};

CBDatePicker.propTypes = propTypes;
CBDatePicker.defaultProps = defaultProps;

export default CBDatePicker;
