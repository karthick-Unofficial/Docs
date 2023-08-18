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
} from "@material-ui/core";
import { Search, Cancel } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

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
	autoFocus: PropTypes.bool
};
const defaultProps = {
	disabled: false,
	error: false,
	label: "",
	results: [],
	required: false,
	handleSearch: null,
	autoFocus: false
};

const useStyles = makeStyles({
	root: {
		"&::before": {
			borderBottom: "none"
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
	autoFocus
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
	return (
		<div id={`${id}-search-field-wrapper`}>
			<TextField
				error={!focus && error}
				value={inputValue}
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
						<InputAdornment position="end">
							<IconButton
								style={label || focus ? {} : { opacity: 0 }}
								disabled={!inputValue || inputValue.length === 0}
								onClick={handleClear}
							>
								{inputValue && inputValue.length > 0 ? <Cancel /> : <Search />}
							</IconButton>
						</InputAdornment>
					)
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
