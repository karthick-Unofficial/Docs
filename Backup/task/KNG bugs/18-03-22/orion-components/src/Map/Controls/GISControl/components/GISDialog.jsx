import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Dialog, TextField, SelectField } from "orion-components/CBComponents";
import { withWidth, Typography, MenuItem } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

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

class GISDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			creds: { username: "", password: "", token: "" },
			newService: {
				name: "",
				url: ""
			},
			authType: "none",
			submitted: false
		};

		this.handleSave = this.handleSave.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		const { success } = this.props;
		if (!prevProps.success && success) this.handleClose();
	}

	handleChange = (name, field) => event => {
		this.setState({
			[name]: { ...this.state[name], [field]: event.target.value },
			submitted: false
		});
	};

	handleAuthSelect = event => {
		this.setState({
			authType: event.target.value,
			creds: { username: "", password: "", token: "", submitted: false }
		});
	};

	handleClose = () => {
		const { resetRequest, handleClose } = this.props;
		this.setState({
			creds: {
				username: "",
				password: ""
			},
			newService: {
				name: "",
				url: ""
			},
			authType: "none",
			submitted: false
		});
		resetRequest();
		handleClose("gisDialog");
	};

	handleSave() {
		const { createService } = this.props;
		const { authType, creds, newService } = this.state;
		const { username, password, token } = creds;
		const { name, url } = newService;
		createService(name, url, username, password, token, authType);
	}

	render() {
		const { width, open, error, isFetching, dir } = this.props;
		const { creds, newService, authType } = this.state;

		return (
			<Dialog
				open={open}
				confirm={{
					label: error ? getTranslation("global.map.controls.gisControl.gisDialog.retry") : getTranslation("global.map.controls.gisControl.gisDialog.add"),
					action: this.handleSave,
					disabled:
						!newService.name ||
						!newService.url ||
						(authType === "login" && (!creds.username || !creds.password)) ||
						(authType === "token" && !creds.token)
				}}
				abort={{
					label: getTranslation("global.map.controls.gisControl.gisDialog.cancel"),
					action: this.handleClose
				}}
				requesting={isFetching}
				dir={dir}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<TextField
						id="name"
						label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.serviceName")}
						value={newService.name}
						handleChange={this.handleChange("newService", "name")}
						fullWidth={true}
						autoFocus={true}
						dir={dir}
					/>
					<TextField
						id="url"
						label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.esriServiceEndpoint")}
						value={newService.url}
						handleChange={this.handleChange("newService", "url")}
						fullWidth={true}
						helperText={getTranslation("global.map.controls.gisDialog.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer")}
						dir={dir}
					/>
					<SelectField
						id="auth-select"
						label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.authType")}
						handleChange={this.handleAuthSelect}
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
								handleChange={this.handleChange("creds", "username")}
								fullWidth={true}
								dir={dir}
							/>
							<TextField
								id="password"
								label={getTranslation("global.map.controls.gisControl.gisDialog.fieldLabel.password")}
								value={creds.password}
								handleChange={this.handleChange("creds", "password")}
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
							handleChange={this.handleChange("creds", "token")}
							fullWidth={true}
							dir={dir}
						/>
					)}
					{error && <Typography color="error">{error}</Typography>}
				</div>
			</Dialog>
		);
	}
}

GISDialog.propTypes = propTypes;
GISDialog.defaultProps = defaultProps;

export default withWidth()(GISDialog);
