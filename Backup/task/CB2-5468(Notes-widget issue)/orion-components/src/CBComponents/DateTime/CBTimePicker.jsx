import React from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import MomentUtils from "@date-io/moment";
import HijriUtils from "@date-io/hijri";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { TextField } from "@mui/material";
import DateTimePickerActionBar from "./CustomComponents/DateTimePicker/DateTimePickerActionBar";


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
		border: '2px solid #88134A',
		backgroundColor: '#88134A',
	}
};

const propTypes = {
	id: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	value: PropTypes.object,
	handleChange: PropTypes.func.isRequired,
	format: PropTypes.string,
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	disabled: PropTypes.bool,
	margin: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string,
	theme: PropTypes.string
};

const defaultProps = {
	id: "time-picker",
	label: "",
	format: "time_12-hour",
	value: null,
	minDate: "1900-01-01",
	disabled: false,
	margin: "normal",
	locale: "en",
	theme: "dark"
};

const CBTimePicker = ({
	id,
	label,
	value,
	handleChange,
	format,
	minDate,
	disabled,
	margin,
	dir,
	locale,
	okLabel,
	cancelLabel,
	clearLabel,
	theme
}) => {
	const formatDateLabel = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
				? timeConversion.convertToUserTime(date, format, locale)
				: invalidLabel;
	};
	moment.locale(locale);
	const twelveHourFormat = !format.includes("24-hour") || format.toLowerCase().includes("hh:mm a");
	return (
		<LocalizationProvider dateAdapter={locale === "ar" ? HijriUtils : MomentUtils} localeText={locale} adapterLocale={locale}>
			<MobileTimePicker
				id={id}
				label={label}
				value={moment(value)}
				onChange={handleChange}
				//labelFunc={(date, label) => formatDateLabel(date, label, format)}
				//clearable={true}
				showToolbar={true}
				closeOnSelect={false}
				minDate={moment(minDate)}
				disabled={disabled}
				ampm={twelveHourFormat}
				renderInput={(params) =>
					<TextField
						{...params}
						fullWidth
						margin={margin}
						error={value === null ? false : params.error}
						variant="standard"
						InputLabelProps={{
							style: {
								transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
								textAlign: (dir && dir == "rtl" ? "right" : "left"),
								left: (dir && dir == "rtl" ? "unset" : "")

							}
						}}
					/>}
				DialogProps={{
					sx: theme === "dark" ? darkThemeSx : {},
					style: { direction: "ltr" },
					className: theme === "dark" ? 'cbDateTimePicker' : 'lightcbDateTimePicker'
				}}

				toolbarTitle={<div>&nbsp;</div>}
				toolbarPlaceholder={null}
				componentsProps={{
					actionBar: {
						actions: [clearLabel, cancelLabel, okLabel]
					},
				}}
				components={{
					ActionBar: DateTimePickerActionBar
				}}
			/>
		</LocalizationProvider>
	);
};


CBTimePicker.propTypes = propTypes;
CBTimePicker.defaultProps = defaultProps;

export default CBTimePicker;
