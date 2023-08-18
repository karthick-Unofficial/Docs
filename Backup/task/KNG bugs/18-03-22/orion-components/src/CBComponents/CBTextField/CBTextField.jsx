import React, {useState} from "react";
import {
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
	FormHelperText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	handleChange: PropTypes.func.isRequired,
	endAdornment: PropTypes.node,
	required: PropTypes.bool,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	disabled: PropTypes.bool,
	type: PropTypes.string,
	adornmentClick: PropTypes.func,
	dir: PropTypes.string
};

const defaultProps = {
	label: "",
	required: false,
	error: false,
	helperText: "",
	disabled: false,
	type: "text",
	adornmentClick: () => {}
};

const styles = {
	root: {
		width: "100%"
	}
};

const CBTextField = ({
	classes,
	id,
	label,
	value,
	handleChange,
	endAdornment,
	multiline,
	formControlStyles,
	required,
	error,
	helperText,
	disabled,
	fullWidth,
	type,
	adornmentClick,
	autoFocus,
	dir
}) => {
	const [focus, setFocus] = useState(false);
	const styles = {
		iconRight: {
			position: "relative",
			right: -48
		},
		withEA: (dir && dir == "rtl" ? 
			{marginLeft: 48} : { marginRight: 48 }),
		iconLeft: {
			position: "relative",
			right: 48
		}
	};

	return (
		<FormControl
			required={required}
			className={classes.root}
			margin="normal"
			style={formControlStyles}
			error={!focus && error}
			disabled={disabled}
			fullWidth={fullWidth}
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
		>
			{label && <InputLabel style={dir && dir == "rtl" ? {left: "unset", transformOrigin: "top right"} : {}}>{label}</InputLabel>}
			<Input
				id={id}
				type={type || "text"}
				style={endAdornment ? styles.withEA : {}}
				fullWidth={fullWidth}
				multiline={multiline}
				value={value}
				onChange={handleChange}
				endAdornment={
					endAdornment ? (
						<InputAdornment
							style={dir && dir == "rtl" ? styles.iconLeft : styles.iconRight}
							position={dir && dir == "rtl" ? "start" : "end"}
							onClick={adornmentClick}
						>
							{endAdornment}
						</InputAdornment>
					) : (
						""
					)
				}
				autoComplete="off"
				autoFocus={autoFocus}
			/>
			{helperText && 
				<FormHelperText
					style={{overflowWrap: "break-word", textAlign: (dir && dir == "rtl" ? "right" : "left")}}
				>
					{helperText}
				</FormHelperText>
			}
		</FormControl>
	);
};

CBTextField.propTypes = propTypes;
CBTextField.defaultProps = defaultProps;

export default withStyles(styles)(CBTextField);
