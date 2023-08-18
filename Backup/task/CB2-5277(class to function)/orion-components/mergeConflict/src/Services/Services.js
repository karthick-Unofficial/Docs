import React, { Fragment, useState, useEffect } from "react";
import HealthServiceContainer from "./HealthService/HealthServiceContainer";
import ConfigServiceContainer from "./ConfigService/ConfigServiceContainer";
import SystemNotificationService from "./SystemNotificationService/SystemNotificationServiceContainer";
import ApplicationProfileService from "./ApplicationProfile/ApplicationProfileServiceContainer";

const Services = ({children, servicesReady}) => {
	const [ configReady, setConfigReady ] = useState(false);
	const [ applicationProfileReady, setApplicationProfileReady ] = useState(false);

	useEffect(() => {
		if (configReady && applicationProfileReady) {
			servicesReady();
		}
	}, [configReady, applicationProfileReady]);

	return (
		<Fragment>
			<HealthServiceContainer />
			<ConfigServiceContainer setReady={() => setConfigReady(true)}/>
			<ApplicationProfileService setReady={() => setApplicationProfileReady(true)} />
			<SystemNotificationService />
			{children}
		</Fragment>
	);
};

export default Services;