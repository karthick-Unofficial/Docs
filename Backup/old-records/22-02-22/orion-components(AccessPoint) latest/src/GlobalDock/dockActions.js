import { updatePersistedState } from "../AppState/Actions";

const dockStateKey = "globalDockState";
export const openPanel = ( appId, panelName ) => {
	return (dispatch, getState) => {
		const state = getState();
		const globalDockState = state.appState && state.appState.persisted && state.appState.persisted.globalDockState;
		if (!globalDockState) {
			return;
		}
		let newDockState = null;
		if (globalDockState && globalDockState.leftDock && globalDockState.leftDock.availablePanels && globalDockState.leftDock.availablePanels.includes(panelName)) {
			if (globalDockState.leftDock.currentPanel !== panelName) {
				newDockState = { 
					...globalDockState,
					leftDock: {
						...globalDockState.leftDock,
						currentPanel: panelName
					}
				};
			}
		} else if (globalDockState && globalDockState.rightDock && globalDockState.rightDock.availablePanels && globalDockState.rightDock.availablePanels.includes(panelName)) {
			if (globalDockState.rightDock.currentPanel !== panelName) {
				newDockState = { 
					...globalDockState,
					rightDock: {
						...globalDockState.rightDock,
						currentPanel: panelName
					}
				};
			}
		}
		if (newDockState) {
			dispatch(updatePersistedState(appId, dockStateKey, newDockState, false));
		}
	};
};

export const closePanel = ( appId, panelName ) => {
	return (dispatch, getState) => {
		const state = getState();
		const globalDockState = state.appState && state.appState.persisted && state.appState.persisted.globalDockState;
		if (!globalDockState) {
			return;
		}
		let newDockState;
		if (globalDockState && globalDockState.leftDock && globalDockState.leftDock.currentPanel === panelName) {
			newDockState = { 
				...globalDockState,
				leftDock: {
					...globalDockState.leftDock,
					currentPanel: null
				}
			};
		} else if (globalDockState && globalDockState.rightDock && globalDockState.rightDock.currentPanel === panelName) {
			newDockState = { 
				...globalDockState,
				rightDock: {
					...globalDockState.rightDock,
					currentPanel: null
				}
			};
		} else {
			return;
		}
		dispatch(updatePersistedState(appId, dockStateKey, newDockState, false));
	};
};

export const moveToOtherDock = ( appId, globalDockState, dockDirection, panelName ) => {
	return dispatch => {
		let newDockState;
		if (dockDirection === "left") {
			const newLeftPanels = globalDockState.leftDock.availablePanels.filter(panel => panel !== panelName);
			newDockState = { 
				leftDock: {
					availablePanels: newLeftPanels,
					currentPanel: null
				},
				rightDock: {
					availablePanels: [ ...globalDockState.rightDock.availablePanels, panelName ],
					currentPanel: panelName
				}
			};
		} else {
			const newRightPanels = globalDockState.rightDock.availablePanels.filter(panel => panel !== panelName);
			newDockState = { 
				leftDock: {
					availablePanels: [ ...globalDockState.leftDock.availablePanels, panelName ],
					currentPanel: panelName
				},
				rightDock: {
					availablePanels: newRightPanels,
					currentPanel: null
				}
			};
		}
		dispatch(updatePersistedState(appId, dockStateKey, newDockState, false));
	};
};

export const saveDockState = ( appId, globalDockState ) => {
	return dispatch => {
		dispatch(updatePersistedState(appId, dockStateKey, globalDockState, false));
	};
}; 