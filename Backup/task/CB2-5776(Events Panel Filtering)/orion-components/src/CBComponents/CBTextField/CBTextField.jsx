import React, { useState } from "react";
import { FormControl, Input, InputAdornment, InputLabel, FormHelperText } from "@mui/material";
import { withStyles } from "@mui/styles";
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
	dir: PropTypes.string,
	inputLabelStyle: PropTypes.object,
	placeholder: PropTypes.string,
	labelShrink: PropTypes.string,
	endAdornmentStyles: PropTypes.object,
	inputStyles: PropTypes.object,
	disableFocusError: PropTypes.bool,
	dottedInputUnderline: PropTypes.bool
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
	},
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		}
	},
	dottedUnderline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		},
		"&.MuiInput-underline.Mui-disabled:before": {
			borderBottomStyle: "dotted!important"
		}
	},
	formControl: {
		transform: "translate(14px, 24px) scale(1)"
	},
	shrink: {
		transform: "translate(14px, 1.5px) scale(0.75)"
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
	dir,
	inputLabelStyle,
	placeholder,
	labelShrink,
	endAdornmentStyles,
	inputStyles,
	disableFocusError,
	dottedInputUnderline
}) => {
	const [focus, setFocus] = useState(false);
	const styles = {
		withEA: {
			...(dir === "rtl" && { marginLeft: "48px" }),
			...(dir === "ltr" && { marginRight: "48px" })
		},
		icon: {
			position: "relative",
			...(dir === "rtl" && { right: -48 }),
			...(dir === "rtl" && { right: 48 })
		},
		inputLabel: {
			...(dir === "ltr" && { left: "-15px" }),
			...(dir === "rtl" && {
				left: "unset",
				transformOrigin: "top right",
				right: "15px"
			}),
			...inputLabelStyle
		},
		formHelperText: {
			overflowWrap: "break-word",
			...(dir === "rtl" && { textAlign: "right" }),
			margin: "3px 0 0 0"
		}
	};

	return (
		<FormControl
			required={required}
			className={classes.root}
			margin="normal"
			style={formControlStyles}
			error={disableFocusError ? error : !focus && error}
			disabled={disabled}
			fullWidth={fullWidth}
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
		>
			{label && (
				<InputLabel
					style={styles.inputLabel}
					classes={{
						formControl: classes.formControl,
						shrink: classes.shrink
					}}
					shrink={labelShrink}
				>
					{label}
				</InputLabel>
			)}
			<Input
				id={id}
				type={type || "text"}
				style={inputStyles || (endAdornment ? styles.withEA : {})}
				fullWidth={fullWidth}
				multiline={multiline}
				value={value}
				onChange={handleChange}
				endAdornment={
					endAdornment ? (
						<InputAdornment
							style={endAdornmentStyles || styles.icon}
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
				classes={{
					underline: dottedInputUnderline ? classes.dottedUnderline : classes.underline
				}}
				placeholder={placeholder}
			/>
			{helperText && <FormHelperText sx={styles.formHelperText}>{helperText}</FormHelperText>}
		</FormControl>
	);
};

CBTextField.propTypes = propTypes;
CBTextField.defaultProps = defaultProps;

export default withStyles(styles)(CBTextField);
