import React, { Component } from "react";
import { authService, applicationService } from "client-app-core";

import {
	loginUser,
	requestReset,
	fetchAppVersion,
	resetError
} from "./loginActions";

import {Translate} from "orion-components/i18n/I18nContainer";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			version: ""
		};
	}

	componentDidMount() {
		// this.props.dispatch(fetchAppVersion("ecosystem"));
		return applicationService.getApplicationVersion(
			"ecosystem",
			(err, response) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						version: response.app.version
					});
				}
			}
		);
	}

	render() {
		const { dispatch, errorMessage, children } = this.props;

		return (
			<div className="login-background">
				<div className="map-overlay" />
				<div className="form-container">
					<div className="login-logo">
						<img alt="cb-logo" src="../../../static/images/avert_main_logo.png" />
					</div>
					<div className="login-container">
						{React.cloneElement(children, {
							errorMessage: errorMessage,
							onLoginClick: creds => dispatch(loginUser(creds)),
							onForgotClick: username => dispatch(requestReset(username)),
							resetError: () => dispatch(resetError())
						})}
					</div>
				</div>
				<div className="login-version-bar">
					<p className="login-version"><Translate value="login.version" count={this.state.version}/></p>
					<p className="login-copyright"><Translate value="login.copyright"/></p>
				</div>
			</div>
		);
	}
}

export default Login;
