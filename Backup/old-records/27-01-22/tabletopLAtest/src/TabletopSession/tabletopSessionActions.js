import _ from "lodash";
import { facilityService, fileStorageService } from "client-app-core";
import TabletopSessionService from "../services/tabletopSessionService";
import * as actionTypes from "../actionTypes";
import * as utilities from "../shared/utility/utilities";

export { subscribeFeed } from "orion-components/GlobalData/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";

export { clearComponentMessage } from "../appActions";

// Session state subscription
export const subscribeSessionState = ( userId, sessionId ) => {
	return ( dispatch, getState ) => {
		TabletopSessionService.subscribeSessionState(sessionId, (err, response) => {
			if (err) {
				console.log("Error in subscribeSessionState callback: " + err);
			}
			if (!response) {
				return;
			}
			switch (response.type) {
				case "initial":
				case "add": 
					switch (response.subType) {		
						case "session":			
							dispatch(sessionReceived({
								userId,
								session: response.new_val
							}));
							break;
						case "simulation":
							dispatch(simulationAdded(response.new_val));
							break;
						case "simulationData":
							dispatch(simulationDataReceived(response.new_val));
							fetchSimulationFrames(sessionId, response.new_val.simId, null, dispatch, getState);
							break;
						case "currentFrame":
							dispatch(currentFrameUpdated(response.new_val));
							break;
						case "communication":
							dispatch(communicationReceived(response.new_val));
							break;
					}
					break;
				case "change": 
					switch (response.subType) {		
						case "session":			
							dispatch(sessionUpdated(response.new_val));
							// If current simulation has been set or new simulation set in it, 
							// new simulation load has been triggered.
							if ((!response.old_val.currentSimulation && response.new_val.currentSimulation)
								|| (response.old_val.currentSimulation && response.new_val.currentSimulation
									&& response.old_val.currentSimulation.simId !== response.new_val.currentSimulation.simId)) {
								dispatch(simulationLoadTriggered());	
							}
							break;
						case "simulation":
							dispatch(simulationUpdated(response.new_val));
							break;
						case "simulationData":
							dispatch(simulationDataReceived(response.new_val));
							fetchSimulationFrames(sessionId, response.new_val.simId, null, dispatch, getState);
							break;							
						case "currentFrame":
							dispatch(currentFrameUpdated(response.new_val));
							break;
					}
					break;					
				case "remove":
					switch (response.subType) {		
						case "simulation":
							dispatch(simulationDeleted(response.old_val.simId));
							break;
					}
					break;
				default:
					break;
			}
		});
	};
};

const sessionReceived = ( sessionData ) => {
	return {
		type: actionTypes.SESSION_RECEIVED,
		sessionData
	};
};

const sessionUpdated = ( session ) => {
	return {
		type: actionTypes.SESSION_UPDATED,
		session
	};
};

const simulationAdded = ( simulation ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_ADDED,
		simulation
	};
};

const simulationUpdated = ( simulation ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_UPDATED,
		simulation
	};
};

const simulationDeleted = ( simId ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_DELETED,
		simId
	};
};

const simulationLoadTriggered = () => {
	return {
		type: actionTypes.SESSION_SIMULATION_LOAD_TRIGGERED
	};
};

const simulationDataReceived = ( simulationData ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_DATA_RECEIVED,
		simulationData
	};
};

const currentFrameUpdated = ( currentFrame ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_CURRENTFRAME_RECEIVED,
		currentFrame
	};
};

const communicationReceived = ( communication ) => {
	return {
		type: actionTypes.COMMUNICATION_RECEIVED,
		communication
	};
};

export const setController = (sessionId, controller) => {
	return (dispatch) => {
		TabletopSessionService.setController(sessionId, controller, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Setting controller successful");
			}
		});
	};
};

export const setSimulationMode = (sessionId, simulationMode) => {
	return (dispatch) => {
		TabletopSessionService.setSimulationMode(sessionId, simulationMode, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Setting simulation mode successful");
			}
		});
	};
};

export const createCommunication = (sessionId, communicationData) => {
	return (dispatch) => {

		TabletopSessionService.createCommunication(sessionId, communicationData, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("Communication creation successful");
			}
		});
	};
};

// Load simulation
export const loadSimulation = ( sessionId, simId ) => {
	return ( dispatch ) => {
		TabletopSessionService.loadSimulation(sessionId, simId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("simulation load successful");
			}
		});
	};
};

// Delete simulations
export const deleteSimulation = ( sessionId, simId ) => {
	return ( dispatch ) => {
		TabletopSessionService.deleteSimulation(sessionId, simId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("simulations delete successful");
			}
		});
	};
};

// Set playback settings
export const setPlaybackSettings = ( sessionId, playbackSettings ) => {
	return ( dispatch ) => {
		TabletopSessionService.setPlaybackSettings(sessionId, playbackSettings, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("setting playback settings successful");
			}
		});
	};
};

