import TabletopSessionService from "../services/tabletopSessionService";
import SimulationService from "../services/simulationService";
import * as actionTypes from "../actionTypes";
import * as utilities from "../shared/utility/utilities";

// Session list related actions
export const subscribeSessions = () => {
	return dispatch => {
		TabletopSessionService.subscribeSessions( (err, response) => {
			if (err) {
				console.log("Error in subscribeSessions callback: " + err);
			}
			if (!response) {
				return;
			}
			if (response.state && response.state === "ready") {
				dispatch(allSessionsLoaded());
				return;
			}
			if (!response.type) {
				return;
			}
			switch (response.type) {
				case "initial":
				case "add": 					
					dispatch(sessionAdded(response.new_val));
					break;
				case "change": 
					dispatch(sessionUpdated(response.new_val));
					break;					
				case "remove":
					dispatch(sessionDeleted(response.old_val.id));
					break;
				default:
					break;
			}
		});
	};
};

const sessionAdded = ( session ) => {
	return {
		type: actionTypes.SESSION_ADDED,
		session
	};
};

const sessionUpdated = ( session ) => {
	return {
		type: actionTypes.SESSION_UPDATED,
		session
	};
};

const sessionDeleted = ( sessionId ) => {
	return {
		type: actionTypes.SESSION_DELETED,
		sessionId
	};
};

const allSessionsLoaded = () => {
	return {
		type: actionTypes.ALL_SESSIONS_LOADED
	};
};

// New session related actions
export const getBaseSimulations = () => {
	return dispatch => {
		SimulationService.getAllBaseSimulations((err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else if (response) {
				dispatch(baseSimulationsReceived(response));
			}
		});
	};
};

export const createSession = ( tabletopSession ) => {
	return dispatch => {
		// We start initializing the session. Set state first to indicate this.
		dispatch(sessionInitializing({
			newSession: true, 
			continueSession: false
		}));
		TabletopSessionService.createSession(tabletopSession, (err, response) => {
			if (err || !response || response.success === false) {
				const error = utilities.handleApiError(err, response, null); // We want to dispatch error ourselves
				dispatch(sessionInitFailed(error));
			} else if (response) {
				const newSession = response;
				// We update session id in state
				dispatch(sessionInitializing({
					sessionId: newSession.id
				}));
				// Subscribe to session state
				TabletopSessionService.subscribeSessionState(newSession.id, (subErr, subResponse) => {
					if (subErr) {
						console.log("Error in subscribeSessionState callback: " + subErr);
					}
					if (subResponse) {
						if (subResponse.subType === "session") {
							dispatch(sessionReceivedOrUpdated(subResponse.new_val));
						}
						if (subResponse.subType === "simulation" && 
							subResponse.new_val.name === newSession.baseSimName) {
							dispatch(sessionLoadStatusUpdated({
								baseSimId: subResponse.new_val.simId,
								avertLoadProgressPct: subResponse.new_val.progress,
								avertLoadStatus: subResponse.new_val.avertStatus
							}));
						}
						if (subResponse.subType === "simulationData") {
							dispatch(simulationDataReceived(subResponse.new_val));
						}
					}
				});
			}
		});
	};
};

const baseSimulationsReceived = ( simulations ) => {
	return {
		type: actionTypes.BASE_SIMULATION_LIST_RECEIVED,
		simulations
	};
};

const sessionInitializing = ( sessionData ) => {
	return {
		type: actionTypes.SESSION_INITIALIZING,
		sessionData
	};
};

const sessionInitFailed = ( error ) => {
	return {
		type: actionTypes.SESSION_INIT_FAILED,
		error
	};
};

const sessionReceivedOrUpdated = ( session ) => {
	return {
		type: actionTypes.SESSION_RECEIVED,
		session
	};
};

const sessionLoadStatusUpdated = ( loadStatus ) => {
	return {
		type: actionTypes.SESSION_AVERT_LOAD_STATUS_UPDATED,
		loadStatus
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

const simulationDataReceived = ( simulationData ) => {
	return {
		type: actionTypes.SESSION_SIMULATION_DATA_RECEIVED,
		simulationData
	};
};

// Set user mappings
export const setUserMappings = ( sessionId, userMappings ) => {
	return ( dispatch ) => {
		TabletopSessionService.setUserMappings(sessionId, userMappings, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("setting user mappings successful");
			}
		});
	};
};

// Start session
export const startSession = ( sessionId ) => {
	return ( dispatch ) => {
		TabletopSessionService.setActive(sessionId, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				// We redirect to the session that has been marked as active
				window.location = `${window.location.origin}/tabletop-app/#/tabletopSession?sessionId=${sessionId}`;
			}
		});
	};
};

