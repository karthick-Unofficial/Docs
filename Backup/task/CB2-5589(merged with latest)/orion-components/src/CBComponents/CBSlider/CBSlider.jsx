import React from "react";
import PropTypes from "prop-types";
import { Slider } from "@mui/material";

const propTypes = {
	value: PropTypes.number.isRequired,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	onChangeCommitted: PropTypes.func
};

const defaultProps = {
	min: 0,
	max: 100,
	step: 1
};

const CBSlider = ({ value, min, max, step, onChange, onChangeCommitted }) => {
	return (
		<Slider
			value={value}
			min={min}
			max={max}
			step={step}
			onChange={onChange}
			onChangeCommitted={onChangeCommitted}
			size="small"
		/>
	);
};

CBSlider.propTypes = propTypes;
CBSlider.defaultProps = defaultProps;

export default CBSlider;
