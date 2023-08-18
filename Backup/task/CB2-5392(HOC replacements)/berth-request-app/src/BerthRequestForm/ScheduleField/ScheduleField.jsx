import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "orion-components/CBComponents";

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
			<DateTimePicker
				id="eta"
				label={label}
				value={value}
				handleChange={handleSelect}
				disabled={disabled}
				format={format}
				dir={dir}
				locale={locale}
			/>
		</Fragment>
	);
};

ScheduleField.propTypes = propTypes;

export default ScheduleField;