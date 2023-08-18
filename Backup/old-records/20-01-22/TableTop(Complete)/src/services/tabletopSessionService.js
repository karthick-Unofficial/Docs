import { realtimeClient, restClient } from "client-app-core";

class TabletopSessionService {
	constructor(options) {
		this._options = options;
		this._rc = realtimeClient;
		this._restClient = restClient;
	}

	createSession(tabletopSession, callback) {
		const url = "/tabletop-app/api/tabletopSessions";
		const body = JSON.stringify({
			tabletopSession
		});
		this._restClient.exec_post(url, body, callback);
	}

	setActive(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/setActive`;
		this._restClient.exec_post(url, null, callback);
	}

	setController(tabletopSessionId, controller, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/setController`;
		const body = JSON.stringify({
			controller
		});
		this._restClient.exec_post(url, body, callback);
	}

	setUserMappings(tabletopSessionId, userMappings, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/userMappings`;
		const body = JSON.stringify({
			userMappings
		});
		this._restClient.exec_post(url, body, callback);
	}

	createCommunication(tabletopSessionId, communication, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/communications`;
		const body = JSON.stringify({
			communication
		});
		this._restClient.exec_post(url, body, callback);
	}

	markSimulationAsFailed(tabletopSessionId, simId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/markFailed`;
		this._restClient.exec_post(url, null, callback);
	}

	setPlaybackSettings(tabletopSessionId, playbackSettings, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/playbackSettings`;
		const body = JSON.stringify({
			playbackSettings
		});
		this._restClient.exec_post(url, body, callback);
	}

	deleteSession(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}`;
		this._restClient.exec_delete(url, callback);
	}

	resumeSession(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/resume`;
		this._restClient.exec_post(url, null, callback);
	}

	loadExistingSession(tabletopSessionId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/load`;
		this._restClient.exec_post(url, null, callback);
	} 

	deleteExistingSessions(tabletopSessions, callback) {
		const url = "/tabletop-app/api/tabletopSessions/delete";
		const body = JSON.stringify({
			tabletopSessions
		});
		this._restClient.exec_post(url, body, callback);
	}

	setSimulationMode(tabletopSessionId, simulationMode, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/setSimulationMode`;
		const body = JSON.stringify({
			simulationMode
		});
		this._restClient.exec_post(url, body, callback);
	}

	loadSimulation(tabletopSessionId, simId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/load`;
		this._restClient.exec_post(url, null, callback);
	}

	getSimulationFrames(tabletopSessionId, simId, afterTime, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/frames/${afterTime}`;
		this._restClient.exec_get(url, callback);
	}

	playSimulation(tabletopSessionId, simId, fromTime, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/play`;
		const body = JSON.stringify({
			fromTime
		});
		this._restClient.exec_post(url, body, callback);
	}

	pauseSimulation(tabletopSessionId, simId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/pause`;
		this._restClient.exec_post(url, null, callback);
	}

	moveSimulation(tabletopSessionId, simId, moveSettings, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/move`;
		const body = JSON.stringify({
			moveSettings
		});
		this._restClient.exec_post(url, body, callback);
	}

	deleteSimulation(tabletopSessionId, simId, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}`;
		this._restClient.exec_delete(url, callback);
	}

	checkObjectiveLocation(tabletopSessionId, x, y, z, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/objectiveLocationCheck/${x}/${y}/${z}`;
		if (callback){
			this._restClient.exec_get(url, callback);
		} else {
			return new Promise((resolve, reject)=>{
				this._restClient.exec_get(url, (err, result)=>{
					if (err){
						reject(err);
						return;
					}
					resolve(result);
				});
			});
		}
	}

	getLocationHistory(tabletopSessionId, simId, afterTime, agentId, currLon, currLat, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/simulations/${simId}/locationHistory/${afterTime}/${agentId}/${currLon}/${currLat}`;
		this._restClient.exec_get(url, callback);
	}

	setSetting(tabletopSessionId, settingName, settingValue, callback) {
		const url = `/tabletop-app/api/tabletopSessions/${tabletopSessionId}/settings`;
		const body = JSON.stringify({
			settingName,
			settingValue
		});
		this._restClient.exec_post(url, body, callback);
	}
	
	subscribeSessions(callback) {
		this._rc.subscribe("tabletop-app", "/tabletopSessions", null, function(msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}

	subscribeSessionState(tabletopSessionId, callback) {
		const args = {
			tabletopSessionId
		};
		this._rc.subscribe("tabletop-app", "/tabletopSessionState", args, function(msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}
}

const tabletopSessionService = new TabletopSessionService();
export default tabletopSessionService;