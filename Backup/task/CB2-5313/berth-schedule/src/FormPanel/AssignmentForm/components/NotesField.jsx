import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { Typography, TextField } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { makeStyles } from "@mui/styles";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	notes: PropTypes.string,
	dir: PropTypes.string
};



const useStyles = makeStyles({
	root: {
		"& .MuiFormLabel-root": {
			transform: "translate(-14px, 20px) scale(1)",
			left: "unset"
		},
		"& .MuiInputLabel-shrink": {
			transform: "translate(6px, -6px) scale(0.75)!important"
		},
		"& .MuiOutlinedInput-notchedOutline": {
			"& legend": {
				textAlign: "right"
			}
		}
	},
	notchedOutline: {
		borderColor: "rgba(255, 255, 255, 0.23)"
	}
});

const NotesField = ({
	handleChange,
	notes,
	dir
}) => {
	const classes = useStyles();
	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				<Translate value="formPanel.notes.title" />
			</Typography>
			<TextField
				style={{ margin: 16 }}
				id="notes"
				key="notes"
				label={getTranslation("formPanel.notes.fieldLabel.additionalInfo")}
				value={notes}
				onChange={handleChange("notes")}
				multiline
				rows={8}
				variant="outlined"
				InputProps={{
					sx: {
						textAlign: "unset",
						fontSize: "14px",
						color: "#fff",
						lineHeight: "unset",
						"&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
							borderColor: "#fff"
						}
					},
					classes: {
						notchedOutline: classes.notchedOutline
					}
				}}
				InputLabelProps={{
					style: {
						textAlign: "unset",
						fontSize: 14,
						color: "#B5B9BE"
					}
				}}
				inputProps={{
					style: {
						height: "auto"
					}
				}}
				classes={dir && dir == "rtl" ? classes : {}}
			/>
		</Fragment>
	);
};

NotesField.propTypes = propTypes;


export default memo(NotesField);
