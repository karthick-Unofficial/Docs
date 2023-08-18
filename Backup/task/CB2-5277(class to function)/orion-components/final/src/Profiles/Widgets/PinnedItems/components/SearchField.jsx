import React, { useEffect, useState } from "react";

import { TextField, IconButton } from "@material-ui/core";

const SearchField = ({
	handleClear,
	updateSearch,
	width,
	placeholder,
	autoFocus
}) => {
	const [value, setValue] = useState("");

	useEffect(() => {
		handleClearEvent();
	}, []);

	const handleClearEvent = () => {
		handleClear();
		setValue("");
	};

	const handleSearch = value => {
		updateSearch(value);
		setValue(value);
	};

	return (
		<div className="search-field" style={{ marginTop: "15px" }}>
			<TextField
				id="search-field"
				placeholder={placeholder}
				onChange={e => {
					handleSearch(e.target.value);
				}}
				value={value}
				style={{
					backgroundColor: "transparent",
					width: width
				}}
				autoFocus={autoFocus}
			/>

			{value !== "" ? (
				<IconButton
					style={{
						color: "white"
					}}
					onClick={handleClearEvent}
				>
					<i className="material-icons">cancel</i>
				</IconButton>
			) : (
				<i className="material-icons">search</i>
			)}
		</div>
	);
};
export default SearchField;
