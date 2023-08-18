import React from "react";

// Material UI
import { Button, Dialog } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";

const EntityShare = ({ handleClick, handleClose, shared }) => {
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");

	const actions = [
		<Button variant="text" color="primary" onClick={handleClick} key="share-action-button">
			{shared
				? getTranslation("global.profiles.entityProfile.entityShare.unshare")
				: getTranslation("global.profiles.entityProfile.entityShare.share")}
		</Button>,
		<Button variant="text" color="primary" onClick={handleClose} key="cancel-action-button">
			{getTranslation("global.profiles.entityProfile.entityShare.cancel")}
		</Button>
	];
	return (
		<Dialog actions={actions} className="share-dialog" open={dialog === "shareEntityDialog"} onRequestClose={handleClose}>
			<p>
				{shared ? (
					<Translate value="global.profiles.entityProfile.entityShare.unshareEntity" />
				) : (
					<Translate value="global.profiles.entityProfile.entityShare.confirmationText" />
				)}
			</p>
		</Dialog>
	);
};

export default EntityShare;
