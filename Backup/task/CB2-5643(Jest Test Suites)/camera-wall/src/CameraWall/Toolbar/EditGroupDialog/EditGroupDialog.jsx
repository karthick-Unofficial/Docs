import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField } from "orion-components/CBComponents";
//import { withWidth } from "@material-ui/core";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { closeDialog, deleteGroup, updateGroup } from "./editGroupDialogActions";

const propTypes = {
	id: PropTypes.string.isRequired,
	width: PropTypes.string.isRequired
};

const EditGroupDialog = ({ id, width }) => {
	const open = useSelector((state) => state.appState.dialog.openDialog === "edit-group-dialog");
	const { selectedGroup } = useSelector((state) => state.appState.persisted);
	const dir = useSelector((state) => getDir(state));

	const [name, setName] = useState(selectedGroup.name);
	const dispatch = useDispatch();

	useEffect(() => {
		setName(selectedGroup.name);
	}, [selectedGroup]);

	const handleChange = (e) => {
		setName(e.target.value);
	};
	const handleClose = () => {
		dispatch(closeDialog("edit-group-dialog"));
	};
	const handleConfirmDelete = () => {
		dispatch(deleteGroup(id));
		handleClose();
	};
	const handleUpdate = () => {
		dispatch(updateGroup(id, { name }));
		handleClose();
	};
	const handleCancel = () => {
		handleClose();
	};
	return (
		<Dialog
			open={open}
			title=""
			textContent=""
			confirm={{
				label: getTranslation("cameraWall.toolBar.editGroupDialog.save"),
				action: handleUpdate,
				disabled: !name.length
			}}
			abort={{
				label: getTranslation("cameraWall.toolBar.editGroupDialog.cancel"),
				action: handleCancel
			}}
			deletion={{
				label: getTranslation("cameraWall.toolBar.editGroupDialog.removeCameraGrp"),
				action: handleConfirmDelete
			}}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					handleChange={handleChange}
					id="new-group"
					label={getTranslation("cameraWall.toolBar.editGroupDialog.fieldLabel.cameraGroup")}
					value={name}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};

EditGroupDialog.propTypes = propTypes;

//export default memo(withWidth()(EditGroupDialog));
export default memo(EditGroupDialog);
