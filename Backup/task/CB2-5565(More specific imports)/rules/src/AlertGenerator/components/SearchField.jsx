import React, { useState } from "react";

import { TextField, IconButton } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import {useStyles} from "../../shared/styles/overrides";

const SearchField = ({ updateSearch, width, searchValue }) => {
	const classes = useStyles();

	const [search, setSearch] = useState("");
	const eraseInputValue = () => {
		setSearch("");
		updateSearch("");
	};

	const handleSearch = value => {
		setSearch(value);
		updateSearch(value);
	};


	return (
		<div className="search-field">
			<TextField
				id="search-field"
				value={search}
				placeholder={getTranslation("alertGenerator.searchField.search")}
				onChange={e => {
					handleSearch(e.target.value);
				}}
				style={{
					backgroundColor: "transparent",
					width: width
				}}
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
