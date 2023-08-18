import _ from "lodash";
import * as utilities from "../shared/utility/utilities";
import { createEvent, createEquipmentEvent } from "../entities/events/eventCreator";
import AvertEvent from "../entities/events/AvertEvent";

export const createCurrentDataForFrame = ( tabletopSession, newFrame ) => {
	// currentSimTime maintained in currentData duplicates tabletopSession.session.currentSimulation.playStatus.simTime 
	// but serves an important purpose. currentSimTime ensures that the frame for that simTime is available
	// and can be used where the associated frame information must be available.
	// tabletopSession.session.currentSimulation.playStatus.simTime does not guarantee that the frame for the simTime is 
	// available yet.

	const currentSimTime = newFrame.simTime;
	const oldSimTime = tabletopSession.currentData ? tabletopSession.currentData.currentSimTime : null;
	const moveForward = (oldSimTime == null) || (currentSimTime > oldSimTime);

	// We first setup the initial list of agents, either from the previous currentData, and if that 
	// does not exist, construct the list from simulationData.
	const agents = {};
	if (tabletopSession.currentData) {
		const currentDataAgents = _.values(tabletopSession.currentData.agents);
		currentDataAgents.forEach( currentAgent => {
			const agentCopy = utilities.createAgentCopy(currentAgent, true);
			agents[currentAgent.id] = agentCopy;
			// For facilitators, the correct location will already be set later when we process agentPositions
			// For same team agents, we initialize to location known at time 0
			// Processing agent positions later should get us to the correct state for the current frame.
			if (!tabletopSession.userInfo.isFacilitator && agentCopy.entityData.properties.team === tabletopSession.userInfo.userRole) {
				const simAgent = tabletopSession.simulationData.agents[agentCopy.id];
				if (simAgent) {
					agentCopy.entityData.geometry = simAgent.entityData.geometry;
					// If current sim time is 0, last seen time is invalid, else it will be 0
					if (!utilities.doubleEquals(currentSimTime, 0)) {
						agentCopy.entityData.properties.lastSeenTime = 0;
					}
				}
			}
		});
	} else {
		const simAgents = _.values(tabletopSession.simulationData.agents);
		simAgents.forEach( simAgent => {
			// Facilitator and same team members have access to this agent
			if (tabletopSession.userInfo.isFacilitator || 
				simAgent.entityData.properties.team === tabletopSession.userInfo.userRole) {
				agents[simAgent.id] = utilities.createAgentCopy(simAgent, true);
				agents[simAgent.id].entityData.properties.detected = false;
				agents[simAgent.id].entityData.properties.neutralized = false;
				// Same team members also know the location at time 0.
				// These will get overwritten by current frame as applicable.
				if (!tabletopSession.userInfo.isFacilitator) {
					agents[simAgent.id].entityData.geometry = simAgent.entityData.geometry;
					// If current sim time is 0, last seen time is invalid, else it will be 0
					if (!utilities.doubleEquals(currentSimTime, 0)) {
						agents[simAgent.id].entityData.properties.lastSeenTime = 0;
					}
				}
			}
		});
	}

	// Update agent positions based on the current frame
	if (newFrame.agentPositions) {
		newFrame.agentPositions.forEach(agentPosition => {
			if (!agents.hasOwnProperty(agentPosition.id)) {
				const simDataAgent = tabletopSession.simulationData.agents[agentPosition.id];
				const newAgent = utilities.createAgentCopy(simDataAgent, false);
				newAgent.entityData.properties.detected = false;
				newAgent.entityData.properties.neutralized = false;
				agents[agentPosition.id] = newAgent;
			}
			agents[agentPosition.id].entityData.geometry = agentPosition.geometry;
			agents[agentPosition.id].entityData.properties.heading = agentPosition.heading;
			agents[agentPosition.id].entityData.properties.vehicle = agentPosition.vehicle;
			agents[agentPosition.id].entityData.properties.lastSeenTime = agentPosition.lastSeenTime;
		});
	}

	const existingEvents = tabletopSession.currentData ? tabletopSession.currentData.events : [];
	const appliedCommAvertEvents = tabletopSession.currentData ? { ...tabletopSession.currentData.appliedCommAvertEvents } : {};
	const commsToSend = [];
	let newEvents = [];
	const newCurrentData = {
		currentSimTime,
		oldSimTime,
		agents,
		appliedCommAvertEvents
	};

	// Process communications followed by events
	let numEventsToRemove = 0;
	if (moveForward) {
		let commEventsAdded = false;
		// Processing communications if applicable. Facilitators know everything so dont depend on communications.
		if (!tabletopSession.userInfo.isFacilitator && tabletopSession.communications) {
			let forwardCommsIndex = 0;
			if (oldSimTime != null) {
				while (forwardCommsIndex < tabletopSession.communications.length
					&& utilities.doubleLessThanEquals(tabletopSession.communications[forwardCommsIndex].time, oldSimTime)) {
					forwardCommsIndex++;
				}
			}
			while (forwardCommsIndex < tabletopSession.communications.length
				&& utilities.doubleLessThanEquals(tabletopSession.communications[forwardCommsIndex].time, currentSimTime)) {
				const communication = tabletopSession.communications[forwardCommsIndex];
				if (isCommunicationApplicable(communication, tabletopSession)) {
					const commsEvent = getEventFromCommunication(communication, newCurrentData);
					if (commsEvent) {
						newEvents.push(commsEvent);
						const commToSend = commsEvent.apply(agents, tabletopSession);
						if (commToSend) {
							commsToSend.push(commToSend);
						}
						commEventsAdded = true;
					}
				}
				forwardCommsIndex++;
			}
		}
		// Now process events
		let forwardIndex = 0;
		if (oldSimTime != null) {
			while (forwardIndex < tabletopSession.simulationFrames.length
				&& utilities.doubleLessThanEquals(tabletopSession.simulationFrames[forwardIndex].simTime, oldSimTime)) {
				forwardIndex++;
			}
		}
		while (forwardIndex < tabletopSession.simulationFrames.length
			&& utilities.doubleLessThanEquals(tabletopSession.simulationFrames[forwardIndex].simTime, currentSimTime)) {
			tabletopSession.simulationFrames[forwardIndex].events.forEach( frameEvent => {
				if (!appliedCommAvertEvents[frameEvent.id]) { // event not processed through communication
					const eventToAdd = createEvent(frameEvent);
					if (eventToAdd) {
						if (commEventsAdded) {
							// Add event at the correct location instead of just pushing it at the end
							newEvents.splice(_.sortedIndexBy(newEvents, eventToAdd, "effectiveTime"), 0, eventToAdd);
						} else {
							newEvents.push(eventToAdd);
						}
						const commToSend = eventToAdd.apply(agents, tabletopSession);
						if (commToSend) {
							commsToSend.push(commToSend);
						}
					}
				}
			});
			forwardIndex++;
		}
	} else {
		let backwardIndex = existingEvents.length - 1;
		while (backwardIndex >= 0
			&& utilities.doubleGreaterThan(existingEvents[backwardIndex].effectiveTime, currentSimTime)) { 
			const eventToRemove = existingEvents[backwardIndex];
			eventToRemove.undo(agents, tabletopSession);
			if (eventToRemove.commsTime) {
				removeCommunicationEvent(eventToRemove, newCurrentData);
			}
			backwardIndex--;
			numEventsToRemove++;
		}
	}

	// Now set the events property in newCurrentData
	let events;
	if (newEvents.length > 0) {
		events = [...existingEvents, ...newEvents];
		if (oldSimTime == null) {
			newEvents = []; // Initializing
		}
	} else if (numEventsToRemove > 0) {
		events = existingEvents.slice(0, existingEvents.length - numEventsToRemove);
	} else {
		// No changes. Use the existing collection without changes
		events = existingEvents;
	}
	newCurrentData.events = events;
	newCurrentData.newEvents = newEvents;

	if (commsToSend.length > 0) {
		newCurrentData.commsToSend = commsToSend;
	}

	newCurrentData.agentGroups = deduceAgentGroups(newCurrentData.agents, tabletopSession.simulationData.agentGroups);

	return newCurrentData;
};

