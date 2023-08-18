import { updatePersistedState } from "orion-components/AppState/Actions";
export {
	setMapReference,
	toggleMapVisible
} from "orion-components/AppState/Actions";

export const setMapState = keyVal => {
	return dispatch => {
		dispatch(updatePersistedState("facilities-app", "mapSettings", keyVal));
	};
};
