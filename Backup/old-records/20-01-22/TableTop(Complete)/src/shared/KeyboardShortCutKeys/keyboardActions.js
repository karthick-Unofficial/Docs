import ModificationService from "../../services/modificationService";
import { activeSessionSelector, exerciseSettingsSelector } from "../../TabletopSessionList/selectors";
import { raiseError } from "../../appActions";
import {resumeSession, joinSession} from "../../TabletopSessionList/tabletopSessionListActions";
import * as utilities from "../utility/utilities";
import * as actionTypes from "../../actionTypes";


export const modifyExercise = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tabletopSession && state.tabletopSession.session) {
			const session = state.tabletopSession.session;
			const userInfo = state.tabletopSession.userInfo;
			if (userInfo.userId !== session.controller) {
				return; // User must be controller
			}
			if (!session.currentSimulation || session.currentSimulation.loadStatus === "loading" || !session.currentSimulation.playStatus) {
				return;
			}
			if (session.modificationsActive) {
				return; // Modifications already enabled
			}
			if (session.currentSimulation.playStatus.status !== "paused") {
				return; // Modifications can only be enabled if the simulation is paused
			}
			if (session.settings && session.settings.readOnly) {
				return; // Modifications not allowed in read only sessions
			}
			if (session.simulationMode !== "simulation") {
				return; // Modifications can only be created when simulation mode is 'simulation'
			}
			if (!state.tabletopSession.simulations) {
				return;
			}
			const currentSimulation = state.tabletopSession.simulations[session.currentSimulation.simId];
			if (!currentSimulation) {
				return;
			}
			if (currentSimulation.parentDivergeTime > 0 && session.currentSimulation.playStatus.simTime < currentSimulation.parentDivergeTime) {
				let parent = state.tabletopSession.simulations[currentSimulation.parentSimId];
				const exerciseSettings = exerciseSettingsSelector(state);
				const simTimePrecision = exerciseSettings.simTimePrecision;
				while (parent && parent.parentDivergeTime > 0 && currentSimulation.playStatus.simTime < parent.parentDivergeTime) {
					parent = state.tabletopSession.simulations[parent.parentSimId];
				}
				dispatch(raiseError(`The current simulation was spawned from its parent at a later simulation time: ${utilities.truncate(currentSimulation.parentDivergeTime, simTimePrecision)}.\nIf you want to create a simulation for the current time, please create it as a child of ${parent.name}.`));
				return;
			}
			ModificationService.enableModifications(session.id, (err, response) => {
				if (err || !response || response.success === false) {
					utilities.handleApiError(err, response, dispatch);
				} else {
					console.log("Modifications enabled");
				}
			});
		}
	};
};

export const openMapLayers = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tabletopSession && state.tabletopSession.session) {
			dispatch(openWidget("mapLayers"));
		}
	};
};

export const openExerciseSettings = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tabletopSession && state.tabletopSession.session) {
			dispatch(openWidget("exerciseSettings"));
		}
	};
};

export const openRoster = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tabletopSession && state.tabletopSession.session) {
			dispatch(openWidget("roster"));
		}
	};
};

export const openUserMappings = () => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tabletopSession && state.tabletopSession.session) {
			dispatch(openWidget("userMappingSettings"));
		}
	};
};

export const enterExercise = () => {
	return (dispatch, getState) => {
		const state = getState();
		if(state.tabletopSessions) {
			const activeSession = activeSessionSelector(state);
			if(activeSession){
				const user = state.session.user;
				const isController = activeSession.controller === user.id;
				if (isController) {
					dispatch(resumeSession(activeSession));
				} else {
					dispatch(joinSession(activeSession));
				}
			}
		}
	};
};

const openWidget = (widgetName) => {
	return {
		type: actionTypes.SEND_COMPONENT_MESSAGE,
		message: {
			recipient: "dock",
			data: {
				command: "open",
				widget: widgetName
			}
		}
	};
};