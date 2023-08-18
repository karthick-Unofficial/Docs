import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField } from "orion-components/CBComponents";
import { withWidth } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	closeDialog: PropTypes.func.isRequired,
	deleteGroup: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	open: PropTypes.bool,
	selectedGroup: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired
	}).isRequired,
	updateGroup: PropTypes.func.isRequired,
	width: PropTypes.string.isRequired,
	dir: PropTypes.string
};

const defaultProps = { open: false };

const EditGroupDialog = ({
	closeDialog,
	deleteGroup,
	id,
	open,
	selectedGroup,
	updateGroup,
	width,
	dir
}) => {
	const [name, setName] = useState(selectedGroup.name);

	useEffect(() => {
		setName(selectedGroup.name);
	}, [selectedGroup]);

	const handleChange = e => {
		setName(e.target.value);
	};
	const handleClose = () => {
		closeDialog("edit-group-dialog");
	};
	const handleConfirmDelete = () => {
		deleteGroup(id);
		handleClose();
	};
	const handleUpdate = () => {
		updateGroup(id, { name });
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
				label: <Translate value="cameraWall.toolBar.editGroupDialog.save"/>,
				action: handleUpdate,
				disabled: !name.length
			}}
			abort={{
				label: <Translate value="cameraWall.toolBar.editGroupDialog.cancel"/>,
				action: handleCancel
			}}
			deletion={{
				label: <Translate value="cameraWall.toolBar.editGroupDialog.removeCameraGrp"/>,
				action: handleConfirmDelete
			}}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					handleChange={handleChange}
					id="new-group"
					label={<Translate value="cameraWall.toolBar.editGroupDialog.fieldLabel.cameraGroup"/>}
					value={name}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};

EditGroupDialog.propTypes = propTypes;
EditGroupDialog.defaultProps = defaultProps;

export default memo(withWidth()(EditGroupDialog));
