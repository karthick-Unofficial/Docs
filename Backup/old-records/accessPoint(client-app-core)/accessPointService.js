import { RealtimeClient } from "./RealtimeClient";
import { RestClient } from "./restClient";

export class AccessPointService {
	constructor(options) {
		this._options = options;
		this._restClient = new RestClient();
		this._rc = new RealtimeClient();
	}

	/**
	 * Get all accessPoints
	 * @param {function} callback 
	 */
	getAll(callback) {
		const url = "/ecosystem/api/accessPoint";
		this._restClient.exec_get(url, callback);
	}

	/**
	 * Get accessPoint by Id
	 * @param {string} accessPointId 
	 * @param {function} callback 
	 */
	getById(accessPointId, callback) {
		const url = `/ecosystem/api/accessPoint/${accessPointId}`;
		this._restClient.exec_get(url, callback);
	}

	/**
	 * Create an accessPoint
	 * @param {object} accessPoint 
	 * @param {function} callback 
	 */
	create(accessPoint, callback) {
		const url = "/ecosystem/api/accessPoint";
		const body = JSON.stringify({
			accessPoint
		});
		this._restClient.exec_post(url, body, callback);
	}

	/**
	 * Update an accessPoint
	 * @param {string} accessPointId 
	 * @param {object} update 
	 * @param {function} callback 
	 */
	update(accessPointId, update, callback) {
		const url = `/ecosystem/api/accessPoint/${accessPointId}`;
		const body = JSON.stringify({
			update
		});
		this._restClient.exec_put(url, body, callback);
	}

}
