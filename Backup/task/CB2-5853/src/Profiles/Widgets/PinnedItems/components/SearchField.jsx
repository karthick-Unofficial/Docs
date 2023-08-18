import React, { useEffect, useState } from "react";

import { TextField, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	underline: {
		"&:before": {
			borderBottom: "1px solid rgb(181, 185, 190)!important"
		},
		"&:after": {
			borderBottom: "1px solid #1688bd"
		}
	},
	input: {
		"&::placeholder": {
			color: "#fff",
			fontSize: "14px",
			fontWeight: "normal",
			opacity: 0.5
		}
	}
});

const SearchField = ({ handleClear, updateSearch, width, placeholder, autoFocus }) => {
	const classes = useStyles();
	const [value, setValue] = useState("");

	useEffect(() => {
		return () => {
			handleClearEvent();
		};
	}, []);

	const handleClearEvent = () => {
		handleClear();
		setValue("");
	};

	const handleSearch = (value) => {
		updateSearch(value);
		setValue(value);
	};

	return (
		<div className="search-field" style={{ marginTop: "15px" }}>
			<TextField
				id="search-field"
				placeholder={placeholder}
				onChange={(e) => {
					handleSearch(e.target.value);
				}}
				variant="standard"
				value={value}
				style={{
					backgroundColor: "transparent",
					width: width
				}}
				autoFocus={autoFocus}
				InputProps={{
					classes: {
						input: classes.input,
						underline: classes.underline
					}
				}}
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
