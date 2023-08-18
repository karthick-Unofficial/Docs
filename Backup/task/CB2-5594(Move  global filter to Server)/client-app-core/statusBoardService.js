import { RealtimeClient } from "./RealtimeClient";
import { RestClient } from "./restClient";

export class StatusBoardService {
	constructor(options) {
		this._options = options;
		this._restClient = new RestClient();
		this._rc = new RealtimeClient();
	}

	/**
	 * Get all authorized template status cards
	 * @param {function} callback 
	 */
	getTemplateLibrary(callback) {
		const url = "/ecosystem/api/statusBoard/statusCard";
		this._restClient.exec_get(url, callback);
	}

	/**
	 * Create a status card
	 * @param {object} statusCard 
	 * @param {function} callback 
	 */
	create(statusCard, callback) {
		const url = "/ecosystem/api/statusBoard/statusCard";
		const body = JSON.stringify({
			statusCard
		});
		this._restClient.exec_post(url, body, callback);
	}

	/**
	 * Update a status card
	 * @param {string} statusCardId 
	 * @param {object} update 
	 * @param {function} callback 
	 */
	update(statusCardId, update, callback) {
		const url = `/ecosystem/api/statusBoard/statusCard/${statusCardId}`;
		const body = JSON.stringify({
			update
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
	 * Update the selectedIndex (aka selected item) om a specific data object of a status card
	 * @param {string} statusCardId 
	 * @param {number} dataIndex 
	 * @param {number} selectedIndex 
	 * @param {function} callback 
	 */
	updateSelectedIndex(statusCardId, dataIndex, selectedIndex, callback) {
		const url = `/ecosystem/api/statusBoard/statusCard/${statusCardId}/updateSelected`;
		const body = JSON.stringify({
			dataIndex,
			selectedIndex
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
	 * Delete a status card
	 * @param {string} statusCardId 
	 * @param {function} callback 
	 */
	delete(statusCardId, callback) {
		const url = `/ecosystem/api/statusBoard/statusCard/${statusCardId}`;
		this._restClient.exec_delete(url, callback);
	}

	/**
	 * Update the organizations a status card is shared with
	 * @param {string} statusCardId 
	 * @param {array} orgs -- ex: ["ares-security-corp", "the-security-group"]
	 * @param {function} callback 
	 */
	shareWithOrgs(statusCardId, orgs, callback) {
		const url = `/ecosystem/api/statusBoard/statusCard/${statusCardId}/share`;
		const body = JSON.stringify({
			orgs
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
	 * Create a new status card based on a template
	 * @param {string} templateId 
	 * @param {function} callback 
	 */
	createFromTemplate(templateId, callback) {
		const url = `/ecosystem/api/statusBoard/statusCard/${templateId}/create`;
		this._restClient.exec_post(url, null, callback);
	}

	/**
	 * Stream a user's authorized status cards
	 * @param {function} callback 
	 */
	streamStatusCards(appId, callback) {
		const args = {
			appId: appId
		};
		this._rc.subscribe("ecosystem", "/statusBoard/statusCard", args, function (msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}
}
