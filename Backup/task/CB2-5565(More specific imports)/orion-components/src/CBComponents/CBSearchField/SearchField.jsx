import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	FormControl,
	Button,
	Typography
} from "@mui/material";
import { Search, Cancel, Visibility } from "@mui/icons-material";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";

const propTypes = {
	id: PropTypes.string,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	handleClear: PropTypes.func.isRequired,
	filters: PropTypes.number,
	handleClearFilters: PropTypes.func,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	autoFocus: PropTypes.bool,
	dir: PropTypes.string,
	inputStyle: PropTypes.object,
	adornmentStyle: PropTypes.object,
	formControlStyle: PropTypes.object

};

const defaultProps = {
	id: "search-field",
	filters: 0,
	handleClearFilters: null,
	placeholder: "",
	label: "",
	disabled: false,
	autoFocus: false,
	inputStyle: {},
	adornmentStyle: {},
	formControlStyle: {}
};
const handleSearch = (e, handleChange, setValue) => {
	e.persist();
	handleChange(e);
	if (setValue) {
		setValue(e.target.value);
	}

};

const useStyles = makeStyles({
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "2px solid rgb(22, 136, 189)"
		}
	}
});

const SearchField = ({
	id,
	placeholder,
	handleChange,
	handleClear,
	filters,
	value,
	handleClearFilters,
	label,
	disabled,
	autoFocus,
	dir,
	inputStyle,
	adornmentStyle,
	formControlStyle
}) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [ownValue, setValue] = useState("");
	useEffect(() => {
		if (value !== ownValue) {
			setValue(value);
		}
	}, [value]);
	const styles = {
		input: {
			...(dir === "rtl" ? { marginLeft: 48 } : { marginRight: 48 }),
			width: "100%",
			color: "#fff",
			fontSize: 14
		},
		icon: {
			position: "relative",
			right: -48,
			...(dir === "rtl" && { marginRight: 8, marginLeft: 0 }),
		},
		filter: {
			minWidth: "auto",
			textTransform: "none",
			"&:hover": {
				backgroundColor: "transparent"
			},
			...(dir === "rtl" && { paddingRight: 0 }),
			...(dir === "ltr" && { paddingLeft: 0 }),
		},
		visibility: {
			...(dir === "rtl" && { paddingLeft: 6 }),
			...(dir === "ltr" && { paddingRight: 6 }),
		}
	};
	const filtered = Boolean(filters);
	return (
		<FormControl
			sx={{ flexDirection: "row", maxHeight: 32, ...formControlStyle }}
			margin="normal"
			fullWidth={!filtered}
			disabled={disabled}
		>
			{label && <InputLabel>{label}</InputLabel>}
			<Input
				id={id}
				style={{ ...styles.input, ...inputStyle }}
				value={ownValue}
				placeholder={placeholder}
				onChange={e => {
					handleSearch(e, handleChange, setValue);
				}}
				endAdornment={
					<InputAdornment style={styles.icon} position="end">
						<IconButton disabled={!ownValue} onClick={() => { setValue(""); handleClear(); }} sx={{ padding: "12px" }}>
							{ownValue ? <Cancel sx={{ color: "rgba(255, 255, 255, 0.3)", ...adornmentStyle }} /> : <Search sx={{ color: "rgba(255, 255, 255, 0.3)", ...adornmentStyle }} />}
						</IconButton>
					</InputAdornment>
				}
				autoComplete="off"
				autoFocus={autoFocus}
				classes={{ underline: classes.underline }}
			/>
			{filtered && (
				<Button
					style={styles.filter}
					onClick={() => dispatch(handleClearFilters)}
					color="primary"
					disableFocusRipple
				>
					<Visibility style={styles.visibility} />
					<Typography color="inherit" noWrap>
						<Translate value="global.CBComponents.CBSearchField.searchField.clear" count={filters} />
					</Typography>
				</Button>
			)}
		</FormControl>
	);
};

SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;

export default SearchField;