// Resume session
export const resumeSession = ( session ) => {
	return (dispatch) => {
		TabletopSessionService.resumeSession(session.id, (err, response) => {
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else if (response && response.hasOwnProperty("ready")) {
				if (response.ready) {
					// We redirect to the session as it is ready
					window.location = `${window.location.origin}/tabletop-app/#/tabletopSession?sessionId=${session.id}`;
				} else {
					dispatch(sessionInitializing({
						sessionId: session.id, 
						newSession: false, 
						continueSession: true
					}));
					
					// We need to subscribe to the session state to determine when it will be ready to redirect to
					TabletopSessionService.subscribeSessionState(session.id, (subErr, subResponse) => {
						if (subErr) {
							console.log("Error in subscribeSessionState callback: " + subErr);
						}
						if (subResponse) {
							if (subResponse.subType === "session") {
								dispatch(sessionReceivedOrUpdated(subResponse.new_val));
							}
							if (subResponse.subType === "simulation" && 
								subResponse.new_val.name === session.baseSimName) {
								const progressPct = subResponse.new_val.progress;
								const loadStatus = subResponse.new_val.avertStatus;
								dispatch(sessionLoadStatusUpdated({
									baseSimId: subResponse.new_val.simId,
									avertLoadProgressPct: progressPct,
									avertLoadStatus: loadStatus
								}));
								if (progressPct === 100 && loadStatus === "COMPLETE") {
									// We redirect to the session as it is ready
									window.location = `${window.location.origin}/tabletop-app/#/tabletopSession?sessionId=${session.id}`;
								}
							}
						}
					});
				}
			}
		});
	};
};

// Join session
export const joinSession = ( session ) => {
	return () => {
		// We redirect to the session
		window.location = `${window.location.origin}/tabletop-app/#/tabletopSession?sessionId=${session.id}`;
	};
};

// Load existing session
export const loadExistingSession = ( session ) => {
	return (dispatch) => {
		dispatch(sessionInitializing({
			sessionId: session.id, 
			newSession: false, 
			continueSession: false
		}));
		TabletopSessionService.loadExistingSession(session.id, (err, response) => {
			if (err || !response || response.success === false) {
				const error = utilities.handleApiError(err, response, null); // We want to dispatch error ourselves
				dispatch(sessionInitFailed(error));
			} else {
				// We need to subscribe to the session state to determine when it will be ready to redirect to
				TabletopSessionService.subscribeSessionState(session.id, (subErr, subResponse) => {
					if (subErr) {
						console.log("Error in subscribeSessionState callback: " + subErr);
					}
					if (subResponse) {
						if (subResponse.subType === "session") {
							dispatch(sessionReceivedOrUpdated(subResponse.new_val));
						}
						if (subResponse.subType === "simulation" && 
							subResponse.new_val.name === session.baseSimName) {
							const progressPct = subResponse.new_val.progress;
							const loadStatus = subResponse.new_val.avertStatus;
							dispatch(sessionLoadStatusUpdated({
								baseSimId: subResponse.new_val.simId,
								avertLoadProgressPct: progressPct,
								avertLoadStatus: loadStatus
							}));
							if (progressPct === 100 && loadStatus === "COMPLETE") {
								// We redirect to the session as it is ready
								window.location = `${window.location.origin}/tabletop-app/#/tabletopSession?sessionId=${session.id}`;
							}
						}
					}
				});
			}
		});
	};
};

//deleteExistingSessions
export const deleteExistingSessions = ( sessions ) =>{
	return (dispatch) => {
		TabletopSessionService.deleteExistingSessions(sessions, (err, response) =>{
			if (err || !response || response.success === false) {
				utilities.handleApiError(err, response, dispatch);
			} else {
				console.log("existing Sessions deleted successfully.");
			}
		});
	};
};

// Set new session parameters
export const setBaseSimLoadTriggered = () => {
	return {
		type: actionTypes.SET_NEW_SESSION_BASE_SIM_LOAD_TRIGGERED
	};
};

export const setUserMappingsTriggered = () => {
	return {
		type: actionTypes.SET_NEW_SESSION_USER_MAPPINGS_TRIGGERED
	};
};

// Display user mappings
export const displayUserMappings = (display) => {
	return {
		type: actionTypes.SET_DISPLAY_USER_MAPPINGS,
		display
	};
};

export const clearSessionToLoad = () => {
	return {
		type: actionTypes.CLEAR_SESSION_TO_LOAD
	};
};