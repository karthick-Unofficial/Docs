import _ from "lodash";
import * as utilities from "../../shared/utility/utilities";
import SyntheticEvent from "./SyntheticEvent";

class EquipmentInfoEvent extends SyntheticEvent {
	constructor(event) {
		super(event);
	}

	get displayInEventList() {
		return false;
	}

	get displayTrace() {
		return false;
	}
	get classification() {
		return "agentEquipment";
	}

	apply(frameAgents, tabletopSession) {
		let agent = frameAgents[this.event.actorId];
		if (!agent) {
			// We need to fetch from simulationData and add
			const simAgent = tabletopSession.simulationData.agents[this.event.actorId];
			agent = utilities.createAgentCopy(simAgent, false);
			frameAgents[agent.id] = agent;
		}
		if (!agent.entityData.properties.equipment) {
			agent.entityData.properties.equipment = [];
		}
		this.event.data.forEach(datum => {
			if (!agent.entityData.properties.equipment.find(eq => eq.libraryId === datum)) {
				const equipmentPattern = _.find(tabletopSession.simulationData.equipmentPatterns, (eqPattern) =>{
					return  eqPattern.id === datum;
				});
				
				if (equipmentPattern) {
					this.event.pivotFor = this.event.pivotFor || [];
					this.event.pivotFor.push(datum);
					agent.entityData.properties.equipment.push({ 
						libraryId: parseInt(datum), 
						name: equipmentPattern.entityData.properties.name 
					});
				}
			}
		});
	}

	undo(frameAgents) {
		if (!this.event.pivotFor) {
			return;
		}
		const agent = frameAgents[this.event.actorId];
		if (agent && agent.entityData.properties.equipment) {
			this.event.pivotFor.forEach(datum => {
				_.remove(agent.entityData.properties.equipment, eq => eq.libraryId === datum);
			});
		}
	}

	get canCommunicateToSameTeam() {
		return false;
	}

	get canCommunicateToOpponentTeam() {
		return true;
	}

	getCommsExclusionList() {
		return [];
	}
}

export default EquipmentInfoEvent;