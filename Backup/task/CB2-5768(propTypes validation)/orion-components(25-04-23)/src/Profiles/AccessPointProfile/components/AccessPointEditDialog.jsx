import React, { memo, useState } from "react";

import { Button, TextField, DialogActions, Typography } from "@mui/material";
import { Dialog } from "orion-components/CBComponents";

import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

const propTypes = {
	accessPoint: PropTypes.object.isRequired,
	close: PropTypes.func,
	update: PropTypes.func,
	dir: PropTypes.string
};

const AccessPointEditDialog = ({ accessPoint, close, update, dir }) => {
	const dispatch = useDispatch();
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const type = accessPoint ? accessPoint.entityData.properties.type : "";
	const accessPointId = accessPoint ? accessPoint.id : "";

	const [name, setName] = useState(accessPoint ? accessPoint.entityData.properties.name : "");
	const [description, setDescription] = useState(accessPoint ? accessPoint.entityData.properties.description : "");
	const [error, setError] = useState({
		name: ""
	});

	const handleClose = () => {
		close();
	};

	const handleNameChange = (event) => {
		if (event.target.value.length > 50) {
			setError({
				...error,
				name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.lessThanFifty")
			});
			return;
		}
		setName(event.target.value);
		setError({ ...error, name: "" });
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleCancel = () => {
		setName(accessPoint ? accessPoint.entityData.properties.name : "");
		setDescription(accessPoint ? accessPoint.entityData.properties.description : "");
		handleClose();
	};

	const handleSave = () => {
		if (!name) {
			setError({
				...error,
				name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.noName")
			});
			return;
		}

		const entityData = {
			...accessPoint.entityData,
			properties: {
				...accessPoint.entityData.properties,
				name: name,
				description: description
			}
		};
		dispatch(update(accessPoint.id, entityData));
		handleClose();
	};

	const dialogStyles = {
		dialog: {
			maxWidth: 500
		}
	};

	const textFieldStyles = {
		marginBottom: "2rem",
		backgroundColor: "#2C2D2F", // Force styling in Map app
		input: { textOverflow: "ellipsis" }
	};

	const actions = [
		<Button style={{ color: "#B2B6BB" }} variant="text" onClick={handleCancel} key="cancel-action-button">
			{getTranslation("global.profiles.accessPointProfile.Dialog.cancel")}
		</Button>,
		<Button color="primary" variant="text" onClick={handleSave} key="confirm-action-button">
			{getTranslation("global.profiles.accessPointProfile.Dialog.confirm")}
		</Button>
	];

	const dialogTitle = [
		<Typography sx={{ fontWeight: "400", fontSize: "22px" }} key="dialog-title">
			{getTranslation("global.profiles.accessPointProfile.Dialog.editAcc")}
		</Typography>
	];

	const dialogActions = () => {
		return <DialogActions>{actions}</DialogActions>;
	};

	return (
		<Dialog
			open={dialog === "accessPointEditDialog"}
			paperPropStyles={dialogStyles.dialog}
			dialogContentStyles={{
				paddingTop: "25px",
				paddingBottom: "25px",
				borderTop: "none",
				borderBottom: "none"
			}}
			titlePropStyles={{ marginBottom: "1.5rem" }}
			title={dialogTitle}
			actions={true}
			DialogActionsFunction={dialogActions}
		>
			<div>
				<TextField
					id="accessPoint-name"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.accessPointProfile.Dialog.accName")}
					value={name}
					onChange={handleNameChange}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					errorText={error.name}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
							left: "unset"
						}
					}}
				/>
				<TextField
					id="accessPoint-description"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.accessPointProfile.Dialog.desc")}
					value={description}
					onChange={handleDescriptionChange}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
							left: "unset"
						}
					}}
				/>
				<TextField
					id="accessPoint-type"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.accessPointProfile.Dialog.type")}
					disabled={true}
					value={type}
					style={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
							left: "unset"
						}
					}}
				/>
				<TextField
					id="accessPoint-id"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.accessPointProfile.Dialog.accId")}
					disabled={true}
					value={accessPointId}
					style={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
							left: "unset"
						}
					}}
				/>
			</div>
		</Dialog>
	);
};

const componentUpdate = (prevProps, nextProps) => {
	if (prevProps.accessPoint.id !== nextProps.accessPoint.id) {
		return false;
	} else {
		return true;
	}
};

AccessPointEditDialog.propTypes = propTypes;

export default memo(AccessPointEditDialog, componentUpdate);
