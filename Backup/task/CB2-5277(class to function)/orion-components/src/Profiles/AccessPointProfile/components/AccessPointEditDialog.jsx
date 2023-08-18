import React, { Component, memo, useState } from "react";

import { Dialog, FlatButton, TextField } from "material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const AccessPointEditDialog = ({
	accessPoint,
	close,
	update,
	open,
	dir
}) => {
	const [name, setName] = useState(accessPoint ? accessPoint.entityData.properties.name : "");
	const [description, setDescription] = useState(accessPoint ? accessPoint.entityData.properties.description : "");
	const [type, setType] = useState(accessPoint ? accessPoint.entityData.properties.type : "");
	const [accessPointId, setAccessPointId] = useState(accessPoint ? accessPoint.id : "");
	const [error, setError] = useState({
		name: ""
	});

	const handleClose = () => {
		close();
	};

	const handleNameChange = event => {
		if (event.target.value.length > 50) {
			setError({ ...error, name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.lessThanFifty") });
			return;
		}
		setName(event.target.value);
		setError({ ...error, name: "" });
	};

	const handleDescriptionChange = event => {
		setDescription(event.target.value);
	};

	const handleCancel = () => {
		setName(accessPoint ? accessPoint.entityData.properties.name : "");
		setDescription(accessPoint ? accessPoint.entityData.properties.description : "");
		handleClose();
	};

	const handleSave = () => {
		if (!name) {
			setError({ ...error, name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.noName") });
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
		update(accessPoint.id, entityData);
		handleClose();
	};

	const dialogStyles = {
		dialog: {
			maxWidth: 500
		}
	};

	const textFieldStyles = {
		marginBottom: "1rem",
		backgroundColor: "#2C2D2F", // Force styling in Map app
		input: { textOverflow: "ellipsis" }
	};

	const actions = [
		<FlatButton
			label={getTranslation("global.profiles.accessPointProfile.Dialog.cancel")}
			secondary={true}
			onClick={handleCancel}
		/>,
		<FlatButton label={getTranslation("global.profiles.accessPointProfile.Dialog.confirm")} primary={true} onClick={handleSave} />
	];

	return (
		<Dialog
			open={open}
			onRequestClose={handleCancel}
			contentStyle={dialogStyles.dialog}
			bodyStyle={{
				borderTop: "none",
				borderBottom: "none"
			}}
			actions={actions}
			title={getTranslation("global.profiles.accessPointProfile.Dialog.editAcc")}
			autoScrollBodyContent={true}
		>
			<TextField
				id="accessPoint-name"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.accessPointProfile.Dialog.accName")}
				value={name}
				onChange={handleNameChange}
				style={textFieldStyles}
				inputStyle={textFieldStyles.input}
				errorText={error.name}
				floatingLabelStyle={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
					}
				}}
			/>
			<TextField
				id="accessPoint-description"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.accessPointProfile.Dialog.desc")}
				value={description}
				onChange={handleDescriptionChange}
				style={textFieldStyles}
				inputStyle={textFieldStyles.input}
				floatingLabelStyle={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
					}
				}}
			/>
			<TextField
				id="accessPoint-type"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.accessPointProfile.Dialog.type")}
				disabled={true}
				value={type}
				style={textFieldStyles}
				inputStyle={textFieldStyles.input}
				floatingLabelStyle={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
					}
				}}
			/>
			<TextField
				id="accessPoint-id"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.accessPointProfile.Dialog.accId")}
				disabled={true}
				value={accessPointId}
				style={textFieldStyles}
				inputStyle={textFieldStyles.input}
				floatingLabelStyle={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
					}
				}}
			/>
		</Dialog>
	);
};

const componentUpdate = (prevProps, nextProps) => {
	if (prevProps.accessPoint.id !== nextProps.accessPoint.id || prevProps.open !== nextProps.open) {
		return false;
	}
	else {
		return true;
	}
};

export default memo(AccessPointEditDialog, componentUpdate);


