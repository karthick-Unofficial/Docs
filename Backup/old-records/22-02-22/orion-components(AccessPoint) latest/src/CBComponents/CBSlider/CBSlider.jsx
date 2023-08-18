import React from "react";
import PropTypes from "prop-types";
import { Slider } from "@material-ui/core";

const propTypes = {
	value: PropTypes.number.isRequired,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	onChange: PropTypes.func.isRequired
};

const defaultProps = {
	min: 0,
	max: 100,
	step: 1
};

const CBSlider = ({ value, min, max, step, onChange }) => {
	return (
		<Slider value={value} min={min} max={max} step={step} onChange={onChange} />
	);
};

CBSlider.propTypes = propTypes;
CBSlider.defaultProps = defaultProps;

export default CBSlider;
