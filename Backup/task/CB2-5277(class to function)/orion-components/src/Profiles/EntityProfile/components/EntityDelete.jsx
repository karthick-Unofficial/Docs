import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const EntityDelete = ({
	closeDialog,
	name,
	id,
	deleteShape,
	open
}) => {

	const handleClose = () => {
		closeDialog("shapeDeleteDialog");
	};

	const handleConfirmDelete = () => {
		deleteShape(id, name);
		handleClose();
	};

	const actions = [
		<FlatButton label={getTranslation("global.profiles.entityProfile.entityDelete.cancel")} onClick={handleClose} secondary={true} />,
		<FlatButton
			label={getTranslation("global.profiles.entityProfile.entityDelete.delete")}
			onClick={handleConfirmDelete}
			keyboardFocused={true}
			primary={true}
		/>
	];

	return (
		<Dialog
			actions={actions}
			open={open}
			bodyStyle={{
				padding: "24px"
			}}
			contentStyle={{
				maxWidth: "500px"
			}}
			onRequestClose={handleClose}
		>
			<div className="dialog-first-section">
				<Translate value="global.profiles.entityProfile.entityDelete.confirmationText" />
			</div>
		</Dialog>
	);
};

export default EntityDelete;
