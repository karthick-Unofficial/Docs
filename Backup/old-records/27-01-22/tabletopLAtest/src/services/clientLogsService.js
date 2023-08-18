import { restClient } from "client-app-core";

class ClientLogsService {
	constructor(options) {
		this._options = options;
		this._restClient = restClient;
	}

	saveClientLogs(clientLogData, callback) {
		const url = "/tabletop-app/api/clientLogs";
		const body = JSON.stringify({
			clientLogData
		});
		this._restClient.exec_post(url, body, callback);
	}
}

const clientLogsService = new ClientLogsService();
export default clientLogsService;