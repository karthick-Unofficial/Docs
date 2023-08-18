import { updatePersistedState, setLocalAppState } from "orion-components/AppState/Actions";

// TODO: Grab app argument from state
export const setMapStyle = style => {
    return (dispatch, getState) => {
        const appId = getState().application.appId;
        if (!window.api) {
            dispatch(updatePersistedState(appId, "mapSettings", { mapStyle: style }));
        }
        else {
            const mapSettingsState = getState().appState.persisted.mapSettings || {};
            mapSettingsState["mapStyle"] = style;
            dispatch(setLocalAppState("mapSettings", mapSettingsState));
        }
    };
};
