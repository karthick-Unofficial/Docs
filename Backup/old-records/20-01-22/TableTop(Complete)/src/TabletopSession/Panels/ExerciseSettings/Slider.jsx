import React from "react";
import PropTypes from "prop-types";
import { Slider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const thumbPropTypes = {
	"aria-valuenow": PropTypes.number,
	"aria-valuemax": PropTypes.number
};
const SliderThumb = (props) => {
	return (
		<span {...props}>
			<span style={{ fontFamily: "roboto", fontSize: 10, fontWeight: "bold", color: "#fff"}}>
				{`${props["aria-valuemax"] === 2 ? props["aria-valuenow"] * 10 : props["aria-valuenow"]}`}
			</span>
		</span>
	);
};
SliderThumb.propTypes = thumbPropTypes;

const propTypes = {
	value: PropTypes.number.isRequired,
	min: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	step: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onChangeCommitted: PropTypes.func,
	marks: PropTypes.array
};

const sliderStyle = makeStyles({
	root: {
		height: 5,
		marginTop: 14
	},
	thumb: {
		height: 23,
		width: 23,
		backgroundColor: "#4db5f4",
		marginTop: -10,
		marginLeft: -11
	},
	track: {
		height: 5
	},
	rail: {
		height: 5
	},
	mark: {
		height: 5
	}
});

const ExerciseSettingsSlider = ({
	value,
	min,
	max,
	step,
	onChange,
	onChangeCommitted,
	marks
}) => {
	const classes = sliderStyle();

	return (
		<Slider 
			value={value} 
			min={min} 
			max={max} 
			step={step} 
			onChange={onChange}
			onChangeCommitted={onChangeCommitted}
			ThumbComponent={SliderThumb}
			classes={{
				root: classes.root,
				thumb: classes.thumb,
				track: classes.track,
				rail: classes.rail,
				mark: classes.mark
			}}
			marks={marks}
		/>
	);
};

ExerciseSettingsSlider.propTypes = propTypes;
export default ExerciseSettingsSlider;