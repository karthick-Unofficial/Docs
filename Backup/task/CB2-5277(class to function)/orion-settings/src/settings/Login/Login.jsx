import React, { useState, useEffect } from "react";
import { authService, applicationService } from "client-app-core";

import {
	loginUser,
	requestReset,
	fetchAppVersion,
	resetError
} from "./loginActions";

import { Translate } from "orion-components/i18n/I18nContainer";

const Login = ({ dispatch, errorMessage, children }) => {
	const [version, setVersion] = useState("");

	useEffect(() => {
		// props.dispatch(fetchAppVersion("ecosystem"));
		return applicationService.getApplicationVersion(
			"ecosystem",
			(err, response) => {
				if (err) {
					console.log(err);
				} else {
					setVersion(response.app.version);
				}
			}
		);
	}, []);

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
				<p className="login-version"><Translate value="login.version" count={version} /></p>
				<p className="login-copyright"><Translate value="login.copyright" /></p>
			</div>
		</div>
	);
};

export default Login;