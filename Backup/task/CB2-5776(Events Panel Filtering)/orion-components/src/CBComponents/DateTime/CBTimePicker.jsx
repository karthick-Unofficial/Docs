import React from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import MomentUtils from "@date-io/moment";
import HijriUtils from "@date-io/hijri";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { TextField } from "@mui/material";
import DateTimePickerActionBar from "./CustomComponents/DateTimePicker/DateTimePickerActionBar";
import { useSelector } from "react-redux";
import { getTranslation } from "orion-components/i18n";

const darkThemeSx = {
	"& .MuiPickersDay-dayWithMargin": {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},
	"& .MuiCalendarPicker-root": {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},
	"& .MuiTabs-flexContainer": {
		backgroundColor: "#2C2C2E"
	},
	"& .MuiTabs-indicator": {
		border: "2px solid #88134A",
		backgroundColor: "#88134A"
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
	theme: "dark",
	clearLabel: true,
	okLabel: true,
	cancelLabel: true
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
	okLabel,
	cancelLabel,
	clearLabel,
	theme
}) => {
	const locale = useSelector((state) => state.i18n && state.i18n.locale);
	const localeOverride = locale === "ar_kw" ? "en" : locale;

	const styles = {
		inputLabelProps: {
			...(dir === "ltr" && { transformOrigin: "top left" }),
			...(dir === "rtl" && {
				transformOrigin: "top right",
				left: "unset",
				textAlign: "right"
			})
		}
	};

	const formatTime = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
			? timeConversion.convertToUserTime(date, format, localeOverride)
			: invalidLabel;
	};
	moment.locale(localeOverride);
	const twelveHourFormat = !format.includes("24-hour") || format.toLowerCase().includes("hh:mm a");

	const actions = [
		clearLabel ? getTranslation("global.CBComponents.DateTime.clear") : null,
		cancelLabel ? getTranslation("global.CBComponents.DateTime.cancel") : null,
		okLabel ? getTranslation("global.CBComponents.DateTime.ok") : null
	];

	return (
		<LocalizationProvider
			dateAdapter={locale === "ar" ? HijriUtils : MomentUtils}
			localeText={localeOverride}
			adapterLocale={localeOverride}
		>
			<MobileTimePicker
				id={id}
				label={label}
				value={moment(value)}
				onChange={handleChange}
				showToolbar={true}
				closeOnSelect={false}
				minDate={moment(minDate)}
				disabled={disabled}
				ampm={twelveHourFormat} // cSpell:ignore ampm
				renderInput={(params) => {
					params.inputProps.value = formatTime(value, "Invalid Time", format);
					return (
						<TextField
							{...params}
							fullWidth
							margin={margin}
							error={value === null ? false : params.error}
							variant="standard"
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
						/>
					);
				}}
				DialogProps={{
					sx: theme === "dark" ? darkThemeSx : {},
					style: { direction: "ltr" },
					className: theme === "dark" ? "cbDateTimePicker" : "lightcbDateTimePicker"
				}}
				toolbarTitle={<div>&nbsp;</div>}
				toolbarPlaceholder={null}
				componentsProps={{
					actionBar: {
						actions
					}
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
