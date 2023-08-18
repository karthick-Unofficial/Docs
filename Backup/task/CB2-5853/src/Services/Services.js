import React, { Fragment, useState, useEffect } from "react";
import HealthService from "./HealthService/HealthService";
import ConfigService from "./ConfigService/ConfigService";
import SystemNotificationService from "./SystemNotificationService/SystemNotificationService";
import ApplicationProfileService from "./ApplicationProfile/ApplicationProfileService";
import StatusCardService from "./StatusCardService/StatusCardService";

import * as actionCreators from "./servicesActions.js";
import { useDispatch } from "react-redux";

const Services = ({ exclude, children }) => {
	if (!exclude) exclude = [];
	const dispatch = useDispatch();
	const { servicesReady } = actionCreators;

	const [configReady, setConfigReady] = useState(exclude.indexOf("config") >= 0);
	const [applicationProfileReady, setApplicationProfileReady] = useState(exclude.indexOf("applicationProfile") >= 0);

	useEffect(() => {
		if (configReady && applicationProfileReady) {
			dispatch(servicesReady());
		}
	}, [configReady, applicationProfileReady]);

	return (
		<Fragment>
			{exclude.indexOf("health") < 0 && <HealthService />}
			{exclude.indexOf("config") < 0 && <ConfigService setReady={() => setConfigReady(true)} />}
			{exclude.indexOf("applicationProfile") < 0 && (
				<ApplicationProfileService setReady={() => setApplicationProfileReady(true)} />
			)}
			{exclude.indexOf("systemNotification") < 0 && <SystemNotificationService />}
			{exclude.indexOf("statusCards") < 0 && <StatusCardService />}
			{children}
		</Fragment>
	);
};

export default Services;
