import React, { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField, SelectField } from "orion-components/CBComponents";
import { withWidth, Typography, MenuItem } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	width: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	error: PropTypes.string,
	success: PropTypes.bool.isRequired,
	isFetching: PropTypes.bool,
	createService: PropTypes.func.isRequired,
	resetRequest: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	dir: PropTypes.string
};
const defaultProps = {
	error: "",
	isFetching: false,
	dir: "ltr"
};

const GISDialog = ({
	success,
	resetRequest,
	handleClose,
	createService,
	width,
	open,
	error,
	isFetching,
	dir
}) => {
	const dispatch = useDispatch();

	const [creds, setCreds] = useState({ username: "", password: "", token: "" });
	const [newService, setNewService] = useState({
		name: "",
		url: ""
	});
	const [authType, setAuthType] = useState("none");
	const [submitted, setSubmitted] = useState(false);
	const prevPropSuccess = useRef();

	useEffect(() => {
		prevPropSuccess.current = success;
	}, [success]);

	useEffect(() => {
		if (!prevPropSuccess && success) handleCloseEvent();
	}, [success]);

	const handleChange = (name, field, dynamicSetState) => event => {
		const dynamicState = name == "newService" ? newService : creds;
		dynamicSetState({ ...dynamicState, [field]: event.target.value });
		setSubmitted(false);
	};

	const handleAuthSelect = event => {
		setAuthType(event.target.value);
		setCreds({ username: "", password: "", token: "", submitted: false });
	};

	const handleCloseEvent = () => {
		setCreds({
			username: "",
			password: ""
		});
		setNewService({
			name: "",
			url: ""
		});
		setAuthType("none");
		setSubmitted(false);
		dispatch(resetRequest());
		handleClose("gisDialog");
	};

	const handleSave = () => {
		const { username, password, token } = creds;
		const { name, url } = newService;
		dispatch(createService(name, url, username, password, token, authType));
	};
	return (
		<Dialog
			open={open}
			confirm={{
				label: error ? getTranslation("global.map.controls.gisControl.gisDialog.retry") : getTranslation("global.map.controls.gisControl.gisDialog.add"),
				action: handleSave,
				disabled:
					!newService.name ||
					!newService.url ||
					(authType === "login" && (!creds.username || !creds.password)) ||
					(authType === "token" && !creds.token)
			}}
			abort={{
				label: getTranslation("global.map.controls.gisControl.gisDialog.cancel"),
				action: handleCloseEvent
			}}
			requesting={isFetching}
			dir={dir}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<TextField
					id="name"
					label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.serviceName")}
					value={newService.name}
					handleChange={handleChange("newService", "name", setNewService)}
					fullWidth={true}
					autoFocus={true}
					dir={dir}
				/>
				<TextField
					id="url"
					label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.esriServiceEndpoint")}
					value={newService.url}
					handleChange={handleChange("newService", "url", setNewService)}
					fullWidth={true}
					helperText={getTranslation("global.map.controls.gisDialog.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer")}
					dir={dir}
				/>
				<SelectField
					id="auth-select"
					label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.authType")}
					handleChange={handleAuthSelect}
					value={authType}
					dir={dir}
				>
					<MenuItem key="login" value="login">
						<Translate value="global.map.controls.gisControl.gisDialog.menuItem.login" />
					</MenuItem>
					<MenuItem key="token" value="token">
						<Translate value="global.map.controls.gisControl.gisDialog.menuItem.token" />
					</MenuItem>
					<MenuItem key="none" value="none">
						<Translate value="global.map.controls.gisControl.gisDialog.menuItem.none" />
					</MenuItem>
				</SelectField>
				{authType === "login" && (
					<Fragment>
						<TextField
							id="username"
							label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.username")}
							value={creds.username}
							handleChange={handleChange("creds", "username", setCreds)}
							fullWidth={true}
							dir={dir}
						/>
						<TextField
							id="password"
							label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.password")}
							value={creds.password}
							handleChange={handleChange("creds", "password", setCreds)}
							fullWidth={true}
							type="password"
							dir={dir}
						/>
					</Fragment>
				)}
				{authType === "token" && (
					<TextField
						id="token"
						label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.token")}
						value={creds.token}
						handleChange={handleChange("creds", "token", setCreds)}
						fullWidth={true}
						dir={dir}
					/>
				)}
				{error && <Typography color="error">{error}</Typography>}
			</div>
		</Dialog>
	);

};

GISDialog.propTypes = propTypes;
GISDialog.defaultProps = defaultProps;

export default withWidth()(GISDialog);
