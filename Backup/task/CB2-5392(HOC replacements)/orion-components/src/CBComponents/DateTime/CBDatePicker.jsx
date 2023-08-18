import React from "react";
import PropTypes from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { timeConversion } from "client-app-core";
import "moment/locale/ar";
import { Input, TextField } from "@material-ui/core";


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
	locale: PropTypes.string
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
	locale: "en"
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
	autoOk }) => {

	const formatDateLabel = (date, invalidLabel, format) => {
		return date === null
			? ""
			: format && date
				? timeConversion.convertToUserTime(date, format, locale)
				: invalidLabel;
	};

	moment.locale(locale);
	return (
		<MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} moment={moment} locale={locale}>
			<DatePicker
				{...options}
				id={id}
				label={label}
				value={value}
				InputProps={InputProps}
				inputVariant={inputVariant}
				onChange={handleChange}
				fullWidth={fullWidth === undefined ? true : fullWidth}
				margin={margin}
				labelFunc={(date, label) => formatDateLabel(date, label, format)}
				clearable={clearable}
				minDate={minDate}
				disabled={disabled}
				autoOk={autoOk}
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

CBDatePicker.propTypes = propTypes;
CBDatePicker.defaultProps = defaultProps;

export default CBDatePicker;
