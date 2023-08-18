import React from "react";
import { TextField } from "orion-components/CBComponents";
import { IconButton } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";

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
