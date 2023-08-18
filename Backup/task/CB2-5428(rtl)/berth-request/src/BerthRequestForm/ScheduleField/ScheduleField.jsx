import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "orion-components/CBComponents";
import dateTimePickerTheme from "../../shared/theme/dateTimePickerTheme";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { getTranslation } from "orion-components/i18n/Actions";

const propTypes = {
	handleSelect: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.any,
	disabled: PropTypes.bool,
	timeFormat: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const ScheduleField = ({ handleSelect, value, label, disabled, timeFormat, dir, locale }) => {
	const format = `full_${timeFormat}`;

	return (
		<Fragment>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={dateTimePickerTheme}>
					<DateTimePicker
						id="eta"
						label={label}
						value={value}
						handleChange={handleSelect}
						disabled={disabled}
						format={format}
						dir={dir}
						locale={locale}
						clearable={true}
						theme="light"
						okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
						clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}
						cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
					/>
				</ThemeProvider>
			</StyledEngineProvider>
		</Fragment>
	);
};

ScheduleField.propTypes = propTypes;

export default ScheduleField;