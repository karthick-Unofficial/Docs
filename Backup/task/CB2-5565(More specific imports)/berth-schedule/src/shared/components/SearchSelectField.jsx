import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	ClickAwayListener,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	Paper,
	Popper,
	TextField
} from "@mui/material";
import { Search, Cancel } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const propTypes = {
	disabled: PropTypes.bool,
	error: PropTypes.bool,
	label: PropTypes.string,
	handleSearch: PropTypes.func,
	handleSelect: PropTypes.func.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	results: PropTypes.array,
	required: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	autoFocus: PropTypes.bool,
	dir: PropTypes.string
};
const defaultProps = {
	disabled: false,
	error: false,
	label: "",
	results: [],
	required: false,
	handleSearch: null,
	autoFocus: false,
	dir: "ltr"
};

const useStyles = makeStyles({
	root: {
		"&::before": {
			borderBottom: "none"
		}
	},
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(255, 255, 255)!important"
		},
		"&:after": {
			borderBottom: "1px solid #1688bd"
		}
	},
	hoverUnderline: {
		"&:hover:not(.Mui-disabled)::before": {
			borderBottom: "1px solid rgb(255, 255, 255)!important"
		},
		"&:after": {
			borderBottom: "1px solid #1688bd"
		}
	}
});

const SearchSelectField = ({
	disabled,
	error,
	label,
	handleSearch,
	handleSelect,
	id,
	results,
	required,
	value,
	autoFocus,
	dir,
	hoverInputUnderline
}) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [width, setWidth] = useState(0);
	const [inputValue, setInputValue] = useState(value);
	const [focus, setFocus] = useState(false);
	useEffect(() => {
		setInputValue(value);
		return () => {
			setInputValue(value);
		};
	}, [value]);
	const handleChange = e => {
		const field = document.getElementById(`${id}-search-field-wrapper`);
		if (handleSearch) {
			handleSearch(e);
		}
		setInputValue(e.target.value);
		setAnchorEl(field);
		setWidth(field.offsetWidth);
	};
	const handleClear = () => {
		setInputValue("");
		handleSearch({ target: { value: "" } });
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleSelectItem = id => {
		handleSelect(id);
		handleClose();
	};

	const styles = {
		inputLabelProps: {
			fontSize: 14,
			color: "#B5B9BE",
			...(dir === "rtl" ? { transformOrigin: "top right", textAlign: "right", right: 0 } : { transformOrigin: "top left", right: "unset" })
		},
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	return (
		<div id={`${id}-search-field-wrapper`}>
			<TextField
				error={!focus && error}
				value={inputValue}
				variant="standard"
				label={label}
				onChange={handleChange}
				margin={!label ? "none" : "normal"}
				required={required}
				fullWidth
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				disabled={disabled}
				autoFocus={autoFocus}
				InputProps={{
					className: label ? "" : classes.root,
					endAdornment: (
						<InputAdornment position={dir == "rtl" ? "start" : "end"}>
							<IconButton
								style={label || focus ? {} : { opacity: 0 }}
								disabled={!inputValue || inputValue.length === 0}
								onClick={handleClear}
							>
								{inputValue && inputValue.length > 0 ? <Cancel style={{ color: "#646464" }} />
									: <Search style={{ color: "#646464" }} />}
							</IconButton>
						</InputAdornment>
					),
					classes: { underline: hoverInputUnderline ? classes.hoverUnderline : classes.underline }
				}}
				InputLabelProps={{
					style: styles.inputLabelProps
				}}
			/>
			<Popper
				open={!!anchorEl}
				anchorEl={anchorEl}
				style={{
					zIndex: 99999,
					width
				}}
			>
				{inputValue && !!results.length && (
					<ClickAwayListener onClickAway={handleClose}>
						<Paper
							style={{
								backgroundColor: "#242426",
								backfaceVisibility: "hidden", // Fixes blurry text in Chrome
								borderRadius: 0
							}}
						>
							<List
								onFocus={() => setFocus(true)}
								onBlur={() => setFocus(false)}
							>
								{results.map(result => {
									return (
										<ListItem
											style={{ paddingTop: 2, paddingBottom: 2 }}
											dense
											button
											key={result.id}
											onClick={() => handleSelectItem(result.id)}
										>
											<ListItemText
												primary={result.name}
												secondary={result.date || ""}
												primaryTypographyProps={{
													variant: "body1",
													noWrap: true
												}}
												secondaryTypographyProps={{
													variant: "caption",
													noWrap: true,
													component: "p"
												}}
												style={styles.listItemText}
											/>
										</ListItem>
									);
								})}
							</List>
						</Paper>
					</ClickAwayListener>
				)}
			</Popper>
		</div>
	);
};

SearchSelectField.propTypes = propTypes;
SearchSelectField.defaultProps = defaultProps;

export default memo(SearchSelectField);
