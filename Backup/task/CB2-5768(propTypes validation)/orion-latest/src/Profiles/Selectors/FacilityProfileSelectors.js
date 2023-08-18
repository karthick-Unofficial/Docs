import { createSelector } from "reselect";
import { defaultFacilityProfileWidgets } from "orion-components/Profiles/Utils/FacilityProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { isWidgetLaunchableAndExpandable, getAppId, entityTypeSelector } from "orion-components/Profiles/Selectors";
import { getTranslation } from "orion-components/i18n";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];

const getWidgetState = (state) => widgetStateSelector(state) || [];

const getCustomWidgetConfig = (widgetName, context, integrations) => {
	const widgetArr = [];
	const { entity } = context;
	integrations.filter((customWidget) => {
		if (entity.feedId === customWidget.feedId && hasOwn(customWidget, "widgets")) {
			const { widgets } = customWidget;
			for (let i = 0; i < widgets.length; i++) {
				if (widgets[i].id === widgetName) {
					widgetArr.push(widgets[i]);
					break;
				}
			}
		}
	});
	return widgetArr;
};

export const facilityWidgetConfig = createSelector(
	[getWidgetState, selectIntegrations, (state) => state],
	(widgetState, integrations, state) => (context, disableCameras) => {
		const defaultTypes = ["activities", "files", "cameras", "floorPlans", "accessPoints", "facility-condition"];

		const facilityConditionWidget = getCustomWidgetConfig("facility-condition", context, integrations);

		if (!disableCameras) {
			defaultFacilityProfileWidgets.push({
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.facilityProfile.main.cameras")
			});
		}

		//If the widget array for the facility feed doesn't contain facility-condition, remove it from the DEFAULT_WIDGET_CONFIG.
		if (facilityConditionWidget.length === 0) {
			defaultFacilityProfileWidgets.filter((widget) => widget.id !== "facility-condition");
		}

		const launchableAndExpandable = isWidgetLaunchableAndExpandable(getAppId(state), entityTypeSelector(state));
		const { widgetsExpandable } = launchableAndExpandable;

		if (widgetsExpandable) defaultTypes.push("map");

		const filteredDefault = defaultFacilityProfileWidgets.filter((widget) => defaultTypes.includes(widget.id));
		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = unionBy(filteredDefault, filteredState, "id");

		return widgetConfig;
	}
);
