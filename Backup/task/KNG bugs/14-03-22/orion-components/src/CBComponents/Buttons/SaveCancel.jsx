import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { Check as Confirm, Close as Cancel } from "@material-ui/icons";

const propTypes = {
	handleCancel: PropTypes.func.isRequired,
	handleConfirm: PropTypes.func.isRequired
};

const SaveCancel = ({ handleCancel, handleConfirm }) => {
	return (
		<Fragment>
			<Fab
				size="small"
				style={{
					backgroundColor: "#E85858",
					color: "#FFF",
					bottom: 24
				}}
				onClick={handleCancel}
			>
				<Cancel />
			</Fab>
			<Fab
				style={{
					backgroundColor: "#4CAF50",
					color: "#FFF"
				}}
				onClick={handleConfirm}
			>
				<Confirm />
			</Fab>
		</Fragment>
	);
};

SaveCancel.propTypes = propTypes;

export default SaveCancel;
