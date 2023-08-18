class Event {
	constructor(event) {
		this.event = event;
	}

	get effectiveTime() {
		return this.commsTime || this.event.time;
	}

	// eslint-disable-next-line no-unused-vars
	getSubject(agents, simulationData) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getOpponent(agents) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getTeam(simulationData) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getEntityTargets(agents, simulationData) {
		throw new Error("Not implemented");
	}

	getGeometryTargets() {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getDescription(agents, simulationData, simTimePrecision) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getData(agents, simulationData) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	getTraceCoordinates(agents, fullTrace) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	apply(frameAgents, tabletopSession) {
		throw new Error("Not implemented");
	}

	// eslint-disable-next-line no-unused-vars
	undo(frameAgents, tabletopSession) {
		throw new Error("Not implemented");
	}

	getCommsExclusionList() {
		return [];
	}
}

export default Event;