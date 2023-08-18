import { createSelector } from "reselect";
import { defaultCamerasProfileWidgets } from "orion-components/Profiles/Utils/CameraProfileWidgets";
import { defaultFacilityProfileWidgets } from "../Utils/FacilityProfileWidgets";

const entityTypeSelector = (state) => state.appState?.contextPanel?.profile?.selectedEntity?.type || null;

const profileWidgetOrderSelector = (state) => state.appState?.persisted?.profileWidgetOrder || null;

const getDefaultProfileWidgets = (entityType) => {
	switch (entityType) {
		case "camera":
			return defaultCamerasProfileWidgets;
		case "facility":
			return defaultFacilityProfileWidgets;
		default:
			return [];
	}
};

const getWidgetState = createSelector(
	[entityTypeSelector, profileWidgetOrderSelector],
	(entityType, widgetOrder) => (id, widgetData) => {
		if (widgetOrder === null) {
			const widget = getDefaultProfileWidgets(entityType).find((widget) => widget.id === id);
			return widget ? widget[widgetData] : null;
		}

		if (entityType in widgetOrder) {
			const widget = widgetOrder[entityType].find((widget) => widget.id === id);
			return widget ? widget[widgetData] : null;
		} else {
			if (widgetData === "enabled") {
				return false;
			}

			return null;
		}
	}
);

export { getWidgetState };
