import React, { useState, useRef, useEffect } from "react";
import {
	IconButton,
	Input,
	InputAdornment,
	FormControl
} from "@mui/material";
import { Search, Cancel } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { searchUpdated } from "./cardSearchFieldActions";


const CardSearchField = () => {

	const dispatch = useDispatch();

	const primaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.primaryOpen);
	const dir = useSelector(state => getDir(state));

	const inputEl = useRef(null);
	const [value, setValue] = useState("");

	const handleSearch = e => {
		setValue(e.target.value);
		dispatch(searchUpdated(e.target.value));
	};

	const styles = {
		// List panel open
		wide: {
			...(dir === "rtl" && { right: "400px" }),
			...(dir === "ltr" && { left: "400px" })
		},
		// List panel closed
		narrow: {
			...(dir === "rtl" && { right: "100px" }),
			...(dir === "ltr" && { left: "100px" })
		},
		input: {
			color: "#FFF",
			width: "100%",
			...(dir === "rtl" && { marginLeft: 48 }),
			...(dir === "ltr" && { marginRight: 48 })
		},
		icon: {
			position: "relative",
			...(dir === "rtl" && { left: -48 }),
			...(dir === "ltr" && { right: -48 })
		}
	};

	return (
		<div
			key={"card-search-container"}
			style={{
				position: "absolute",
				width: "20%",
				...((primaryOpen ? styles.wide : styles.narrow))
			}}
		>
			<FormControl
				style={{ flexDirection: "row", maxHeight: 32 }}
				margin="normal"
				fullWidth={true}
			>
				<Input
					inputRef={inputEl}
					id={"status-card-search-input"}
					style={styles.input}
					value={value}
					placeholder={getTranslation("searchField.searchStatusCard")}
					onChange={handleSearch}
					endAdornment={
						<InputAdornment style={styles.icon} position="end">
							<IconButton disabled={value.length === 0} onClick={() => { setValue(""); dispatch(searchUpdated("")) }}>
								{value.length > 0 ? <Cancel /> : <Search />}
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>
		</div>
	);
};

export default CardSearchField;