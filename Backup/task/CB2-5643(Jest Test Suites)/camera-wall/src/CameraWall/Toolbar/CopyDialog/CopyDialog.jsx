import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField } from "orion-components/CBComponents";
//import { withWidth } from "@material-ui/core";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { closeDialog, createGroup } from "./copyDialogActions";

const propTypes = {
	width: PropTypes.string.isRequired
};

const defaultProps = { open: false };

const CopyDialog = ({ width }) => {
	const open = useSelector((state) => state.appState.dialog.openDialog === "copy-dialog");
	const dir = useSelector((state) => getDir(state));
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const handleChange = (e) => {
		setName(e.target.value);
	};
	const handleClose = () => {
		dispatch(closeDialog("copy-dialog"));
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
				label: getTranslation("cameraWall.toolBar.copyDialog.create"),
				action: handleSave,
				disabled: !name.length
			}}
			abort={{
				label: getTranslation("cameraWall.toolBar.copyDialog.cancel"),
				action: handleClose
			}}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					handleChange={handleChange}
					id="new-group-name"
					label={getTranslation("cameraWall.toolBar.copyDialog.fieldLabel.cameraGroup")}
					value={name}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};

CopyDialog.propTypes = propTypes;
CopyDialog.defaultProps = defaultProps;

export default CopyDialog;