// Fetch all simulation frames
const fetchSimulationFrames = ( sessionId, simId, afterTime, dispatch, getState ) => {
	let fetchFrames = true;
	if (afterTime === null) {
		// We need to find out till what time the frames are already available and trigger fetch accordingly
		const state = getState();
		const lastFrameTimeFetched = state.tabletopSession.lastFrameTimeFetched === undefined ? -1 : state.tabletopSession.lastFrameTimeFetched;
		if (lastFrameTimeFetched > -1 && state.tabletopSession.session.currentSimulation && state.tabletopSession.session.currentSimulation.simId
			&& state.tabletopSession.simulations && state.tabletopSession.simulations.hasOwnProperty(state.tabletopSession.session.currentSimulation.simId)) {
			const simulation = state.tabletopSession.simulations[state.tabletopSession.session.currentSimulation.simId];
			if (simulation.endTime && utilities.doubleEquals(lastFrameTimeFetched, simulation.endTime)) {
				fetchFrames = false;
			}
		}
		if (fetchFrames) {
			afterTime = lastFrameTimeFetched;
		}
	}
	if (!fetchFrames) {
		return;
	}
	TabletopSessionService.getSimulationFrames(sessionId, simId, afterTime, (err, response) => {
		if (err || !response || response.success === false) {
			utilities.handleApiError(err, response, dispatch);
		} else if (response) {
			let done = false;
			const state = getState();
			const frameData = response;
			if (frameData.frameSummary && frameData.frameSummary.startSimTime != null 
				&& frameData.frameSummary.endSimTime != null) {
				// We dispatch only if the data pertains to the current simulation. Else the current simulation may have changed
				if (state.tabletopSession.session && state.tabletopSession.session.currentSimulation 
					&& state.tabletopSession.session.currentSimulation.simId === simId) {
					dispatch(simulationFramesReceived(frameData));
					afterTime = frameData.frameSummary.endSimTime;
				} else {
					return;
				}
			}

			let simulation;
			if (state.tabletopSession.simulations) {
				simulation = state.tabletopSession.simulations[simId];
			}
			if (simulation && simulation.endTime && utilities.doubleEquals(afterTime, simulation.endTime)) {
				done = true;
			}
			if (!done) {
				utilities
					.sleep(200)
					.then(() => {
						if (state.tabletopSession.session && state.tabletopSession.session.currentSimulation 
							&& state.tabletopSession.session.currentSimulation.simId === simId) {
							fetchSimulationFrames(sessionId, simId, afterTime, dispatch, getState);
						}
					});
			}
		}
	});
};

const simulationFramesReceived = ( frameData ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_FRAMES_RECEIVED,
		frameData
	};
};

// Simulation playback
export const playSimulation = ( sessionId, simId, fromTime ) => {
	return ( dispatch ) => {
		TabletopSessionService.playSimulation(sessionId, simId, fromTime, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			}
		});
	};
};

export const pauseSimulation = ( sessionId, simId ) => {
	return ( dispatch ) => {
		TabletopSessionService.pauseSimulation(sessionId, simId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			}
		});
	};
};

export const moveSimulation = ( sessionId, simId, moveSettings ) => {
	return ( dispatch ) => {
		TabletopSessionService.moveSimulation(sessionId, simId, moveSettings, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			}
		});
	};
};

// Mark simulation as failed
export const markSimulationAsFailed = ( sessionId, simId ) => {
	return (dispatch) => {
		TabletopSessionService.markSimulationAsFailed(sessionId, simId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			}
		});
	};
};

// Fetch location history
export const fetchLocationHistory = ( sessionId, simId, agentId ) => {
	return (dispatch, getState) => {
		dispatch(locationHistoryTriggered(agentId));
		getLocationHistory(sessionId, simId, agentId, -1, 0, 0, dispatch, getState);
	};
};

const getLocationHistory = ( sessionId, simId, agentId, afterTime, currLon, currLat, dispatch, getState ) => {
	TabletopSessionService.getLocationHistory(sessionId, simId, afterTime, agentId, currLon, currLat, (err, response) => {
		if (err || !response || response.success === false) {
			utilities.handleApiError(err, response, dispatch);
		} else if (response) {
			let done = false;
			let lastLon = currLon;
			let lastLat = currLat;
			const locationData = response;
			if (locationData.locationSummary && locationData.locationSummary.startSimTime != null 
				&& locationData.locationSummary.endSimTime != null) {
				locationData.agentId = agentId;
				dispatch(locationHistoryReceived(locationData));
				afterTime = locationData.locationSummary.endSimTime;
				if (locationData.locations.length > 0) {
					const lastLocation = locationData.locations[locationData.locations.length - 1];
					lastLon = lastLocation.coordinates[0];
					lastLat = lastLocation.coordinates[1];
				}
			}
			const state = getState();
			let simulation;
			if (state.tabletopSession.simulations) {
				simulation = state.tabletopSession.simulations[simId];
			}
			if (simulation && simulation.endTime && utilities.doubleEquals(afterTime, simulation.endTime)) {
				done = true;
			}
			if (!done) {
				utilities
					.sleep(200)
					.then(() => {
						// Fetch next state if location history is still on for this agent
						const state = getState();
						if (state.tabletopSession.locationHistory && state.tabletopSession.locationHistory.hasOwnProperty(agentId)) {
							getLocationHistory(sessionId, simId, agentId, afterTime, lastLon, lastLat, dispatch, getState);
						}
					});
			}
		}
	});
};

