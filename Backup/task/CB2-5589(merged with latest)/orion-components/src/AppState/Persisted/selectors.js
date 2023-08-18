import { createSelector } from "reselect";

export const persistedState = (state) => state.appState.persisted;
export const profileState = (state) => state.appState.contextPanel.profile;

export const mapSettingsSelector = createSelector(persistedState, (state) => {
	const settings = state.mapSettings || {};
	return {
		mapZoom: settings.mapZoom || 3,
		mapCenter: settings.mapCenter || [-98.2015, 39.4346],
		mapStyle: settings.mapStyle || "satellite",
		...settings
	};
});

export const widgetStateSelector = createSelector(persistedState, profileState, (persisted, profile) => {
	let type = profile.selectedEntity.type;

	switch (type) {
		case "shapes":
		case "track":
			type = "entity";
			break;
		case "camera":
			break;
		case undefined: // this should be removed once events are given an entityType prop
			type = "event";
			break;
		default:
			break;
	}

	return persisted.profileWidgetOrder ? persisted.profileWidgetOrder[type] : null;
});

export const disabledFeedsSelector = createSelector(persistedState, (state) =>
	state && state.disabledFeeds ? state.disabledFeeds : []
);

export const layerOpacitySelector = createSelector(persistedState, (state) =>
	state.layerOpacity ? state.layerOpacity : 1
);

export const nauticalChartLayerOpacitySelector = createSelector(
	persistedState,
	state => state.nauticalChartLayerOpacity
);

export const roadAndLabelLayerOpacitySelector = createSelector(
	persistedState,
	state => state.roadAndLabelLayerOpacity
);

export const weatherRadarLayerOpacitySelector = createSelector(
	persistedState,
	state => state.weatherRadarLayerOpacity
);

export const ssrRadarLayerOpacitySelector = createSelector(persistedState, (state) =>
	state.ssrRadarLayerOpacity !== null && state.ssrRadarLayerOpacity !== undefined ? state.ssrRadarLayerOpacity : 1
);

export const activityFiltersSelector = createSelector(persistedState, (state) => {
	return state.activityFilters ? state.activityFilters : [];
});

export const eventFiltersSelector = createSelector(persistedState, (state) =>
	state.eventFilters ? state.eventFilters : []
);

export const eventTemplateFiltersSelector = createSelector(persistedState, (state) =>
	state.eventTemplateFilters ? state.eventTemplateFilters : []
);
