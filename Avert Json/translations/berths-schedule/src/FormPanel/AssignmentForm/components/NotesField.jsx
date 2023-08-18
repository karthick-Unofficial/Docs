import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { Typography, TextField } from "@material-ui/core";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	notes: PropTypes.string
};

const defaultProps = {

};

const NotesField = ({
	handleChange,
	notes
}) => {

	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				Additional Information
			</Typography>
			<TextField
				style={{ margin: 16 }}
				id="notes"
				key="notes"
				label="Additional Information"
				value={notes}
				onChange={handleChange("notes")}
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
