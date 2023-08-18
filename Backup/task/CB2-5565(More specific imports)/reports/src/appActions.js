import { restClient } from "client-app-core";
import * as t from "./actionTypes.js";
export { hydrateUser } from "orion-components/AppMenu";
export { getGlobalAppState } from "orion-components/AppState/Actions";
export { subscribeFeedPermissions } from "orion-components/GlobalData/Actions";

export const reportTypesReceived = reports => {
	return {
		type: t.REPORT_TYPES_RECEIVED,
		payload: reports
	};
};

export const discoverReportTypes = () => {
	// Request reports via nats
	return function(dispatch) {
		restClient.exec_get("/reports-app/api/reportTypes", function(err, result) {
			if (err) {
				console.log(err);
			}

			const reduced = result.reduce((a, b) => {
				return { ...a, [b.id]: b };
			}, {});

			dispatch(reportTypesReceived(reduced));
		});
	};
};
