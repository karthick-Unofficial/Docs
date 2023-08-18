import React, { useState } from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/ar";
import { TextField } from "@mui/material";
import DatePickerActionBar from "./CustomComponents/DatePicker/DatePickerActionBar";
import { useSelector } from "react-redux";
import { getTranslation } from "orion-components/i18n";

const darkThemeSx = {
	"& .MuiDayPicker-weekContainer": {
		"& .Mui-disabled": {
			color: "#7C7C7D !important"
		}
	},
	"& .MuiPickersDay-dayWithMargin": {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},

	"& .MuiCalendarPicker-root": {
		color: "#fff",
		backgroundColor: "#2C2C2E"
	},
	"& .MuiTypography-h4": {
		fontSize: "1.5rem"
	},
	"& .MuiPickersToolbar-penIconButton": {
		display: "none !important"
	}
};
const lightThemeSx = {
	"& .MuiTypography-h4": {
		fontSize: "1.5rem"
	},
	"& .MuiPickersToolbar-penIconButton": {
		display: "none !important"
	}
};

const propTypes = {
	id: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	fullWidth: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	handleChange: PropTypes.func.isRequired,
	format: PropTypes.string,
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	margin: PropTypes.string,
	options: PropTypes.object,
	okLabel: PropTypes.bool,
	cancelLabel: PropTypes.bool,
	clearLabel: PropTypes.bool,
	autoOk: PropTypes.bool,
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
	theme: "dark",
	clearLabel: true,
	okLabel: true,
	cancelLabel: true
};

const CBDatePicker = ({
	id,
	label,
	fullWidth,
	value,
	handleChange,
	minDate,
	clearable,
	disabled,
	margin,
	options,
	dir,
	okLabel,
	cancelLabel,
	clearLabel,
	autoOk,
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

	moment.locale(localeOverride); // supports date picker localization like calendar date translation and toolbar

	let tempDate = null;

	const [dateTime, setDateTime] = useState(value);
	const [ok, setOk] = useState(false);

	const resetDateTime = () => {
		if (tempDate === null && dateTime === null) {
			setDateTime(null);
		} else {
			setDateTime(dateTime);
		}
	};

	const setActualDate = () => {
		setOk(!ok);
		tempDate = dateTime;
		handleChange(dateTime);
	};

	const actions = [
		clearable && clearLabel
			? getTranslation("global.CBComponents.DateTime.clear")
			: null,
		cancelLabel
			? getTranslation("global.CBComponents.DateTime.cancel")
			: null,
		okLabel ? getTranslation("global.CBComponents.DateTime.ok") : null
	];

	return (
		<LocalizationProvider
			dateAdapter={MomentUtils}
			localeText={localeOverride}
			adapterLocale={localeOverride}
		>
			<MobileDatePicker
				{...options}
				id={id}
				label={label}
				onChange={(val) => {
					setDateTime(val);
					handleChange(val);
				}}
				value={dateTime}
				onOpen={() => {
					if (value === null && dateTime === null) {
						setDateTime(new Date());
					} else {
						setDateTime(moment(dateTime));
					}
				}}
				minDate={moment(minDate)}
				disabled={disabled}
				DialogProps={{
					style: { direction: "ltr" },
					className: "cbDateTimePicker",
					sx: theme === "dark" ? darkThemeSx : lightThemeSx
				}}
				dayOfWeekFormatter={(val) => {
					return (
						<div
							style={{
								color: theme === "dark" ? "#fff" : "black"
							}}
						>
							{val}
						</div>
					);
				}}
				toolbarTitle={<div>&nbsp;</div>}
				closeOnSelect={autoOk}
				showToolbar={true}
				componentsProps={{
					actionBar: {
						actions,
						resetDateTime: resetDateTime,
						submit: setActualDate
					}
				}}
				components={{
					ActionBar: DatePickerActionBar
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						{...options}
						variant="standard"
						value={moment(value).format("MM/D/YYYY")}
						fullWidth={fullWidth === undefined ? true : fullWidth}
						error={value === null ? false : params.error}
						margin={margin}
						////inputProps={InputProps}
						InputLabelProps={{
							style: styles.inputLabelProps
						}}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};

CBDatePicker.propTypes = propTypes;
CBDatePicker.defaultProps = defaultProps;

export default CBDatePicker;
