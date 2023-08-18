import React, {Fragment, useState } from "react";
import PropTypes from "prop-types";
import { SearchField } from "orion-components/CBComponents";
import {
	Popper,
	List,
	MenuItem,
	Paper,
	ClickAwayListener
} from "@material-ui/core";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	closeOnSelect: PropTypes.bool,
	id: PropTypes.string.isRequired,
	items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	placeholder: PropTypes.string,
	selected: PropTypes.string,
	handleSelect: PropTypes.func.isRequired,
	clearSelected: PropTypes.func.isRequired,
	queryTypeahead: PropTypes.func.isRequired,
	updateState: PropTypes.func,
	maxResults: PropTypes.number,
	disabled: PropTypes.bool,
	clearOnClickAway: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	closeOnSelect: false,
	items: [],
	placeholder: "",
	selected: "",
	maxResults: 5,
	disabled: false,
	handleSelect: () => { },
	clearSelected: () => { },
	queryTypeahead: () => { },
	updateState: () => { },
	clearOnClickAway: false
};

const Typeahead = ({ id,
	queryTypeahead,
	updateState,
	clearOnClickAway,
	clearSelected,
	closeOnSelect,
	handleSelect,
	items, 
	placeholder, 
	selected, 
	maxResults, 
	disabled, 
	dir
}) => {
	const [value, setValue] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [open, setOpen] = useState(false);
	const [width, setWidth] = useState(null);

	const handleChange = event => {
		const { value } = event.target;
		const field = document.getElementById(id).parentElement;
		setAnchorEl(field);
		setOpen(true);
		setWidth(field.offsetWidth);
		queryTypeahead(value);
		updateState(event);
		if (!_.size(value)) { handleClose(); }
	};

	const handleClose = () => {
		if (clearOnClickAway) {
			clearSelected();
		}
		setAnchorEl(null);
		setOpen(false);
	};

	const handleClear = () => {
		clearSelected();
		setValue("");
		setAnchorEl(null);
		setOpen(false);
	};

	const handleSelectItem = (id, label, data) => {
		setValue("");
		handleSelect(data);

		if (clearOnClickAway) {
			setAnchorEl(null);
			setOpen(false);
		}
		else if (closeOnSelect) {
			handleClose();
		}
	};
	const results = [];

	Object.keys(items).some(key => {
		if (items[key].searchString.toLowerCase().includes(value.toLowerCase())) {
			results.push({
				id: key,
				label: items[key].label,
				fullData: items[key].fullData
			});
		}
		return results.length >= maxResults;
	});

	return (
		<Fragment>
			<SearchField
				id={id}
				placeholder={placeholder}
				value={selected || value}
				handleChange={handleChange}
				handleClear={handleClear}
				disabled={disabled}
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
										onClick={() => handleSelectItem(result.id, result.label, result.fullData)}
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
									<span style={{ margin: "auto" }}><Translate value="berthRequestForm.typeAhead.noResults" /></span>
								</MenuItem>
							)}
						</List>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</Fragment>
	);
};

Typeahead.propTypes = propTypes;
Typeahead.defaultProps = defaultProps;

export default Typeahead;
