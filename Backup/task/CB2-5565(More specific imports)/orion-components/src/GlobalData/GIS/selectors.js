import { createSelector } from "reselect";
import size from "lodash/each";
import pickBy from "lodash/pickBy";

// Assigning an empty object to a variable, prevents unnecessary re-renders
const defaultGISState = {};

const gisData = state => state.globalData.gisData;
const gisState = state => state.appState.persisted.gisState || defaultGISState;

export const gisDataSelector = createSelector(
	gisData,
	data => data
);
export const gisStateSelector = createSelector(
	gisState,
	state => state
);

export const gisLayerSelector = createSelector(
	gisData,
	gisState,
	(data, state) => {
		const { layers } = data;
		return size(layers)
			? pickBy(
				layers,
				layer => state[layer.serviceId] && state[layer.serviceId][layer.id]
			)
			: {};
	}
);
