import React from "react";

// Material UI
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { Translate, getTranslation } from "orion-components/i18n";

const EntityShare = ({ handleClick, handleClose, shared, open }) => {

	const actions = [
		<FlatButton
			label={shared ? getTranslation("global.profiles.entityProfile.entityShare.unshare") : getTranslation("global.profiles.entityProfile.entityShare.share")}
			primary={true}
			keyboardFocused={true}
			onClick={handleClick}
		/>,
		<FlatButton
			label={getTranslation("global.profiles.entityProfile.entityShare.cancel")}
			primary={true}
			onClick={handleClose}
		/>
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
