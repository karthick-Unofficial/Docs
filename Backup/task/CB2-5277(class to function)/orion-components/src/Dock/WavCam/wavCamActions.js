import * as t from "../actionTypes";
import { getAppState, updatePersistedState } from "../../AppState/Persisted/actions";
export { toggleWavCam } from "../actions";
export { startFOVItemStream } from "orion-components/ContextualData/contextStreaming";

export const toggleWavCamLabels = () => {
	return {
		type: t.TOGGLE_WAV_CAM_LABELS
	};
};

export const getWavCamState = () => {
	return dispatch => {
		const app = "wavcam";
		dispatch(getAppState(app));
	};
};

export const setWavPanoState = (cameraId, metadata, showLabels) => {
	return (dispatch, getState) => {
		const app = "wavcam";
		const currentState = getState().appState.persisted["wavcam_pano"];
		const keyVal = { 
			selectedWavCam: cameraId,
			showLabels: showLabels,
			wavCamMetadata: currentState ? currentState["wavCamMetadata"] : {} 
		};
		keyVal.wavCamMetadata[cameraId] = metadata;
		dispatch(updatePersistedState(app, "wavcam_pano", keyVal));
	};
};

export const setSelectedWavCam = (cameraId) => {
	return (dispatch) => {
		const app = "wavcam";
		const keyVal = { 
			selectedWavCam: cameraId
		};
		dispatch(updatePersistedState(app, "wavcam_pano", keyVal));
	};
};

