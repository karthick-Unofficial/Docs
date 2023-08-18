import React from "react";
import { Select, MenuItem } from "@mui/material";
import {useStyles} from "../../../../shared/styles/overrides";

const DropdownSelection = ({
	inputOptions,
	dropdownValue,
	handleChange,
	styles,
	dir
}) => {
	const classes = useStyles();

	return (
		<Select
			displayEmpty
			className={`disableOutlined ${dir == "rtl" && "rtlIcon"}`}
			value={dropdownValue}
			onChange={handleChange}
			style={styles.main}
			classes={{ select: classes.select }}
			MenuProps={{
				anchorOrigin: {
					vertical: "top",
					horizontal: "left"
				},
				transformOrigin: {
					vertical: "top",
					horizontal: "left"
				},
				classes: {
					paper: classes.paper
				}
			}}
		>
			{inputOptions.map((option) => {
				return (
					<MenuItem
						key={option.value}
						value={option.value}
						classes={{ selected: classes.selected }}
						sx={{ padding: "6px 24px", fontSize: "15px", height: "32px", letterSpacing: "unset" }}
					>
						{option.label}
					</MenuItem>
				);
			})}
		</Select>
	);
};

export default DropdownSelection;