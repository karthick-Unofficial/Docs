import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { validate } from "../utility/validate";

const propTypes = {
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	handleChange: PropTypes.func.isRequired,
	field: PropTypes.object,
	autoFocus: PropTypes.bool
};

const defaultProps = {
	type: "text",
	value: "",
	autoFocus: false
};

const useStyles = makeStyles({
	root: {
		"&::before": {
			borderBottom: "none"
		}
	},
	underline: {
		"&:hover:not(.Mui-disabled)::before": {
			borderBottom: "1px solid rgb(255, 255, 255)!important"
		},
		"&:after": {
			borderBottom: "1px solid #1688bd"
		}
	}
});

const FocusInput = ({ type, value, handleChange, field, autoFocus }) => {
	const [focus, setFocus] = useState(false);
	const classes = useStyles();
	const validateInput = () => {
		if (value && field && (field.required === true || field.display === "Phone")) {
			return validate(type, value);
		} return true;
	};
	return (
		<FormControl
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
			error={focus ? false : !validateInput()}
		>
			<Input className={classes.root} value={value} onChange={handleChange} autoFocus={autoFocus} classes={{ underline: classes.underline }} />
		</FormControl>
	);
};

FocusInput.propTypes = propTypes;
FocusInput.defaultProps = defaultProps;

export default memo(FocusInput);
