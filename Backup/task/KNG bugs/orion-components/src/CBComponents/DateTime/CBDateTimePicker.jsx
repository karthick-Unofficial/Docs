import React, { Component } from "react";
import PropTypes from "prop-types";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { timeConversion } from "client-app-core";

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
	locale: PropTypes.string
};

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
	locale: "en"
};

class CBDateTimePicker extends Component {
	formatDateLabel = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
				? timeConversion.convertToUserTime(date, format)
				: invalidLabel;
	};

	render() {
		const {
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
			locale
		} = this.props;
		let clearable;
		if (this.props.clearable === undefined) {
			clearable = true;
		}

		const twelveHourFormat = !format.includes("24-hour") || format.toLowerCase().includes("hh:mm a");
		return (
			<MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={locale}>
				<DateTimePicker
					id={id || "date-time-picker"}
					label={label}
					value={value}
					onChange={handleChange}
					fullWidth
					margin={margin}
					labelFunc={(date, label) => this.formatDateLabel(date, label, format)}
					clearable={clearable}
					minDate={minDate}
					maxDate={maxDate}
					DialogProps={{
						disableEnforceFocus: true
					}}
					disabled={disabled}
					ampm={twelveHourFormat}
					InputLabelProps={{
						style: {
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
							textAlign: (dir && dir == "rtl" ? "right" : "left"),
							left: (dir && dir == "rtl" ? "unset" : "")

						}
					}}
				/>
			</MuiPickersUtilsProvider>
		);
	}
}

CBDateTimePicker.propTypes = propTypes;
CBDateTimePicker.defaultProps = defaultProps;

export default CBDateTimePicker;
