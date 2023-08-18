import { cameraService, entityCollection } from "client-app-core";
import { toggleMapVisible } from "orion-components/AppState/Actions";
import * as t from "../../actionTypes";

export const _selectWidget = (widget) => {
	return {
		type: t.SELECT_WIDGET,
		payload: widget
	};
};

export const selectWidget = (widget) => {
	return (dispatch, getState) => {
		const prevWidget = getState().userAppState.cameraView;

		if (
			(prevWidget !== "map-view" && widget === "map-view") ||
			(prevWidget === "map-view" && widget !== "map-view")
		) {
			dispatch(toggleMapVisible());
		}
		dispatch(_selectWidget(widget));
	};
};

export const createCollection = (name, members) => {
	return (dispatch) => {
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const updateCamera = (cameraId, camera) => {
	return (dispatch) => {
		cameraService.update(cameraId, camera, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};
