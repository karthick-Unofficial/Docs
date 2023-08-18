import { updatePersistedState } from "orion-components/AppState/Actions";

// TODO: Grab app argument from state
export const setMapStyle = style => {
	return dispatch => {
		dispatch(
			updatePersistedState("facilities-app", "mapSettings", { mapStyle: style })
		);
	};
};
