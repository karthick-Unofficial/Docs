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
} from "@material-ui/core";
import { Search, Cancel, Visibility } from "@material-ui/icons";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

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
	dir: PropTypes.string
};

const defaultProps = {
	id: "search-field",
	filters: 0,
	handleClearFilters: null,
	placeholder: "",
	label: "",
	disabled: false,
	autoFocus: false
};
const handleSearch = (e, handleChange, setValue) => {
	e.persist();
	handleChange(e);
	if (setValue) {
		setValue(e.target.value);
	}

};

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
	dir
}) => {
	const dispatch = useDispatch();

	const [ownValue, setValue] = useState("");
	useEffect(() => {
		if (value !== ownValue) {
			setValue(value);
		}
	}, [value]);
	const styles = {
		input: {
			marginRight: 48,
			width: "100%"
		},
		icon: {
			position: "relative",
			right: -48
		},
		filter: {
			minWidth: "auto",
			textTransform: "none",
			paddingLeft: 0,
			"&:hover": {
				backgroundColor: "transparent"
			}
		},
		inputRTL: {
			marginLeft: 48,
			width: "100%"
		},
		iconRTL: {
			position: "relative",
			left: -48,
			marginLeft: 0,
			marginRight: 8
		},
		filterRTL: {
			minWidth: "auto",
			textTransform: "none",
			paddingRight: 0,
			"&:hover": {
				backgroundColor: "transparent"
			}
		}
	};
	const filtered = Boolean(filters);
	return (
		<FormControl
			style={{ flexDirection: "row", maxHeight: 32 }}
			margin="normal"
			fullWidth={!filtered}
			disabled={disabled}
		>
			{label && <InputLabel>{label}</InputLabel>}
			<Input
				id={id}
				style={dir && dir == "rtl" ? styles.inputRTL : styles.input}
				value={ownValue}
				placeholder={placeholder}
				onChange={e => {
					handleSearch(e, handleChange, setValue);
				}}
				endAdornment={
					<InputAdornment style={dir && dir == "rtl" ? styles.iconRTL : styles.icon} position="end">
						<IconButton disabled={!ownValue} onClick={() => { setValue(""); handleClear(); }}>
							{ownValue ? <Cancel /> : <Search />}
						</IconButton>
					</InputAdornment>
				}
				autoComplete="off"
				autoFocus={autoFocus}
			/>
			{filtered && (
				<Button
					style={dir && dir == "rtl" ? styles.filterRTL : styles.filter}
					onClick={() => dispatch(handleClearFilters)}
					color="primary"
					disableFocusRipple
				>
					<Visibility style={dir && dir == "rtl" ? { paddingLeft: 6 } : { paddingRight: 6 }} />
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
