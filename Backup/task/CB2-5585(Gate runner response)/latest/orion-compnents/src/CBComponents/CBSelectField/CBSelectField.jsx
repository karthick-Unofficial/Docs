import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import classNames from "classnames";

import map from "lodash/map";

const styles = {
	root: {
		backgroundColor: "#2c2d2f"
	},
	icon: {
		right: "unset!important",
		left: "0!important",
		background: "transparent"
	},
	select: {
		paddingRight: "0!important",
		textAlign: "right"
	},
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		}
	},
	selectBackground: {
		background: "transparent!important"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.number,
		PropTypes.object
	]).isRequired,
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	handleChange: PropTypes.func.isRequired,
	open: PropTypes.bool,
	handleOpen: PropTypes.func,
	controlled: PropTypes.bool,
	multiple: PropTypes.bool,
	maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	disabled: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	label: "",
	items: [],
	children: [],
	open: false,
	handleOpen: () => { },
	controlled: false,
	multiple: false,
	maxHeight: "auto",
	helperText: "",
	disaled: false
};

const CBSelectField = ({
	classes,
	formControlProps,
	id,
	label,
	value,
	inputProps,
	items,
	handleChange,
	children,
	open,
	handleOpen,
	controlled,
	multiple,
	error,
	maxHeight,
	helperText,
	disabled,
	dir
}) => {

	const inlineStyles = {
		menuProps: {
			...(dir === "rtl" && { width: "unset" }),
			...(dir === "ltr" && { width: 0 })
		},
		inputLabelProps: {
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			...(dir === "rtl" && { width: "100%", transformOrigin: "top right", textAlign: "right" }),
			...(dir === "ltr" && { width: "90%", transformOrigin: "top left", textAlign: "left" }),
			color: "#B5B9BE",
			fontSize: 14
		},
		formHelperTextProps: {
			...(dir === "rtl" && { position: "unset !important", textAlign: "right", opacity: "1 !important" })
		},
		menuItem: {
			display: "block",
			textOverflow: "ellipsis",
			...(dir === "ltr" && { textAlign: "left" }),
			...(dir === "rtl" && { textAlign: "rightF" })
		}
	};
	/**
	 * If Select Field is set to controlled, add necessary additional props
	 * onClose is mocked in order to control open state with passed handleChange function
	 */
	const controlProps = controlled
		? {
			open: open,
			onOpen: handleOpen,
			onClose: () => { }
		}
		: {};
	return (
		// TODO: Potentially update to use FormControl and Select components
		<TextField
			{...formControlProps}
			id={id}
			select
			disabled={disabled}
			variant="standard"
			label={label}
			error={error}
			onChange={handleChange}
			SelectProps={{
				classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : { select: classes.selectBackground }),
				multiple,
				MenuProps: {
					style: inlineStyles.menuProps, // Setting width to 0 prevents menu from expanding beyond TextField
					// Setting width to "unset" prevents dropdown position issues in RTL styling. 
					anchorOrigin: { vertical: "top", horizontal: "left" },
					transformOrigin: { vertical: "top", horizontal: "left" },
					getContentAnchorEl: null,
					MenuListProps: {
						className: classNames(classes.root, "cb-select-field-list")
					}
				},
				...controlProps
			}}
			InputProps={{
				...inputProps,
				classes: { underline: classes.underline }
			}}
			InputLabelProps={{
				style: inlineStyles.inputLabelProps
			}}
			margin="normal"
			fullWidth
			value={value}
			helperText={helperText}
			FormHelperTextProps={{
				style: inlineStyles.formHelperTextProps
			}}
		>
			{children}
			{map(items, item => (
				// display: "block" solves text-overflow: "ellipsis" conflict with flex (https://github.com/mui-org/material-ui/issues/11380)
				<MenuItem
					key={item.id}
					value={item.id}
					style={inlineStyles.menuItem}
				>
					{item.name || item.value}
				</MenuItem>
			))}
		</TextField>
	);
};

CBSelectField.propTypes = propTypes;
CBSelectField.defaultProps = defaultProps;

export default withStyles(styles)(CBSelectField);
