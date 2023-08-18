import _ from "lodash";
import * as utilities from "../../../shared/utility/utilities";
import AvertEvent from "../AvertEvent";

class TargetDestroyedAvertEvent extends AvertEvent {
	constructor(event) {
		super(event);
	}

	get classification() {
		return "targetDestroyed";
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

	getSubject(agents, simulationData) {
		const objective = simulationData.objectives[this.event.participantId];
		if (objective) {
			return objective.entityData.properties.name;
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

	getEntityTargets(agents, simulationData) {
		const objective = simulationData.objectives[this.event.participantId];
		const actor = agents[this.event.actorId];
		if ((actor && actor.entityData.geometry) 
			|| (objective && objective.entityData.geometry)) {
			const entities = [];
			if (actor && actor.entityData.geometry) {
				entities.push(actor);
			}
			if (objective && objective.entityData.geometry) {
				entities.push(objective);
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
		const objective = simulationData.objectives[this.event.participantId];
		const actor = agents[this.event.actorId];
		const causedByText = actor ? `by ${actor.entityData.properties.name} ` : "";
		const causeText = this.event.actorTool ? `using ${this.event.actorTool} ` : "";
		return `${objective.entityData.properties.name} was DESTROYED ${causedByText}${causeText}at ${utilities.truncate(this.effectiveTime, simTimePrecision)}`;
	}

	getData(agents, simulationData) {
		const objective = simulationData.objectives[this.event.participantId];
		const agent = agents[this.event.actorId];
		return {
			classification: this.classification,
			subjectId: objective.id,
			subjectName: objective.entityData.properties.name,
			subjectType: objective.entityType,
			opponentId: agent ? agent.id : null,
			opponentName: agent ? agent.entityData.properties.name : null,
			opponentType: agent ? agent.entityType : null,
			verb: "DESTROYED",
			cause: this.event.actorTool,
			time: this.effectiveTime
		};
	}

	getTraceCoordinates() {
		return [this.event.participantX, this.event.participantY, this.event.participantZ];
	}

	apply(frameAgents, tabletopSession) {
		// TODO: This has same code as barrier breach apply. Need to refactor, specially if more duplications need to be made.
		try {
			// We see if any equipments on opponent (causing the breach) get uncovered. 
			// Facilitator and same team members already know equipments.
			if (tabletopSession.userInfo.isFacilitator) {
				return;
			}

			const actor = frameAgents[this.event.actorId];
			if (!actor || actor.entityData.properties.team === tabletopSession.userInfo.userRole) {
				return;
			}

			if (this.event.eventSignatureName) {
				let equipmentUncovered = null;
				const patterns = _.values(tabletopSession.simulationData.equipmentPatterns);

				// First look for in-use signatures
				const inUsePatterns = [];
				patterns.forEach(pattern => {
					if (_.isEqual(pattern.entityData.properties.inUseSignature, this.event.eventSignatureName)) {
						inUsePatterns.push(pattern);
					}
				});

				if (inUsePatterns.length > 0) {
					inUsePatterns.forEach(inUsePattern => {
						const equipment = tabletopSession.simulationData.agents[this.event.actorId].entityData.properties.equipment.filter(
							eq => _.isEqual(eq.libraryId, inUsePattern.id));
						if (equipment.length > 1) {
							return; // We have multiple matches, dont know which equipment to uncover
						}
						if (equipment.length === 1) {
							equipmentUncovered = equipment[0];
						}
					});
				}

				if (!equipmentUncovered) {
					// We now look into normal signatures
					const normalPatterns = [];
					patterns.forEach (pattern => {
						if (_.isEqual(pattern.entityData.properties.normalSignature, this.event.eventSignatureName)) {
							normalPatterns.push(pattern);
						}
					});
					if (normalPatterns.length > 0) {
						normalPatterns.forEach(normalPattern => {
							const equipment = tabletopSession.simulationData.agents[this.event.actorId].entityData.properties.equipment.filter(
								eq => _.isEqual(eq.libraryId, normalPattern.id));
							if (equipment.length > 1) {
								return; // We have multiple matches, dont know which equipment to uncover
							}
							if (equipment.length === 1) {
								equipmentUncovered = equipment[0];
							}
						});
					}
				}

				if (!equipmentUncovered) {
					return;
				}

				// If equipment uncovered is already known, we return
				if (actor.entityData.properties.equipment && actor.entityData.properties.equipment.find(eq => eq.libraryId === equipmentUncovered.libraryId)) {
					return;
				}
				
				// An equipment has been uncovered. Check if a communication for the same already exists. If not, send communication
				if (!tabletopSession.communications || !tabletopSession.communications.find(com => 
					com.type === "EQUIPMENT_INFO" && com.implicit && com.time <= tabletopSession.session.currentSimulation.playStatus.simTime &&
					_.isEqual(com.to, tabletopSession.userInfo.selfAgentIds) && com.data === `${actor.id}#${equipmentUncovered.libraryId}`)) {
					const commObj = {
						simId: tabletopSession.session.currentSimulation.simId,
						time: tabletopSession.session.currentSimulation.playStatus.simTime,
						type: "EQUIPMENT_INFO",
						data: `${actor.id}#${equipmentUncovered.libraryId}`,
						commDevices: [],
						to: tabletopSession.userInfo.selfAgentIds,
						implicit: true
					};
					return commObj;
				}
			}
		} catch (err) {
			console.log("Target destroyed event apply failed with error: " + err);
		}
	}

	undo() {
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

export default TargetDestroyedAvertEvent;