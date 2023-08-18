import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { SearchField } from "orion-components/CBComponents";
import {
	Popper,
	List,
	MenuItem,
	Paper,
	ClickAwayListener
} from "@mui/material";
import _ from "lodash";
import { Translate } from "orion-components/i18n";

const propTypes = {
	closeOnSelect: PropTypes.bool,
	id: PropTypes.string.isRequired,
	items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	placeholder: PropTypes.string,
	selected: PropTypes.array,
	handleSelect: PropTypes.func.isRequired,
	maxResults: PropTypes.number,
	dir: PropTypes.string
};

const defaultProps = {
	closeOnSelect: false,
	items: [],
	placeholder: "",
	selected: [],
	maxResults: 5
};

const SearchSelectField = ({
	id,
	closeOnSelect,
	handleSelect,
	items,
	placeholder,
	selected,
	maxResults,
	dir,
	noResultString
}) => {
	const [value, setValue] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [open, setOpen] = useState(false);
	const [width, setWidth] = useState(null);

	const handleChange = event => {
		const { value } = event.target;
		const field = document.getElementById(id).parentElement;
		setValue(value);
		setAnchorEl(field);
		setOpen(true);
		setWidth(field.offsetWidth);
		if (!_.size(value)) handleClose();
	};

	const handleClose = () => {
		setValue("");
		setAnchorEl(null);
		setOpen(false);
	};

	const handleSelectItem = id => {
		handleSelect(id);
		if (closeOnSelect) {
			handleClose();
		}
	};

	const results = [];

	Object.keys(items).some(key => {
		if (
			!_.includes(selected, key) &&
			items[key].searchString.toLowerCase().includes(value.toLowerCase())
		) {
			results.push({
				id: key,
				label: items[key].label
			});
		}
		return results.length >= maxResults;
	});

	return (
		<Fragment>
			<SearchField
				id={id}
				placeholder={placeholder}
				value={value}
				handleChange={handleChange}
				handleClear={handleClose}
				dir={dir}
			/>

			<Popper
				id={`${id}-results`}
				disablePortal
				open={open}
				anchorEl={anchorEl}
				style={{
					width,
					zIndex: 99
				}}
			>
				<ClickAwayListener onClickAway={handleClose}>
					<Paper>
						<List>
							{_.size(results) ? (
								_.map(results, result => (
									<MenuItem
										onClick={() => handleSelectItem(result.id)}
										key={result.id}
									>
										<span
											style={{
												overflow: "hidden",
												whiteSpace: "nowrap",
												textOverflow: "ellipsis"
											}}
										>
											{result.label}
										</span>
									</MenuItem>
								))
							) : (
								<MenuItem>
									<span style={{ margin: "auto" }}>{noResultString ? noResultString : <Translate value="global.CBComponents.CBSearchField.searchSelectField.noResults" />}</span>
								</MenuItem>
							)}
						</List>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</Fragment>
	);
};

SearchSelectField.propTypes = propTypes;
SearchSelectField.defaultProps = defaultProps;

export default SearchSelectField;
