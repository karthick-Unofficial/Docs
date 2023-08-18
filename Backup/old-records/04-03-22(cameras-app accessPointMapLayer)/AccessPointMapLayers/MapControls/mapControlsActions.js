import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { accessPointService, shapeService } from "client-app-core";
import { validateShape } from "orion-components/Map/helpers";
import { setMapTools } from "orion-components/Map/Tools/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	setMapTools,
	setActivePath,
	updatePath
} from "orion-components/Map/Tools/Actions";

export const updateAccessPointLocation = accessPointId => {
	return (dispatch, getState) => {
		const { geometry } = getState().mapState.mapTools.feature;
		accessPointService.update(accessPointId, { accessPoint: { geometry } }, err => {
			if (err) {
				console.log(err);
			} else {
				dispatch(setMapTools({ type: null }));
			}
		});
	};
};

export const addFOV = (accessPointId, name) => {
	return (dispatch, getState) => {
		const { geometry } = getState().mapState.mapTools.feature;
		if (!validateShape(geometry)) {
			return;
		}
		const shape = {
			entityData: {
				type: "Feature",
				properties: {
					name,
					type: "FOV"
				},
				geometry
			}
		};
		accessPointService.addFOV(accessPointId, shape, err => {
			if (err) {
				console.log(err);
			} else {
				dispatch(setMapTools({ type: null }));
			}
		});
	};
};

export const updateFOV = id => {
	return (dispatch, getState) => {
		const { geometry, properties } = getState().mapState.mapTools.feature;
		if (!validateShape(geometry)) {
			return;
		}
		const update = {
			entityData: {
				geometry,
				properties
			}
		};
		shapeService.update(id, update, err => {
			if (err) {
				console.log(err);
			} else {
				dispatch(setMapTools({ type: null }));
			}
		});
	};
};

export const removeFOV = accessPointId => {
	return dispatch => {
		accessPointService.removeFOV(accessPointId, err => {
			if (err) {
				console.log(err);
			}
		});
		dispatch(unsubscribeFromFeed(accessPointId, "fov", "profile"));
		dispatch(unsubscribeFromFeed(accessPointId, "fovItems", "profile"));
	};
};

export const updateSpotlight = accessPointId => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		accessPointService.upsertSpotlightShape(accessPointId, feature, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(setMapTools({ type: null }));
			}
		});
	};
};
