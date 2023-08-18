import { restClient } from "client-app-core";

class SimulationService {
	constructor(options) {
		this._options = options;
		this._restClient = restClient;
	}

	getAllBaseSimulations(callback) {
		const url = "/tabletop-app/api/simulations/base";
		this._restClient.exec_get(url, callback);
	}
}

const simulationService = new SimulationService();
export default simulationService;