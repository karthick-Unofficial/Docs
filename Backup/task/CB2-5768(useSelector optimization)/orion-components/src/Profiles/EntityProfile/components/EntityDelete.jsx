import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const EntityDelete = ({ closeDialog, name, id, deleteShape, open }) => {
	const dispatch = useDispatch();

	const handleClose = () => {
		dispatch(closeDialog("shapeDeleteDialog"));
	};

	const handleConfirmDelete = () => {
		dispatch(deleteShape(id, name));
		handleClose();
	};

	const actions = [
		<Button variant="text" color="primary" onClick={handleClose} key="cancel-action-button">
			{getTranslation("global.profiles.entityProfile.entityDelete.cancel")}
		</Button>,
		<Button variant="text" color="primary" onClick={handleConfirmDelete} key="delete-action-button">
			{getTranslation("global.profiles.entityProfile.entityDelete.delete")}
		</Button>
	];

	return (
		<Dialog
			open={open}
			sx={{
				padding: "24px"
			}}
			onRequestClose={handleClose}
		>
			<DialogContent
				sx={{
					maxWidth: "500px",
					color: "#fff"
				}}
			>
				<div className="dialog-first-section">
					<Translate value="global.profiles.entityProfile.entityDelete.confirmationText" />
				</div>
			</DialogContent>

			<DialogActions>{actions}</DialogActions>
		</Dialog>
	);
};

export default EntityDelete;
