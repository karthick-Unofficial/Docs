import React, { useState } from "react";

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
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
		marginBottom: "2rem",
		backgroundColor: "#2C2D2F", // Force styling in Map app
		input: { textOverflow: "ellipsis" }
	};

	const actions = [
		<Button
			variant="text"
			style={{ color: "#B2B6BB" }}
			onClick={handleCancel}
		>
			{getTranslation("global.profiles.cameraProfile.cameraDialog.cancel")}
		</Button>,
		<Button
			variant="text"
			color="primary"
			onClick={handleSave} >
			{getTranslation("global.profiles.cameraProfile.cameraDialog.confirm")}
		</Button>
	];

	return (
		<Dialog
			open={open}
			onRequestClose={handleCancel}
			PaperProps={{ sx: { ...dialogStyles.dialog } }}
		>

			<DialogTitle sx={{ marginBottom: "1.5rem" }} >
				<Typography sx={{ fontWeight: "400", fontSize: "22px" }}>
					{getTranslation("global.profiles.cameraProfile.cameraDialog.editCam")}
				</Typography>
			</DialogTitle>
			<DialogContent sx={{
				paddingTop: "25px",
				paddingBottom: "25px",
				borderTop: "none",
				borderBottom: "none"
			}}>
				<TextField
					id="camera-name"
					fullWidth={true}
					label={getTranslation("global.profiles.cameraProfile.cameraDialog.camName")}
					value={name}
					variant="standard"
					onChange={handleNameChange}
					sx={textFieldStyles}
					errorText={error.name}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
				<TextField
					id="camera-description"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.cameraProfile.cameraDialog.desc")}
					value={description}
					onChange={handleDescriptionChange}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
				<TextField
					id="camera-type"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.cameraProfile.cameraDialog.type")}
					disabled={true}
					value={type}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
				<TextField
					id="camera-id"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.cameraProfile.cameraDialog.camId")}
					disabled={true}
					value={cameraId}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
				<TextField
					id="camera-system"
					fullWidth={true}
					variant="standard"
					label={getTranslation("global.profiles.cameraProfile.cameraDialog.systemName")}
					disabled={true}
					value={system}
					sx={textFieldStyles}
					InputProps={{ style: textFieldStyles.input }}
					InputLabelProps={{
						style: {
							color: "#646465",
							transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
						}
					}}
				/>
			</DialogContent>
			<DialogActions>
				{actions}
			</DialogActions>
		</Dialog>
	);
};

export default CameraDialog;
