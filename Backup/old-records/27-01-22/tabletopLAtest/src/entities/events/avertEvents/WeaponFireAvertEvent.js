import * as utilities from "../../../shared/utility/utilities";
import AvertEvent from "../AvertEvent";

class WeaponFireAvertEvent extends AvertEvent {
	constructor(event) {
		super(event);
	}

	get classification() {
		return "weaponFire";
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
		const victimAgent = agents[this.event.participantId];
		const aggressorAgent = agents[this.event.actorId];
		const causedByText = aggressorAgent ? `by ${aggressorAgent.entityData.properties.name} ` : "";
		const causeText = this.event.actorTool ? `using ${this.event.actorTool} ` : "";
		return `${victimAgent.entityData.properties.name} was SHOT ${causedByText}${causeText}at ${utilities.truncate(this.effectiveTime, simTimePrecision)}`;
	}

	getData(agents) {
		const victimAgent = agents[this.event.participantId];
		const aggressorAgent = agents[this.event.actorId];
		return {
			classification: this.classification,
			subjectId: victimAgent.id,
			subjectName: victimAgent.entityData.properties.name,
			subjectType: victimAgent.entityType,
			opponentId: aggressorAgent ? aggressorAgent.id : null,
			opponentName: aggressorAgent ? aggressorAgent.entityData.properties.name : null,
			opponentType: aggressorAgent ? aggressorAgent.entityType : null,
			verb: "SHOT",
			cause: this.event.actorTool,
			time: this.effectiveTime
		};
	}

	getTraceCoordinates(agents, fullTrace) {
		// We display full trace if fullTrace is true or if the opponent's current location is known, else we display half trace
		if (fullTrace || (agents && agents[this.event.actorId] && agents[this.event.actorId].entityData && agents[this.event.actorId].entityData.geometry
			&& agents[this.event.actorId].entityData.properties && !agents[this.event.actorId].entityData.properties.lastSeenTime)) {
			return [
				[this.event.participantX, this.event.participantY, this.event.participantZ],
				[this.event.actorX, this.event.actorY, this.event.actorZ]
			];
		} else {
			return [
				[this.event.participantX, this.event.participantY, this.event.participantZ],
				[(this.event.actorX + this.event.participantX)/2, (this.event.actorY + this.event.participantY)/2, this.event.actorZ]
			];
		}
	}

	apply(frameAgents, tabletopSession) {
		let victimAgent = frameAgents[this.event.participantId];
		if (!victimAgent) {
			// We need to fetch from simulationData and add
			const simVictimAgent = tabletopSession.simulationData.agents[this.event.participantId];
			victimAgent = utilities.createAgentCopy(simVictimAgent, false);
			frameAgents[victimAgent.id] = victimAgent;
			this.pivotEvent = true;
		}		
	}

	undo(frameAgents) {
		if (this.pivotEvent) {
			const victimAgent = frameAgents[this.event.participantId];
			if (victimAgent) {
				delete frameAgents[victimAgent.id];
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

export default WeaponFireAvertEvent;