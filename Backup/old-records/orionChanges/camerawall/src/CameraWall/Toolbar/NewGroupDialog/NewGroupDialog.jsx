import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField } from "orion-components/CBComponents";
import { withWidth } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	closeDialog: PropTypes.func.isRequired,
	createGroup: PropTypes.func.isRequired,
	open: PropTypes.bool,
	width: PropTypes.string.isRequired,
	dir: PropTypes.string
};

const defaultProps = { open: false };

const NewGroupDialog = ({ closeDialog, createGroup, open, width, dir }) => {
	const [name, setName] = useState("");
	const handleChange = e => {
		setName(e.target.value);
	};
	const handleClose = () => {
		closeDialog("new-group-dialog");
		setName("");
	};
	const handleSave = () => {
		createGroup(name);
		handleClose();
	};
	return (
		<Dialog
			open={open}
			confirm={{
				label: <Translate value="cameraWall.toolBar.newGroupDialog.save"/>,
				action: handleSave,
				disabled: !name.length
			}}
			abort={{ label: <Translate value="cameraWall.toolBar.newGroupDialog.cancel"/>, action: handleClose }}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					handleChange={handleChange}
					id="new-group-name"
					label={<Translate value="cameraWall.toolBar.newGroupDialog.fieldLabel.cameraGroup"/>}
					value={name}
					autoFocus={true}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};

NewGroupDialog.propTypes = propTypes;
NewGroupDialog.defaultProps = defaultProps;

export default memo(withWidth()(NewGroupDialog));
