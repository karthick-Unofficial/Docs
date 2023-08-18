import * as t from "./actionTypes";
import { shapeService, spotlightService } from "client-app-core";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import center from "@turf/center";
import { getSpotlight } from "orion-components/Map/helpers";

export const restoreShape = (id) =>
	shapeService.restore(id, (err, res) => {
		if (err) {
			console.log(err, res);
		}
	});

export const deleteShape = (id, name, undoing) => {
	return (dispatch) => {
		shapeService.delete(id, (err, response) => {
			if (err) {
				console.log(err, response);
			} else {
				if (!undoing) {
					const undoFunc = () => {
						dispatch(restoreShape(id));
					};
					dispatch(createUserFeedback(name + " has been deleted.", undoFunc));
				}
			}
		});
	};
};

export const createShape = (data) => {
	return (dispatch) => {
		const { properties, geometry } = data;
		const { name, description, symbol, polyFill, polyStroke, polyFillOpacity, lineWidth, lineType } = properties;
		const { type } = geometry;
		const shape = {
			entityData: {
				type,
				properties: {
					name,
					symbol,
					description,
					type: type === "LineString" ? "Line" : type,
					...(polyFill && { polyFill }),
					...(polyStroke && { polyStroke }),
					...(polyFillOpacity && { polyFillOpacity }),
					...(lineWidth && { lineWidth }),
					...(lineType && { lineType })
				},
				geometry
			}
		};

		shapeService.create(shape, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const id = response.generated_keys[0];
				const undo = true;
				const undoFunc = () => {
					dispatch(deleteShape(id, name, undo));
				};
				dispatch(createUserFeedback(name + " has been created.", undoFunc));
			}
		});
	};
};

export const updateShape = (id, entityData, inScope) => {
	return () => {
		const shape = { entityData };
		if (inScope !== undefined) {
			shape.inScope = inScope;
		}
		shapeService.update(id, shape, (err, response) => {
			if (err) {
				console.log(err, response);
			}
		});
	};
};

export const updateCurrentFeature = (feature) => {
	return {
		type: t.UPDATE_CURRENT_FEATURE,
		payload: { feature }
	};
};

export const setMapTools = ({ type, mode, feature }) => {
	return {
		type: t.SET_MAP_TOOLS,
		payload: { type, mode, feature }
	};
};

export const updatePath = (path) => {
	return { type: t.PATH_UPDATE, payload: { path } };
};

export const updatePaths = (paths) => {
	return { type: t.PATHS_UPDATE, payload: { paths } };
};

export const deletePath = (id) => {
	return { type: t.PATH_DELETE, payload: { id } };
};

export const setActivePath = (path) => {
	return { type: t.ACTIVE_PATH_SET, payload: { path } };
};

export const removeSpotlight = (id) => {
	return {
		type: t.SPOTLIGHT_REMOVE,
		payload: { id }
	};
};

export const setSpotlight = (spotlight) => {
	return {
		type: t.SPOTLIGHT_SET,
		payload: { spotlight }
	};
};

export const restartSpotlight = (spotlight) => {
	return {
		type: t.SPOTLIGHT_RESTART,
		payload: { spotlight }
	};
};

export const addSpotlight = (feature) => {
	return (dispatch, getState) => {
		const { mapRef } = getState().mapState.baseMap;
		if (feature.geometry.type !== "Polygon") {
			feature.geometry = getSpotlight({
				center: center(feature.geometry),
				spotlightProximity: feature.spotlightProximity
			}).geometry;
		} else {
			feature.type = "Feature";
		}
		spotlightService.create(feature, (err, res) => {
			if (err) {
				console.log("Error creating spotlight", err);
			} else {
				const spotlight = res.spotlight;
				dispatch(setSpotlight(spotlight));
				mapRef.flyTo({
					center: center(spotlight.geometry).geometry.coordinates
				});
			}
		});
	};
};
