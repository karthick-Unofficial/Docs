import React, { useState } from "react";

import { TextField, IconButton } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import {useStyles} from "../../../../shared/styles/overrides";


const SearchField = ({ updateSearch, width, searchValue }) => {
	const dispatch = useDispatch();

	const [search, setSearch] = useState("");
	const classes = useStyles();

	const eraseInputValue = () => {
		setSearch("");
		dispatch(updateSearch(""));
	};

	const handleSearch = value => {
		setSearch(value);
		dispatch(updateSearch(value));
	};


	return (
		<div className="search-field">
			<TextField
				id="search-field"
				value={search}
				placeholder={getTranslation("createEditRule.subject.subjectDialog.searchField.searchTracks")}
				onChange={e => {
					handleSearch(e.target.value);
				}}
				style={{
					backgroundColor: "transparent",
					width: width
				}}
				autoFocus={true}
				variant="standard"
				InputProps={{ classes: { input: classes.input, underline: classes.underline } }}
			/>

			{searchValue !== "" ? (
				<IconButton onClick={eraseInputValue} style={{ background: "none" }}>
					<i className="material-icons">cancel</i>
				</IconButton>
			) : (
				<i className="material-icons">search</i>
			)}
		</div>
	);
};

export default SearchField;
