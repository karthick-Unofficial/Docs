import { updatePersistedState, setLocalAppState } from "orion-components/AppState/Actions";
import { subscribeFOVs, unsubscribeFOVs } from "orion-components/GlobalData/Actions";
import keys from "lodash/keys";

export const setMapStyle = (style) => {
	return (dispatch, getState) => {
		const appId = getState().application.appId;
		if (!window.api) {
			dispatch(updatePersistedState(appId, "mapSettings", { mapStyle: style }));
		} else {
			const mapSettingsState = getState().appState.persisted.mapSettings || {};
			mapSettingsState["mapStyle"] = style;
			dispatch(setLocalAppState("mapSettings", mapSettingsState));
		}
	};
};

export const setLayerState = (keyVal) => {
	return (dispatch, getState) => {
		const appId = getState().application.appId;
		dispatch(updatePersistedState(appId, "mapSettings", keyVal));
	};
};

export const hideFOVs = () => {
	return (dispatch, getState) => {
		const fovs = getState().globalData.fovs;

		if (fovs) {
			dispatch(unsubscribeFOVs(keys(fovs.data), fovs.subscription));
		}

		dispatch(
			updatePersistedState("map-app", "showAllFOVs", {
				showAllFOVs: false
			})
		);
	};
};

export const showFOVs = (cameraFeeds) => {
	return (dispatch, getState) => {
		Object.values(cameraFeeds).forEach((feed) => {
			dispatch(subscribeFOVs(keys(getState().globalData[feed.feedId].data)));
		});

		dispatch(
			updatePersistedState("map-app", "showAllFOVs", {
				showAllFOVs: true
			})
		);
	};
};
