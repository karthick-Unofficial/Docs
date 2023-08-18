import * as utilities from "../../../shared/utility/utilities";
import AvertEvent from "../AvertEvent";

class DetectionAvertEvent extends AvertEvent {
	constructor(event) {
		super(event);
	}

	get classification() {
		if (this.event.eventSubType === "COMMUNICATION") {
			return "detectionComms";
		}
		return "detection";
	}

	get displayInEventList() {
		return true;
	}

	get displayTrace() {
		return true;
	}

	get canShare() {
		return true;
	}

	get cause() {
		return this.event.actorTool;
	}

	getSubject(agents) {
		const agent = agents[this.event.participantId];
		if (agent) {
			return agent.entityData.properties.name;
		}
		return null;
	}

	getOpponent(agents) {
		const agent = agents[this.event.actorId];
		if (agent) {
			return agent.entityData.properties.name;
		}
		return null;
	}

	getTeam(simulationData) {
		const agent = simulationData.agents[this.event.actorId];
		if (agent) {
			return agent.entityData.properties.team;
		}
		return null;
	}

	getEntityTargets(agents) {
		const actor = agents[this.event.actorId];
		const participant = agents[this.event.participantId];
		if ((actor && actor.entityData.geometry) 
			|| (participant && participant.entityData.geometry)) {
			const entities = [];
			if (actor && actor.entityData.geometry) {
				entities.push(actor);
			}
			if (participant && participant.entityData.geometry) {
				entities.push(participant);
			}
			return entities;
		} else {
			return null;
		}
	}

	getGeometryTargets() {
		return null;
	}

	getDescription(agents, simulationData, simTimePrecision) {
		const detectedAgent = agents[this.event.participantId];
		const detectorAgent = agents[this.event.actorId];
		const detectedByText = detectorAgent ? `by ${detectorAgent.entityData.properties.name} ` : "";
		const causeTextPrefix = this.classification === "detectionComms" ? ", reported on" : "using";
		const causeText = this.event.actorTool ? `${causeTextPrefix} ${this.event.actorTool} ` : "";
		return `${detectedAgent.entityData.properties.name} was DETECTED ${detectedByText}${causeText}at ${utilities.truncate(this.effectiveTime, simTimePrecision)}`;
	}

	getData(agents) {
		const detectedAgent = agents[this.event.participantId];
		const detectorAgent = agents[this.event.actorId];
		return {
			classification: this.classification,
			subjectId: detectedAgent.id,
			subjectName: detectedAgent.entityData.properties.name,
			subjectType: detectedAgent.entityType,
			opponentId: detectorAgent ? detectorAgent.id : null,
			opponentName: detectorAgent ? detectorAgent.entityData.properties.name : null,
			opponentType: detectorAgent ? detectorAgent.entityType : null,
			verb: "DETECTED",
			cause: this.event.actorTool,
			time: this.effectiveTime
		};
	}

	getTraceCoordinates() {
		return [
			[this.event.participantX, this.event.participantY, this.event.participantZ],
			[this.event.actorX, this.event.actorY, this.event.actorZ]
		];
	}

	apply(frameAgents, tabletopSession) {
		let detectedAgent = frameAgents[this.event.participantId];
		if (!detectedAgent) {
			// We need to fetch from simulationData and add
			const simDetectedAgent = tabletopSession.simulationData.agents[this.event.participantId];
			detectedAgent = utilities.createAgentCopy(simDetectedAgent, false);
			frameAgents[detectedAgent.id] = detectedAgent;
		}
		if (!detectedAgent.entityData.properties.detected) {
			this.pivotEvent = true;
			detectedAgent.entityData.properties.detected = true;
		}
	}

	undo(frameAgents, tabletopSession) {
		if (this.pivotEvent) {
			const detectedAgent = frameAgents[this.event.participantId];
			if (detectedAgent) {
				detectedAgent.entityData.properties.detected = false;
				// Delete if not facilitator and not same team
				if (!tabletopSession.userInfo.isFacilitator 
					&& tabletopSession.userInfo.userRole !== detectedAgent.entityData.properties.team) {
					delete frameAgents[detectedAgent.id];
				}
			}
		}
	}

	get canCommunicateToSameTeam() {
		return true;
	}

	get canCommunicateToOpponentTeam() {
		return true;
	}

	getCommsExclusionList() {
		return [ this.event.actorId ];
	}
}

export default DetectionAvertEvent;