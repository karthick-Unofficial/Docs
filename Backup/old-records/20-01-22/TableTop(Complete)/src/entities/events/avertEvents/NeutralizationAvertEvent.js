import * as utilities from "../../../shared/utility/utilities";
import AvertEvent from "../AvertEvent";

class NeutralizationAvertEvent extends AvertEvent {
	constructor(event) {
		super(event);
	}

	get classification() {
		return "neutralization";
	}

	get displayInEventList() {
		return true;
	}

	get displayTrace() {
		return false;
	}

	get canShare() {
		return true;
	}

	get cause() {
		return this.event.participantTool;
	}

	getSubject(agents) {
		const agent = agents[this.event.actorId];
		if (agent) {
			return agent.entityData.properties.name;
		}
		return null;
	}

	getOpponent(agents) {
		const agent = agents[this.event.participantId];
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
		const neutralizedAgent = agents[this.event.actorId];
		const neutralizingAgent = agents[this.event.participantId];
		const neutralizedByText = neutralizingAgent ? `by ${neutralizingAgent.entityData.properties.name} ` : "";
		const causeText = this.event.participantTool ? `using ${this.event.participantTool} ` : "";
		return `${neutralizedAgent.entityData.properties.name} was NEUTRALIZED ${neutralizedByText}${causeText}at ${utilities.truncate(this.effectiveTime, simTimePrecision)}`;
	}

	getData(agents) {
		const neutralizedAgent = agents[this.event.actorId];
		const neutralizingAgent = agents[this.event.participantId];
		return {
			classification: this.classification,
			subjectId: neutralizedAgent.id,
			subjectName: neutralizedAgent.entityData.properties.name,
			subjectType: neutralizedAgent.entityType,
			opponentId: neutralizingAgent ? neutralizingAgent.id : null,
			opponentName: neutralizingAgent ? neutralizingAgent.entityData.properties.name : null,
			opponentType: neutralizingAgent ? neutralizingAgent.entityType : null,
			verb: "NEUTRALIZED",
			cause: this.event.participantTool,
			time: this.effectiveTime
		};
	}

	apply(frameAgents, tabletopSession) {
		let neutralizedAgent = frameAgents[this.event.actorId];
		if (!neutralizedAgent) {
			// We need to fetch from simulationData and add
			const simNeutralizedAgent = tabletopSession.simulationData.agents[this.event.actorId];
			neutralizedAgent = utilities.createAgentCopy(simNeutralizedAgent, false);
			frameAgents[neutralizedAgent.id] = neutralizedAgent;
		}
		neutralizedAgent.entityData.properties.neutralized = true;
	}

	undo(frameAgents, tabletopSession) {
		const neutralizedAgent = frameAgents[this.event.actorId];
		if (neutralizedAgent) {
			neutralizedAgent.entityData.properties.neutralized = false;
			// Delete if not detected and not (facilitator and not same team)
			if (!neutralizedAgent.entityData.properties.detected 
				&& !tabletopSession.userInfo.isFacilitator 
				&& tabletopSession.userInfo.userRole !== neutralizedAgent.entityData.properties.team) {
				delete frameAgents[neutralizedAgent.id];
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

export default NeutralizationAvertEvent;