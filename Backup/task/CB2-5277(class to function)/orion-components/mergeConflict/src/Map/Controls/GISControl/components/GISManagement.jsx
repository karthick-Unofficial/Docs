import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField, SelectField } from "orion-components/CBComponents";
import { withWidth, Collapse, Typography, MenuItem } from "@material-ui/core";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	serviceId: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	properties: PropTypes.object.isRequired,
	updateGISService: PropTypes.func.isRequired,
	deleteGISService: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const GISManagement = ({
	name,
	properties,
	authentication,
	serviceId,
	handleClose,
	updateGISService,
	deleteGISService,
	width,
	open,
	dir
}) => {
	const [nameState, setNameState] = useState(name);
	const [propertiesState, setPropertiesState] = useState(...properties);
	const [authenticationState, setAuthenticationState] = useState(...authentication);
	const [state, setState] = useState();

	const handleSave = () => {
		updateGISService(serviceId, {
			properties: { ...propertiesState },
			authenticationState
		});
		handleClose();
	};

	const handleAuthSelect = event => {
		setAuthenticationState({
			username: "",
			password: "",
			token: "",
			type: event.target.value
		});
	};

	const handleDelete = () => {
		deleteGISService(serviceId);
		handleClose();
	};

	const handleCancel = () => {
		handleClose();
		setTimeout(() => {
			setNameState(name);
			setPropertiesState(...properties);
			setAuthenticationState(...authentication);
		}, 1000);
	};

	const handleChange = (name, field, dynamicSetState) => event => {
		const dynamicState = name == "propertiesState" ? propertiesState : authenticationState;
		dynamicSetState({ ...dynamicState, [field]: event.target.value });
		if (dynamicSetState) {
			dynamicSetState({ ...name, [field]: event.target.value });
		} else {
			setState(prevState => ({ ...prevState, [name]: { ...state[name], [field]: event.target.value } }));
		}
	};

	return (
		<Dialog
			confirm={{
				label: getTranslation("global.map.controls.gisControl.gisManagement.save"),
				action: handleSave,
				disabled:
					isEqual(properties, propertiesState) &&
					isEqual(authentication, authenticationState)
			}}
			abort={{
				label: getTranslation("global.map.controls.gisControl.gisManagement.cancel"),
				action: handleCancel
			}}
			deletion={{
				label: getTranslation("global.map.controls.gisControl.gisManagement.delete"),
				action: handleDelete
			}}
			open={open}
			dir={dir}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					id="gis-rename"
					value={propertiesState.name}
					label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.serviceName")}
					handleChange={handleChange("propertiesState", "name", setPropertiesState)}
					fullWidth={true}
					dir={dir}
				/>
				<TextField
					id="url"
					label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.esriServiceEndpoint")}
					value={propertiesState.endpoint}
					handleChange={handleChange("propertiesState", "endpoint", setPropertiesState)}
					fullWidth={true}
					helperText={getTranslation("global.map.controls.gisControl.gisManagement.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer")}
					dir={dir}
				/>
				<SelectField
					id="auth-select"
					label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.authType")}
					handleChange={handleAuthSelect}
					value={authenticationState.type}
					dir={dir}
				>
					<MenuItem key="login" value="login">
						<Translate value="global.map.controls.gisControl.gisManagement.menuItem.login" />
					</MenuItem>
					<MenuItem key="token" value="token">
						<Translate value="global.map.controls.gisControl.gisManagement.menuItem.token" />
					</MenuItem>
					<MenuItem key="none" value="none">
						<Translate value="global.map.controls.gisControl.gisManagement.menuItem.none" />
					</MenuItem>
				</SelectField>
				{authenticationState.type === "login" && (
					<Fragment>
						<TextField
							id="username"
							label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.username")}
							value={authenticationState.username}
							handleChange={handleChange("authenticationState", "username", setAuthenticationState)}
							fullWidth={true}
							dir={dir}
						/>
						<TextField
							id="password"
							label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.password")}
							value={authenticationState.password}
							handleChange={handleChange("authenticationState", "password", setAuthenticationState)}
							fullWidth={true}
							type="password"
							dir={dir}
						/>
					</Fragment>
				)}
				{authenticationState.type === "token" && (
					<TextField
						id="token"
						label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.token")}
						value={authenticationState.token}
						handleChange={handleChange("authenticationState", "token", setAuthenticationState)}
						fullWidth={true}
						dir={dir}
					/>
				)}
			</div>
		</Dialog>
	);
};

GISManagement.propTypes = propTypes;

export default withWidth()(GISManagement);
