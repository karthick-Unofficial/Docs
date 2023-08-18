import { updatePersistedState } from "orion-components/AppState/Actions";

export const setMapPosition = (coords, zoom) => {
	return dispatch => {
		dispatch(
			updatePersistedState("events-app", "mapSettings", { mapCenter: coords })
		);
		dispatch(
			updatePersistedState("events-app", "mapSettings", { mapZoom: zoom })
		);
	};
};
