import React, { memo } from "react";
import PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
import { default as AssignmentForm } from "./AssignmentForm/AssignmentFormContainer";
import { useMediaQuery } from "@material-ui/core";

const propTypes = {
	closeEventForm: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired
};

const FormPanel = ({ closeEventForm, open }) => {
	const handleClose = () => {
		closeEventForm();
	};
	const mobile = useMediaQuery("(max-width:700px)");
	return (
		<Drawer
			open={open}
			anchor="right"
			style={{
				width: mobile ? "100%" : 700,
				flexShrink: 0
			}}
			PaperProps={{
				style: {
					width: mobile ? "100%" : 700,
					height: "calc(100vh - 48px)",
					top: 48
				}
			}}
		>
			{open && <AssignmentForm handleClose={handleClose} />}
		</Drawer>
	);
};

FormPanel.propTypes = propTypes;

export default memo(FormPanel);
