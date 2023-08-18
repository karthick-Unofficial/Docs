import { createSelector } from "reselect";
import { defaultEntityProfileWidgets } from "orion-components/Profiles/Utils/EntityProfileWidgets";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { getTranslation } from "orion-components/i18n";
import unionBy from "lodash/unionBy";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getWidgetState = (state) => widgetStateSelector(state)?.widgetOrder || [];
const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];

export const getCustomWidgetConfig = (widgetName, context, integrations, extract = "feedId") => {
	const entities = ["shapes", "track"]; //since, entityTypes of track and shapes are differing, we are using this arr to check if the type is an entity.
	const customWidgetsArr = [];
	const { entity } = context;
	integrations.filter((customWidget) => {
		if ((extract === "entityType" ? entities.includes(customWidget[extract]) : entity[extract] === customWidget[extract])
			&& hasOwn(customWidget, "widgets")) {
			const { widgets } = customWidget;
			widgets.map((widget) => {
				if (widget.id === widgetName) {
					customWidgetsArr.push(widget.id);
				}
			});
		}
	});
	return customWidgetsArr;
};

export const entityWidgetConfig = createSelector(
	[getWidgetState, selectIntegrations],
	(widgetState, integrations) => (context, marineTrafficVesselData, marineTrafficVisible) => {
		const checkDroneWidget = getCustomWidgetConfig("drone-association", context, integrations, "entityType");

		let widgetConfig = widgetState.length > 0 ? unionBy(widgetState, defaultEntityProfileWidgets, "id") : defaultEntityProfileWidgets;

		//checking if widgets has already been populated in widgetState
		const marineTrafficWidget = Boolean(widgetConfig.find((widget) => widget.id === "marineTrafficParticulars"));
		const droneAssociation = Boolean(widgetConfig.find((widget) => widget.id === "drone-association"));

		// -- remove marine traffic from irrelevant feeds
		if (!marineTrafficVesselData || !marineTrafficVisible) {
			widgetConfig = widgetConfig.filter((widget) => widget.id !== "marineTrafficParticulars")
		} else if (!marineTrafficWidget) {
			widgetConfig.push({
				enabled: true,
				id: "marineTrafficParticulars",
				name: getTranslation("global.profiles.entityProfile.main.marineTraffic")
			});
		}

		//If the widget array for any of the facility feed doesn't contain drone-association, remove it from the DEFAULT_WIDGET_CONFIG.
		if (checkDroneWidget.length === 0) {
			widgetConfig = widgetConfig.filter((widget) => widget.id !== "drone-association");
		} else if (!droneAssociation) {
			widgetConfig.push({
				enabled: true,
				id: "drone-association",
				name: getTranslation("global.profiles.entityProfile.main.droneAssociation")
			})
		}

		return widgetConfig;
	}
);
