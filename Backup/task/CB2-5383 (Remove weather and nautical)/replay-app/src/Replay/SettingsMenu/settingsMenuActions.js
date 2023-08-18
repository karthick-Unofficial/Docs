import * as t from "./actionTypes";
import { updatePersistedState, setLocalAppState } from "orion-components/AppState/Actions";
export { updatePersistedState, setLocalAppState } from "orion-components/AppState/Actions";
import {
	subscribeFOVs,
	unsubscribeFOVs
} from "orion-components/GlobalData/Actions";
export {
	createService,
	getGISLayers,
	turnOffGISLayer,
	resetGISRequest,
	updateVisibleGIS,
	updateGISService,
	deleteGISService
} from "orion-components/Map/Controls/Actions";
import _ from "lodash";
export const showFOVs = () => {
	return (dispatch, getState) => {
		const cameras = getState().globalData.cameras;

		if (cameras) {
			dispatch(subscribeFOVs(_.keys(cameras.data)));
		}

		dispatch(
			updatePersistedState("replay-app", "showAllFOVs", { showAllFOVs: true })
		);
	};
};

export const hideFOVs = () => {
	return (dispatch, getState) => {
		const fovs = getState().globalData.fovs;

		if (fovs) {
			dispatch(unsubscribeFOVs(_.keys(fovs.data), fovs.subscription));
		}

		dispatch(
			updatePersistedState("replay-app", "showAllFOVs", { showAllFOVs: false })
		);
	};
};

export const closeSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_CLOSE
	};
};
