import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";

const EntityDelete = ({ closeDialog, name, id, deleteShape }) => {
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");

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
			open={dialog === "shapeDeleteDialog"}
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
