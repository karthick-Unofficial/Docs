import React, { memo, useState } from "react";

import { Dialog, FlatButton, TextField } from "material-ui";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const CameraDialog = ({
	camera,
	open,
	close,
	update,
	dir
}) => {
	const dispatch = useDispatch();

	const [name, setName] = useState(camera ? camera.entityData.properties.name : "");
	const [description, setDescription] = useState(camera ? camera.entityData.properties.description : "");
	const [type, setType] = useState(camera ? camera.entityData.properties.deviceType : "");
	const [cameraId, setCameraId] = useState(camera ? camera.connection.cameraId : "");
	const [system, setSystem] = useState(camera ? camera.cameraSystem : "");
	const [error, setError] = useState({
		name: ""
	});

	const handleClose = () => {
		close();
	};

	const handleNameChange = event => {
		if (event.target.value.length > 50) {
			setError({ ...error, name: getTranslation("global.profiles.cameraProfile.cameraDialog.errorText.lessThanFifty") });
			return;
		}
		setName(event.target.value);
		setError({ ...error, name: "" });
	};

	const handleDescriptionChange = event => {
		setDescription(event.target.value);
	};

	const handleCancel = () => {
		setName(camera ? camera.entityData.properties.name : "");
		setDescription(camera ? camera.entityData.properties.description : "");
		handleClose();
	};

	const handleSave = () => {
		if (!name) {
			setError({ ...error, name: getTranslation("global.profiles.cameraProfile.cameraDialog.errorText.noName") });
			return;
		}

		const Update = {
			camera: {
				properties: {
					...camera.entityData.properties,
					name: name,
					description: description
				}
			}
		};

		dispatch(update(camera.id, Update));

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
			label={getTranslation("global.profiles.cameraProfile.cameraDialog.cancel")}
			secondary={true}
			onClick={handleCancel}
		/>,
		<FlatButton label={getTranslation("global.profiles.cameraProfile.cameraDialog.confirm")} primary={true} onClick={handleSave} />
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
			title={getTranslation("global.profiles.cameraProfile.cameraDialog.editCam")}
			autoScrollBodyContent={true}
		>
			<TextField
				id="camera-name"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.camName")}
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
				id="camera-description"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.desc")}
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
				id="camera-type"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.type")}
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
				id="camera-id"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.camId")}
				disabled={true}
				value={cameraId}
				style={textFieldStyles}
				inputStyle={textFieldStyles.input}
				floatingLabelStyle={{
					style: {
						transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
					}
				}}
			/>
			<TextField
				id="camera-system"
				fullWidth={true}
				floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.systemName")}
				disabled={true}
				value={system}
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

export default CameraDialog;
