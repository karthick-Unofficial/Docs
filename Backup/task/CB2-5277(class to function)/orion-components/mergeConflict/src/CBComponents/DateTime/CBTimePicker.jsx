import React from "react";
import PropTypes from "prop-types";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import HijriUtils from "@date-io/hijri";
import moment from "moment";
import { timeConversion } from "client-app-core";

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
	locale: PropTypes.string
};

const defaultProps = {
	id: "time-picker",
	label: "",
	format: "time_12-hour",
	value: null,
	minDate: "1900-01-01",
	disabled: false,
	margin: "normal",
	locale: "en"
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
	clearLabel
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
		<MuiPickersUtilsProvider utils={locale && locale == "ar" ? HijriUtils : MomentUtils} moment={moment} locale={locale}>
			<TimePicker
				id={id}
				label={label}
				value={value}
				onChange={handleChange}
				fullWidth
				margin={margin}
				labelFunc={(date, label) => formatDateLabel(date, label, format)}
				clearable={true}
				minDate={minDate}
				disabled={disabled}
				ampm={twelveHourFormat}
				InputLabelProps={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
						textAlign: (dir && dir == "rtl" ? "right" : "left"),
						left: (dir && dir == "rtl" ? "unset" : "")

					}
				}}
				okLabel={okLabel}
				cancelLabel={cancelLabel}
				clearLabel={clearLabel}
				DialogProps={{
					style: { direction: "ltr" }
				}}
			/>
		</MuiPickersUtilsProvider>
	);
};


CBTimePicker.propTypes = propTypes;
CBTimePicker.defaultProps = defaultProps;

export default CBTimePicker;