// Apply communication to current data to create a new one
export const createCurrentDataForComms = ( communication, currentData, tabletopSession ) => {
	if (tabletopSession.userInfo.isFacilitator) {
		return currentData;
	}

	if (isCommunicationApplicable(communication, tabletopSession)) {
		const newCurrentData = { 
			currentSimTime: currentData.currentSimTime,
			oldSimTime: currentData.currentSimTime,
			agents: { ...currentData.agents },
			events: [ ...currentData.events ],
			appliedCommAvertEvents: { ...currentData.appliedCommAvertEvents }
		}; 
		const commsEvent = getEventFromCommunication(communication, newCurrentData, tabletopSession);
		if (commsEvent) {
			newCurrentData.events.push(commsEvent);
			newCurrentData.newEvents = [ commsEvent ];
			const commToSend = commsEvent.apply(newCurrentData.agents, tabletopSession);
			if (commToSend) {
				newCurrentData.commsToSend = [ commToSend ];
			}
			newCurrentData.newCommunication = commsEvent;
			newCurrentData.agentGroups = deduceAgentGroups(newCurrentData.agents, tabletopSession.simulationData.agentGroups);
			return newCurrentData;
		}
	}
	return currentData; // No changes, so return the passed current data
};

const deduceAgentGroups = (agents, origAgentGroups) => {
	const agentGroups = {};
	if (!origAgentGroups || origAgentGroups.length === 0) {
		return agentGroups;
	}
	_.values(origAgentGroups).forEach(origAgentGroup => {
		const groupAgentIds = [ ...origAgentGroup.entityData.properties.agentIds ];
		const effectiveGroupAgentIds = [];
		groupAgentIds.forEach(groupAgentId => {
			if (!agents.hasOwnProperty(groupAgentId)) {
				return; // Agent not known
			}
			const agent = agents[groupAgentId];
			if (agent.neutralized) {
				return; // Neutralized agents are taken out of group so they get displayed separately
			}
			if (!agent.entityData.geometry) {
				return; // Agent location not known
			}
			effectiveGroupAgentIds.push(groupAgentId);
		});
		if (effectiveGroupAgentIds.length > 1) {
			// We check if any agents are at a different location and hence to be displayed separately
			const uniqueLocations = [];
			effectiveGroupAgentIds.forEach(groupAgentId => {
				const agent = agents[groupAgentId];
				const agentLocation = uniqueLocations.find(uLocation => {
					return (utilities.doubleEquals(agent.entityData.geometry.coordinates[0], uLocation.location[0])
						&& utilities.doubleEquals(agent.entityData.geometry.coordinates[1], uLocation.location[1]));
				});
				if (agentLocation) {
					agentLocation.agents.push(groupAgentId);
				} else {
					uniqueLocations.push({
						location: [ agent.entityData.geometry.coordinates[0], agent.entityData.geometry.coordinates[1] ],
						agents: [ groupAgentId ]
					});
				}
			});
			if (uniqueLocations.length === 1) {
				// All agents are at the same location
				agentGroups[origAgentGroup.id] = {
					...origAgentGroup,
					entityData: {
						properties: {
							...origAgentGroup.entityData.properties,
							agentIds: effectiveGroupAgentIds
						}
					}
				};
			} else {
				// Find maximum agents at same location
				let maxAgents = uniqueLocations[0].agents.length;
				let maxAgentsIndex = 0;
				for (let i = 1; i < uniqueLocations.length; i++) {
					if (uniqueLocations[i].agents.length > maxAgents) {
						maxAgents = uniqueLocations[i].agents.length;
						maxAgentsIndex = i;
					}
				}
				if (maxAgents > 1) {
					agentGroups[origAgentGroup.id] = {
						...origAgentGroup,
						entityData: {
							properties: {
								...origAgentGroup.entityData.properties,
								agentIds: uniqueLocations[maxAgentsIndex].agents
							}
						}
					};
				}
			}
		}
	});
	return agentGroups;
};

