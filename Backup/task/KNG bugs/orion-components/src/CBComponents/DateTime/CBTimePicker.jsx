import React, { Component } from "react";
import PropTypes from "prop-types";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
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
	dir: PropTypes.string
};

const defaultProps = {
	id: "time-picker",
	label: "",
	format: "time_12-hour",
	value: null,
	minDate: "1900-01-01",
	disabled: false,
	margin: "normal"
};

class CBTimePicker extends Component {
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
			disabled,
			margin,
			dir
		} = this.props;

		const twelveHourFormat = !format.includes("24-hour") || format.toLowerCase().includes("hh:mm a");
		return (
			<MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
				<TimePicker
					id={id}
					label={label}
					value={value}
					onChange={handleChange}
					fullWidth
					margin={margin}
					labelFunc={(date, label) => this.formatDateLabel(date, label, format)}
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
				/>
			</MuiPickersUtilsProvider>
		);
	}
}

CBTimePicker.propTypes = propTypes;
CBTimePicker.defaultProps = defaultProps;

export default CBTimePicker;
