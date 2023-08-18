import { createSelector } from "reselect";
import { defaultFacilityProfileWidgets } from "orion-components/Profiles/Utils/FacilityProfileWidgets";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { getTranslation } from "orion-components/i18n";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];

const getWidgetState = (state) => widgetStateSelector(state)?.widgetOrder
	|| [];

export const getCustomWidgetConfig = (widgetName, context, integrations, extract = "feedId") => {
	const widgetArr = [];
	const { entity } = context;
	integrations.filter((customWidget) => {
		if (entity[extract] === customWidget[extract] && hasOwn(customWidget, "widgets")) {
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
	[getWidgetState, selectIntegrations],
	(widgetState, integrations) => (context, disableCameras) => {
		let widgetOrder = widgetState.length > 0 ? widgetState : defaultFacilityProfileWidgets;

		const defaultTypes = ["activities", "files", "cameras", "floorPlans", "accessPoints", "facility-condition"];
		const facilityConditionWidget = getCustomWidgetConfig("facility-condition", context, integrations, "entityType");

		//checking if widgets has already been populated in widgetState
		const camerasWidget = Boolean(widgetOrder.find((widget) => widget.id === "cameras"));
		const facilityCondition = Boolean(widgetOrder.find((widget) => widget.id === "facility-condition"));

		if (!disableCameras && !camerasWidget) {
			widgetOrder.push({
				enabled: true,
				id: "cameras",
				name: getTranslation("global.profiles.facilityProfile.main.cameras")
			});
		}

		//If the widget array for any of the facility feed doesn't contain facility-condition, remove it from the DEFAULT_WIDGET_CONFIG.
		if (facilityConditionWidget.length === 0) {
			widgetOrder = widgetOrder.filter((widget) => widget.id !== "facility-condition");
		} else if (!facilityCondition) {
			widgetOrder.push({
				enabled: true,
				id: "facility-condition",
				name: getTranslation("global.profiles.facilityProfile.main.facilityCondition")
			})
		}

		const filteredWidgets = widgetOrder.filter((widget) => defaultTypes.includes(widget.id));

		return filteredWidgets;
	}
);