import React, { Component, Fragment } from "react";
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

class GISManagement extends Component {
	constructor(props) {
		super(props);
		const { name, properties, authentication } = this.props;
		this.state = {
			deleting: false,
			name: name,
			properties: { ...properties },
			authentication: { ...authentication }
		};
	}

	handleSave = () => {
		const { serviceId, handleClose, updateGISService } = this.props;
		const { properties, authentication } = this.state;
		updateGISService(serviceId, {
			properties: { ...properties },
			authentication
		});
		handleClose();
	};

	handleDelete = () => {
		this.setState({ deleting: true });
	};

	handleAuthSelect = event => {
		this.setState({
			authentication: {
				username: "",
				password: "",
				token: "",
				type: event.target.value
			}
		});
	};

	handleConfirm = () => {
		const { serviceId, handleClose, deleteGISService } = this.props;
		deleteGISService(serviceId);
		handleClose();
	};

	handleCancel = () => {
		const { handleClose, name, properties, authentication } = this.props;
		handleClose();

		setTimeout(() => {
			this.setState({
				deleting: false,
				name,
				properties: { ...properties },
				authentication: { ...authentication }
			});
		}, 1000);
	};

	handleChange = (name, field) => event => {
		this.setState({
			[name]: { ...this.state[name], [field]: event.target.value }
		});
	};

	render() {
		const { width, open, dir } = this.props;
		const { deleting, properties, authentication } = this.state;
		return (
			<Dialog
				confirm={{
					label: deleting ? getTranslation("global.map.controls.gisControl.gisManagement.confirm") : getTranslation("global.map.controls.gisControl.gisManagement.save"),
					action: deleting ? this.handleConfirm : this.handleSave,
					disabled:
						!deleting &&
						isEqual(this.props.properties, properties) &&
						isEqual(this.props.authentication, authentication)
				}}
				abort={{ label: getTranslation("global.map.controls.gisControl.gisManagement.cancel"), action: this.handleCancel }}
				deletion={
					deleting ? null : { label: getTranslation("global.map.controls.gisControl.gisManagement.delete"), action: this.handleDelete }
				}
				open={open}
				dir={dir}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<Collapse in={!deleting}>
						<TextField
							id="gis-rename"
							value={properties.name}
							label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.serviceName")}
							handleChange={this.handleChange("properties", "name")}
							fullWidth={true}
							dir={dir}
						/>
						<TextField
							id="url"
							label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.esriServiceEndpoint")}
							value={properties.endpoint}
							handleChange={this.handleChange("properties", "endpoint")}
							fullWidth={true}
							helperText={getTranslation("global.map.controls.gisControl.gisManagement.helperText.exampleURL", "http://services.arcgis.com/ArcGIS/rest/services/Port/MapServer")}
							dir={dir}
						/>
						<SelectField
							id="auth-select"
							label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.authType")}
							handleChange={this.handleAuthSelect}
							value={authentication.type}
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
						{authentication.type === "login" && (
							<Fragment>
								<TextField
									id="username"
									label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.username")}
									value={authentication.username}
									handleChange={this.handleChange("authentication", "username")}
									fullWidth={true}
									dir={dir}
								/>
								<TextField
									id="password"
									label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.password")}
									value={authentication.password}
									handleChange={this.handleChange("authentication", "password")}
									fullWidth={true}
									type="password"
									dir={dir}
								/>
							</Fragment>
						)}
						{authentication.type === "token" && (
							<TextField
								id="token"
								label={getTranslation("global.map.controls.gisControl.gisManagement.fieldLabel.token")}
								value={authentication.token}
								handleChange={this.handleChange("authentication", "token")}
								fullWidth={true}
								dir={dir}
							/>
						)}
					</Collapse>
					<Collapse in={deleting}>
						<Typography variant="subtitle1">
							<Translate value="global.map.controls.gisControl.gisManagement.deleteConfirmation" />
						</Typography>
					</Collapse>
				</div>
			</Dialog>
		);
	}
}

GISManagement.propTypes = propTypes;

export default withWidth()(GISManagement);
