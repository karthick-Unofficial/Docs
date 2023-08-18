import React, { Fragment, memo, useState, useEffect } from "react";
import { cameraGroupService } from "client-app-core";
import PropTypes from "prop-types";
import { SearchField as CBSearchField } from "orion-components/CBComponents";
import { ClickAwayListener, List, ListItem, ListItemText, Paper, Popper } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { stageItem } from "./searchFieldActions";

const uniqueArray = (array) => Array.from(new Set(array));

const propTypes = {
	dir: PropTypes.string
};

const SearchField = () => {
	const dir = useSelector((state) => getDir(state));

	const [anchorEl, setAnchorEl] = useState(null);
	const [width, setWidth] = useState(0);
	const [recentItems, setRecentItems] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [results, setResults] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (searchValue === "") {
			setResults([]);
		} else {
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

	const handleChange = (e) => {
		const field = document.getElementById("search-field-wrapper");
		setSearchValue(e.target.value);
		setAnchorEl(field);
		setWidth(field.offsetWidth);
	};
	const handleClose = () => {
		setSearchValue("");
		setAnchorEl(null);
	};
	const handleSelect = (result) => {
		const newItems = uniqueArray([result, ...recentItems].slice(0, 5));
		setRecentItems(newItems);
		dispatch(stageItem(result));
		handleClose();
	};
	const types = uniqueArray(results.map((result) => result.type));
	const placeholderTxt = getTranslation("listPanel.searchField.search");

	const styles = {
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	return (
		<div id="search-field-wrapper">
			<CBSearchField
				value={searchValue}
				placeholder={placeholderTxt}
				handleChange={handleChange}
				handleClear={handleClose}
				dir={dir}
			/>
			<Popper
				open={!!anchorEl}
				anchorEl={anchorEl}
				sx={{
					zIndex: 99,
					width
				}}
			>
				<ClickAwayListener onClickAway={handleClose}>
					<Paper
						sx={{
							backgroundColor: "#242426",
							backfaceVisibility: "hidden", // Fixes blurry text in Chrome
							borderRadius: 0
						}}
					>
						<List>
							{!!recentItems.length && (
								<Fragment>
									<ListItem sx={{ paddingBottom: 0 }}>
										<ListItemText
											primary={getTranslation("listPanel.searchField.recentlySelected")}
											primaryTypographyProps={{
												variant: "body1"
											}}
											sx={styles.textAlignRight}
										/>
									</ListItem>
									<List>
										{recentItems.map((item) => {
											return (
												<ListItem
													sx={{
														paddingTop: 2,
														paddingBottom: 2
													}}
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
														sx={styles.textAlignRight}
													/>
												</ListItem>
											);
										})}
									</List>
								</Fragment>
							)}
							{results.length ? (
								types.map((type) => {
									return (
										<Fragment key={type}>
											<ListItem
												sx={{
													paddingBottom: 0
												}}
											>
												<ListItemText
													primary={type}
													primaryTypographyProps={{
														variant: "body1"
													}}
													sx={styles.textAlignRight}
												/>
											</ListItem>
											<List>
												{results
													.filter((result) => result.type === type)
													.map((result) => {
														return (
															<ListItem
																sx={{
																	paddingTop: 2,
																	paddingBottom: 2
																}}
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
																	sx={styles.textAlignRight}
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
										primary={getTranslation("listPanel.searchField.noResults")}
										primaryTypographyProps={{
											align: "center",
											variant: "overline"
										}}
										sx={{
											...styles.textAlignRight,
											color: "#fff"
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
