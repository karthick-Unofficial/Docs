import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { Check as Confirm, Close as Cancel } from "@material-ui/icons";

const propTypes = {
	handleCancel: PropTypes.func.isRequired,
	handleConfirm: PropTypes.func.isRequired
};

const SaveCancel = ({ handleCancel, handleConfirm, disabled }) => {
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
				style={disabled ? {
					backgroundColor: "#4CAF50",
					color: "#FFF",
					opacity: 0.4
				} : {
					backgroundColor: "#4CAF50",
					color: "#FFF"
				}}
				onClick={handleConfirm}
				disabled={disabled}
			>
				<Confirm />
			</Fab>
		</Fragment>
	);
};

SaveCancel.propTypes = propTypes;

export default SaveCancel;
