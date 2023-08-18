import * as actionTypes from "../actionTypes";

const initialSessionToLoad = {
	sessionId: null,
	baseSimId: null,
	newSession: false,
	continueSession: false,
	newSessionParams: null,
	avertLoadProgressPct: 0,
	avertLoadStatus: "",
	initializing: false,
	session: null,
	simulationData: null
};

const initialState = {
	sessions: {},
	allSessionsLoaded: false,
	baseSimulations: [],
	sessionToLoad: initialSessionToLoad,
	displayUserMappings: false
};

const sessionList = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SESSION_ADDED:
		case actionTypes.SESSION_UPDATED: 
			return {
				...state,
				sessions: {
					...state.sessions,
					[action.session.id]: action.session
				}
			};
		case actionTypes.ALL_SESSIONS_LOADED:
			return {
				...state,
				allSessionsLoaded: true
			};
		case actionTypes.SESSION_DELETED: {
			const newSessions = { ...state.sessions };
			delete newSessions[action.sessionId];
			return {
				...state,
				sessions: newSessions
			};
		}
		case actionTypes.BASE_SIMULATION_LIST_RECEIVED:
			return {
				...state,
				baseSimulations: action.simulations
			};
		case actionTypes.SESSION_INITIALIZING:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					initializing: true,
					...action.sessionData
				}
			};
		case actionTypes.SESSION_INIT_FAILED:
			return {
				...state,
				sessionToLoad: initialSessionToLoad
			};
		case actionTypes.SESSION_RECEIVED:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					session: action.session
				}
			};
		case actionTypes.SESSION_AVERT_LOAD_STATUS_UPDATED:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					baseSimId: action.loadStatus.baseSimId,
					avertLoadProgressPct: action.loadStatus.avertLoadProgressPct,
					avertLoadStatus: action.loadStatus.avertLoadStatus
				}
			};
		case actionTypes.SESSION_SIMULATION_DATA_RECEIVED:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					simulationData: action.simulationData
				}
			};
		case actionTypes.SET_NEW_SESSION_BASE_SIM_LOAD_TRIGGERED:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					newSessionParams: {
						...state.sessionToLoad.newSessionParams,
						baseSimLoadTriggered: true
					}
				}
			};
		case actionTypes.SET_NEW_SESSION_USER_MAPPINGS_TRIGGERED:
			return {
				...state,
				sessionToLoad: {
					...state.sessionToLoad,
					newSessionParams: {
						...state.sessionToLoad.newSessionParams,
						userMappingsTriggered: true
					}
				}
			};
		case actionTypes.CLEAR_SESSION_TO_LOAD:
			return {
				...state,
				sessionToLoad: initialSessionToLoad
			};
		case actionTypes.SET_DISPLAY_USER_MAPPINGS:
			return {
				...state,
				displayUserMappings: action.display
			};
		default:
			return state;
	}
};

export default sessionList;