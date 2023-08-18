import { attachmentService } from "client-app-core";
import { subscribeFOVs, unsubscribeFOVs } from "orion-components/GlobalData/Actions";
import keys from "lodash/keys";
import pull from "lodash/pull";

export { linkEntities, unlinkEntities } from "./entityProfileActions";
export { addRemoveFromCollections, addRemoveFromEvents, setWidgetOrder, updateActivityFilters } from "./commonActions";

export const attachFilesToCamera = (cameraId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(cameraId, "camera", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const showFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [cameraId];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = [...cameraIds, ...keys(fovs.data)];

		dispatch(subscribeFOVs(cameraIds));
	};
};

export const hideFOV = cameraId => {
	return (dispatch, getState) => {
		let cameraIds = [];
		const fovs = getState().globalData.fovs;

		if (fovs) cameraIds = pull(keys(fovs.data), cameraId);

		dispatch(unsubscribeFOVs([cameraId], fovs.subscription));
		dispatch(subscribeFOVs(cameraIds));
	};
};
