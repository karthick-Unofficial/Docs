import {
	createSelectorCreator,
	createSelector,
	defaultMemoize
} from "reselect";
import { mapFiltersSelector } from "orion-components/ContextPanel/Selectors";
import { contextById } from "orion-components/ContextualData/Selectors";

import _ from "lodash";
import isEqual from "react-fast-compare";

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

const cameraProps = state => {
	const globalDataIds = Object.keys(state && state.globalGeo ? state.globalGeo : {});
	let cameras = {};
	globalDataIds.forEach(id => {
		if (id.includes("camera")) {
			cameras = _.merge(cameras, (_.cloneDeep(state.globalData[id])));
		}
	});
	return cameras && cameras.data  ? cameras.data : {};
};
const cameraGeo = state => {
	const globalGeoIds = Object.keys(state && state.globalGeo ? state.globalGeo : {});
	let cameras = {};
	globalGeoIds.forEach(id => {
		if (id.includes("camera")) {
			cameras = _.merge(cameras, (_.cloneDeep(state.globalGeo[id])));
		}
	});
	return cameras && cameras.data ? cameras.data : {};
};
const floorPlan = state => state.floorPlan;

export const floorPlanSelector = createSelector(
	floorPlan,
	floorPlan => {
		const {
			selectedFloor,
			coordinates,
			creating,
			preLoaded,
			image
		} = floorPlan || {};

		return { selectedFloor, coordinates, creating, image, preLoaded };
	}
);
export const cameraMapFeatures = id => {
	return createDeepEqualSelector(
		contextById(id),
		cameraGeo,
		cameraProps,
		mapFiltersSelector,
		(context, cameraGeo, cameraProps, filters) => {
			let mapFeatures = {};
			if (context && context.entity) {
				const { fov, fovItems, entity, fovEvents, linkedEntities } = context;
				mapFeatures = {
					[entity.id]: entity
				};
				if (linkedEntities) {
					mapFeatures = { ...mapFeatures, ..._.keyBy(linkedEntities, "id") };
				}
				if (fovItems) {
					mapFeatures = { ...mapFeatures, ..._.keyBy(fovItems, "id") };
				}
				if (fovEvents) {
					mapFeatures = { ...mapFeatures, ..._.keyBy(fovEvents, "id") };
				}
				if (fov && !Array.isArray(fov)) {
					mapFeatures = { ...mapFeatures, [fov.id]: fov };
				}
			} else {
				const cameras = cameraGeo
					? _.merge(cameraProps, cameraGeo)
					: cameraProps;
				if (filters && Object.keys(filters).length) {
					mapFeatures = _.pickBy(cameras, camera =>
						Object.keys(filters).includes(camera.id)
					);
				} else {
					mapFeatures = cameras;
				}
			}

			//Filter out non-map display types
			const filteredMapFeatures = {};
			Object.keys(mapFeatures).forEach(key => {
				if ((mapFeatures[key].entityData.displayType || "map").toLowerCase() === "map") {
					filteredMapFeatures[key] = mapFeatures[key];
				}
			});

			return filteredMapFeatures;
		}
	);
};
