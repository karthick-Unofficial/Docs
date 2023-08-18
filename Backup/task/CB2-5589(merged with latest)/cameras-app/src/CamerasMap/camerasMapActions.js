import { updatePersistedState } from "orion-components/AppState/Actions";
export { updatePersistedState, setMapReference } from "orion-components/AppState/Actions";

export const setMapPosition = (coords, zoom) => {
	return (dispatch) => {
		// combined both map center and map zoom persisted states, updating them separately, resulting in data mismatch
		dispatch(
			updatePersistedState("cameras-app", "mapSettings", {
				mapCenter: coords,
				mapZoom: zoom
			})
		);
	};
};
