import React, { Component } from "react";

import { Dialog, FlatButton, TextField } from "material-ui";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

class CameraDialog extends Component {
	constructor(props) {
		super(props);

		const { camera } = this.props;

		this.state = {
			name: camera ? camera.entityData.properties.name : "",
			description: camera ? camera.entityData.properties.description : "",
			type: camera ? camera.entityData.properties.deviceType : "",
			cameraId: camera ? camera.connection.cameraId : "",
			system: camera ? camera.cameraSystem : "",
			error: {
				name: ""
			}
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { camera, open } = this.props;
		if (
			camera.id !== nextProps.camera.id ||
			this.state !== nextState ||
			open !== nextProps.open
		) {
			return true;
		} else {
			return false;
		}
	}

	handleClose = () => {
		this.props.close();
	};

	handleNameChange = event => {
		const { error } = this.state;

		if (event.target.value.length > 50) {
			this.setState({
				error: { ...error, name: getTranslation("global.profiles.cameraProfile.cameraDialog.errorText.lessThanFifty")}
			});
			return;
		}

		this.setState({
			name: event.target.value,
			error: { ...error, name: "" }
		});
	};

	handleDescriptionChange = event => {
		this.setState({
			description: event.target.value
		});
	};

	handleCancel = () => {
		const { camera } = this.props;
		this.setState({
			name: camera ? camera.entityData.properties.name : "",
			description: camera ? camera.entityData.properties.description : ""
		});
		this.handleClose();
	};

	handleSave = () => {
		const { camera } = this.props;
		const { error, name, description } = this.state;

		if (!name) {
			this.setState({ error: { ...error, name: getTranslation("global.profiles.cameraProfile.cameraDialog.errorText.noName") } });
			return;
		}

		const update = {
			camera: {
				properties: {
					...camera.entityData.properties,
					name: name,
					description: description
				}
			}
		};

		this.props.update(camera.id, update);

		this.handleClose();
	};

	render() {
		const { name, description, type, cameraId, system, error } = this.state;
		const { open, dir } = this.props;

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
				onClick={this.handleCancel}
			/>,
			<FlatButton label={getTranslation("global.profiles.cameraProfile.cameraDialog.confirm")} primary={true} onClick={this.handleSave} />
		];

		return (
			<Dialog
				open={open}
				onRequestClose={this.handleCancel}
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
					onChange={this.handleNameChange}
					style={textFieldStyles}
					inputStyle={textFieldStyles.input}
					errorText={error.name}
					floatingLabelStyle={{
						style: {
							transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
						}
					}}
				/>
				<TextField
					id="camera-description"
					fullWidth={true}
					floatingLabelText={getTranslation("global.profiles.cameraProfile.cameraDialog.desc")}
					value={description}
					onChange={this.handleDescriptionChange}
					style={textFieldStyles}
					inputStyle={textFieldStyles.input}
					floatingLabelStyle={{
						style: {
							transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
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
							transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
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
							transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
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
							transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
						}
					}}
				/>
			</Dialog>
		);
	}
}

export default CameraDialog;
