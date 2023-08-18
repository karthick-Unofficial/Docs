import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { getTranslation } from "orion-components/i18n/I18nContainer";

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

	return (
		<Fragment>
			<TextField
				style={dir == "rtl" ? { margin: "16px 16px 16px 35px", flexGrow: 1 } : { margin: "16px 35px 16px 16px", flexGrow: 1 }}
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
