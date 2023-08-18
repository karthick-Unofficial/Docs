import React from "react";
import { withStyles } from "@mui/styles";
import { FormControlLabel, Checkbox } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import PropTypes from "prop-types";

const propTypes = {
	classes: PropTypes.object.isRequired,
	checked: PropTypes.bool.isRequired,
	handleChange: PropTypes.func.isRequired,
	disableCheckbox: PropTypes.bool,
	label: PropTypes.string,
	style: PropTypes.object
};

const defaultProps = {
	disableCheckbox: false
};

const styles = {
	root: {
		color: "#828283",
		"&$checked": {
			color: "#69f0ae"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
};

const CBCheckbox = ({ classes, checked, handleChange, disableCheckbox, label, style }) => {
	return label ? (
		<FormControlLabel
			control={
				<Checkbox
					classes={{
						root: classes.root,
						checked: classes.checked,
						disabled: classes.disabled
					}}
					disabled={disableCheckbox}
					checked={checked}
					icon={<CheckCircle />}
					checkedIcon={<CheckCircle />}
					onChange={handleChange}
				/>
			}
			label={label}
			style={style}
		/>
	) : (
		<Checkbox
			classes={{
				root: classes.root,
				checked: classes.checked,
				disabled: classes.disabled
			}}
			disabled={disableCheckbox}
			checked={checked}
			icon={<CheckCircle />}
			checkedIcon={<CheckCircle />}
			onChange={handleChange}
		/>
	);
};

CBCheckbox.propTypes = propTypes;
CBCheckbox.defaultProps = defaultProps;

export default withStyles(styles)(CBCheckbox);
