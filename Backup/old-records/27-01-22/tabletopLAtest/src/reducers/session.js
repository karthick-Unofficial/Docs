import _ from "lodash";
import { lineString } from "@turf/helpers";
import bbox from "@turf/bbox";
import * as actionTypes from "../actionTypes";
import { createCurrentDataForFrame, createCurrentDataForComms } from "./sessionCurrentData";
import * as utilities from "../shared/utility/utilities";
const initialState = {};
/*initialState = {
	userInfo: {},
	session: {},
	simulations: {},
	simulationData: {
		agents: {},
		agentGroups: {},
		objectives: {},
		barriers: {},
		interdictionSites: {},
		commDevices: {},
		equipmentPatterns: {},
		userHasCommDevices: false
	},
	lastFrameTimeFetched: -1,
	simulationFrames: [],
	currentFrame: {},
	currentData: {
		agents: {},
		agentGroups: {},
		events: []
	},
	floorPlans: {},
	communications: [],
	modifications: {},
	modificationSubscription: {}
	mapRefs: [],
	traceLineFeatures: [],
	tracePointFeatures: [],
	locationHistory: {},
	fovAgents: []
};*/

const session = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SESSION_RECEIVED: {
			if (!action.sessionData || !action.sessionData.userId || !action.sessionData.session) {
				// It is possible that we navigated back to tabletopSessions and this reducer is not yet unregistered
				// Skip handling.
				return state;
			}
			const isFacilitator = action.sessionData.session.facilitator === action.sessionData.userId;
			let userRole = null;
			let selfAgentIds = null;
			let controlledAgentIds = null;
			if (!isFacilitator) {
				const userMapping = action.sessionData.session.userMappings.find(userMapping => 
					userMapping.userId === action.sessionData.userId);
				if (userMapping) {
					userRole = userMapping.userRole;
					selfAgentIds = userMapping.selfAgentIds;
					controlledAgentIds = userMapping.controlledAgentIds;
				}
			}
			return {
				...state,
				userInfo: { 
					userId: action.sessionData.userId,
					isFacilitator,
					userRole,
					selfAgentIds,
					controlledAgentIds					
				},
				session: action.sessionData.session
			};
		}
		case actionTypes.SESSION_UPDATED: {
			// Clear location history if not facilitator and simulation mode is not playback
			let newLocationHistory;
			if ((state.userInfo && state.userInfo.isFacilitator) || action.session.simulationMode === "playback") {
				newLocationHistory = state.locationHistory;
			} else {
				newLocationHistory = null;
			}
			return {
				...state,
				session: action.session,
				locationHistory: newLocationHistory
			};
		}
		case actionTypes.SESSION_SIMULATION_ADDED:
		case actionTypes.SESSION_SIMULATION_UPDATED: 
			return {
				...state,
				simulations: { 
					...state.simulations, 
					[action.simulation.simId]: action.simulation 
				}
			};
		case actionTypes.SESSION_SIMULATION_DELETED: {
			const newSimulations = { ...state.simulations };
			delete newSimulations[action.simId];
			return {
				...state,
				simulations: newSimulations
			};
		}
		case actionTypes.SESSION_SIMULATION_DATA_RECEIVED: {
			const agents = _.reduce(action.simulationData.agents, function(obj, agent) {
				obj[agent.id] = agent;
				return obj;
			   }, {});
			const agentGroups = _.reduce(action.simulationData.agentGroups, function(obj, agentGroup) {
				obj[agentGroup.id] = agentGroup;
				return obj;
			   }, {});
			const objectives = _.reduce(action.simulationData.objectives, function(obj, objective) {
				obj[objective.id] = objective;
				return obj;
			   }, {});
			const barriers = _.reduce(action.simulationData.barriers, function(obj, barrier) {
				obj[barrier.id] = barrier;
				return obj;
			   }, {});
			const interdictionSites = _.reduce(action.simulationData.interdictionSites, function(obj, interdictionSite) {
				obj[interdictionSite.id] = interdictionSite;
				return obj;
			   }, {});
			const commDevices = _.reduce(action.simulationData.commDevices, function(obj, commDevice) {
				obj[commDevice.id] = commDevice;
				return obj;
			   }, {});
			const equipmentPatterns = _.reduce(action.simulationData.equipmentPatterns, function(obj, equipmentPattern) {
				obj[equipmentPattern.id] = equipmentPattern;
				return obj;
			   }, {});
			let hasCommDevice = false;
			if (!state.userInfo.isFacilitator) {
				if (state.session.userMappings) {
					const userMappings = state.session.userMappings.find(userMapping => 
						userMapping.userId === state.userInfo.userId);
					if (userMappings) {
						const cDevices = _.values(commDevices);
						for (let i = 0; i < cDevices.length; i++) {
							if (userMappings.selfAgentIds.includes(cDevices[i].entityData.properties.ownerId)) {
								hasCommDevice = true;
								break;
							}
						}
					}
				}
			}
			return {
				...state,
				simulationData: {
					agents: agents,
					agentGroups: agentGroups,
					objectives: objectives,
					barriers: barriers,
					interdictionSites: interdictionSites,
					commDevices: commDevices,
					equipmentPatterns: equipmentPatterns,
					userHasCommDevices: hasCommDevice
				}
			};
		}
		case actionTypes.SESSION_SIMULATION_FRAMES_RECEIVED: {
			const newSimulationFrames = state.simulationFrames ? [ ...state.simulationFrames, ...action.frameData.frames ] 
				: [ ...action.frameData.frames ];
			const newState = {
				...state,
				lastFrameTimeFetched: action.frameData.frameSummary.endSimTime,
				simulationFrames: newSimulationFrames
			};
			// If the current frame has not yet been processed to create current data and it is now possible to 
			// process it, do so.
			if (newState.currentFrame 
				&& utilities.doubleLessThanEquals(newState.currentFrame.simTime, newState.lastFrameTimeFetched) 
				&& (!newState.currentData 
					|| !utilities.doubleEquals(newState.currentData.currentSimTime, newState.currentFrame.simTime))) {
				const newCurrentData = createCurrentDataForFrame(newState, newState.currentFrame);
				newState.currentData = newCurrentData;
			}
			return newState;
		}
		case actionTypes.SESSION_SIMULATION_LOAD_TRIGGERED:
			return {
				...state,
				lastFrameTimeFetched: -1,
				simulationData: null,
				simulationFrames: [],
				currentData: null,
				traceLineFeatures: null,
				tracePointFeatures: null,
				locationHistory: null,
				fovAgents: null
			};
		case actionTypes.SESSION_SIMULATION_CURRENTFRAME_RECEIVED: {
			if (!state.lastFrameTimeFetched || utilities.doubleGreaterThan(action.currentFrame.simTime, state.lastFrameTimeFetched)) {
				// Frame not yet available in simulationFrames. We need to wait for it.
				return {
					...state,
					currentFrame: action.currentFrame
				};
			}
			const newCurrentData = createCurrentDataForFrame(state, action.currentFrame);
			return {
				...state,
				currentFrame: action.currentFrame,
				currentData: newCurrentData
			};
		}
		case actionTypes.FLOORPLANS_RECEIVED: {
			const orderedPlans = _.orderBy(action.floorPlans, "order", "asc");
			for (let i = 0; i < orderedPlans.length; i++) {
				const floorPlan = orderedPlans[i];
				if (i < orderedPlans.length - 1) {
					floorPlan.nextPlanAltitude = orderedPlans[i+1].altitude;
				} else {
					floorPlan.nextPlanAltitude = Number.MAX_VALUE;
				}
				floorPlan.bbox = bbox(lineString(floorPlan.geometry.coordinates[0]));
			}
			return {
				...state,
				floorPlans: {
					...state.floorPlans,
					[action.facilityId]: orderedPlans
				}
			};
		}
		case actionTypes.COMMUNICATION_RECEIVED: {
			// Add the communication in ascending order of time
			const newComms = [ ...(state.communications || []) ];
			newComms.splice(_.sortedIndexBy(newComms, action.communication, "time"), 0, action.communication);
			let newCurrentData = null;
			if (state.currentData) {
				newCurrentData = createCurrentDataForComms(action.communication, state.currentData, state);
			}
			return {
				...state,
				currentData: newCurrentData,
				communications: newComms
			};
		}
		case actionTypes.MODIFICATIONS_SUBSCRIBED:
			return {
				...state,
				modificationSubscription: action.subscription
			};
		case actionTypes.MODIFICATIONS_UNSUBSCRIBED:
			return {
				...state,
				modifications: {},
				modificationSubscription: null
			};
		case actionTypes.MODIFICATION_ADDED:
		case actionTypes.MODIFICATION_UPDATED: 
			return {
				...state,
				modifications: {
					...state.modifications,
					[action.modification.id]: action.modification
				}
			};
		case actionTypes.MODIFICATION_DELETED: {
			const newModifications = { ...state.modifications };
			delete newModifications[action.modificationId];
			return {
				...state,
				modifications: newModifications
			};
		}
		case actionTypes.MAP_OPENED: {
			const newMapRefs = [ ...(state.mapRefs || []) ];
			newMapRefs.push(action.mapData);
			return {
				...state,
				mapRefs: newMapRefs
			};
		}
		case actionTypes.MAP_CLOSED: {
			const newMapRefs = [ ...(state.mapRefs || []) ];
			_.remove(newMapRefs, mapRef => 
				(!action.mapData.floorPlanId && !mapRef.floorPlanId)
				|| (mapRef.floorPlanId === action.mapData.floorPlanId));
			return {
				...state,
				mapRefs: newMapRefs
			};
		}
		case actionTypes.TRACE_FEATURES_SET:
			return {
				...state,
				traceLineFeatures: action.lineFeatures,
				tracePointFeatures: action.pointFeatures
			};
		case actionTypes.LOCATIONHISTORY_TRIGGERED: 
			return {
				...state,
				locationHistory: {
					...state.locationHistory,
					[action.agentId]: []
				}
			};
		case actionTypes.LOCATIONHISTORY_RECEIVED: {
			if (action.locationData.locations.length === 0) {
				return state;
			}
			const existingHistory = state.locationHistory && state.locationHistory.hasOwnProperty(action.locationData.agentId)
				? state.locationHistory[action.locationData.agentId] : null;
			if (!existingHistory) {
				return state;
			}
			const name = state.simulationData.agents[action.locationData.agentId].entityData.properties.name;
			const team = state.simulationData.agents[action.locationData.agentId].entityData.properties.team;
			return {
				...state,
				locationHistory: {
					...state.locationHistory,
					[action.locationData.agentId]: [...existingHistory, ...(action.locationData.locations.map(location => {
						return {
							properties: {
								agentId: action.locationData.agentId,
								agentName: name,
								simTime: location.simTime,
								team
							},
							geometry: {
								type: "Point",
								coordinates: location.coordinates
							}
						};
					}))]
				}
			};
		}
		case actionTypes.LOCATIONHISTORY_CLEAR: {
			let newLocationHistory = state.locationHistory ? {...state.locationHistory} : null;
			if (newLocationHistory) {
				delete newLocationHistory[action.agentId];
			}
			if (_.keys(newLocationHistory).length === 0) {
				newLocationHistory = null;
			}
			return {
				...state,
				locationHistory: newLocationHistory
			};
		}
		case actionTypes.DISPLAY_FOV:
			return {
				...state,
				fovAgents: [...(state.fovAgents || []), action.agentId]
			};
		case actionTypes.HIDE_FOV: {
			const newFovAgents = [...(state.fovAgents || [])];
			const index = newFovAgents.indexOf(action.agentId);
			if (index > -1) {
				newFovAgents.splice(index, 1);
			}
			return {
				...state,
				fovAgents: newFovAgents
			};
		}
		default:
			return state;
	}
};

export default session;