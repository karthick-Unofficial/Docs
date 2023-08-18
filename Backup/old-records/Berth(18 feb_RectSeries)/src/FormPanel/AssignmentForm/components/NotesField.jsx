import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { Typography, TextField } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { makeStyles } from "@material-ui/styles";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	notes: PropTypes.string,
	dir: PropTypes.string,
	classes: PropTypes.object
};

const defaultProps = {

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
					style: {
						textAlign: (dir && dir == "rtl" ? "right" : "left")
					}
				}}
				InputLabelProps={{
					style: {
						textAlign: (dir && dir == "rtl" ? "right" : "left")
					}
				}}
				classes={dir && dir == "rtl" ? classes : {}}
			/>
		</Fragment>
	);
};

NotesField.propTypes = propTypes;
NotesField.defaultProps = defaultProps;

export default memo(NotesField);
