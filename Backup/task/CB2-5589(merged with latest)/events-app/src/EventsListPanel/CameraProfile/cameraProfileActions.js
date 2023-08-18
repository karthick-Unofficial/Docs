import { cameraService } from "client-app-core";
import * as t from "../../actionTypes";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";

export { createCollection } from "orion-components/SharedActions/entityCollectionActions";
export { selectWidget } from "../../appActions";

export const updateCameraSuccess = (id, data) => {
	return {
		type: t.CAMERA_UPDATED,
		payload: { id: id, data: data }
	};
};

export const updateCamera = (cameraId, camera) => {
	return (dispatch) => {
		cameraService.update(cameraId, camera, (err) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(updateCameraSuccess(cameraId, camera.camera));
			}
		});
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