export const locationHistoryTriggered = ( agentId ) => {
	return {
		type: actionTypes.LOCATIONHISTORY_TRIGGERED,
		agentId
	};
};

export const clearLocationHistory = ( agentId ) => {
	return {
		type: actionTypes.LOCATIONHISTORY_CLEAR,
		agentId
	};
};

const locationHistoryReceived = ( locationData ) => {
	return {
		type: actionTypes.LOCATIONHISTORY_RECEIVED,
		locationData
	};
};

export const setSessionSetting = ( sessionId, settingName, settingValue ) => {
	return (dispatch) => {
		TabletopSessionService.setSetting(sessionId, settingName, settingValue, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log(`Setting ${settingName} updated successfully.`);
			}
		});
	};
};

export const displayGuardOrders = ( orgId, guardName ) => {
	return (dispatch) => {
		const formattedGuardName = guardName.replace(/ /g, "_").toLowerCase();
		const fileName = `${orgId}_${formattedGuardName}.pdf`;
		fileStorageService.fileExists("tabletop-guard-orders", fileName, (err, response) => {
			if (err || !response || response.success === false) {
				dispatch({
					type: actionTypes.OPERATION_FAILED,
					error: "Fetching guard orders failed"
				});
			} else if (!response.exists) {
				dispatch({
					type: actionTypes.OPERATION_FAILED,
					error: `Guard orders not setup for guard ${guardName}`
				});
			} else {
				const w = window.open(`/_fileDownload?bucketName=tabletop-guard-orders&fileName=${fileName}`,
					`Guard Orders for ${guardName}`, "toolbar=no,location=no,status=no,menubar=no");
				setTimeout(() => { 
					if (w && w.document) {
						w.document.title = `Guard Orders for ${guardName}`;
					}
				}, 5000);
			}
		});
	};
};

export const displayFov = ( agentId ) => {
	return {
		type: actionTypes.DISPLAY_FOV,
		agentId
	};
};

export const hideFov = ( agentId ) => {
	return {
		type: actionTypes.HIDE_FOV,
		agentId
	};
};

// Fetch floor plans
export const getFloorPlans = ( facilityId ) => {
	return (dispatch) => {
		facilityService.getFacilityFloorplans(facilityId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				const { success, result } = response;
				if (success) {
					dispatch(floorPlansReceived(facilityId, result));
				}
			}
		});
	};
};

const floorPlansReceived = ( facilityId, floorPlans ) => {
	return {
		type: actionTypes.FLOORPLANS_RECEIVED,
		facilityId,
		floorPlans
	};
};

export const mapOpened = ( mapRef, facilityId, floorPlanId ) => {
	return {
		type: actionTypes.MAP_OPENED,
		mapData: {
			mapRef,
			facilityId,
			floorPlanId
		}
	};
};

export const mapClosed = ( floorPlanId ) => {
	return {
		type: actionTypes.MAP_CLOSED,
		mapData: {
			floorPlanId
		}
	};
};

export const loadAgentProfile = ( agentId ) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: "roster",
				widgetData: {
					agentId
				}
			}
		}
	};
};

export const openEventsWidget = ( ) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: "events"
			}
		}
	};
};

export const loadFacilityProfile = ( facilityId, floorPlanId = null ) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: "facilities",
				widgetData: {
					facilityId,
					floorPlanId
				}
			}
		}
	};
};

export const openMapLayersWidget = () => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: "mapLayers"
			}
		}
	};
};

export const closeModificationWidget = () => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "close",
				widget: "modifyExercise"
			}
		}
	};
};

export const setModificationExclusiveModeOn = () => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "exclusiveModeOn",
				widget: "modifyExercise"
			}
		}
	};
};

export const setModificationExclusiveModeOff = () => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "exclusiveModeOff"
			}
		}
	};
};

export const persistMapFloorplanControlState = (settings) => {
	return (dispatch) => {
		const settingsToPersist = _.cloneDeep(settings);
		settingsToPersist.facilityFloorplans = JSON.stringify(settingsToPersist.facilityFloorplans);
		dispatch(updatePersistedState("tabletop-app", "mapFloorPlanSettings", settingsToPersist));
	};
};

export const handleApiError = (err, response) => {
	return (dispatch) => {
		utilities.handleApiError(err, response, dispatch);
	};
};