import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import classNames from "classnames";

import _ from "lodash";

const styles = {
	root: {
		backgroundColor: "#2c2d2f"
	},
	icon: {
		right: "unset!important",
		left: "0!important"
	},
	select: {
		paddingRight: "0!important",
		textAlign: "right"
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
	handleOpen: () => {},
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
	/**
	 * If Select Field is set to controlled, add necessary additional props
	 * onClose is mocked in order to control open state with passed handleChange function
	 */
	const controlProps = controlled
		? {
			open: open,
			onOpen: handleOpen,
			onClose: () => {}
		  }
		: {};
	return (
		// TODO: Potentially update to use FormControl and Select components
		<TextField
			{...formControlProps}
			id={id}
			select
			disabled={disabled}
			label={label}
			error={error}
			onChange={handleChange}
			SelectProps={{
				classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select }: {}),
				multiple,
				MenuProps: {
					style: (dir && dir == "rtl" ? {maxHeight, width: "unset"} : { maxHeight, width: 0 }), // Setting width to 0 prevents menu from expanding beyond TextField
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
				...inputProps
			}}
			InputLabelProps={{
				style: {
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
					width: (dir && dir == "rtl" ? "100%": "90%"),
					transformOrigin: (dir && dir == "rtl" ? "top right": "top left"),
					textAlign: (dir && dir == "rtl" ? "right" : "left")
				}
			}}
			margin="normal"
			fullWidth
			value={value}
			helperText={helperText}
			FormHelperTextProps={{
				// classes: (dir && dir == "rtl" ? {root: classes.helperText}: {})
				style: (dir && dir == "rtl" ? {textAlign: "right", opacity: "1!important", position: "unset!important"} : {})
			  }}			
		>
			{children}
			{_.map(items, item => (
				// display: "block" solves text-overflow: "ellipsis" conflict with flex (https://github.com/mui-org/material-ui/issues/11380)
				<MenuItem
					key={item.id}
					value={item.id}
					style={{ display: "block", textOverflow: "ellipsis", textAlign: (dir && dir == "rtl" ? "right" : "left")}}
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
