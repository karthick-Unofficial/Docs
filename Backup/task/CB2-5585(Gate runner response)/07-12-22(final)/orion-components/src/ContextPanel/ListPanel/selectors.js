import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";

import isEqual from "react-fast-compare";

export const listPanelState = state => state.appState.contextPanel.listPanel;
export const mapFiltersState = state =>
	state.appState.contextPanel.listPanel && state.appState.contextPanel.listPanel.mapFilters;
const mapEntities = state => state.appState.mapRef.entities;

const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	isEqual
);

export const searchValueSelector = createSelector(
	listPanelState,
	state => {
		return state.searchValue.toLowerCase();
	}
);

export const mapFiltersById = createSelector(
	mapFiltersState,
	filters => {
		if (!filters) {
			return [];
		}
		const filterIds = [];
		Object.values(filters).forEach(collection => {
			collection.forEach(entity => filterIds.push(entity.id));
		});
		return filterIds;
	}
);

export const filteredFeaturesSelector = createDeepEqualSelector(
	mapFiltersById,
	mapEntities,
	(ids, entities) => {
		if (!ids.length) {
			return;
		}
		const features = {};
		Object.values(entities).forEach(feed =>
			Object.values(feed).forEach(entity => {
				if (ids.includes(entity.id) || ids.includes(entity.parentEntity)) {
					features[entity.id] = entity;
				}
			})
		);
		return features;
	}
);

export const mapFiltersSelector = createDeepEqualSelector(
	filteredFeaturesSelector,
	entities => entities
);

export const eventSearchSelector = createSelector(
	listPanelState,
	state => {
		return state && state.eventSearch && state.eventSearch.toLowerCase();
	}
);

export const eventTemplateSearchSelector = createSelector(
	listPanelState,
	state => {
		return state.eventTemplateSearch.toLowerCase();
	}
);
