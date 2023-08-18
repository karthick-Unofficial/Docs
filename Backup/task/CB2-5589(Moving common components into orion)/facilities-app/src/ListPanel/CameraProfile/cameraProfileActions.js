import {
	cameraService,
	entityCollection
} from "client-app-core";
import {
	toggleMapVisible
} from "orion-components/AppState/Actions";

// Update Viewing History
// export const updateViewingHistory = ({
// 	id,
// 	name,
// 	type,
// 	item
// }) => {
// 	return {
// 		type: t.UPDATE_VIEWING_HISTORY,
// 		payload: {
// 			id,
// 			name,
// 			type,
// 			item
// 		}
// 	};
// };

// export const _selectWidget = widget => {
// 	return {
// 		type: t.SELECT_WIDGET,
// 		payload: widget
// 	};
// };

export const selectWidget = widget => {
	return (dispatch, getState) => {
		const prevWidget = getState().userAppState.cameraView;

		if (
			(prevWidget !== "Map Location and FOV" &&
				widget === "Map Location and FOV") ||
			(prevWidget === "Map Location and FOV" &&
				widget !== "Map Location and FOV")
		) {
			dispatch(toggleMapVisible());
		}
		//dispatch(_selectWidget(widget)); _selectWidget declaration is commented
	};
};

export const createCollection = (name, members) => {
	return dispatch => {
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

// Don't think this is necessary anymore
// export const updateCameraSuccess = (id, data) => {
// 	return {
// 		type: t.CAMERA_UPDATED,
// 		payload: { id: id, data: data }
// 	};
// };

export const updateCamera = (cameraId, camera) => {
	return dispatch => {
		cameraService.update(cameraId, camera, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};