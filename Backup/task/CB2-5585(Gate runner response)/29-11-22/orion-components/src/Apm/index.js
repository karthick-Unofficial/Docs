import { useState, useEffect } from "react";
import { init as initApm } from "@elastic/apm-rum";
import { applicationService } from "client-app-core";
export { apm } from "@elastic/apm-rum";
export { afterFrame } from "@elastic/apm-rum-core";
export { default as withTransaction } from "./withTransaction.js";
export { default as withSpan } from "./withSpan.js";
export { default as captureUserInteraction } from "./userInteraction.js";

const ApmIndex = (props) => {

	const baseConf = {
		serviceName: props.serviceName,
		serverUrl: `https://${window.location.hostname}`,
		serviceVersion: "1.17.0",
		active: true,
		instrument: true,
		environment: "dev",
		logLevel: "debug",
		transactionSampleRate: 1.0,
		breakdownMetrics: true,
		ignoreTransactions: [/health-reports-with-auth*/],
		propogateTracestate: true,
		disableInstrumentations: ["eventtarget"] //["xmlhttprequest", "fetch"]
	};

	const [serverApmConfig, setServerApmConfig] = useState(null);

	useEffect(() => {
		applicationService.getApplicationConfig((err, response) => {
			if (err) console.log("ERROR", err);
			if (!response) return;
			const { apm } = response;
			setServerApmConfig({ ...baseConf, ...(apm || {}) });
		});
	}, []);

	serverApmConfig && initApm(serverApmConfig);

	return props.children;
};

export default ApmIndex;