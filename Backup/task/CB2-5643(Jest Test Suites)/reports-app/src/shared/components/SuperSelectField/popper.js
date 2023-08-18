import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";


const StyledAutocompletePopper = styled("div")(({ theme }) => ({
	[`& .${autocompleteClasses.paper}`]: {
		boxShadow: "none",
		margin: 0,
		color: "inherit",
		fontSize: 16
	},
	[`& .${autocompleteClasses.listbox}`]: {
		backgroundColor: theme.palette.mode === "light" ? "#fff" : "#1c2128",
		padding: 0,
		[`& .${autocompleteClasses.option}`]: {
			minHeight: "auto",
			alignItems: "flex-start",
			padding: 8,
			"&[aria-selected=\"true\"]": {
				backgroundColor: "transparent"
			},
			[`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
			{
				backgroundColor: theme.palette.action.hover
			}
		}
	},
	[`&.${autocompleteClasses.popperDisablePortal}`]: {
		position: "relative"
	}
}));

function PopperComponent(props) {
	const { disablePortal, anchorEl, open, ...other } = props;
	return <StyledAutocompletePopper {...other} />;
}

PopperComponent.propTypes = {
	anchorEl: PropTypes.any,
	disablePortal: PropTypes.bool,
	open: PropTypes.bool.isRequired
};


export default PopperComponent;