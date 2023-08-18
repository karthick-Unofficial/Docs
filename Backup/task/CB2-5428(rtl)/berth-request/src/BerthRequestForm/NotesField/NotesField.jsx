import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	updateNotes: PropTypes.func.isRequired,
	notes: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {

};

const NotesField = ({
	updateNotes,
	notes,
	dir
}) => {

	const handleNotesChanged = e => {
		updateNotes(e.target.value);
	};

	const styles = {
		textField: {
			...(dir === "rtl" && { margin: "16px 16px 16px 35px", flexGrow: 1 }),
			...(dir === "ltr" && { margin: "16px 35px 16px 16px", flexGrow: 1 })
		}
	};

	return (
		<Fragment>
			<TextField
				style={styles.textField}
				id="notes"
				key="notes"
				label={getTranslation("berthRequestForm.notesField.fieldLabel.additionalInfo")}
				value={notes}
				onChange={handleNotesChanged}
				multiline
				rows={8}
				variant="outlined"
			/>
		</Fragment>
	);
};

NotesField.propTypes = propTypes;
NotesField.defaultProps = defaultProps;

export default memo(NotesField);
