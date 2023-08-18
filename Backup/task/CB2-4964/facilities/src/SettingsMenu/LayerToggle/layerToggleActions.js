import { updatePersistedState } from "orion-components/AppState/Actions";

// TODO: Grab app argument from state
export const setLayerState = keyVal => {
	return dispatch => {
		dispatch(updatePersistedState("facilities-app", "mapSettings", keyVal));
	};
};
