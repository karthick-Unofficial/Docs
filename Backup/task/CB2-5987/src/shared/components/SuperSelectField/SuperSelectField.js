import * as React from "react";
import { useState, useEffect } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Autocomplete from "@mui/material/Autocomplete";
import { IconButton, TextField, Paper } from "@mui/material";
import StyledInput from "./styledInput";
import PopperComponent from "./popper";
import StyledPopper from "./styledPopper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/styles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";

const StyledPaper = styled(Paper)(() => ({
	backgroundColor: "#fff"
}));

function PaperComponent(props) {
	const { ...other } = props;
	return <StyledPaper {...other} />;
}

const SuperSelectField = ({
	options,
	label,
	multiple,
	onChange,
	selectedValue,
	autoCompletePlaceHolder,
	onAutoCompleteTyping,
	dynamicSearch
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [value, setValue] = useState([]);
	const [pendingValue, setPendingValue] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [autocompleteOptions, setAutoCompleteOptions] = useState([]);
	const [toggleSelectAll, setToggleSelectAll] = useState(false);

	useEffect(() => {
		setAutoCompleteOptions(options);
		if (multiple) {
			const checkSelected = [];
			options.forEach((element) => {
				selectedValue.forEach((selVal) => {
					if (selVal.value === element.value) {
						checkSelected.push(element);
					}
				});
			});
			setValue(checkSelected);
		} else {
			setValue(selectedValue[0]);
		}
	}, [options]);

	const getLabels = () => selectedValue.map((data) => data.label);

	const handleClick = (event) => {
		setPendingValue(value);
		setAnchorEl(event.currentTarget);
		//if (dynamicSearch) {
		//	const filteredOptions = [options[0]];
		//	const merger = [...filteredOptions, ...selectedValue];
		//	setAutoCompleteOptions(merger);

		//}
	};

	const handleClose = () => {
		setValue(pendingValue);
		if (multiple) {
			onChange(pendingValue);
		}

		if (anchorEl) {
			anchorEl.focus();
		}
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "superSelectField" : undefined;

	useEffect(() => {
		if (toggleSelectAll) {
			setAutoCompleteOptions([options[0]]);
		} else {
			setAutoCompleteOptions(options);
		}
	}, [toggleSelectAll]);

	return (
		<React.Fragment>
			<TextField
				variant="standard"
				placeholder={label}
				onClick={handleClick}
				value={getLabels()}
				InputProps={{
					endAdornment: (
						<IconButton>
							<ArrowDropDownIcon style={{ color: "black" }} />
						</IconButton>
					),
					sx: {
						marginTop: "10px",
						"& input": {
							color: "black",
							width: "230px",
							cursor: "pointer"
						}
					}
				}}
			/>
			<StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
				<ClickAwayListener onClickAway={handleClose}>
					<div>
						<Autocomplete
							open
							multiple={multiple}
							value={pendingValue}
							onChange={(event, newValue) => {
								if (multiple) {
									setPendingValue(newValue);
								} else {
									setPendingValue(newValue);
									onChange(newValue);
									handleClose();
								}
							}}
							disableCloseOnSelect
							PaperComponent={PaperComponent}
							PopperComponent={PopperComponent}
							renderTags={() => null}
							noOptionsText={<div style={{ color: "black" }}>No match found</div>}
							renderOption={(props, option, { selected }) => (
								<li
									{...props}
									style={{
										color: selected ? "#4eb5f3" : "black"
									}}
									key={option.key}
								>
									{multiple ? (
										<div
											style={{ display: "flex" }}
											onClick={() => {
												if (option.key === "select_all") {
													setToggleSelectAll(!toggleSelectAll);
												}
											}}
										>
											<div style={{ flexBasis: "20%" }}>
												<CheckBoxOutlineBlankIcon
													style={{
														color: "#9F9F9F",
														display: selected ? "none" : "block",
														margin: "0px 10px"
													}}
												/>
												<CheckIcon
													style={{
														color: "#4DB4F1",
														display: !selected ? "none" : "block",
														margin: "0px 10px"
													}}
												/>
											</div>
											<div
												style={{
													color: selected ? "#4eb5f3" : "black",
													fontSize: "16px"
												}}
											>
												{option.label}
											</div>
										</div>
									) : (
										option.label
									)}
								</li>
							)}
							options={autocompleteOptions}
							getOptionLabel={(option) => option.label}
							renderInput={(params) => (
								<StyledInput
									ref={params.InputProps.ref}
									inputProps={params.inputProps}
									autoFocus
									value={searchValue}
									placeholder={autoCompletePlaceHolder}
									onChange={(e) => {
										setSearchValue(e.target.value);
										if (dynamicSearch) {
											onAutoCompleteTyping(e.target.value);
										}
									}}
								/>
							)}
						/>
					</div>
				</ClickAwayListener>
			</StyledPopper>
		</React.Fragment>
	);
};

export default SuperSelectField;
