import React from "react";

// Material UI
import { Button, Dialog } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";

const EntityShare = ({ handleClick, handleClose, shared, open }) => {

	const actions = [
		<Button
			variant="text"
			color="primary"
			onClick={handleClick}
		>
			{shared ? getTranslation("global.profiles.entityProfile.entityShare.unshare") : getTranslation("global.profiles.entityProfile.entityShare.share")}
		</Button>,
		<Button
			variant="text"
			color="primary"
			onClick={handleClose}
		>
			{getTranslation("global.profiles.entityProfile.entityShare.cancel")}
		</Button>
	];
	return (
		<Dialog
			actions={actions}
			className="share-dialog"
			open={open}
			onRequestClose={handleClose}
		>
			<p>
				{shared
					? <Translate value="global.profiles.entityProfile.entityShare.unshareEntity" />
					: <Translate value="global.profiles.entityProfile.entityShare.confirmationText" />}
			</p>
		</Dialog>
	);
};

export default EntityShare;