const isCommunicationApplicable = ( communication, tabletopSession ) => {
	// If this user sent the communication, they already know about it, so ignore - unless this is an implicit communication
	if (tabletopSession.userInfo.userId === communication.from && !communication.implicit) {
		return false;
	}

	// We dont currently check the to field as we believe that the check is not needed.

	if (communication.simId !== tabletopSession.session.currentSimulation.simId) {
		// We traverse the simulation hierarchy to see if this communication is applicable to this hierarchy
		let applicable = false;
		let simulation = tabletopSession.simulations[tabletopSession.session.currentSimulation.simId];
		while (!applicable && simulation.parentSimId) {
			if (simulation.parentDivergeTime
				&& utilities.doubleLessThanEquals(communication.time, simulation.parentDivergeTime)
				&& communication.simId === simulation.parentSimId) {
				applicable = true;
			} else {
				simulation = tabletopSession.simulations[simulation.parentSimId];
			}
		}
		if (!applicable) {
			return false;
		}
	}

	return true;
};

const getEventFromCommunication = ( communication, currentData ) => {
	let event;
	switch (communication.type) {
		case "AVERT_EVENT": {
			if (!currentData.appliedCommAvertEvents[communication.data]) {
				event = createEvent(communication.avertEvent);
				event.commsTime = communication.time;
				event.commsFrom = communication.from;
				currentData.appliedCommAvertEvents[communication.data] = event;
			}
			break;
		}
		case "EQUIPMENT_INFO": {
			event = createEquipmentEvent(communication);
			event.commsTime = communication.time;
			event.commsFrom = communication.from;
		}
	}
	return event;
};

const removeCommunicationEvent = ( event, currentData ) => {
	if (event instanceof AvertEvent) {
		delete currentData.appliedCommAvertEvents[event.event.id];
	}
};