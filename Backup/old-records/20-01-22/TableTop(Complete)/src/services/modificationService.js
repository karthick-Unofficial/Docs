import { realtimeClient, restClient } from "client-app-core";

class ModificationService {
	constructor(options) {
		this._options = options;
		this._rc = realtimeClient;
		this._restClient = restClient;
	}

	enableModifications(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/enable`;
		this._restClient.exec_post(url, null, callback);
	}

	setModificationsData(tabletopSessionId, modificationsData, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/modificationsData`;
		const body = JSON.stringify({
			modificationsData
		});
		this._restClient.exec_post(url, body, callback);
	}

	cancelModifications(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/cancel`;
		this._restClient.exec_post(url, null, callback);
	}

	createModification(tabletopSessionId, modification, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications`;
		const body = JSON.stringify({ modification });
		this._restClient.exec_post(url, body, callback);
	}

	updateModification(tabletopSessionId, modification, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modification.id}`;
		const body = JSON.stringify({ modification });
		this._restClient.exec_post(url, body, callback);
	}

	submitModificationsToController(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/submit/toController`;
		this._restClient.exec_post(url, null, callback);
	}

	submitModificationsToAvert(tabletopSessionId, childSimName, simTime, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/submit/toAvert`;
		const body = JSON.stringify({
			childSimName,
			simTime
		});
		this._restClient.exec_post(url, body, callback);
	}

	approveModification(tabletopSessionId, modificationId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modificationId}/approve`;
		this._restClient.exec_post(url, null, callback);
	}

	rejectModification(tabletopSessionId, modificationId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modificationId}/reject`;
		this._restClient.exec_post(url, null, callback);
	}

	revertModificationDecision(tabletopSessionId, modificationId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modificationId}/revertDecision`;
		this._restClient.exec_post(url, null, callback);
	}

	setModificationComment(tabletopSessionId, modificationId, comment, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modificationId}/setComment`;
		const body = JSON.stringify({ comment });
		this._restClient.exec_post(url, body, callback);
	}

	deleteModification(tabletopSessionId, modificationId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/modifications/${modificationId}`;
		this._restClient.exec_delete(url, callback);
	}

	subscribeModifications(tabletopSessionId, callback) {
		const args = {
			tabletopSessionId
		};
		// Returns promise that will resolve to channel that can be used for unsubscribe
		return this._rc.subscribe("tabletop-app", "/modifications", args, function (msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}
}

const modificationService = new ModificationService();
export default modificationService;