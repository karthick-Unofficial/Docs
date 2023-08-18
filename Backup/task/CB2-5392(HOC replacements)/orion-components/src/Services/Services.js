import React, { Fragment, useState, useEffect } from "react";
import HealthService from "./HealthService/HealthService";
import ConfigService from "./ConfigService/ConfigService";
import SystemNotificationService from "./SystemNotificationService/SystemNotificationService";
import ApplicationProfileService from "./ApplicationProfile/ApplicationProfileService";
import * as actionCreators from "./servicesActions.js";
import { useDispatch } from "react-redux";

const Services = ({ children }) => {
	const dispatch = useDispatch();
	const { servicesReady } = actionCreators;

	const [configReady, setConfigReady] = useState(false);
	const [applicationProfileReady, setApplicationProfileReady] = useState(false);

	useEffect(() => {
		if (configReady && applicationProfileReady) {
			dispatch(servicesReady());
		}
	}, [configReady, applicationProfileReady]);

	return (
		<Fragment>
			<HealthService />
			<ConfigService setReady={() => setConfigReady(true)} />
			<ApplicationProfileService setReady={() => setApplicationProfileReady(true)} />
			<SystemNotificationService />
			{children}
		</Fragment>
	);
};

export default Services;