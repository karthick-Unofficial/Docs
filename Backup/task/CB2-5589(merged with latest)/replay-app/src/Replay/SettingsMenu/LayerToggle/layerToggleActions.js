import { updatePersistedState, setLocalAppState } from "orion-components/AppState/Actions";

// TODO: Grab app argument from state
export const setLayerState = (keyVal) => {
	return (dispatch, getState) => {
		if (!window.api) {
			dispatch(updatePersistedState("replay-app", "mapSettings", keyVal));
		} else {
			const mapSettingsState = getState().appState.persisted.mapSettings || {};
			const key = Object.keys(keyVal)[0];
			mapSettingsState[key] = keyVal[key];
			dispatch(setLocalAppState("mapSettings", mapSettingsState));
		}
	};
};
