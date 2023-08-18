import React, { useState, useEffect } from "react";
import { applicationService } from "client-app-core";
import { useSelector } from "react-redux";

import { Translate } from "orion-components/i18n";

const Login = ({ children }) => {
	const [version, setVersion] = useState("");
	// helps to render latest translations
	const translations = useSelector(state => state.i18n.translations);

	useEffect(() => {
		// this.props.dispatch(fetchAppVersion("ecosystem"));
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
					{children}
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