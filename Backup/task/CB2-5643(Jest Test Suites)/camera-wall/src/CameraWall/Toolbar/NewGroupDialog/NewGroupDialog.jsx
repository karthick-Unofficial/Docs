import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField } from "orion-components/CBComponents";
//import { withWidth } from "@material-ui/core";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { closeDialog, createGroup } from "./newGroupDialogActions";

const propTypes = {
	width: PropTypes.string.isRequired
};

const NewGroupDialog = ({ width }) => {
	const open = useSelector((state) => state.appState.dialog.openDialog === "new-group-dialog");
	const dir = useSelector((state) => getDir(state));
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const handleChange = (e) => {
		setName(e.target.value);
	};
	const handleClose = () => {
		dispatch(closeDialog("new-group-dialog"));
		setName("");
	};
	const handleSave = () => {
		dispatch(createGroup(name));
		handleClose();
	};
	return (
		<Dialog
			open={open}
			confirm={{
				label: getTranslation("cameraWall.toolBar.newGroupDialog.save"),
				action: handleSave,
				disabled: !name.length
			}}
			abort={{
				label: getTranslation("cameraWall.toolBar.newGroupDialog.cancel"),
				action: handleClose
			}}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					handleChange={handleChange}
					id="new-group-name"
					label={getTranslation("cameraWall.toolBar.newGroupDialog.fieldLabel.cameraGroup")}
					value={name}
					autoFocus={true}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};

NewGroupDialog.propTypes = propTypes;

export default NewGroupDialog;
