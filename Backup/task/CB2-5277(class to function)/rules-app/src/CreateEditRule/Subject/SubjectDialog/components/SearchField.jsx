import React, { useRef } from "react";

import { TextField, IconButton } from "material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const SearchField = ({ updateSearch, width, searchValue }) => {
	const typeaheadRef = useRef(null);
	const eraseInputValue = () => {
		typeaheadRef.input.value = "";
		updateSearch("");
	};

	const handleSearch = value => {
		updateSearch(value);
	};


	return (
		<div className="search-field">
			<TextField
				id="search-field"
				ref={typeaheadRef}
				placeholder={getTranslation("createEditRule.subject.subjectDialog.searchField.searchTracks")}
				onChange={e => {
					handleSearch(e.target.value);
				}}
				style={{
					backgroundColor: "transparent",
					width: width
				}}
				underlineStyle={{
					borderColor: "#41454A"
				}}
				autoFocus={true}
			/>

			{searchValue !== "" ? (
				<IconButton onClick={eraseInputValue}>
					<i className="material-icons">cancel</i>
				</IconButton>
			) : (
				<i className="material-icons">search</i>
			)}
		</div>
	);
};

export default SearchField;
