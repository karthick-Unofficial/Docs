import _ from "lodash";
import AvertEvent from "../AvertEvent";
import {truncate} from "../../../shared/utility/utilities";

class BarrierBreachAvertEvent extends AvertEvent {
	constructor(event) {
		super(event);
	}

	get classification() {
		return "barrierBreach";
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

	getSubject() {
		return this.event.participantName;
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
		const agent = agents[this.event.actorId];
		if (agent && agent.entityData.geometry) {
			return [ agent ];
		} else {
			return null;
		}
	}

	getGeometryTargets() {
		return [{
			"coordinates": [       
				this.event.participantX,       
				this.event.participantY,
				this.event.participantZ    
			],     
			"type": "Point"   
		}];
	}

	getDescription(agents, simulationData, simTimePrecision) {
		const agent = agents[this.event.actorId];
		const breachByText = agent ? `by ${agent.entityData.properties.name} ` : "";
		const causeText = this.event.actorTool ? `using ${this.event.actorTool} ` : "";
		return `${this.event.participantName} was BREACHED ${breachByText}${causeText}at ${truncate(this.effectiveTime, simTimePrecision)}`;
	}

	getData(agents) {
		const agent = agents[this.event.actorId];
		return {
			classification: this.classification,
			subjectId: null,
			subjectName: this.event.participantName,
			subjectType: "barrier",
			opponentId: agent ? agent.id : null,
			opponentName: agent ? agent.entityData.properties.name : null,
			opponentType: agent ? agent.entityType : null,
			verb: "BREACHED",
			cause: this.event.actorTool,
			time: this.effectiveTime
		};
	}

	getTraceCoordinates() {
		return [this.event.participantX, this.event.participantY, this.event.participantZ];
	}

	apply(frameAgents, tabletopSession) {
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
			console.log("Barrier breach event apply failed with error: " + err);
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

export default BarrierBreachAvertEvent;