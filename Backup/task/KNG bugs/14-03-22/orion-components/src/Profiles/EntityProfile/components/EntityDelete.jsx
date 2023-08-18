import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

export default class EntityDelete extends Component {
	handleClose = () => {
		const { closeDialog } = this.props;

		closeDialog("shapeDeleteDialog");
	};

	handleConfirmDelete = () => {
		const { name, id, deleteShape } = this.props;

		deleteShape(id, name);

		this.handleClose();
	};

	render() {
		const { open } = this.props;

		const actions = [
			<FlatButton label={getTranslation("global.profiles.entityProfile.entityDelete.cancel")} onClick={this.handleClose} secondary={true} />,
			<FlatButton
				label={getTranslation("global.profiles.entityProfile.entityDelete.delete")}
				onClick={this.handleConfirmDelete}
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
				onRequestClose={this.handleClose}
			>
				<div className="dialog-first-section">
					<Translate value="global.profiles.entityProfile.entityDelete.confirmationText"/>
				</div>
			</Dialog>
		);
	}
}
