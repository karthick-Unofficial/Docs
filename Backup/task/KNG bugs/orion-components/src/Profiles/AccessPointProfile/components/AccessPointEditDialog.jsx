import React, { Component } from "react";

import { Dialog, FlatButton, TextField } from "material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";

class AccessPointEditDialog extends Component {
	constructor(props) {
		super(props);

		const { accessPoint } = this.props;

		this.state = {
			name: accessPoint ? accessPoint.entityData.properties.name : "",
			description: accessPoint ? accessPoint.entityData.properties.description : "",
			type: accessPoint ? accessPoint.entityData.properties.type : "",
			accessPointId: accessPoint ? accessPoint.id : "",
			error: {
				name: ""
			}
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { accessPoint, open } = this.props;
		if (
			accessPoint.id !== nextProps.accessPoint.id ||
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
				error: { ...error, name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.lessThanFifty") }
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
		const { accessPoint } = this.props;
		this.setState({
			name: accessPoint ? accessPoint.entityData.properties.name : "",
			description: accessPoint ? accessPoint.entityData.properties.description : ""
		});
		this.handleClose();
	};

	handleSave = () => {
		const { accessPoint } = this.props;
		const { error, name, description } = this.state;

		if (!name) {
			this.setState({ error: { ...error, name: getTranslation("global.profiles.accessPointProfile.Dialog.errorText.noName") } });
			return;
		}

		const entityData = {
			...accessPoint.entityData,
			properties: {
				...accessPoint.entityData.properties,
				name: name,
				description: description
			}
		}


		this.props.update(accessPoint.id, entityData);

		this.handleClose();
	};

	render() {
		const { name, description, type, accessPointId, error } = this.state;
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
				label={getTranslation("global.profiles.accessPointProfile.Dialog.cancel")}
				secondary={true}
				onClick={this.handleCancel}
			/>,
			<FlatButton label={getTranslation("global.profiles.accessPointProfile.Dialog.confirm")} primary={true} onClick={this.handleSave} />
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
				title={getTranslation("global.profiles.accessPointProfile.Dialog.editAcc")}
				autoScrollBodyContent={true}
			>
				<TextField
					id="accessPoint-name"
					fullWidth={true}
					floatingLabelText={getTranslation("global.profiles.accessPointProfile.Dialog.accName")}
					value={name}
					onChange={this.handleNameChange}
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
					onChange={this.handleDescriptionChange}
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
	}
}

export default AccessPointEditDialog;
