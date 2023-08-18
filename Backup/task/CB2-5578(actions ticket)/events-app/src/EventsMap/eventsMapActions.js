import { updatePersistedState } from "orion-components/AppState/Actions";

export { setMapReference } from "orion-components/AppState/Actions";

export const setMapPosition = (coords, zoom) => {
	return dispatch => {
		// combined both mapcenter and mapzoom persisted states, updating them separately, resulting in data mismatch
		dispatch(
			updatePersistedState("events-app", "mapSettings", {
				mapCenter: coords,
				mapZoom: zoom
			})
		);
	};
};
