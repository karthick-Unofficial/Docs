import React, { Fragment, memo, useState, useEffect } from "react";
import { cameraGroupService } from "client-app-core";
import PropTypes from "prop-types";
import { SearchField as CBSearchField } from "orion-components/CBComponents";
import {
	ClickAwayListener,
	List,
	ListItem,
	ListItemText,
	Paper,
	Popper
} from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const uniqueArray = array => Array.from(new Set(array));

const propTypes = {
	stageItem: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const SearchField = ({ stageItem, dir }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [width, setWidth] = useState(0);
	const [recentItems, setRecentItems] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [results, setResults] = useState([]);

	useEffect(() => {
		if (searchValue === "") {
			setResults([]);
		}
		else {
			cameraGroupService.searchForPinning(searchValue, (err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else if (response) {
					setResults(response);
				}
			});
		}
		
		return () => {
			setResults([]);
		};
	}, [searchValue]);

	const handleChange = e => {
		const field = document.getElementById("search-field-wrapper");
		setSearchValue(e.target.value);
		setAnchorEl(field);
		setWidth(field.offsetWidth);
	};
	const handleClose = () => {
		setSearchValue("");
		setAnchorEl(null);
	};
	const handleSelect = result => {
		const newItems = uniqueArray([result, ...recentItems].slice(0, 5));
		setRecentItems(newItems);
		stageItem(result);
		handleClose();
	};
	const types = uniqueArray(results.map(result => result.type));
	const placeholderTxt = renderToStaticMarkup(<Translate value="listPanel.searchField.search"/>);
	let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
	return (
		<div id="search-field-wrapper">
			<CBSearchField
				value={searchValue}
				placeholder={placeholderString}
				handleChange={handleChange}
				handleClear={handleClose}
				dir={dir}
			/>
			<Popper
				open={!!anchorEl}
				anchorEl={anchorEl}
				style={{
					zIndex: 99,
					width
				}}
			>
				<ClickAwayListener onClickAway={handleClose}>
					<Paper
						style={{
							backgroundColor: "#242426",
							backfaceVisibility: "hidden", // Fixes blurry text in Chrome
							borderRadius: 0
						}}
					>
						<List>
							{!!recentItems.length && (
								<Fragment>
									<ListItem style={{ paddingBottom: 0 }}>
										<ListItemText
											primary={<Translate value="listPanel.searchField.recentlySelected"/>}
											primaryTypographyProps={{ variant: "body1" }}
										/>
									</ListItem>
									<List>
										{recentItems.map(item => {
											return (
												<ListItem
													style={{ paddingTop: 2, paddingBottom: 2 }}
													dense
													button
													key={item.id}
													onClick={() => handleSelect(item)}
												>
													<ListItemText
														primary={item.name}
														primaryTypographyProps={{
															variant: "caption"
														}}
													/>
												</ListItem>
											);
										})}
									</List>
								</Fragment>
							)}
							{results.length ? (
								types.map(type => {
									return (
										<Fragment key={type}>
											<ListItem
												style={{
													paddingBottom: 0
												}}
											>
												<ListItemText
													primary={type}
													primaryTypographyProps={{ variant: "body1" }}
												/>
											</ListItem>
											<List>
												{results
													.filter(result => result.type === type)
													.map(result => {
														return (
															<ListItem
																style={{ paddingTop: 2, paddingBottom: 2 }}
																dense
																button
																key={result.id}
																onClick={() => handleSelect(result)}
															>
																<ListItemText
																	primary={result.name}
																	primaryTypographyProps={{
																		variant: "caption"
																	}}
																/>
															</ListItem>
														);
													})}
											</List>
										</Fragment>
									);
								})
							) : (
								<ListItem>
									<ListItemText
										primary={<Translate value="listPanel.searchField.noResults"/>}
										primaryTypographyProps={{
											align: "center",
											variant: "overline"
										}}
									/>
								</ListItem>
							)}
						</List>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</div>
	);
};

SearchField.propTypes = propTypes;

export default memo(SearchField);
