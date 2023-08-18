import React, { Component, Fragment } from "react";
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

class SearchSelectField extends Component {
	constructor(props) {
		super(props);
		this.state = { value: "", anchorEl: null, open: false, width: null };
	}
	handleChange = event => {
		const { id } = this.props;
		const { value } = event.target;
		const field = document.getElementById(id).parentElement;
		this.setState({
			value: value,
			anchorEl: field,
			open: true,
			width: field.offsetWidth
		});
		if (!_.size(value)) this.handleClose();
	};

	handleClose = () => {
		this.setState({ value: "", anchorEl: null, open: false });
	};
	handleSelectItem = id => {
		const { closeOnSelect, handleSelect } = this.props;
		handleSelect(id);
		if (closeOnSelect) {
			this.handleClose();
		}
	};

	render() {
		const { id, items, placeholder, selected, maxResults, dir, noResultString } = this.props;
		const { value, anchorEl, open, width } = this.state;
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
					handleChange={this.handleChange}
					handleClear={this.handleClose}
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
					<ClickAwayListener onClickAway={this.handleClose}>
						<Paper>
							<List>
								{_.size(results) ? (
									_.map(results, result => (
										<MenuItem
											onClick={() => this.handleSelectItem(result.id)}
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
										<span style={{ margin: "auto" }}>{noResultString ? noResultString : <Translate value="global.CBComponents.CBSearchField.searchSelectField.noResults"/>}</span>
									</MenuItem>
								)}
							</List>
						</Paper>
					</ClickAwayListener>
				</Popper>
			</Fragment>
		);
	}
}

SearchSelectField.propTypes = propTypes;
SearchSelectField.defaultProps = defaultProps;

export default SearchSelectField;
