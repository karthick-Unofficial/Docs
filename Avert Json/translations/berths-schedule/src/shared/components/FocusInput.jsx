import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
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
	}
});

const FocusInput = ({ type, value, handleChange, field, autoFocus }) => {
	const [focus, setFocus] = useState(false);
	const classes = useStyles();
	const validateInput = () => {
		if(value && field && (field.required === true || field.display === "Phone")){
			return validate(type, value);
		}return true;
	};
	return (
		<FormControl
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
			error={focus ? false : !validateInput()}
		>
			<Input className={classes.root} value={value} onChange={handleChange} autoFocus={autoFocus} />
		</FormControl>
	);
};

FocusInput.propTypes = propTypes;
FocusInput.defaultProps = defaultProps;

export default memo(FocusInput);
