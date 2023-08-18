import React from "react";
import { TextField } from "orion-components/CBComponents";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";

const AddField = ({
	id,
	label,
	value,
	handleChange,
	handleSubmit,
	error,
	errorMessage,
	dir
}) => {
	const styles = {
		button: {
			color: "#35b7f3",
			backgroundColor: "#fff",
			borderRadius: "100%"
		}
	};
	return (
		<TextField
			id={id}
			label={label}
			value={value}
			error={error}
			helperText={errorMessage}
			handleChange={handleChange}
			endAdornment={
				<IconButton disabled={!value} onClick={handleSubmit}>
					<AddCircle style={!value ? {} : styles.button} />
				</IconButton>
			}
			dir={dir}
		/>
	);
};

export default AddField;
